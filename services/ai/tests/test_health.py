"""Health + smoke tests for the ai service."""
from __future__ import annotations

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health() -> None:
    """The liveness endpoint must report status ok."""
    response = client.get("/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["service"] == "ai"


def test_predict() -> None:
    """The flood-risk prediction endpoint returns a valid assessment."""
    features = {
        "rainfall_mm_24h": 72.0,
        "rainfall_mm_72h": 160.0,
        "river_level_ratio": 0.85,
        "soil_moisture": 0.7,
        "terrain_slope": 2.0,
        "upstream_rain": True,
    }
    response = client.post("/api/v1/ai/predict/flood-risk", json=features)
    assert response.status_code == 200
    body = response.json()
    assert body["risk_level"] in {"low", "moderate", "high", "extreme"}
    assert 0.0 <= body["probability"] <= 1.0

