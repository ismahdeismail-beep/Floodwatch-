"""Analytics routes."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from .engine import (
    flood_trends,
    infrastructure_impact,
    model_accuracy,
    overview,
    population_impact,
    report,
)
from .schemas import InfrastructureImpact, ModelAccuracyReport, OverviewResponse, PopulationImpact, TrendPoint

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/overview", response_model=OverviewResponse)
async def get_overview() -> dict:
    """Platform analytics summary."""
    return overview()


@router.get("/flood-trends", response_model=list[TrendPoint])
async def get_flood_trends(from_period: str | None = Query(default=None, alias="from"), to_period: str | None = Query(default=None, alias="to")) -> list[dict]:
    """Flood event trend series."""
    return flood_trends(from_period, to_period)


@router.get("/model-accuracy", response_model=list[ModelAccuracyReport])
async def get_model_accuracy() -> list[dict]:
    """Prediction accuracy metrics."""
    return model_accuracy()


@router.get("/population-impact", response_model=list[PopulationImpact])
async def get_population_impact() -> list[dict]:
    """Population exposure by county."""
    return population_impact()


@router.get("/infrastructure-impact", response_model=list[InfrastructureImpact])
async def get_infrastructure_impact() -> list[dict]:
    """Infrastructure exposure summary."""
    return infrastructure_impact()


@router.get("/reports/{report_id}")
async def get_report(report_id: str) -> dict:
    """Fetch a generated report."""
    result = report(report_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Report not found")
    return result
