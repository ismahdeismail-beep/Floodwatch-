"""Geospatial intelligence routes."""
from __future__ import annotations

from fastapi import APIRouter, Query

from .engine import buffer, communities, elevation, floodplain, nearest_facilities, safe_route, watershed
from .schemas import BufferResponse, ElevationResponse, FloodplainResponse, NearestFacility, RouteResponse, WatershedResponse

router = APIRouter(prefix="/gis", tags=["gis"])


@router.get("/elevation", response_model=ElevationResponse)
async def get_elevation(lat: float = Query(ge=-90, le=90), lon: float = Query(ge=-180, le=180)) -> dict:
    """Elevation at a coordinate."""
    return elevation(lat, lon)


@router.get("/watershed", response_model=WatershedResponse)
async def get_watershed(lat: float = Query(ge=-90, le=90), lon: float = Query(ge=-180, le=180)) -> dict:
    """Watershed catchment GeoJSON."""
    return watershed(lat, lon)


@router.get("/floodplain", response_model=FloodplainResponse)
async def get_floodplain(river_id: str = Query(...)) -> dict:
    """Floodplain polygon for a river."""
    return floodplain(river_id)


@router.get("/buffer", response_model=BufferResponse)
async def get_buffer(lat: float = Query(...), lon: float = Query(...), radius_m: float = Query(1000, ge=10)) -> dict:
    """Buffer circle GeoJSON around a point."""
    return buffer(lat, lon, radius_m)


@router.get("/nearest-facilities", response_model=list[NearestFacility])
async def get_nearest_facilities(
    lat: float = Query(...),
    lon: float = Query(...),
    types: str = Query("hospital,school,shelter"),
) -> list[dict]:
    """Nearest facilities of the requested types."""
    return nearest_facilities(lat, lon, [t.strip() for t in types.split(",")])


@router.get("/routes", response_model=RouteResponse)
async def get_route(
    from_lat: float = Query(...),
    from_lon: float = Query(...),
    to_lat: float = Query(...),
    to_lon: float = Query(...),
) -> dict:
    """Safe route GeoJSON between two points."""
    return safe_route(from_lat, from_lon, to_lat, to_lon)


@router.get("/communities")
async def get_communities() -> dict:
    """At-risk communities as a GeoJSON FeatureCollection."""
    return communities()
