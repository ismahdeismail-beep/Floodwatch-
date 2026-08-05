# Development Guide

## Repository Layout

See [README.md](../../README.md#repository-structure) for the full tree. Key rules:

- `apps/*` — Next.js (web, dashboard, admin) and Expo (mobile) applications.
- `packages/*` — `@floodwatch/*` shared packages (types, ui, api-client, utils, tsconfig, eslint-config).
- `services/*` — Python FastAPI microservices (outside the npm workspace).
- `docs/*` — documentation; update when behavior changes.
- `infrastructure/`, `scripts/`, `tests/`, `datasets/`, `models/` — ops and data assets.

## Workspace Commands (root)

```bash
npm install          # install all JS workspaces (npm ci in CI)
npm run dev          # turbo: run dev across apps/packages
npm run build        # turbo: production builds
npm run lint         # turbo: eslint across workspaces
npm run typecheck    # turbo: tsc --noEmit across workspaces
npm run test         # turbo: tests (JS side)
```

Target one workspace: `npm run dev --workspace=@floodwatch/web`.

## Python Services

```bash
cd services/<name>
python -m venv .venv && .venv\Scripts\Activate.ps1   # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port <port>
```

### Running Backend Infrastructure (WSL2 Native)

Services require PostgreSQL+PostGIS, Redis, and MinIO. Instead of Docker, run them natively in WSL2:

```powershell
# First-time setup (installs everything in WSL2 Ubuntu)
.\scripts\wsl-services.ps1 setup

# Daily usage
.\scripts\wsl-services.ps1 start    # Start all services
.\scripts\wsl-services.ps1 stop     # Stop all services
.\scripts\wsl-services.ps1 status   # Check what's running
```

Or directly in WSL2:
```bash
bash ~/.floodwatch/start-services.sh
bash ~/.floodwatch/status-services.sh
```

All services follow the same 12-file layout (see [Services Reference](../architecture/services.md)).

## Adding a Shared Type

1. Add the type to `packages/types/src/index.ts`.
2. It is immediately available in all workspaces via `@floodwatch/types` (`workspace:*`).
3. If UI components need it, update `packages/ui` accordingly.

## Adding a New App or Service

- **App**: create under `apps/<name>`, copy the shared configs pattern from
  `apps/web`, register nothing extra (npm workspaces picks it up). Add to turbo
  `pipeline` if it has new tasks.
- **Service**: create `services/<name>` using the canonical layout; add a
  `docker-compose.yml` service entry; add to docs (services reference + README table).

## Linting & Formatting

- ESLint: flat config via `@floodwatch/eslint-config` (TS + React/Next rules).
- Prettier: `.prettierrc` at root.
- Python: PEP 8; run `ruff` if installed (`scripts/lint-python`).
- Run `npm run lint` before pushing.

## PR Workflow

1. Branch from `main`: `feat/<slug>` or `fix/<slug>`.
2. Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`).
3. CI runs lint, typecheck, build, tests — must be green.
4. Preview deployment is auto-created for web apps.
5. Squash-merge; Release Please versions from conventional commits.

## Testing

- JS: vitest unit tests per workspace (add as needed); e2e with Playwright
  (`tests/e2e/`).
- Python: pytest per service (`tests/test_health.py` plus domain tests).
- Load: Locust (`tests/load/locustfile.py`) against the gateway.
- Smoke: `tests/smoke/` health-check all services after deploy.
