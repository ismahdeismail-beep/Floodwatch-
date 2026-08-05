"""Service configuration loaded from environment variables."""
from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime settings for hydrology. Override via environment variables."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    service_name: str = "hydrology"
    service_title: str = "FloodWatch Hydrology"
    service_description: str = "River gauges, watersheds, soil moisture and flow forecasting (GloFAS-style). Applies warning thresholds to river levels."
    log_level: str = "INFO"
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
    ]
    port: int = 8003

    glofas_api_url: str = ""
    glofas_api_key: str = ""
    redis_url: str = "redis://localhost:6379/0"



@lru_cache
def get_settings() -> Settings:
    """Return a cached settings singleton."""
    return Settings()


settings = get_settings()
