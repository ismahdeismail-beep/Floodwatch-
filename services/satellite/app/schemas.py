"""Satellite request/response models."""
from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel


class SatelliteScene(BaseModel):
    """Catalog entry for an acquired satellite scene."""

    id: str
    source: str
    sensor: str
    lat: float
    lon: float
    acquired_at: datetime
    cloud_cover_pct: float
    size_mb: float
    status: str = "available"


class FloodExtentResult(BaseModel):
    """Detected flood extent for a scene (GeoJSON geometry)."""

    scene_id: str
    area_km2: float
    confidence_pct: float
    geometry: dict
