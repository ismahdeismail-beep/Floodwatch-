"""Health + smoke tests for the gis service."""
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
    assert body["service"] == "gis"


def test_communities() -> None:
    """The communities endpoint returns GeoJSON."""
    response = client.get("/api/v1/gis/communities")
    assert response.status_code == 200
    assert response.json()["type"] == "FeatureCollection"

