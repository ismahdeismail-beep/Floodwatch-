# Services Reference

Backend services are Python 3.12 + FastAPI microservices. Each service exposes a
`/health` endpoint and versioned routes under `/api/v1`, with Swagger UI at
`/docs`. All services share the same 12-file layout:

```
services/<name>/
├── Dockerfile              # python:3.12-slim, healthcheck
├── requirements.txt        # FastAPI, uvicorn, pydantic-settings, httpx, python-dotenv
├── requirements-optional.txt
├── .env.example
├── README.md
└── app/
    ├── __init__.py
    ├── config.py           # pydantic-settings Settings (env-var driven)
    ├── main.py             # FastAPI app, CORS, /health, route mounting
    ├── schemas.py          # Pydantic request/response models
    ├── engine.py           # domain logic (mock/stub implementations)
    └── routes.py           # API routers
```

## Service Registry

| Service | Port | Responsibility |
|---------|------|----------------|
| `api-gateway` | 8000 | Entry point for all clients; route aggregation, rate limiting, API-key/JWT validation, CORS |
| `auth` | 8001 | JWT issuance, OAuth2 password flow, RBAC, API-key management, demo in-memory store |
| `weather` | 8002 | Aggregation of weather providers (KMD, ECMWF, OpenWeather, Meteostat); current conditions + 7-day forecasts |
| `hydrology` | 8003 | River gauge telemetry, watersheds, soil moisture, river stage analytics |
| `satellite` | 8004 | Sentinel-1/2, Landsat, MODIS ingestion; flood extent detection, NDWI indices |
| `gis` | 8005 | Geospatial processing: floodplains, buffers, routing, exposure analysis (PostGIS) |
| `ai` | 8006 | ML prediction engine; model registry; deterministic baseline `v0.1.0` until MLflow models promoted |
| `alerts` | 8007 | Multi-channel notification engine (SMS, WhatsApp, push, email, webhook); templating, delivery tracking |
| `analytics` | 8008 | Trends, model accuracy, impact analytics, report data |

## Common Conventions

- **Settings**: `app/config.py` reads environment variables (both `SERVICE_X` and
  `service_x` forms) via pydantic-settings.
- **Health**: `GET /health` → `{"status": "ok", "service": "<name>", "version": "0.1.0"}`.
- **API envelope**: `{ "data": ... }` with `meta.generatedAt`; errors
  `{ "error": { "code", "message", "details? } }`.
- **CORS**: permissive in development; tightened via env in production.
- **Tests**: `tests/test_health.py` (pytest) per service.

## Inter-Service Communication

- Services are independent; they communicate through the gateway in production.
- Direct service-to-service calls are allowed for internal pipelines (e.g.,
  `satellite → gis → ai`) using internal URLs/API keys, managed in `config.py`.
- Async jobs use Redis (pub/sub + queues); raster artifacts pass through MinIO/GCS.

## Development

```bash
cd services/ai
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8006
# Swagger: http://localhost:8006/docs
```

Or run the full backend infrastructure via WSL2 (no Docker):

```powershell
.\scripts\wsl-services.ps1 start    # Start PostgreSQL, Redis, MinIO
```

```bash
# In WSL2 Ubuntu
bash ~/.floodwatch/start-services.sh
```
