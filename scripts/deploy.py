#!/usr/bin/env python3
"""Deploy pitagoricos-ai to Chatita server via S3 + SSM."""
import os
import subprocess
import sys
import time
import boto3

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BUCKET = "chatita-deployments-temp"
INSTANCE_ID = "i-0994d0887cc3c3476"
REGION = "us-west-2"
REMOTE_DIR = "/opt/chatita-aion/apps/pitagoricos-ai"
PORT = 3200


def run(cmd, cwd=None):
    print(f"$ {cmd}")
    result = subprocess.run(cmd, shell=True, cwd=cwd or ROOT, capture_output=True, text=True)
    if result.returncode != 0:
        print(result.stdout)
        print(result.stderr)
        sys.exit(result.returncode)
    return result.stdout.strip()


def main():
    print("==> Building and packaging")
    run("bash scripts/build-and-package.sh")

    # Find tarball
    tarballs = [f for f in os.listdir(ROOT) if f.startswith("pitagoricos-ai-") and f.endswith(".tar.gz")]
    if not tarballs:
        print("No tarball found")
        sys.exit(1)
    tarball = max(tarballs, key=lambda f: os.path.getmtime(os.path.join(ROOT, f)))
    local_path = os.path.join(ROOT, tarball)
    s3_key = f"pitagoricos-ai/{tarball}"

    print(f"==> Uploading {tarball} to s3://{BUCKET}/{s3_key}")
    run(f"aws s3 cp \"{local_path}\" s3://{BUCKET}/{s3_key}")

    # Load secrets from .env.local
    env = {}
    env_path = os.path.join(ROOT, ".env.local")
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, value = line.split("=", 1)
                    env[key] = value

    required = [
        "AUTH_GOOGLE_ID", "AUTH_GOOGLE_SECRET", "AUTH_SECRET",
        "ELEVENLABS_API_KEY", "ELEVENLABS_AGENT_ID", "ALLOWED_EMAILS"
    ]
    for k in required:
        if k not in env:
            print(f"Missing {k} in .env.local")
            sys.exit(1)

    env_exports = "\n".join([f'export {k}="{v}"' for k, v in env.items()])

    commands = [
        f"mkdir -p {REMOTE_DIR}",
        f"mkdir -p /var/log/pitagoricos-ai",
        f"aws s3 cp s3://{BUCKET}/{s3_key} /tmp/{tarball}",
        f"rm -rf {REMOTE_DIR}/* {REMOTE_DIR}/.next {REMOTE_DIR}/node_modules",
        f"tar -xzf /tmp/{tarball} -C {REMOTE_DIR}",
        f"cd {REMOTE_DIR} && npm ci --omit=dev",
        f"cat > {REMOTE_DIR}/.env.production << 'EOF'\nNODE_ENV=production\nPORT={PORT}\nNEXTAUTH_URL=https://pitagoricos.ai\nAUTH_URL=https://pitagoricos.ai/api/auth\n{env_exports}\nDATABASE_URL=file:./prisma/pitagoricos.db\nEOF",
        f"cd {REMOTE_DIR} && npx prisma migrate deploy",
        f"cd {REMOTE_DIR} && cp .env.production .env",
        f"pm2 reload ecosystem.config.js --update-env || pm2 start ecosystem.config.js",
        "pm2 save",
    ]

    print("==> Running remote deployment via SSM")
    ssm = boto3.client("ssm", region_name=REGION)
    response = ssm.send_command(
        InstanceIds=[INSTANCE_ID],
        DocumentName="AWS-RunShellScript",
        Parameters={"commands": commands},
        CloudWatchOutputConfig={"CloudWatchOutputEnabled": True},
    )
    command_id = response["Command"]["CommandId"]
    print(f"SSM CommandId: {command_id}")

    # Poll for completion
    print("==> Polling SSM command status...")
    for _ in range(60):
        time.sleep(5)
        invocations = ssm.list_command_invocations(
            CommandId=command_id, InstanceId=INSTANCE_ID, Details=True
        )["CommandInvocations"]
        if invocations:
            status = invocations[0]["Status"]
            print(f"  Status: {status}")
            if status in ["Success", "Failed", "Cancelled", "TimedOut"]:
                break
    else:
        print("Timeout waiting for SSM command")
        sys.exit(1)

    # Verify service
    print("==> Verifying service")
    time.sleep(3)
    verify = ssm.send_command(
        InstanceIds=[INSTANCE_ID],
        DocumentName="AWS-RunShellScript",
        Parameters={
            "commands": [
                f"curl -sf http://127.0.0.1:{PORT}/es || echo 'HEALTH_CHECK_FAILED'",
            ]
        },
    )
    print(f"Verification CommandId: {verify['Command']['CommandId']}")
    print("==> Deployment complete")


if __name__ == "__main__":
    main()
