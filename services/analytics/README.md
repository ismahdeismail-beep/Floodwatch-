# FloodWatch Analytics

Historical flood trends, model accuracy, population and infrastructure impact, reports and climate indicators.

## Endpoints

| Method & Path | Description |
|---------------|-------------|
| `GET /api/v1/analytics/overview` | Platform analytics summary |
| `GET /api/v1/analytics/flood-trends?from&to` | Flood event trend series |
| `GET /api/v1/analytics/model-accuracy` | Prediction accuracy metrics |
| `GET /api/v1/analytics/population-impact` | Population exposure by county |
| `GET /api/v1/analytics/infrastructure-impact` | Infrastructure risk summary |
| `GET /api/v1/analytics/reports/{id}` | Generated report |

## Environment variables

| Variable | Example / default |
|----------|-------------------|
| `POSTGRES_URL` | postgresql://floodwatch:floodwatch_dev@localhost:5432/floodwatch |
| `REDIS_URL` | redis://localhost:6379/0 |

## Run locally

```bash
cd services/analytics
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8008
```

Swagger UI: http://localhost:8008/docs

## Run with Docker

```bash
cd services/analytics
docker build -t floodwatch/analytics .
docker run -p 8008:8008 floodwatch/analytics
```

Or from the repo root: `docker compose up --build analytics`

## Tests

```bash
cd services/analytics
pip install pytest
pytest
```

## Optional heavy dependencies

Install only if this service needs them:

| Library | Purpose |
|---------|---------|
| `mlflow>=2.16` | Model performance tracking |

## Integration notes

- Swagger/OpenAPI: http://localhost:8008/docs
- All responses use the unified error envelope documented in docs/api/error-handling.md
