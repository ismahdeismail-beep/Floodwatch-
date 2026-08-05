"""Provider integration + fallback tests for the weather service.

HTTP calls are mocked with a fake ``httpx.AsyncClient`` so tests never touch
the network. Open-Meteo is always configured (keyless), so it is the provider
exercised here; every key-activated provider is forced unconfigured so a
developer's local API keys cannot leak real network calls into the suite.
"""
from __future__ import annotations

from datetime import datetime

import httpx
import pytest
from fastapi.testclient import TestClient

from app import engine
from app.engine import service
from app.main import app

client = TestClient(app)

CURRENT_PAYLOAD = {
    "current": {
        "time": "2026-08-05T12:00",
        "temperature_2m": 21.4,
        "relative_humidity_2m": 62,
        "wind_speed_10m": 14.2,
        "precipitation": 0.2,
        "cloud_cover": 45,
    }
}

FORECAST_PAYLOAD = {
    "daily": {
        "time": ["2026-08-06", "2026-08-07", "2026-08-08"],
        "precipitation_sum": [12.3, 0.0, 4.5],
        "precipitation_probability_max": [80, 10, 55],
        "temperature_2m_min": [15.0, 16.2, 17.1],
        "temperature_2m_max": [23.4, 25.6, 24.9],
        "wind_speed_10m_max": [18.0, 22.0, 9.0],
    }
}

REQUIRED_OBSERVATION = {
    "temperature_c",
    "humidity_pct",
    "wind_speed_kmh",
    "precipitation_mm_h",
    "cloud_cover_pct",
    "observed_at",
    "source",
}
REQUIRED_DAY = {"date", "precip_mm", "precip_probability_pct", "t_min_c", "t_max_c", "wind_speed_kmh"}


@pytest.fixture(autouse=True)
def _isolated_providers(monkeypatch: pytest.MonkeyPatch) -> None:
    """Force key-activated providers off and Open-Meteo on for every test."""
    for name in ("kenya-met", "ecmwf", "noaa", "openweather", "meteostat"):
        monkeypatch.setattr(service.providers[name], "api_key", "")
    monkeypatch.setattr(engine.settings, "open_meteo_enabled", True)


def _install_fake_client(monkeypatch: pytest.MonkeyPatch, handler) -> None:
    """Replace ``httpx.AsyncClient`` in the engine module with a fake."""

    class FakeAsyncClient:
        def __init__(self, *args, **kwargs) -> None:
            pass

        async def __aenter__(self) -> "FakeAsyncClient":
            return self

        async def __aexit__(self, *exc) -> bool:
            return False

        async def get(self, url: str, params: dict | None = None):
            return handler(url, params)

    monkeypatch.setattr(engine.httpx, "AsyncClient", FakeAsyncClient)


class FakeResponse:
    def __init__(self, payload: dict, status_code: int = 200) -> None:
        self.payload = payload
        self.status_code = status_code

    def raise_for_status(self) -> None:
        if self.status_code >= 400:
            raise httpx.HTTPStatusError(
                "mock HTTP error",
                request=httpx.Request("GET", "http://mock"),
                response=httpx.Response(self.status_code),
            )

    def json(self) -> dict:
        return self.payload


def _assert_aware_utc(value: str) -> None:
    parsed = datetime.fromisoformat(value)
    assert parsed.utcoffset() is not None
    assert parsed.utcoffset().total_seconds() == 0


def test_forecast_returns_days_schema(monkeypatch: pytest.MonkeyPatch) -> None:
    """GET forecast returns the days array with required keys and length for days=3."""

    def handler(url: str, params: dict) -> FakeResponse:
        assert "api.open-meteo.com" in url
        assert params.get("forecast_days") == 3
        return FakeResponse(FORECAST_PAYLOAD)

    _install_fake_client(monkeypatch, handler)
    response = client.get("/api/v1/weather/forecast", params={"lat": -1.29, "lon": 36.82, "days": 3})
    assert response.status_code == 200
    body = response.json()
    assert len(body["days"]) == 3
    for day in body["days"]:
        assert REQUIRED_DAY.issubset(day.keys())
        _assert_aware_utc(day["date"])


def test_current_returns_observation(monkeypatch: pytest.MonkeyPatch) -> None:
    """GET current returns required fields including a real provider source."""

    def handler(url: str, params: dict) -> FakeResponse:
        assert "api.open-meteo.com" in url
        return FakeResponse(CURRENT_PAYLOAD)

    _install_fake_client(monkeypatch, handler)
    response = client.get("/api/v1/weather/current", params={"lat": -1.29, "lon": 36.82})
    assert response.status_code == 200
    body = response.json()
    assert REQUIRED_OBSERVATION.issubset(body.keys())
    assert body["source"] == "openmeteo"
    assert body["temperature_c"] == 21.4
    _assert_aware_utc(body["observed_at"])


def test_provider_status_reports_configuration() -> None:
    """Provider registry reflects real configuration state."""
    status = service.provider_status()
    by_name = {item["name"]: item for item in status}
    assert by_name["openmeteo"]["status"] == "configured"
    assert by_name["openmeteo"]["api_key_present"] is False
    assert by_name["openweather"]["status"] == "missing-key"
    assert by_name["kenya-met"]["status"] == "missing-key"
    assert by_name["ecmwf"]["status"] == "missing-key"


def test_demo_fallback_has_source_demo(monkeypatch: pytest.MonkeyPatch) -> None:
    """When every configured provider fails, the response source is demo."""

    def handler(url: str, params: dict) -> FakeResponse:
        raise httpx.ConnectError("mock network failure")

    _install_fake_client(monkeypatch, handler)
    response = client.get("/api/v1/weather/current", params={"lat": -1.29, "lon": 36.82})
    assert response.status_code == 200
    body = response.json()
    assert body["source"] == "demo"
    _assert_aware_utc(body["observed_at"])
