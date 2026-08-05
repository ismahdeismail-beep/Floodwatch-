"""Analytics core: trends, model accuracy, impact summaries.

Demo series illustrate the shapes the analytics API will return once the
platform ingests historical flood events and prediction logs.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

TRENDS: list[dict[str, Any]] = [
    {"period": "2025-04", "flood_events": 6, "affected_people": 124000},
    {"period": "2025-05", "flood_events": 12, "affected_people": 289000},
    {"period": "2025-06", "flood_events": 4, "affected_people": 61000},
    {"period": "2025-07", "flood_events": 1, "affected_people": 9000},
    {"period": "2025-11", "flood_events": 8, "affected_people": 154000},
    {"period": "2025-12", "flood_events": 14, "affected_people": 332000},
    {"period": "2026-01", "flood_events": 9, "affected_people": 178000},
    {"period": "2026-02", "flood_events": 5, "affected_people": 88000},
]

ACCURACY: list[dict[str, Any]] = [
    {"model": "flood-risk-v0.1-baseline", "precision": 0.86, "recall": 0.92, "false_alarm_rate": 0.08, "evaluated_on": "2026-06-01"},
    {"model": "flood-depth-v0.1", "precision": 0.79, "recall": 0.84, "false_alarm_rate": 0.11, "evaluated_on": "2026-06-01"},
]

POPULATION: list[dict[str, Any]] = [
    {"county": "Garissa", "population": 841353, "at_risk_pct": 34.2, "risk_level": "high"},
    {"county": "Busia", "population": 893681, "at_risk_pct": 28.7, "risk_level": "extreme"},
    {"county": "Nairobi", "population": 4397087, "at_risk_pct": 12.4, "risk_level": "moderate"},
    {"county": "Kakamega", "population": 1867400, "at_risk_pct": 21.9, "risk_level": "high"},
    {"county": "Lamu", "population": 143920, "at_risk_pct": 17.3, "risk_level": "moderate"},
]

INFRASTRUCTURE: list[dict[str, Any]] = [
    {"kind": "roads", "total": 161451, "at_risk": 12400},
    {"kind": "bridges", "total": 9040, "at_risk": 730},
    {"kind": "hospitals", "total": 12340, "at_risk": 415},
    {"kind": "schools", "total": 90211, "at_risk": 4280},
]

REPORTS: dict[str, dict[str, Any]] = {
    "rpt_001": {
        "id": "rpt_001",
        "title": "Quarterly Flood Risk Report — Q1 2026",
        "generated_at": "2026-03-31",
        "summary": "Long rains season analysis across 12 high-risk counties.",
    },
}


def overview() -> dict[str, Any]:
    """Platform analytics summary."""
    return {
        "total_predictions": 482913,
        "active_alerts": 7,
        "monitored_rivers": 24,
        "at_risk_communities": 186,
        "model_uptime_pct": 99.92,
        "updated_at": datetime.now(timezone.utc),
    }


def flood_trends(from_period: str | None = None, to_period: str | None = None) -> list[dict[str, Any]]:
    """Flood event trend series, optionally filtered by period."""
    series = TRENDS
    if from_period:
        series = [t for t in series if t["period"] >= from_period]
    if to_period:
        series = [t for t in series if t["period"] <= to_period]
    return series


def model_accuracy() -> list[dict[str, Any]]:
    """Prediction accuracy metrics per model."""
    return ACCURACY


def population_impact() -> list[dict[str, Any]]:
    """Population exposure by county."""
    return POPULATION


def infrastructure_impact() -> list[dict[str, Any]]:
    """Infrastructure exposure summary."""
    return INFRASTRUCTURE


def report(report_id: str) -> dict[str, Any] | None:
    """Return a generated report, if it exists."""
    return REPORTS.get(report_id)
