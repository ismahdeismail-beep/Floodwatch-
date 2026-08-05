# System Design Document — FloodWatch AI

**Version:** 1.0
**Status:** Approved (scaffold baseline)

---

## 1. Introduction

This document describes the system design of the FloodWatch AI platform: a
cloud-native, microservice-based ecosystem that collects environmental data,
predicts flood risk with AI, and delivers early warnings across channels.

## 2. System Context

```
 Trusted Environmental Data
        │
        ▼
 Data Collection Platform ──► Data Processing ──► Geospatial Intelligence
                                                      │
                                                      ▼
                                         Artificial Intelligence Core
                                                      │
                                                      ▼
                                          Flood Intelligence Engine
                                                      │
                                                      ▼
                                          Decision Intelligence Engine
                  ┌──────────────────────────┬─────────────────────────┐
                  ▼                          ▼                         ▼
        Government Dashboard          Public Website          Mobile Application
                  └──────────────────────────┼─────────────────────────┘
                                             ▼
                              Notification & API Platform
```

## 3. Component Design

### 3.1 AI Prediction Engine
- Inputs: processed rainfall, river stage, soil moisture, terrain, population.
- Outputs: probability, depth, duration, extent, impact, confidence, feature importance.
- Implementation: Python microservice (`services/ai`) with a pluggable model registry.
- Baseline: deterministic sigmoid-weighted model (`v0.1.0`) standing in until
  MLflow-registered ML models are promoted to production.

### 3.2 Data Collection Engine
- Scheduled ingestion with retry/backoff, validation, and version tracking.
- Providers: ECMWF/CDS, NASA Earthdata (GPM/IMERG/MODIS), Copernicus Data Space
  (Sentinel-1/2), CHIRPS, GloFAS, OSM, WorldPop.
- Services: `weather`, `hydrology`, `satellite`, `gis`.

### 3.3 Data Processing Engine
- Cleaning, normalization, validation, transformation, feature engineering.
- Geospatial alignment via PostGIS and GeoPandas/Rasterio/xarray.

### 3.4 Geospatial Intelligence Engine
- Terrain, watersheds, rivers, floodplains, roads, buildings, boundaries, routing.
- PostGIS spatial queries; safe-route computation in `gis`.

### 3.5 Flood Intelligence Engine
- Merges predictions with geospatial context → flood maps, timelines, affected
  communities, safe routes, infrastructure risk.

### 3.6 Decision Intelligence Engine
- Maps risk scores to warning levels (Green/Yellow/Orange/Red) and produces
  recommendations, evacuation advice, and prioritization.

### 3.7 Alert Engine
- Multi-channel delivery: SMS, WhatsApp, Push (FCM), Email, Browser, Webhook.
- Templating, delivery tracking, retries, channel fallback, expiry.

### 3.8 Applications
- Web (Next.js), Dashboard (Next.js), Admin (Next.js), Mobile (Expo/React Native).

### 3.9 Public API
- Gateway (`api-gateway`) aggregates routes; per-service OpenAPI at `/docs`.

## 4. Data Design

### 4.1 Stores

| Store | Purpose |
|-------|---------|
| PostgreSQL + PostGIS (Supabase) | Relational + geospatial data (counties, gauges, alerts, communities, assets, forecast runs) |
| Redis | Caching, rate-limit counters, pub/sub, background job queues |
| MinIO / GCS (object storage) | Raster imagery, model artifacts, exports |

### 4.2 Key Entities
- `alerts` (id, title, body, severity, county, ward, channels, sent_at, expires_at)
- `risk_assessments` (probability, risk_level, expected_depth_m, duration_hours, extent_km2, confidence, model_version)
- `gauge_readings` (gauge_id, level_m, flow_m3s, status, recorded_at)
- `communities`, `infrastructure_assets`, `counties`, `users`, `api_keys`, `model_registry`

## 5. Interface Design

### 5.1 Service Ports

| Service | Port | Health |
|---------|------|--------|
| api-gateway | 8000 | GET /health |
| auth | 8001 | GET /health |
| weather | 8002 | GET /health |
| hydrology | 8003 | GET /health |
| satellite | 8004 | GET /health |
| gis | 8005 | GET /health |
| ai | 8006 | GET /health |
| alerts | 8007 | GET /health |
| analytics | 8008 | GET /health |

### 5.2 Authentication
- JWT access tokens issued by `auth` (OAuth2 password flow for humans, API keys
  for machine clients). Gateway validates tokens, services trust gateway-signed
  identity claims; service-level verification configurable.

### 5.3 Error Handling
- Consistent error envelope: `{ "error": { "code", "message", "details" } }`.
- HTTP status semantics: 400 validation, 401 unauthorized, 403 forbidden, 404,
  409 conflict, 422 unprocessable, 429 rate limited, 5xx server.

## 6. Deployment Design

```
Cloudflare (DNS, CDN, WAF)
   └── Vercel (web/dashboard/admin frontends)
         └── Google Cloud Run (FastAPI services)
               ├── Supabase PostgreSQL + PostGIS
               ├── Gemini AI (reasoning) / MLflow registry
               ├── Firebase Cloud Messaging
               └── External data sources
```

See [docs/deployment/production.md](../deployment/production.md) for the full
hosting architecture and [docs/environment/hosting-stack.md](../environment/hosting-stack.md)
for platform services.

## 7. Security Design

- Secrets injected via environment/secret manager; `.env` never committed.
- API keys stored hashed (prefix visible for identification).
- RBAC across surfaces: `super_admin`, `platform_admin`, `operator`, `auditor`
  (admin) and `admin`, `operator`, `analyst`, `viewer` (dashboard).
- HTTPS everywhere; WAF via Cloudflare; audit logging of admin actions.
- CodeQL + dependency scanning in CI (`.github/workflows/codeql.yml`).

## 8. Observability

- Prometheus metrics per service (`/metrics`), Grafana dashboards, Loki log
  aggregation, OpenTelemetry tracing (prepared).
- SLOs: availability 99.9%, alert delivery < 30 s, API p95 < 500 ms.
