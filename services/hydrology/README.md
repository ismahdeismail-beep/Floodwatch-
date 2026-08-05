# FloodWatch Hydrology

River gauges, watersheds, soil moisture and flow forecasting (GloFAS-style). Applies warning thresholds to river levels.

## Endpoints

| Method & Path | Description |
|---------------|-------------|
| `GET /api/v1/hydrology/rivers` | River registry |
| `GET /api/v1/hydrology/rivers/{id}/gauges` | Gauges on a river |
| `GET /api/v1/hydrology/gauges/{id}/readings` | Recent gauge readings with status |
| `GET /api/v1/hydrology/soil-moisture?lat&lon` | Soil moisture sample |
| `GET /api/v1/hydrology/flow-forecast?river_id` | 72-hour flow forecast (GloFAS-style) |

## Environment variables

| Variable | Example / default |
|----------|-------------------|
| `GLOFAS_API_URL` |  |
| `GLOFAS_API_KEY` |  |
| `REDIS_URL` | redis://localhost:6379/0 |

## Run locally

```bash
cd services/hydrology
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8003
```

Swagger UI: http://localhost:8003/docs

## Run with Docker

```bash
cd services/hydrology
docker build -t floodwatch/hydrology .
docker run -p 8003:8003 floodwatch/hydrology
```

Or from the repo root: `docker compose up --build hydrology`

## Tests

```bash
cd services/hydrology
pip install pytest
pytest
```

## Optional heavy dependencies

Install only if this service needs them:

| Library | Purpose |
|---------|---------|
| `xarray>=2024.1` | Gridded climate/hydrology datasets |
| `rioxarray>=0.16` | Raster-based analysis |
| `pyflwdir>=0.5` | River flow direction and accumulation |
| `duckdb>=1.1` | Fast analytics on parquet archives |
| `whitebox>=2.3` | Terrain analysis (WhiteboxTools) |

## Integration notes

- Swagger/OpenAPI: http://localhost:8003/docs
- All responses use the unified error envelope documented in docs/api/error-handling.md
