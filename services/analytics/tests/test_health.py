"""Health + smoke tests for the analytics service."""
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
    assert body["service"] == "analytics"


def test_overview() -> None:
    """The analytics overview endpoint is reachable."""
    response = client.get("/api/v1/analytics/overview")
    assert response.status_code == 200

