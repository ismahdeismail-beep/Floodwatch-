"""Hydrology core: river registry, gauge thresholds, flow forecasts.

TODO: replace demo datasets with GloFAS + HydroSHEDS ingestion and live
gauge telemetry (see docs/data/data-sources.md).
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

from .schemas import GaugeStatus

RIVERS: list[dict[str, Any]] = [
    {
        "id": "riv_001",
        "name": "Tana River",
        "basin": "Tana",
        "length_km": 1000.0,
        "gauges": [
            {"id": "g_001", "river_id": "riv_001", "name": "Garissa", "lat": -0.4569, "lon": 39.6461, "warning_m": 6.0, "flood_m": 7.2},
            {"id": "g_002", "river_id": "riv_001", "name": "Garsen", "lat": -2.2767, "lon": 40.1000, "warning_m": 4.5, "flood_m": 5.6},
        ],
    },
    {
        "id": "riv_002",
        "name": "Nzoia River",
        "basin": "Lake Victoria",
        "length_km": 257.0,
        "gauges": [
            {"id": "g_003", "river_id": "riv_002", "name": "Budalangi", "lat": 0.2119, "lon": 33.9992, "warning_m": 3.2, "flood_m": 4.1},
        ],
    },
    {
        "id": "riv_003",
        "name": "Athi River",
        "basin": "Athi",
        "length_km": 390.0,
        "gauges": [
            {"id": "g_004", "river_id": "riv_003", "name": "Masinga", "lat": -0.9097, "lon": 37.5844, "warning_m": 2.8, "flood_m": 3.6},
        ],
    },
    {
        "id": "riv_004",
        "name": "Sondu Miriu",
        "basin": "Lake Victoria",
        "length_km": 180.0,
        "gauges": [
            {"id": "g_005", "river_id": "riv_004", "name": "Sondu", "lat": -0.3719, "lon": 35.1114, "warning_m": 2.4, "flood_m": 3.0},
        ],
    },
]


def gauge_status(level_m: float, warning_m: float, flood_m: float) -> GaugeStatus:
    """Classify a water level against warning and flood thresholds."""
    if level_m >= flood_m:
        return GaugeStatus.CRITICAL
    if level_m >= warning_m:
        return GaugeStatus.WARNING
    if level_m >= warning_m * 0.85:
        return GaugeStatus.WATCH
    return GaugeStatus.NORMAL


def rivers() -> list[dict[str, Any]]:
    """Return the river registry."""
    return RIVERS


def gauges_for(river_id: str) -> list[dict[str, Any]]:
    """Return gauges belonging to a river."""
    for river in RIVERS:
        if river["id"] == river_id:
            return river["gauges"]
    return []


def latest_reading(gauge: dict[str, Any]) -> dict[str, Any]:
    """Deterministic latest reading for a gauge (demo telemetry)."""
    seed = abs(hash(gauge["id"]) % 100)
    level = round(gauge["warning_m"] * (0.75 + (seed % 30) / 100), 2)
    status = gauge_status(level, gauge["warning_m"], gauge["flood_m"])
    return {
        "gauge_id": gauge["id"],
        "level_m": level,
        "flow_m3_s": round(120 + level * 90, 1),
        "status": status,
        "recorded_at": datetime.now(timezone.utc),
    }


def reading_history(gauge_id: str, hours: int = 24) -> list[dict[str, Any]]:
    """Return a demo reading series trending toward the current level."""
    gauge = next((g for r in RIVERS for g in r["gauges"] if g["id"] == gauge_id), None)
    if gauge is None:
        return []
    current = latest_reading(gauge)
    series: list[dict[str, Any]] = []
    base = datetime.now(timezone.utc) - timedelta(hours=hours)
    for i in range(hours):
        t = base + timedelta(hours=i)
        drift = (i / max(hours, 1)) * (current["level_m"] - current["level_m"] * 0.72)
        level = round(current["level_m"] * 0.72 + drift, 2)
        series.append(
            {
                "gauge_id": gauge_id,
                "level_m": level,
                "flow_m3_s": round(120 + level * 90, 1),
                "status": gauge_status(level, gauge["warning_m"], gauge["flood_m"]),
                "recorded_at": t,
            }
        )
    return series


def soil_moisture(lat: float, lon: float) -> dict[str, Any]:
    """Deterministic soil moisture sample.

    TODO: ingest ESA CCI SM or NASA SMAP products via the satellite service.
    """
    seed = abs(int((lat * 1000) + (lon * 1000)))
    return {
        "lat": lat,
        "lon": lon,
        "moisture_pct": round(25 + (seed % 60), 1),
        "sampled_at": datetime.now(timezone.utc),
    }


def flow_forecast(river_id: str) -> dict[str, Any]:
    """72-hour flow forecast (GloFAS-style).

    TODO: call the GloFAS API (settings.glofas_api_url) and map station
    identifiers to our river/gauge registry.
    """
    gauges = gauges_for(river_id)
    if not gauges:
        return {}
    seed = abs(hash(river_id) % 100)
    peak = round(150 + seed * 22, 1)
    now = datetime.now(timezone.utc)
    return {
        "river_id": river_id,
        "generated_at": now,
        "peak_flow_m3_s": peak,
        "peak_time": now + timedelta(hours=24 + (seed % 36)),
        "confidence_pct": 68 + (seed % 28),
        "points": [
            {"t": (now + timedelta(hours=h)).isoformat(), "flow_m3_s": round(peak * (0.55 + 0.45 * abs(h - 24) / 24), 1)}
            for h in range(0, 73, 3)
        ],
    }
