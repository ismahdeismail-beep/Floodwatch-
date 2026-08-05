"""Health + smoke tests for the weather service."""
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
    assert body["service"] == "weather"


def test_providers() -> None:
    """The provider registry is reachable."""
    response = client.get("/api/v1/weather/providers")
    assert response.status_code == 200
    assert len(response.json()) >= 1

