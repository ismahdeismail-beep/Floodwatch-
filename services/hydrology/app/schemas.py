"""Hydrology request/response models."""
from __future__ import annotations

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class GaugeStatus(str, Enum):
    """Operational status derived from water level vs thresholds."""

    NORMAL = "normal"
    WATCH = "watch"
    WARNING = "warning"
    CRITICAL = "critical"


class River(BaseModel):
    """River descriptor."""

    id: str
    name: str
    basin: str
    length_km: float
    gauges: list["Gauge"] = []


class Gauge(BaseModel):
    """River gauge station."""

    id: str
    river_id: str
    name: str
    lat: float
    lon: float
    warning_m: float
    flood_m: float


class GaugeReading(BaseModel):
    """A water level reading at a gauge."""

    gauge_id: str
    level_m: float
    flow_m3_s: float
    status: GaugeStatus
    recorded_at: datetime


class SoilMoistureSample(BaseModel):
    """Soil moisture at a point."""

    lat: float
    lon: float
    moisture_pct: float
    sampled_at: datetime


class FlowForecast(BaseModel):
    """72-hour flow forecast for a river (GloFAS-style)."""

    river_id: str
    generated_at: datetime
    peak_flow_m3_s: float
    peak_time: datetime
    confidence_pct: float
    points: list[dict]
