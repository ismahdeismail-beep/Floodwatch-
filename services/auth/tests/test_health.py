"""Health + smoke tests for the auth service."""
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
    assert body["service"] == "auth"


def test_login() -> None:
    """The demo administrator can authenticate."""
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@floodwatch.ai", "password": "ChangeMe123!"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["access_token"]

