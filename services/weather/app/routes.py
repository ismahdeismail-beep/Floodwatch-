"""Weather intelligence routes."""
from __future__ import annotations

from datetime import date, datetime

from fastapi import APIRouter, Query

from .engine import service
from .schemas import HistoricalWeather, WeatherForecast, WeatherObservation, WeatherProvider

router = APIRouter(prefix="/weather", tags=["weather"])


@router.get("/current", response_model=WeatherObservation)
async def current_weather(lat: float = Query(ge=-90, le=90), lon: float = Query(ge=-180, le=180)) -> dict:
    """Current weather conditions at a coordinate."""
    return await service.current(lat, lon)


@router.get("/forecast", response_model=WeatherForecast)
async def forecast(lat: float = Query(ge=-90, le=90), lon: float = Query(ge=-180, le=180), days: int = Query(5, ge=1, le=10)) -> dict:
    """Multi-provider weather forecast."""
    return await service.forecast(lat, lon, days)


@router.get("/historical", response_model=HistoricalWeather)
async def historical(
    lat: float = Query(ge=-90, le=90),
    lon: float = Query(ge=-180, le=180),
    from_date: date = Query(...),
    to_date: date = Query(...),
) -> dict:
    """Historical observations window (provider archive integration pending)."""
    samples = [
        {
            **__import__("app.engine", fromlist=["_demo_current"])._demo_current(lat, lon),
            "observed_at": datetime.combine(d, datetime.min.time()),
        }
        for d in [from_date, to_date]
    ]
    return {"lat": lat, "lon": lon, "from_date": from_date, "to_date": to_date, "samples": samples}


@router.get("/providers", response_model=list[WeatherProvider])
async def providers() -> list[dict]:
    """Provider registry and health status."""
    return service.provider_status()
