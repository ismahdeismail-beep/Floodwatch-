"""Geospatial request/response models."""
from __future__ import annotations

from pydantic import BaseModel


class ElevationResponse(BaseModel):
    """Elevation at a point (metres)."""

    lat: float
    lon: float
    elevation_m: float
    source: str = "SRTM/Copernicus DEM"


class WatershedResponse(BaseModel):
    """Watershed catchment for a point as GeoJSON."""

    lat: float
    lon: float
    area_km2: float
    geometry: dict


class FloodplainResponse(BaseModel):
    """Floodplain polygon for a river."""

    river_id: str
    area_km2: float
    geometry: dict


class BufferResponse(BaseModel):
    """Buffer circle GeoJSON around a point."""

    lat: float
    lon: float
    radius_m: float
    geometry: dict


class NearestFacility(BaseModel):
    """A facility near a point."""

    id: str
    name: str
    kind: str
    distance_km: float
    coordinates: list[float]


class RouteResponse(BaseModel):
    """Safe route as a GeoJSON LineString."""

    from_coordinates: list[float]
    to_coordinates: list[float]
    distance_km: float
    geometry: dict
