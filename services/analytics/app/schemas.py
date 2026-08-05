"""Analytics request/response models."""
from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel


class OverviewResponse(BaseModel):
    """Platform analytics summary."""

    total_predictions: int
    active_alerts: int
    monitored_rivers: int
    at_risk_communities: int
    model_uptime_pct: float
    updated_at: datetime


class TrendPoint(BaseModel):
    """One point of a time series."""

    period: str
    flood_events: int
    affected_people: int


class ModelAccuracyReport(BaseModel):
    """Prediction accuracy metrics."""

    model: str
    precision: float
    recall: float
    false_alarm_rate: float
    evaluated_on: str


class PopulationImpact(BaseModel):
    """Population exposure by county."""

    county: str
    population: int
    at_risk_pct: float
    risk_level: str


class InfrastructureImpact(BaseModel):
    """Infrastructure exposure summary."""

    kind: str
    total: int
    at_risk: int
