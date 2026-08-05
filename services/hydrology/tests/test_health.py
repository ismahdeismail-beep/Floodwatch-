"""Health + smoke tests for the hydrology service."""
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
    assert body["service"] == "hydrology"


def test_rivers() -> None:
    """The river registry is reachable."""
    response = client.get("/api/v1/hydrology/rivers")
    assert response.status_code == 200
    assert len(response.json()) >= 1

