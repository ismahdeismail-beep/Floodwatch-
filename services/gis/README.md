# FloodWatch Geospatial Intelligence

Terrain, watershed, floodplain, buffer, routing and community analysis backed by PostGIS/GeoPandas. Returns GeoJSON throughout.

## Endpoints

| Method & Path | Description |
|---------------|-------------|
| `GET /api/v1/gis/elevation?lat&lon` | Elevation (SRTM / Copernicus DEM) |
| `GET /api/v1/gis/watershed?lat&lon` | Watershed catchment GeoJSON |
| `GET /api/v1/gis/floodplain?river_id` | Floodplain polygon |
| `GET /api/v1/gis/buffer?lat&lon&radius_m` | Buffer circle GeoJSON |
| `GET /api/v1/gis/nearest-facilities?lat&lon&types` | Nearest hospitals/schools/shelters |
| `GET /api/v1/gis/routes?from_lat&from_lon&to_lat&to_lon` | Safe route GeoJSON |
| `GET /api/v1/gis/communities` | At-risk communities (GeoJSON) |

## Environment variables

| Variable | Example / default |
|----------|-------------------|
| `POSTGRES_URL` | postgresql://floodwatch:floodwatch_dev@localhost:5432/floodwatch |
| `REDIS_URL` | redis://localhost:6379/0 |

## Run locally

```bash
cd services/gis
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8005
```

Swagger UI: http://localhost:8005/docs

## Run with Docker

```bash
cd services/gis
docker build -t floodwatch/gis .
docker run -p 8005:8005 floodwatch/gis
```

Or from the repo root: `docker compose up --build gis`

## Tests

```bash
cd services/gis
pip install pytest
pytest
```

## Optional heavy dependencies

Install only if this service needs them:

| Library | Purpose |
|---------|---------|
| `osmnx>=1.9` | Road network analysis |
| `networkx>=3.3` | Routing and graph algorithms |
| `pyflwdir>=0.5` | Flow direction |
| `whitebox>=2.3` | Terrain analysis (WhiteboxTools) |
| `taudem` | Watershed delineation |

## Integration notes

- Swagger/OpenAPI: http://localhost:8005/docs
- All responses use the unified error envelope documented in docs/api/error-handling.md
