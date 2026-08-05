# FloodWatch API Gateway

Single entry point for the FloodWatch platform. Routes /api/v1/* to backend microservices, enforces authentication and rate limiting.

## Endpoints

| Method & Path | Description |
|---------------|-------------|
| `GET /api/v1/services` | List registered backend services |
| `GET/POST/PUT/PATCH/DELETE /api/v1/{service}/{path}` | Reverse proxy to a backend service |

## Environment variables

| Variable | Example / default |
|----------|-------------------|
| `API_BASE_URL` | http://localhost:8000 |
| `SERVICE_AUTH_URL` | http://localhost:8001 |
| `SERVICE_WEATHER_URL` | http://localhost:8002 |
| `SERVICE_HYDROLOGY_URL` | http://localhost:8003 |
| `SERVICE_SATELLITE_URL` | http://localhost:8004 |
| `SERVICE_GIS_URL` | http://localhost:8005 |
| `SERVICE_AI_URL` | http://localhost:8006 |
| `SERVICE_ALERTS_URL` | http://localhost:8007 |
| `SERVICE_ANALYTICS_URL` | http://localhost:8008 |
| `PROXY_TIMEOUT` | 10 |

## Run locally

```bash
cd services/api-gateway
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Swagger UI: http://localhost:8000/docs

## Run with Docker

```bash
cd services/api-gateway
docker build -t floodwatch/api-gateway .
docker run -p 8000:8000 floodwatch/api-gateway
```

Or from the repo root: `docker compose up --build api-gateway`

## Tests

```bash
cd services/api-gateway
pip install pytest
pytest
```

## Integration notes

- Swagger/OpenAPI: http://localhost:8000/docs
- All responses use the unified error envelope documented in docs/api/error-handling.md
