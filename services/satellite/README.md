# FloodWatch Satellite Intelligence

Ingests Sentinel-1/2, Landsat and MODIS imagery; detects flooded areas and estimates flood extent (U-Net/SegFormer segmentation planned).

## Endpoints

| Method & Path | Description |
|---------------|-------------|
| `GET /api/v1/satellite/scenes?lat&lon&from&to&source` | Scene catalog |
| `GET /api/v1/satellite/scenes/{id}/flood-extent` | Flood extent GeoJSON + confidence |
| `GET /api/v1/satellite/scenes/{id}/ndwi` | NDWI water index statistics |

## Environment variables

| Variable | Example / default |
|----------|-------------------|
| `SENTINEL_HUB_CLIENT_ID` |  |
| `SENTINEL_HUB_CLIENT_SECRET` |  |
| `NASA_GPM_API_KEY` |  |
| `REDIS_URL` | redis://localhost:6379/0 |

## Run locally

```bash
cd services/satellite
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8004
```

Swagger UI: http://localhost:8004/docs

## Run with Docker

```bash
cd services/satellite
docker build -t floodwatch/satellite .
docker run -p 8004:8004 floodwatch/satellite
```

Or from the repo root: `docker compose up --build satellite`

## Tests

```bash
cd services/satellite
pip install pytest
pytest
```

## Optional heavy dependencies

Install only if this service needs them:

| Library | Purpose |
|---------|---------|
| `rasterio>=1.3` | Raster IO |
| `xarray>=2024.1` | Multi-dimensional array processing |
| `rioxarray>=0.16` | Raster + xarray integration |
| `opencv-python>=4.10` | Image processing |
| `torch>=2.4` | Deep learning segmentation models |

## Integration notes

- Swagger/OpenAPI: http://localhost:8004/docs
- All responses use the unified error envelope documented in docs/api/error-handling.md
