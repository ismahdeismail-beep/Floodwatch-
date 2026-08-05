# Datasets

Versioned data assets for FloodWatch AI. **Large files are git-ignored** —
only `.gitkeep` files and this documentation are committed.

## Layout

| Directory | Contents |
|-----------|----------|
| `raw/` | As-downloaded upstream data (CHIRPS tifs, gauge exports, satellite scenes) |
| `processed/` | Cleaned, normalized, feature-engineered datasets (parquet/GeoParquet preferred) |
| `geodata/` | Static geospatial layers (counties, watersheds, floodplains, SRTM-derived) |
| `historical_floods/` | Historical flood event records (Kenya Floods database, event footprints) |

## Provenance

Every dataset directory should carry a `sources.json`/README documenting:

- Source provider and dataset name (e.g., `CHIRPS-2.0`, UCSB/CHG)
- Access URL/API and license
- Fetch command (see `scripts/fetch-demo-data.py`)
- Date fetched, spatial extent, resolution
- Processing steps applied (if moved to `processed/`)

## Conventions

- Coordinate reference system: EPSG:4326 for storage; reproject at processing time.
- Rasters: GeoTIFF; vectors: GeoJSON/GeoPackage; tables: Parquet.
- Never commit raw downloads (`.gitignore` covers `datasets/raw/*`, `processed/*`, `geodata/*`).
- Demo dataset: `scripts/fetch-demo-data.py` pulls a small CHIRPS sample.
