"""Weather provider aggregation engine.

Providers are tried in priority order; the first successful response wins.
Key-activated providers (Kenya Met, ECMWF, NOAA, OpenWeather, Meteostat) are
only attempted when their API key is set. Open-Meteo is keyless and therefore
always configured. When every configured provider fails (or none are
configured), the service falls back to deterministic demo data so the
pipeline remains testable and runnable end-to-end with zero external keys.
"""
from __future__ import annotations

import logging
from abc import ABC, abstractmethod
from datetime import datetime, timedelta, timezone
from typing import Any

import httpx

from .config import settings

logger = logging.getLogger(__name__)

PRIORITY = ["kenya-met", "ecmwf", "noaa", "openweather", "meteostat", "openmeteo"]

OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1/forecast"
OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5"

REQUEST_TIMEOUT = 10.0


def _parse_utc(value: str) -> datetime:
    """Parse an ISO-8601 string into a timezone-aware UTC datetime."""
    if value.endswith("Z"):
        value = value[:-1] + "+00:00"
    parsed = datetime.fromisoformat(value)
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed.astimezone(timezone.utc)


def _parse_date_utc(value: str) -> datetime:
    """Parse a ``YYYY-MM-DD`` date string into an aware UTC midnight datetime."""
    return datetime.fromisoformat(value).replace(tzinfo=timezone.utc)


async def _get_json(url: str, params: dict[str, Any]) -> dict[str, Any]:
    """GET JSON from an external API with a 10s timeout and clear logging."""
    try:
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as exc:
        logger.warning("HTTP %s from %s", exc.response.status_code, url)
        raise
    except httpx.HTTPError as exc:
        logger.warning("Request error for %s: %s", url, exc)
        raise
    except ValueError as exc:
        logger.warning("Invalid JSON from %s: %s", url, exc)
        raise RuntimeError(f"Invalid JSON from {url}") from exc


class WeatherProvider(ABC):
    """Base class for all weather providers."""

    name: str = "base"
    api_key: str = ""

    @property
    def configured(self) -> bool:
        """Whether this provider should be attempted."""
        return bool(self.api_key)

    @abstractmethod
    async def fetch_current(self, lat: float, lon: float) -> dict[str, Any]:
        """Fetch current conditions."""

    @abstractmethod
    async def fetch_forecast(self, lat: float, lon: float, days: int) -> list[dict[str, Any]]:
        """Fetch a multi-day forecast."""


class KmdProvider(WeatherProvider):
    name = "kenya-met"
    api_key = settings.kmd_api_key

    async def fetch_current(self, lat: float, lon: float) -> dict[str, Any]:
        raise NotImplementedError("Kenya Met API integration pending")

    async def fetch_forecast(self, lat: float, lon: float, days: int) -> list[dict[str, Any]]:
        raise NotImplementedError("Kenya Met API integration pending")


class EcwmfProvider(WeatherProvider):
    name = "ecmwf"
    api_key = settings.ecmwf_api_key

    async def fetch_current(self, lat: float, lon: float) -> dict[str, Any]:
        raise NotImplementedError("ECMWF API integration pending")

    async def fetch_forecast(self, lat: float, lon: float, days: int) -> list[dict[str, Any]]:
        raise NotImplementedError("ECMWF API integration pending")


class NoaaProvider(WeatherProvider):
    name = "noaa"
    api_key = settings.noaa_api_key

    async def fetch_current(self, lat: float, lon: float) -> dict[str, Any]:
        raise NotImplementedError("NOAA API integration pending")

    async def fetch_forecast(self, lat: float, lon: float, days: int) -> list[dict[str, Any]]:
        raise NotImplementedError("NOAA API integration pending")


class MeteostatProvider(WeatherProvider):
    name = "meteostat"
    api_key = settings.meteostat_api_key

    async def fetch_current(self, lat: float, lon: float) -> dict[str, Any]:
        raise NotImplementedError("Meteostat API integration pending")

    async def fetch_forecast(self, lat: float, lon: float, days: int) -> list[dict[str, Any]]:
        raise NotImplementedError("Meteostat API integration pending")


