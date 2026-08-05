# Tests

Automated test assets for FloodWatch AI.

| Directory | Type | Tooling |
|-----------|------|---------|
| `e2e/` | End-to-end browser tests for web apps | Playwright |
| `load/` | Load tests against the gateway | Locust |
| `smoke/` | Post-deploy health verification | Python + httpx |
| `unit/` (JS) | Per-workspace unit tests | Vitest (configured per app) |
| `unit/` (Python) | Per-service pytest suites | `services/<name>/tests` |

## E2E (Playwright)

```bash
npm install -D @playwright/test   # from repo root
npx playwright install chromium
npx playwright test --config tests/e2e/playwright.config.ts
```

Requires the web app running at http://localhost:3000.

## Load (Locust)

```bash
pip install locust
locust -f tests/load/locustfile.py --host http://localhost:8000
# UI: http://localhost:8089
```

## Smoke (post-deploy)

```bash
python tests/smoke/smoke_services.py --base http://localhost:8000
```

Verifies every service `/health` and a sample gateway route.
