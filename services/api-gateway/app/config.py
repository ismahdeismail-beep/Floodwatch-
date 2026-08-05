"""Service configuration loaded from environment variables."""
from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime settings for api-gateway. Override via environment variables."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    service_name: str = "api-gateway"
    service_title: str = "FloodWatch API Gateway"
    service_description: str = "Single entry point for the FloodWatch platform. Routes /api/v1/* to backend microservices, enforces authentication and rate limiting."
    log_level: str = "INFO"
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
    ]
    port: int = 8000

    api_base_url: str = "http://localhost:8000"
    auth_url: str = "http://localhost:8001"
    weather_url: str = "http://localhost:8002"
    hydrology_url: str = "http://localhost:8003"
    satellite_url: str = "http://localhost:8004"
    gis_url: str = "http://localhost:8005"
    ai_url: str = "http://localhost:8006"
    alerts_url: str = "http://localhost:8007"
    analytics_url: str = "http://localhost:8008"
    proxy_timeout: float = 10.0



@lru_cache
def get_settings() -> Settings:
    """Return a cached settings singleton."""
    return Settings()


settings = get_settings()
