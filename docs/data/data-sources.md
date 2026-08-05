# Data Sources & Ecosystem

FloodWatch AI consumes trusted, predominantly open, scientific and governmental
data. This page documents providers, ingestion cadence, and usage notes.

## Provider Matrix

| Domain | Source | Access | Cadence | Ingested by |
|--------|--------|--------|---------|-------------|
| Weather | Kenya Meteorological Department (KMD) | Agreement | 6-hourly | weather |
| Weather | ECMWF / Copernicus Climate Data Store (HRES, ENS) | CDS API key | 6-hourly | weather |
| Weather | NOAA (GFS) | Open | 6-hourly | weather |
| Weather | OpenWeather | API key | 3-hourly | weather |
| Weather | Meteostat | Open | Hourly | weather |
| Rainfall | NASA GPM IMERG | NASA Earthdata token | 30 min | satellite |
| Rainfall | CHIRPS | Open | Daily | weather |
| Hydrology | GloFAS river discharge forecasts | CDS | Daily | hydrology |
| Hydrology | National gauge networks (WRMA, counties) | Telemetry/API | Minutely–hourly | hydrology |
| Hydrology | HydroSHEDS (catchments, river network) | Open | Static | gis |
| Satellite | Sentinel-1 SAR (flood extent) | Copernicus Data Space | 12-day revisit | satellite |
| Satellite | Sentinel-2 MSI | Copernicus Data Space | 5-day revisit | satellite |
| Satellite | Landsat 8/9 | NASA Earthdata | 16-day revisit | satellite |
| Satellite | MODIS | NASA Earthdata | Daily | satellite |
| Terrain | SRTM 30 m | Open | Static | gis |
| Terrain | Copernicus DEM 30 m | Open | Static | gis |
| Infrastructure | OpenStreetMap | Open (OSMnx) | Weekly refresh | gis |
| Infrastructure | Microsoft Building Footprints | Open | Static refresh | gis |
| Population | WorldPop | Open | Annual | gis |
| Population | HDX / Meta Population Dataset | Open | Annual | gis |

## Ingestion Pipeline

1. **Schedule** — each source has a cadence; the collection engine triggers fetches.
2. **Fetch** — authenticated download (CDS API, Earthdata token, gauge telemetry API).
3. **Validate** — schema checks, range checks, freshness checks.
4. **Store** — vectors → PostGIS; rasters → object storage with metadata in Postgres.
5. **Version** — every ingest records source, timestamp, and version for reproducibility.
6. **Alert on failure** — ingestion failures surface in the admin console and logs.

## Data Quality Rules

- Reject readings outside physically plausible ranges (e.g., negative rainfall, gauge level above sensor max).
- Require freshness: stale telemetry is flagged `degraded` in the dashboard.
- Rainfall accumulation windows: 1 h, 3 h, 6 h, 24 h, 72 h (used by the AI baseline).
- All geometry stored as EPSG:4326 (WGS84); reprojection handled in the gis service.

## Licensing Notes

- CHIRPS, GPM, SRTM, WorldPop, OSM (ODbL), Copernicus data: open licenses with attribution requirements — attribution is displayed in the web app footer and map controls.
- KMD and gauge telemetry: per-agency agreements; data is not redistributed raw.
