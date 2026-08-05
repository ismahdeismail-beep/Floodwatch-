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

# Start core infrastructure natively (no Docker required)
if [[ -d "$HOME/.floodwatch" ]]; then
  echo "==> Starting core infrastructure (postgres, redis, minio)..."
  bash "$HOME/.floodwatch/start-services.sh"
else
  echo "    WSL2 services not installed. Run: bash scripts/wsl-setup.sh"
fi

if command -v node >/dev/null 2>&1; then
  echo "==> Installing JS workspace dependencies..."
  npm install
else
  echo "    Node.js not found - skipping npm install."
fi

echo "==> Done. Next: python scripts/seed-demo-data.py ; npm run dev"
