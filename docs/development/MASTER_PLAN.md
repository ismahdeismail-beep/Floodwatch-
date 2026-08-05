# FloodWatch AI — Master Development Plan

> **Owner:** FloodWatch AI Engineering (sole creator)
> **Status:** Active — Phased Execution
> **Baseline:** All 9 services pass tests · All 10 TS packages typecheck · All 8 lint tasks pass

This plan is the single source of truth for bringing FloodWatch AI from a demo-grade
scaffold to a production-ready, cloud-native flood intelligence platform. Every phase
ends with **verification** (typecheck / lint / pytest / build) so nothing regresses.

---

## Phase 0 — Baseline & Environment Repair ✅ DONE

| Item | Result |
|------|--------|
| npm 11 script-blocking (`allow-scripts = [""]`) blocked native postinstalls | Fixed: repaired `turbo` platform binary, `@next/swc-win32-x64-msvc`, regenerated `.bin` links |
| Workspace `.bin` links absent (node_modules copied, not installed) | Fixed via `npm install` |
| `pytest` missing | Installed (pytest 9.1.1) |
| Mobile typecheck: untyped `tabBarIcon` props (10 errors) | Fixed `apps/mobile/app/(tabs)/_layout.tsx` |
| Auth service: `passlib` unmaintained + missing bcrypt backend | Modernized to direct `bcrypt` (cost 12), removed `passlib` dep |
| 4 shared packages missing `eslint.config.mjs` (ESLint 9 fails) | Added configs extending `@floodwatch/eslint-config` |

**Baseline verification:** `turbo run typecheck` ✅ · `turbo run lint` ✅ · pytest 9/9 services ✅

---

## Phase 1 — Shared Foundations & Engineering Standards

**Python shared core (`services/shared/`)**
- Structured JSON logging + request-ID middleware
- Standard API error envelope (`{error: {code, message, details}}`)
- Redis-backed cache helper with tenacity retries + TTL
- Standard `/health` and `/ready` handlers with dependency checks

**TypeScript packages expansion**
- `@floodwatch/types`: pagination meta, error codes, analytics, historical floods, county schema
- `@floodwatch/api-client`: all endpoint groups, AbortSignal, timeout, retry-once, 204 handling
- `@floodwatch/utils`: coordinate validation, bbox helpers, severity ordering
- `@floodwatch/ui`: Tabs, DataTable, EmptyState, ProgressBar, Skeleton, Chart stubs

**Environment & secrets hygiene**
- All secrets env-only; fail-fast validation for JWT secret in non-dev
- `.env.example` documented; service `.env.example` kept in sync

---

## Phase 2 — Backend Services Production Hardening

### 2a. Weather service — real provider clients
- Implement **Open-Meteo** (keyless, real free API) as first-class provider
- Implement **OpenWeather** client (key-activated: `OPENWEATHER_API_KEY`)
- Keep Kenya Met / ECMWF / NOAA / Meteostat as documented, key-activated clients
- Deterministic demo fallback **only** when every key is absent (explicitly labelled `source: "demo"`)
- Tests: provider parsing, fallback, aggregation order, schema validation

### 2b. API Gateway hardening
- Request-ID header generation + propagation
- JWT auth propagation to downstream services (verify token, pass-through)
- Sliding-window rate limiting per client IP / API key
- Circuit breaker + timeout + retry (tenacity), 502/504 upstream errors mapped to envelope
- Tests: proxy passthrough, rate limit 429, missing-auth 401, upstream-down 502

### 2c. Alerts service — real channel adapters
- Twilio SMS, WhatsApp Business, FCM HTTP v1, SMTP email, outbound webhook
- All behind `alert_dry_run` (default true in dev); real senders activate with credentials
- Per-channel retry policy + delivery tracking + alert history
- Tests: dry-run dispatch, rule matching, template rendering, retry on failure

### 2d. Other services
- Hydrology: USGS + GloFAS key-activated clients; deterministic gauge fallback
- GIS: raster-aware elevation/slope where DEM present; geometric fallbacks
- Satellite: Sentinel Hub / Copernicus OAuth token + search client (key-activated)
- Analytics: accuracy metrics endpoints from real prediction logs when present

---

## Phase 3 — AI & Data Pipelines

- Feature engineering module (`services/ai/app/features.py`) with documented transforms
- Training script `services/ai/train.py` — XGBoost/LightGBM on historical floods,
  cross-validated, metrics persisted to `models/registry/<model>/metadata.json`
- ONNX export + `onnxruntime` inference path; prediction engine loads registry artifact
  when present, else falls back to explainable baseline (explicit `model_version`)
- Explainability: SHAP/permutation importance on trained models, feature_importance in response
- `GET /ai/models` lists real registry entries + baseline

---

## Phase 4 — Frontend Applications

- **Web:** React Query data layer, live map tiles, risk-checker wired to `/ai/predict/flood-risk`,
  weather + alerts pages live, PWA manifest + offline shell, dark-mode toggle, JSON-LD SEO
- **Dashboard:** county drill-down, alert management, reports/export, live monitoring map
- **Admin:** users/roles/API keys/models/data sources wired to gateway (RBAC enforced)
- **Mobile:** expo-notifications push, GPS location, AsyncStorage offline cache, saved locations

---

## Phase 5 — Data Layer & DevOps

- Full PostGIS `init.sql`: users, organizations, api_keys, counties, communities,
  infrastructure_assets, gauge_readings, weather_observations, risk_assessments,
  alerts, notification_deliveries, historical_floods, model_registry, audit_logs
  (with GIST indexes, FKs, constraints)
- Seed script: Kenya counties + demo gauges/communities (real geography)
- Monitoring: Prometheus scrape targets for all 9 services, Grafana dashboard JSON, Loki config
- CI: `npm ci` hardening note, e2e job, smoke job, dependabot scope
- Security: rate-limit defaults, security headers on web, secret scanning

---

## Phase 6 — Testing & Documentation

- Per-service route tests (login/RBAC, weather forecast, risk predict, alert dispatch,
  gateway proxy, hydrology, gis, analytics) — target ≥ 6 tests per service
- Playwright e2e: landing, risk checker, map, alert page; Locust smoke load test
- Docs: module READMEs verified, API reference, troubleshooting guide, CHANGELOG

---

## Phase 7 — Knowledge Persistence (sole-creator memory)

- Supermemory: project profile, architecture map, environment quirks, decisions, error solutions
- Shared-memory log of agent assignments per session
- `docs/architecture` updated with any new ADRs

---

## Verification Gate (every phase)

```
node node_modules/turbo/bin/turbo run typecheck
node node_modules/turbo/bin/turbo run lint
python -m pytest services/<svc>/tests   (all 9)
node node_modules/turbo/bin/turbo run build -- --filter=@floodwatch/web
```
