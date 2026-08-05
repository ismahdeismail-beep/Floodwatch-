"""API gateway routes."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException, Request, Response

from .engine import SERVICES, proxy, registry

router = APIRouter(tags=["gateway"])


@router.get("/services", response_model=list[dict[str, str]])
async def list_services() -> list[dict[str, str]]:
    """List registered backend services."""
    return registry()


@router.api_route(
    "/{service}/{path:path}",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
)
async def route_request(service: str, path: str, request: Request) -> Response:
    """Reverse proxy to a registered backend service."""
    if service not in SERVICES:
        raise HTTPException(status_code=404, detail=f"Unknown service: {service}")
    upstream = await proxy(service, path, request)
    return Response(
        content=upstream.content,
        status_code=upstream.status_code,
        media_type=upstream.headers.get("content-type"),
    )