class OpenWeatherProvider(WeatherProvider):
    name = "openweather"
    api_key = settings.openweather_api_key

    async def fetch_current(self, lat: float, lon: float) -> dict[str, Any]:
        data = await _get_json(
            f"{OPENWEATHER_BASE_URL}/weather",
            {"lat": lat, "lon": lon, "appid": self.api_key, "units": "metric"},
        )
        main = data.get("main", {})
        wind = data.get("wind", {})
        rain = data.get("rain", {}) or {}
        clouds = data.get("clouds", {}) or {}
        dt = data.get("dt")
        return {
            "lat": lat,
            "lon": lon,
            "temperature_c": main.get("temp"),
            "humidity_pct": main.get("humidity"),
            "wind_speed_kmh": round((wind.get("speed") or 0.0) * 3.6, 1),
            "precipitation_mm_h": rain.get("1h", 0.0),
            "cloud_cover_pct": clouds.get("all", 0),
            "observed_at": (
                datetime.fromtimestamp(dt, tz=timezone.utc) if dt else datetime.now(timezone.utc)
            ),
            "source": self.name,
        }

    async def fetch_forecast(self, lat: float, lon: float, days: int) -> list[dict[str, Any]]:
        limit = min(days, 5)
        data = await _get_json(
            f"{OPENWEATHER_BASE_URL}/forecast",
            {"lat": lat, "lon": lon, "appid": self.api_key, "units": "metric", "cnt": limit * 8},
        )
        grouped: dict[str, dict[str, Any]] = {}
        for entry in data.get("list", []):
            dt = datetime.fromtimestamp(entry.get("dt", 0), tz=timezone.utc)
            key = dt.date().isoformat()
            day = grouped.setdefault(
                key,
                {"precip_mm": 0.0, "precip_probability_pct": 0.0, "t_min_c": None, "t_max_c": None, "wind_speed_kmh": 0.0},
            )
            main = entry.get("main", {})
            day["precip_mm"] += (entry.get("rain", {}) or {}).get("3h", 0.0)
            day["precip_probability_pct"] = max(day["precip_probability_pct"], (entry.get("pop") or 0.0) * 100)
            t_min = main.get("temp_min")
            t_max = main.get("temp_max")
            if t_min is not None:
                day["t_min_c"] = t_min if day["t_min_c"] is None else min(day["t_min_c"], t_min)
            if t_max is not None:
                day["t_max_c"] = t_max if day["t_max_c"] is None else max(day["t_max_c"], t_max)
            wind_speed = ((entry.get("wind", {}) or {}).get("speed") or 0.0) * 3.6
            day["wind_speed_kmh"] = max(day["wind_speed_kmh"], round(wind_speed, 1))
        return [
            {
                "date": datetime.fromisoformat(key).replace(tzinfo=timezone.utc),
                "precip_mm": round(day["precip_mm"], 1),
                "precip_probability_pct": round(day["precip_probability_pct"], 1),
                "t_min_c": round(day["t_min_c"], 1) if day["t_min_c"] is not None else 0.0,
                "t_max_c": round(day["t_max_c"], 1) if day["t_max_c"] is not None else 0.0,
                "wind_speed_kmh": day["wind_speed_kmh"],
            }
            for key, day in grouped.items()
        ]


class OpenMeteoProvider(WeatherProvider):
    name = "openmeteo"
    api_key = ""

    @property
    def configured(self) -> bool:
        """Keyless provider; configured whenever enabled in settings."""
        return settings.open_meteo_enabled

    async def fetch_current(self, lat: float, lon: float) -> dict[str, Any]:
        data = await _get_json(
            OPEN_METEO_BASE_URL,
            {
                "latitude": lat,
                "longitude": lon,
                "current": "temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,cloud_cover",
                "timezone": "UTC",
            },
        )
        current = data.get("current")
        if current is None:
            raise RuntimeError("Open-Meteo returned no current conditions")
        observed_at = current.get("time")
        if not observed_at:
            raise RuntimeError("Open-Meteo returned no observation time")
        return {
            "lat": lat,
            "lon": lon,
            "temperature_c": current.get("temperature_2m"),
            "humidity_pct": current.get("relative_humidity_2m"),
            "wind_speed_kmh": current.get("wind_speed_10m"),
            "precipitation_mm_h": current.get("precipitation", 0.0),
            "cloud_cover_pct": current.get("cloud_cover", 0),
            "observed_at": _parse_utc(observed_at),
            "source": self.name,
        }

    async def fetch_forecast(self, lat: float, lon: float, days: int) -> list[dict[str, Any]]:
        data = await _get_json(
            OPEN_METEO_BASE_URL,
            {
                "latitude": lat,
                "longitude": lon,
                "daily": "precipitation_sum,precipitation_probability_max,temperature_2m_min,temperature_2m_max,wind_speed_10m_max",
                "timezone": "UTC",
                "forecast_days": max(1, int(days)),
            },
        )
        daily = data.get("daily") or {}
        times = daily.get("time", [])
        if not times:
            raise RuntimeError("Open-Meteo returned no forecast days")
        result: list[dict[str, Any]] = []
        for index, day_str in enumerate(times):
            result.append(
                {
                    "date": _parse_date_utc(day_str),
                    "precip_mm": _daily_value(daily, "precipitation_sum", index),
                    "precip_probability_pct": _daily_value(daily, "precipitation_probability_max", index),
                    "t_min_c": _daily_value(daily, "temperature_2m_min", index),
                    "t_max_c": _daily_value(daily, "temperature_2m_max", index),
                    "wind_speed_kmh": _daily_value(daily, "wind_speed_10m_max", index),
                }
            )
        return result


