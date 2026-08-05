"""AI prediction request/response models."""
from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class FloodRiskFeatures(BaseModel):
    """Feature vector for flood-risk prediction."""

    rainfall_mm_24h: float = Field(ge=0, le=500)
    rainfall_mm_72h: float = Field(ge=0, le=1000)
    river_level_ratio: float = Field(ge=0, le=2, description="Level / flood threshold")
    soil_moisture: float = Field(ge=0, le=1)
    terrain_slope: float = Field(ge=0, le=90, description="Degrees")
    upstream_rain: bool = False


class FloodRiskAssessment(BaseModel):
    """Explainable flood-risk prediction output."""

    probability: float = Field(ge=0, le=1)
    risk_level: str
    expected_depth_m: float
    duration_hours: float
    extent_km2: float
    confidence: float = Field(ge=0, le=1)
    model_version: str
    feature_importance: dict[str, float]
    generated_at: datetime
    valid_until: datetime


class ModelInfo(BaseModel):
    """Registered model descriptor."""

    id: str
    version: str
    task: str
    metrics: dict[str, float] | None = None
    status: str = "registered"


class RetrainResponse(BaseModel):
    """Retraining job acknowledgement."""

    job_id: str
    status: str = "queued"
