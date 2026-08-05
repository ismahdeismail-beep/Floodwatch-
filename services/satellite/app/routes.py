"""Satellite intelligence routes."""
from __future__ import annotations

from datetime import date

from fastapi import APIRouter, HTTPException, Query

from .engine import flood_extent, ndwi, scenes
from .schemas import FloodExtentResult, SatelliteScene

router = APIRouter(prefix="/satellite", tags=["satellite"])


@router.get("/scenes", response_model=list[SatelliteScene])
async def list_scenes(
    lat: float = Query(ge=-90, le=90),
    lon: float = Query(ge=-180, le=180),
    source: str | None = Query(default=None),
    _from: date | None = Query(default=None, alias="from"),
    _to: date | None = Query(default=None, alias="to"),
) -> list[dict]:
    """Scene catalog near a coordinate, optionally filtered by source/window."""
    return scenes(lat, lon, source)


@router.get("/scenes/{scene_id}/flood-extent", response_model=FloodExtentResult)
async def scene_flood_extent(scene_id: str) -> dict:
    """Detected flood extent GeoJSON for a scene."""
    result = flood_extent(scene_id)
    if not result:
        raise HTTPException(status_code=404, detail="Scene not found")
    return result


@router.get("/scenes/{scene_id}/ndwi")
async def scene_ndwi(scene_id: str) -> dict:
    """NDWI water index statistics for a scene."""
    result = ndwi(scene_id)
    if not result:
        raise HTTPException(status_code=404, detail="Scene not found")
    return result
