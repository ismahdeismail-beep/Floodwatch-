# Deployment Pipeline

FloodWatch AI ships through GitHub Actions with a promote-on-green model.

## Workflow Map

| Workflow | File | Triggers | Purpose |
|----------|------|----------|---------|
| CI | `.github/workflows/ci.yml` | PR + push to `main` | Install, lint, typecheck, build, test (JS + Python) |
| Deploy | `.github/workflows/deploy.yml` | Tag `v*` / manual | Build & push Docker images → Cloud Run; Vercel deploy |
| CodeQL | `.github/workflows/codeql.yml` | push + weekly | Security scanning |
| Dependabot | `.github/dependabot.yml` | schedule | Dependency updates |
| Release | `.github/workflows/release-please.yml` | push to `main` | Conventional-commit changelog + version bumps |

## CI Stages (ci.yml)

1. **Setup** — checkout, Node 22, Python 3.12, npm ci (workspaces).
2. **Lint** — `npm run lint` (turbo, all apps/packages).
3. **Typecheck** — `npm run typecheck` (turbo).
4. **Build** — `npm run build` (turbo; skips mobile native build — runs
   `tsc --noEmit` + `expo export` sanity check instead).
5. **Python checks** — per service: install requirements, `pytest`, `py_compile`.
6. **Docker build** — `docker build` each service image (cached layers).

## Deploy Stages (deploy.yml)

1. Build & push images to Google Artifact Registry (per service).
2. Deploy `api-gateway` first, then `auth`, then data-facing services
   (`weather`, `hydrology`, `satellite`, `gis`), then `ai`, `alerts`, `analytics`.
3. Run post-deploy smoke tests (`tests/smoke`): health checks on all services.
4. Deploy frontends to Vercel (web, dashboard, admin) with `--prod` for tags,
   preview otherwise.

## Environments & Promotion

- **Preview**: every PR gets a Vercel preview and a Cloud Run preview service.
- **Staging**: merged to `main` → staging deploy (after CI passes).
- **Production**: git tag `vX.Y.Z` (via Release Please) → production deploy.
- Rollback: `deploy.yml` supports redeploying a previous image tag (`IMAGE_TAG` input).

## Secrets Required

`GCP_SA_KEY`, `GCP_PROJECT_ID`, `GCP_REGION`, `ARTIFACTORY_REPO`,
`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_*`, `SUPABASE_SERVICE_ROLE_KEY` (deploy-time migrations only).
