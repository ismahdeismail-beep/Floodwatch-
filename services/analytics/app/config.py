"""Service configuration loaded from environment variables."""
from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime settings for analytics. Override via environment variables."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    service_name: str = "analytics"
    service_title: str = "FloodWatch Analytics"
    service_description: str = "Historical flood trends, model accuracy, population and infrastructure impact, reports and climate indicators."
    log_level: str = "INFO"
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
    ]
    port: int = 8008

    postgres_url: str = "postgresql://floodwatch:floodwatch_dev@localhost:5432/floodwatch"
    redis_url: str = "redis://localhost:6379/0"



@lru_cache
def get_settings() -> Settings:
    """Return a cached settings singleton."""
    return Settings()


settings = get_settings()
