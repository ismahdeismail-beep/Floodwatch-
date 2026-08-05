# Phase 1 — Shared Foundations (2026-08-05)

Source of truth: `docs/development/MASTER_PLAN.md` Phase 1. Owner: FloodWatch AI Engineering.

## Goal

Eliminate the duplicated logging / CORS / health / error-handling code across the 9 Python
services by building `services/shared/`; expand the 4 TypeScript packages
(types, utils, api-client, ui); enforce secrets hygiene and JWT fail-fast validation.
Every task ends green at the verification gate. No demo-grade shortcuts.

## Architecture

- `services/shared/` — pure-Python package (stdlib + Starlette + pydantic v2 + redis +
  tenacity; fakeredis dev-only). Public API surface (exported from `shared/__init__.py`):
  `setup_logging`, `request_id_var`, `get_request_id`, `set_request_id`,
  `RequestIDMiddleware`, `ApiError` + subclasses, `register_error_handlers`,
  `Cache`, `health_router`, `ready_router`.
- Services depend on `shared` via pytest `pythonpath = ["."]` under `services/shared`
  and via a `shared` path dependency (or PYTHONPATH) in each service's runtime.
- TS: expand existing packages with additive, backward-compatible exports; new vitest
  tests per package.

## Tech Stack

Python 3.11+ · FastAPI/Starlette · pydantic v2 · redis · tenacity · fakeredis · pytest
TypeScript 5.7 · vitest · React 19 test utils (ui only)

## Global Constraints

- TDD: write the failing test first, watch it fail, implement, watch it pass. Always.
- Only the pilot service (`weather`) changes behavior in Part A; other services get
  roll-out in A7. No unrelated refactors.
- One commit per task, conventional message (`feat:`, `fix:`, `test:`, `chore:`).
- Never commit secrets. `.env.example` only, kept in sync.
- JSON log format identical across all services once shared is adopted.
- JWT secret must fail fast at startup in non-dev (no silent default).

## Verification Gate (run at end of each task where relevant)

```
node node_modules/turbo/bin/turbo run typecheck
node node_modules/turbo/bin/turbo run lint
python -m pytest services -q
node node_modules/turbo/bin/turbo run build -- --filter=@floodwatch/web
```

---

## Part A — Python shared core (`services/shared/`)

- [ ] **A1 Scaffold `services/shared` + `shared/logging.py`**
  - Files: `services/shared/pyproject.toml` (name `floodwatch-shared`, version 0.1.0,
    requires-python >=3.11, `[tool.pytest.ini_options] testpaths=["tests"], pythonpath=["."]`),
    `services/shared/README.md`, `services/shared/shared/__init__.py`,
    `services/shared/shared/logging.py`, `services/shared/tests/test_logging.py`.
  - Tests: (a) import + `__version__`; (b) `setup_logging()` emits JSON records
    (stdout/stderr capture) containing `timestamp`, `level`, `logger`, `message`;
    (c) `set_request_id("abc")` → `request_id` appears in the JSON record; contextvar
    default empty.
  - Verify-fail: `python -m pytest services/shared/tests -q` → collection error (no package).
  - Commit: `feat(shared): add floodwatch-shared package with JSON logging`

- [ ] **A2 `shared/middleware.py` — RequestIDMiddleware**
  - Reads `X-Request-ID` header else generates uuid4; stores in `request_id_var`;
    echoes `X-Request-ID` response header; clears contextvar after response.
  - Tests (starlette TestClient): echoed header; distinct ids across requests;
    contextvar cleared after request.
  - Commit: `feat(shared): add request-id ASGI middleware`

- [ ] **A3 `shared/errors.py` — error envelope**
  - `ApiError` (code, message, status_code, details) + subclasses: NotFoundError(404),
    ValidationError(422), ConflictError(409), UnauthorizedError(401),
    ServiceUnavailableError(503), InternalError(500).
  - `register_error_handlers(app)` → envelope `{"error": {"code","message","details","request_id"}}`.
  - Tests: subclass→status+envelope; unknown exception→500 envelope; request_id in envelope.
  - Commit: `feat(shared): unified ApiError envelope with exception handlers`