def _daily_value(daily: dict[str, Any], key: str, index: int, default: float = 0.0) -> float:
    """Safely index a parallel Open-Meteo daily array."""
    values = daily.get(key) or []
    if index < len(values) and values[index] is not None:
        return values[index]
    return default


def _demo_current(lat: float, lon: float, source: str = "demo") -> dict[str, Any]:
    """Deterministic demo observation (seeded by coordinates)."""
    seed = abs(int((lat * 1000) + (lon * 1000)))
    return {
        "lat": lat,
        "lon": lon,
        "temperature_c": round(18 + (seed % 140) / 10, 1),
        "humidity_pct": 55 + (seed % 40),
        "wind_speed_kmh": round(5 + (seed % 25), 1),
        "precipitation_mm_h": round((seed % 8) / 2, 1),
        "cloud_cover_pct": 20 + (seed % 75),
        "observed_at": datetime.now(timezone.utc),
        "source": source,
    }


def _demo_forecast(lat: float, lon: float, days: int, source: str = "demo") -> list[dict[str, Any]]:
    """Deterministic demo forecast series."""
    seed = abs(int((lat * 1000) + (lon * 1000)))
    out: list[dict[str, Any]] = []
    base = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    for day in range(1, days + 1):
        out.append(
            {
                "date": base + timedelta(days=day),
                "precip_mm": round((seed + day * 7) % 60, 1),
                "precip_probability_pct": 30 + ((seed + day * 13) % 65),
                "t_min_c": round(14 + (seed % 80) / 10, 1),
                "t_max_c": round(24 + (seed % 90) / 10, 1),
                "wind_speed_kmh": round(8 + (seed % 30), 1),
            }
        )
    return out


class WeatherService:
    """Aggregates providers with priority order and demo fallback."""

    def __init__(self) -> None:
        self.providers: dict[str, WeatherProvider] = {
            p.name: p
            for p in (
                KmdProvider(),
                EcwmfProvider(),
                NoaaProvider(),
                OpenWeatherProvider(),
                MeteostatProvider(),
                OpenMeteoProvider(),
            )
        }

    def _configured_names(self) -> list[str]:
        """Providers in priority order that should be attempted."""
        return [name for name in PRIORITY if self.providers[name].configured]

    def provider_status(self) -> list[dict[str, Any]]:
        """Report provider registry health."""
        return [
            {
                "name": name,
                "status": "configured" if self.providers[name].configured else "missing-key",
                "api_key_present": bool(self.providers[name].api_key),
            }
            for name in PRIORITY
        ]

    async def current(self, lat: float, lon: float) -> dict[str, Any]:
        """Return current conditions from the first working provider."""
        for name in self._configured_names():
            provider = self.providers[name]
            try:
                return await provider.fetch_current(lat, lon)
            except Exception as exc:  # noqa: BLE001
                logger.warning("Provider %s failed: %s", name, exc)
        logger.info("No configured provider succeeded; using demo data")
        return _demo_current(lat, lon)

    async def forecast(self, lat: float, lon: float, days: int = 5) -> dict[str, Any]:
        """Return an aggregated forecast."""
        for name in self._configured_names():
            provider = self.providers[name]
            try:
                data = await provider.fetch_forecast(lat, lon, days)
                return {"lat": lat, "lon": lon, "generated_at": datetime.now(timezone.utc), "days": data}
            except Exception as exc:  # noqa: BLE001
                logger.warning("Provider %s failed: %s", name, exc)
        logger.info("No configured provider succeeded; using demo data")
        return {
            "lat": lat,
            "lon": lon,
            "generated_at": datetime.now(timezone.utc),
            "days": _demo_forecast(lat, lon, days),
        }


service = WeatherService()
