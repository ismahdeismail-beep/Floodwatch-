"""AI prediction engine — explainable flood risk baseline.

This is an honest deterministic baseline so the pipeline is testable before
trained artifacts exist. Replace with the MLflow-registered ensemble
(XGBoost/LightGBM/PyTorch) in models/registry/ and load via joblib/ONNX.
"""
from __future__ import annotations

import json
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path

from .config import settings
from .schemas import FloodRiskAssessment, FloodRiskFeatures

_WEIGHTS = {
    "rainfall_24h": 0.25,
    "rainfall_72h": 0.15,
    "river_level": 0.30,
    "soil_moisture": 0.10,
    "terrain": 0.10,
    "upstream": 0.10,
}


def _repo_root() -> Path:
    """Resolve the repository root from this file (services/ai/app/engine.py)."""
    return Path(__file__).resolve().parents[3]


def _model_dir() -> Path:
    path = Path(settings.model_dir)
    return path if path.is_absolute() else _repo_root() / path


def predict(features: FloodRiskFeatures) -> FloodRiskAssessment:
    """Compute an explainable flood-risk assessment from the feature vector."""
    sigmoid = lambda x: 1 / (1 + (2.718281828 ** (-x)))  # noqa: E731
    r24 = sigmoid((features.rainfall_mm_24h - 40) / 12)
    r72 = sigmoid((features.rainfall_mm_72h - 90) / 25)
    river = max(0.0, min(1.0, features.river_level_ratio))
    slope = max(0.0, min(1.0, 1.0 - features.terrain_slope / 15))
    upstream = 1.0 if features.upstream_rain else 0.0

    components = {
        "rainfall_24h": r24,
        "rainfall_72h": r72,
        "river_level": river,
        "soil_moisture": features.soil_moisture,
        "terrain": slope,
        "upstream": upstream,
    }
    score = sum(_WEIGHTS[k] * v for k, v in components.items())
    score = max(0.0, min(1.0, score))

    probability = round(score, 4)
    depth = round(score * 2.8, 2)
    duration = round(6 + score * 42, 1)
    extent = round(score * score * 18.0, 2)
    risk_level = (
        "low" if score < 0.35 else "moderate" if score < 0.60 else "high" if score < 0.80 else "extreme"
    )
    confidence = round(min(0.98, 0.55 + score * 0.4), 3)

    now = datetime.now(timezone.utc)
    return FloodRiskAssessment(
        probability=probability,
        risk_level=risk_level,
        expected_depth_m=depth,
        duration_hours=duration,
        extent_km2=extent,
        confidence=confidence,
        model_version=settings.model_version,
        feature_importance={k: round(v, 4) for k, v in _WEIGHTS.items()},
        generated_at=now,
        valid_until=now + timedelta(hours=6),
    )


def list_models() -> list[dict]:
    """List registered models (baseline + any artifacts under models/registry/)."""
    models = [
        {
            "id": "flood-risk",
            "version": settings.model_version,
            "task": "flood_probability_depth_duration_extent",
            "status": "baseline",
        }
    ]
    registry = _model_dir()
    if registry.is_dir():
        for folder in sorted(registry.iterdir()):
            metadata = folder / "metadata.json"
            if metadata.is_file():
                try:
                    meta = json.loads(metadata.read_text(encoding="utf-8"))
                    models.append(meta)
                except json.JSONDecodeError:
                    continue
    return models


def model_metrics(model_id: str) -> dict:
    """Return evaluation metrics for a model.

    TODO: backtest against historical flood events (analytics service) and
    track with MLflow (settings.mlflow_tracking_uri).
    """
    return {
        "model_id": model_id,
        "precision": 0.86,
        "recall": 0.92,
        "false_alarm_rate": 0.08,
        "auc": 0.94,
        "brier_score": 0.11,
        "last_evaluated": "2026-06-01",
        "note": "Demo metrics pending historical backtesting",
    }


def queue_retrain() -> dict:
    """Queue a retraining job (worker integration pending)."""
    return {"job_id": f"job_{uuid.uuid4().hex[:12]}", "status": "queued"}
