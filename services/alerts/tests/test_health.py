"""Health + smoke tests for the alerts service."""
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
    assert body["service"] == "alerts"


def test_rules() -> None:
    """The alert rules store is reachable."""
    response = client.get("/api/v1/alerts/rules")
    assert response.status_code == 200

