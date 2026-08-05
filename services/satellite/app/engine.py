"""Satellite intelligence: scene catalog, flood extent, NDWI.

TODO: integrate Sentinel Hub / Copernicus Data Space / Planetary Computer
for real acquisitions; train the U-Net/SegFormer flood segmentation model
(see docs/development/ai-environment.md and models/registry/).
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

SCENES: list[dict[str, Any]] = [
    {"id": "scn_001", "source": "sentinel-2", "sensor": "MSI", "lat": -0.4569, "lon": 39.6461, "cloud_cover_pct": 12.0, "size_mb": 420.0},
    {"id": "scn_002", "source": "sentinel-1", "sensor": "SAR-C", "lat": -0.4569, "lon": 39.6461, "cloud_cover_pct": 0.0, "size_mb": 380.0},
    {"id": "scn_003", "source": "landsat-9", "sensor": "OLI-2", "lat": 0.2119, "lon": 33.9992, "cloud_cover_pct": 8.0, "size_mb": 260.0},
    {"id": "scn_004", "source": "modis", "sensor": "MODIS", "lat": -0.3719, "lon": 35.1114, "cloud_cover_pct": 20.0, "size_mb": 90.0},
]


def scenes(lat: float, lon: float, source: str | None = None, limit: int = 20) -> list[dict[str, Any]]:
    """Return scenes near a coordinate, optionally filtered by source."""
    now = datetime.now(timezone.utc)
    result: list[dict[str, Any]] = []
    for i, scene in enumerate(SCENES):
        if source and scene["source"] != source:
            continue
        if abs(scene["lat"] - lat) > 2.0 or abs(scene["lon"] - lon) > 2.0:
            continue
        result.append({**scene, "acquired_at": now - timedelta(days=i * 3), "status": "available"})
    return result[:limit]


def flood_extent(scene_id: str) -> dict[str, Any]:
    """Estimate flooded area for a scene (segmentation model output in prod)."""
    scene = next((s for s in SCENES if s["id"] == scene_id), None)
    if scene is None:
        return {}
    seed = abs(hash(scene_id) % 100)
    area = round(1.5 + seed * 0.9, 2)
    lat, lon = scene["lat"], scene["lon"]
    d = 0.05 + seed / 1000
    geometry = {
        "type": "Polygon",
        "coordinates": [[[lon - d, lat - d], [lon + d, lat - d], [lon + d, lat + d], [lon - d, lat + d], [lon - d, lat - d]]],
    }
    return {
        "scene_id": scene_id,
        "area_km2": area,
        "confidence_pct": round(62 + seed % 35, 1),
        "geometry": geometry,
    }


def ndwi(scene_id: str) -> dict[str, Any]:
    """Return NDWI statistics for a scene (raster processing pending)."""
    scene = next((s for s in SCENES if s["id"] == scene_id), None)
    if scene is None:
        return {}
    seed = abs(hash(scene_id) % 100)
    return {
        "scene_id": scene_id,
        "ndwi_mean": round(-0.2 + (seed % 90) / 100, 3),
        "ndwi_water_pixels_pct": round(2 + seed % 40, 1),
        "method": "NDWI=(Green-NIR)/(Green+NIR)",
    }
