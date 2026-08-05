"""Service registry and reverse proxy for the FloodWatch API gateway."""
from __future__ import annotations

import logging
from typing import Any

import httpx
from starlette.requests import Request

from .config import settings

logger = logging.getLogger(__name__)

# Allowlisted backend services (name -> base URL).
SERVICES: dict[str, str] = {
    "auth": settings.auth_url,
    "weather": settings.weather_url,
    "hydrology": settings.hydrology_url,
    "satellite": settings.satellite_url,
    "gis": settings.gis_url,
    "ai": settings.ai_url,
    "alerts": settings.alerts_url,
    "analytics": settings.analytics_url,
}


def registry() -> list[dict[str, str]]:
    """Return the service registry as a list of descriptors."""
    return [{"name": name, "base_url": url} for name, url in SERVICES.items()]


async def proxy(service: str, path: str, request: Request) -> httpx.Response:
    """Forward a request to a backend service and return its response.

    TODO: add auth propagation, rate limiting, request id headers and
    circuit breakers for production.
    """
    target = SERVICES[service]
    url = f"{target}/api/v1/{path}"
    body = await request.body()

    async with httpx.AsyncClient(timeout=settings.proxy_timeout) as client:
        upstream = await client.request(
            method=request.method,
            url=url,
            params=request.query_params,
            headers={
                k: v
                for k, v in request.headers.items()
                if k.lower() not in {"host", "content-length", "connection"}
            },
            content=body or None,
        )
    return upstream
