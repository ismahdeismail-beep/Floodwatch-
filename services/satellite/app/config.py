"""Service configuration loaded from environment variables."""
from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime settings for satellite. Override via environment variables."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    service_name: str = "satellite"
    service_title: str = "FloodWatch Satellite Intelligence"
    service_description: str = "Ingests Sentinel-1/2, Landsat and MODIS imagery; detects flooded areas and estimates flood extent (U-Net/SegFormer segmentation planned)."
    log_level: str = "INFO"
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
    ]
    port: int = 8004

    sentinel_hub_client_id: str = ""
    sentinel_hub_client_secret: str = ""
    nasa_gpm_api_key: str = ""
    redis_url: str = "redis://localhost:6379/0"



@lru_cache
def get_settings() -> Settings:
    """Return a cached settings singleton."""
    return Settings()


settings = get_settings()
