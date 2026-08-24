#!/bin/bash
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BUCKET="chatita-deployments-temp"
INSTANCE_ID="i-0994d0887cc3c3476"
REGION="us-west-2"
REMOTE_DIR="/opt/chatita-aion/apps/pitagoricos-ai"
DATA_DIR="/opt/chatita-aion/data/pitagoricos-ai"
PORT="3200"

cd "$ROOT"

echo "==> Building and packaging"
bash scripts/build-and-package.sh

# Find tarball
TARBALL=$(ls -t pitagoricos-ai-*.tar.gz | head -1)
S3_KEY="pitagoricos-ai/${TARBALL}"

echo "==> Uploading ${TARBALL} to s3://${BUCKET}/${S3_KEY}"
aws s3 cp "${TARBALL}" "s3://${BUCKET}/${S3_KEY}"

# Generate .env.production locally from .env.local
ENV_FILE="pitagoricos-ai-env-${TARBALL%.tar.gz}.txt"
cat > "/tmp/${ENV_FILE}" << ENVEOF
NODE_ENV=production
PORT=${PORT}
NEXTAUTH_URL=https://pitagoricos.ai
AUTH_URL=https://pitagoricos.ai/api/auth
DATABASE_URL=file:${DATA_DIR}/pitagoricos.db
ENVEOF

if [[ -f .env.local ]]; then
  grep -E '^(AUTH_|ELEVENLABS_|ALLOWED_|NEXT_PUBLIC_)' .env.local >> "/tmp/${ENV_FILE}"
fi

aws s3 cp "/tmp/${ENV_FILE}" "s3://${BUCKET}/pitagoricos-ai/${ENV_FILE}"

# Remote commands as a single bash script stored in SSM parameters list
CMDS=$(cat <<EOF
set -e
mkdir -p ${REMOTE_DIR}
mkdir -p ${DATA_DIR}
mkdir -p /var/log/pitagoricos-ai
if [ ! -f ${DATA_DIR}/pitagoricos.db ] && [ -f ${REMOTE_DIR}/prisma/prisma/pitagoricos.db ]; then cp ${REMOTE_DIR}/prisma/prisma/pitagoricos.db ${DATA_DIR}/pitagoricos.db && echo DB_MIGRATED_FROM_NESTED; fi
if [ ! -f ${DATA_DIR}/pitagoricos.db ] && [ -f ${REMOTE_DIR}/prisma/pitagoricos.db ]; then cp ${REMOTE_DIR}/prisma/pitagoricos.db ${DATA_DIR}/pitagoricos.db && echo DB_MIGRATED_TO_DATA_DIR; fi
aws s3 cp s3://${BUCKET}/${S3_KEY} /tmp/${TARBALL}
rm -rf ${REMOTE_DIR}/* ${REMOTE_DIR}/.next ${REMOTE_DIR}/node_modules
mkdir -p ${REMOTE_DIR}
tar -xzf /tmp/${TARBALL} -C ${REMOTE_DIR}
cd ${REMOTE_DIR} && npm ci --omit=dev
aws s3 cp s3://${BUCKET}/pitagoricos-ai/${ENV_FILE} ${REMOTE_DIR}/.env.production
cp ${REMOTE_DIR}/.env.production ${REMOTE_DIR}/.env
cd ${REMOTE_DIR} && DATABASE_URL=file:${DATA_DIR}/pitagoricos.db npx prisma migrate deploy
pm2 reload ecosystem.config.js --update-env || pm2 start ecosystem.config.js
pm2 save
EOF
)

# Build JSON array of commands
PARAMS=$(python3 -c "import json, sys; lines=[l.strip() for l in sys.argv[1].splitlines() if l.strip()]; print(json.dumps(lines))" "$CMDS")

echo "==> Sending SSM command"
COMMAND_ID=$(aws ssm send-command \
  --instance-ids "${INSTANCE_ID}" \
  --document-name "AWS-RunShellScript" \
  --parameters "commands=${PARAMS}" \
  --region "${REGION}" \
  --query 'Command.CommandId' \
  --output text)

echo "SSM CommandId: ${COMMAND_ID}"

echo "==> Polling SSM status..."
for i in {1..60}; do
  STATUS=$(aws ssm list-command-invocations \
    --command-id "${COMMAND_ID}" \
    --instance-id "${INSTANCE_ID}" \
    --details \
    --query 'CommandInvocations[0].Status' \
    --output text 2>/dev/null || echo "Pending")
  echo "  Status: ${STATUS}"
  if [[ "${STATUS}" == "Success" || "${STATUS}" == "Failed" || "${STATUS}" == "Cancelled" || "${STATUS}" == "TimedOut" ]]; then
    break
  fi
  sleep 5
done

echo "==> Verifying service"
VERIFY_ID=$(aws ssm send-command \
  --instance-ids "${INSTANCE_ID}" \
  --document-name "AWS-RunShellScript" \
  --parameters "commands=[\"curl -sf http://127.0.0.1:${PORT}/es || echo HEALTH_CHECK_FAILED\"]" \
  --region "${REGION}" \
  --query 'Command.CommandId' \
  --output text)

echo "Verification CommandId: ${VERIFY_ID}"
echo "==> Deployment script complete"
