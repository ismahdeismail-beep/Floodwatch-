#!/usr/bin/env bash
# FloodWatch AI — setup script (bash / macOS / Linux)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "==> FloodWatch AI setup (bash)"

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "    .env created from .env.example (edit credentials as needed)."
else
  echo "    .env already exists - skipping."
fi

if command -v docker >/dev/null 2>&1; then
  echo "==> Starting core infrastructure (postgres, redis, minio)..."
  docker compose up -d postgres redis minio
else
  echo "    Docker not found - skipping infrastructure."
fi

if command -v node >/dev/null 2>&1; then
  echo "==> Installing JS workspace dependencies..."
  npm install
else
  echo "    Node.js not found - skipping npm install."
fi

echo "==> Done. Next: python scripts/seed-demo-data.py ; npm run dev"
