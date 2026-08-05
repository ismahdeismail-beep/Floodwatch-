"""Weather request/response models."""
from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class WeatherProvider(BaseModel):
    """Descriptor of a weather data provider."""

    name: str
    status: str = "configured"
    api_key_present: bool = False


class WeatherObservation(BaseModel):
    """Current conditions at a point."""

    lat: float = Field(ge=-90, le=90)
    lon: float = Field(ge=-180, le=180)
    temperature_c: float
    humidity_pct: float
    wind_speed_kmh: float
    precipitation_mm_h: float
    cloud_cover_pct: float
    observed_at: datetime
    source: str


class WeatherForecast(BaseModel):
    """Forecast series for a point."""

    lat: float = Field(ge=-90, le=90)
    lon: float = Field(ge=-180, le=180)
    generated_at: datetime
    days: list["ForecastDay"]


class ForecastDay(BaseModel):
    """One forecast day."""

    date: datetime
    precip_mm: float
    precip_probability_pct: float
    t_min_c: float
    t_max_c: float
    wind_speed_kmh: float


class HistoricalWeather(BaseModel):
    """Historical observations window."""

    lat: float
    lon: float
    from_date: datetime
    to_date: datetime
    samples: list[WeatherObservation]
