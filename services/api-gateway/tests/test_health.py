"""Health + smoke tests for the api-gateway service."""
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
    assert body["service"] == "api-gateway"


def test_registry() -> None:
    """The gateway advertises its registered backend services."""
    response = client.get("/api/v1/services")
    assert response.status_code == 200
    names = {item["name"] for item in response.json()}
    assert {"auth", "weather", "ai"}.issubset(names)

