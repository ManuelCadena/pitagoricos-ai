#!/bin/bash
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Building pitagoricos.ai"
npm run build

echo "==> Packaging standalone"
DIST_DIR="$ROOT/dist"
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

cp -r "$ROOT/.next/standalone" "$DIST_DIR/app"
cp -r "$ROOT/.next/static" "$DIST_DIR/app/.next/static"
cp -r "$ROOT/public" "$DIST_DIR/app/public" 2>/dev/null || true
cp -r "$ROOT/prisma" "$DIST_DIR/app/prisma"
cp "$ROOT/ecosystem.config.js" "$DIST_DIR/app/ecosystem.config.js"
cp "$ROOT/package.json" "$ROOT/package-lock.json" "$DIST_DIR/app/"

echo "==> Creating tarball"
TARBALL="pitagoricos-ai-$(date +%Y%m%d-%H%M%S).tar.gz"
cd "$DIST_DIR/app"
tar -czf "$ROOT/$TARBALL" .
cd "$ROOT"

echo "==> Package created: $TARBALL"
