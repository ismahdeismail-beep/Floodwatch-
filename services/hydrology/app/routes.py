"""Hydrology routes."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from .engine import (
    flow_forecast,
    gauges_for,
    latest_reading,
    reading_history,
    rivers,
    soil_moisture,
)
from .schemas import FlowForecast, Gauge, GaugeReading, River, SoilMoistureSample

router = APIRouter(prefix="/hydrology", tags=["hydrology"])


@router.get("/rivers", response_model=list[River])
async def list_rivers() -> list[dict]:
    """River registry with gauges."""
    return rivers()


@router.get("/rivers/{river_id}/gauges", response_model=list[Gauge])
async def list_gauges(river_id: str) -> list[dict]:
    """Gauges on a river."""
    gauges = gauges_for(river_id)
    if not gauges:
        raise HTTPException(status_code=404, detail="River not found")
    return gauges


@router.get("/gauges/{gauge_id}/readings", response_model=list[GaugeReading])
async def gauge_readings(gauge_id: str, hours: int = Query(24, ge=1, le=168)) -> list[dict]:
    """Recent readings with threshold-derived status."""
    series = reading_history(gauge_id, hours)
    if not series:
        raise HTTPException(status_code=404, detail="Gauge not found")
    return series


@router.get("/soil-moisture", response_model=SoilMoistureSample)
async def soil_moisture_sample(lat: float = Query(ge=-90, le=90), lon: float = Query(ge=-180, le=180)) -> dict:
    """Soil moisture at a coordinate."""
    return soil_moisture(lat, lon)


@router.get("/flow-forecast", response_model=FlowForecast)
async def forecast(river_id: str = Query(...)) -> dict:
    """72-hour flow forecast for a river."""
    result = flow_forecast(river_id)
    if not result:
        raise HTTPException(status_code=404, detail="River not found")
    return result
