"""Service configuration loaded from environment variables."""
from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime settings for weather. Override via environment variables."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    service_name: str = "weather"
    service_title: str = "FloodWatch Weather Intelligence"
    service_description: str = "Aggregates weather forecasts and observations from trusted providers (Kenya Meteorological Department, ECMWF, NOAA, OpenWeather, Meteostat) with validation, caching and fallback."
    log_level: str = "INFO"
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
    ]
    port: int = 8002

    kmd_api_key: str = ""
    ecmwf_api_key: str = ""
    noaa_api_key: str = ""
    openweather_api_key: str = ""
    meteostat_api_key: str = ""
    open_meteo_enabled: bool = True
    redis_url: str = "redis://localhost:6379/0"



@lru_cache
def get_settings() -> Settings:
    """Return a cached settings singleton."""
    return Settings()


settings = get_settings()
