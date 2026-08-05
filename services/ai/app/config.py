"""Service configuration loaded from environment variables."""
from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime settings for ai. Override via environment variables."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    service_name: str = "ai"
    service_title: str = "FloodWatch AI Prediction Engine"
    service_description: str = "The brain: flood probability, depth, duration, extent, risk scoring, population/infrastructure impact, confidence and feature importance. Model registry with versioning and MLflow tracking."
    log_level: str = "INFO"
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
    ]
    port: int = 8006

    model_dir: str = "../models/registry"
    model_version: str = "v0.1-baseline"
    mlflow_tracking_uri: str = ""



@lru_cache
def get_settings() -> Settings:
    """Return a cached settings singleton."""
    return Settings()


settings = get_settings()
