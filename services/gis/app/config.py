"""Service configuration loaded from environment variables."""
from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime settings for gis. Override via environment variables."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    service_name: str = "gis"
    service_title: str = "FloodWatch Geospatial Intelligence"
    service_description: str = "Terrain, watershed, floodplain, buffer, routing and community analysis backed by PostGIS/GeoPandas. Returns GeoJSON throughout."
    log_level: str = "INFO"
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
    ]
    port: int = 8005

    postgres_url: str = "postgresql://floodwatch:floodwatch_dev@localhost:5432/floodwatch"
    redis_url: str = "redis://localhost:6379/0"



@lru_cache
def get_settings() -> Settings:
    """Return a cached settings singleton."""
    return Settings()


settings = get_settings()
