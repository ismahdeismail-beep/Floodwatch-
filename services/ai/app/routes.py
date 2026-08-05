"""AI prediction engine routes."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException

from .engine import list_models, model_metrics, predict, queue_retrain
from .schemas import FloodRiskAssessment, FloodRiskFeatures, ModelInfo, RetrainResponse

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/predict/flood-risk", response_model=FloodRiskAssessment)
async def flood_risk(features: FloodRiskFeatures) -> FloodRiskAssessment:
    """Predict flood risk from a feature vector (explainable)."""
    return predict(features)


@router.get("/models", response_model=list[ModelInfo])
async def models() -> list[dict]:
    """List registered models and versions."""
    return list_models()


@router.get("/models/{model_id}/metrics")
async def metrics(model_id: str) -> dict:
    """Evaluation metrics for a model."""
    known = {m["id"] for m in list_models()}
    if model_id not in known:
        raise HTTPException(status_code=404, detail="Model not found")
    return model_metrics(model_id)


@router.post("/retrain", response_model=RetrainResponse, status_code=202)
async def retrain() -> dict:
    """Queue a model retraining job."""
    return queue_retrain()