- [ ] **A4 `shared/cache.py` — Redis cache helper**
  - `Cache.from_url(url)`; `get_json(key)`, `set_json(key, value, ttl)`, `delete_prefix(prefix)`,
    `ping()`; tenacity retry (3 attempts, 0.1s backoff) on transient connection errors.
  - Tests (fakeredis): roundtrip; TTL expiry; prefix delete; retry after transient failure;
    ping true/false.
  - Commit: `feat(shared): redis-backed cache helper with tenacity retries`

- [ ] **A5 `shared/routes.py` — /health + /ready**
  - `health_router(service, version)` → GET /health `{"status":"ok","service","version","uptime_s"}`.
  - `ready_router(cache)` → GET /ready 200 `{"status":"ready"}` | 503
    `{"status":"unavailable","checks":{"cache":"down"}}`.
  - Tests: /health shape; /ready 200 with fakeredis; /ready 503 with closed client.
  - Commit: `feat(shared): standard health and readiness routers`

- [ ] **A6 Pilot: wire shared into `services/weather`**
  - Replace duplicated `/health` + hardcoded `0.1.0` + custom logging/CORS in
    `services/weather/app/main.py` with shared imports; keep existing weather tests green;
    run full gate.
  - Commit: `refactor(weather): adopt shared logging, health, and error envelope`

- [ ] **A7 Roll out to remaining 8 services**
  - alerts, hydrology, analytics, gis, satellite, ai, auth, api-gateway: same dedup;
    verify per service (`python -m pytest services/<svc>/tests -q`) + full gate;
    one commit per service. (api-gateway envelope adoption completes in C2.)
  - Commit(s): `refactor(<svc>): adopt shared logging, health, and error envelope`

## Part B — TypeScript packages expansion

- [ ] **B1 `@floodwatch/types`**: `Paginated<T>` (items + meta page/pageSize/total/totalPages),
  `ErrorResponse` (code/message/details/request_id), enums RiskLevel, AlertSeverity,
  AlertStatus, DataSource; `CountySchema`, `HistoricalFlood`, `AnalyticsSummary`.
  Typecheck green; vitest type tests.
  Commit: `feat(types): pagination, error codes, county, analytics types`

- [ ] **B2 `@floodwatch/utils`**: `isValidCoordinate`, `bboxFromPoints`,
  `severityOrder`, `formatDateTime`, `debounce`, `cx`. Vitest tests.
  Commit: `feat(utils): coordinate, bbox, severity, formatting helpers`

- [ ] **B3 `@floodwatch/api-client`**: `ApiError` + `normalizeError`; AbortSignal timeout
  (10s default); retry-once on network error; 204 handling; endpoint groups for
  weather/alerts/risk/hydrology/gis/analytics returning `Paginated<T>`.
  Tests with mocked fetch. Commit: `feat(api-client): typed endpoint groups with timeout and retry`

- [ ] **B4 `@floodwatch/ui`**: `Tabs`, `DataTable<T>`, `EmptyState`, `ProgressBar`,
  `Skeleton`, `Chart` (SVG stub). Vitest + RTL render tests.
  Commit: `feat(ui): data display primitives`

- [ ] **B5 Wire packages into `apps/web`**: update imports, keep
  `turbo build --filter=@floodwatch/web` green. Commit: `refactor(web): consume expanded packages`

## Part C — Secrets hygiene & JWT fail-fast

- [ ] **C1 `services/auth` JWT fail-fast**: `AUTH_JWT_SECRET` required at startup in non-dev
  (clear error, no silent default); verify endpoint checks signature+exp before any work;
  401 envelope on expired/tampered/missing. Tests. Commit: `feat(auth): fail-fast JWT validation`

- [ ] **C2 `services/api-gateway`**: verify JWT for protected routes (fail-fast 401 envelope),
  propagate `X-User-ID`; adopt shared envelope+logging; tests (401, pass-through 200, 502 upstream).
  Commit: `feat(api-gateway): jwt verification and shared error envelope`

- [ ] **C3 Secrets hygiene**: grep scan for secrets in tracked files; per-service
  `.env.example` documented & in sync; root `.env.example`; fail-fast env validation helper
  in shared. Commit: `chore(env): document env vars and add fail-fast validation`

## Part D — Final verification & docs

- [ ] **D1 Full gate** (typecheck, lint, pytest all services, web build) — results into ledger.
- [ ] **D2 Update `docs/development/MASTER_PLAN.md`**: Phase 1 → ✅ DONE + results table.
