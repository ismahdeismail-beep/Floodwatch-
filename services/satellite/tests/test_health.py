"""Health + smoke tests for the satellite service."""
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
    assert body["service"] == "satellite"


def test_scenes() -> None:
    """The scene catalog is reachable."""
    response = client.get("/api/v1/satellite/scenes", params={"lat": -1.29, "lon": 36.82})
    assert response.status_code == 200

