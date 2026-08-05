# FloodWatch Weather Intelligence

Aggregates weather forecasts and observations from trusted providers (Kenya Meteorological Department, ECMWF, NOAA, OpenWeather, Meteostat) with validation, caching and fallback.

## Endpoints

| Method & Path | Description |
|---------------|-------------|
| `GET /api/v1/weather/current?lat&lon` | Current weather conditions |
| `GET /api/v1/weather/forecast?lat&lon&days` | Multi-provider forecast aggregation |
| `GET /api/v1/weather/historical?lat&lon&from&to` | Historical observations |
| `GET /api/v1/weather/providers` | Provider registry + health status |

## Environment variables

| Variable | Example / default |
|----------|-------------------|
| `KMD_API_KEY` |  |
| `ECMWF_API_KEY` |  |
| `NOAA_API_KEY` |  |
| `OPENWEATHER_API_KEY` |  |
| `METEOSTAT_API_KEY` |  |
| `REDIS_URL` | redis://localhost:6379/0 |

## Run locally

```bash
cd services/weather
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8002
```

Swagger UI: http://localhost:8002/docs

## Run with Docker

```bash
docker build -t floodwatch/weather -f services/weather/Dockerfile .
docker run -p 8002:8002 floodwatch/weather
```

Or from the repo root: `docker compose up --build weather`

## Tests

```bash
cd services/weather
pip install pytest
pytest
```

## Integration notes

- Swagger/OpenAPI: http://localhost:8002/docs
- All responses use the unified error envelope documented in docs/api/error-handling.md
