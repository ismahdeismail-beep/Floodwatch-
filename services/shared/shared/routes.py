import time

from starlette.requests import Request
from starlette.responses import JSONResponse
from starlette.routing import Route, Router

from shared.cache import Cache


def health_router(service: str, version: str) -> Router:
    started_at = time.monotonic()

    async def health(request: Request) -> JSONResponse:
        return JSONResponse(
            {
                "status": "ok",
                "service": service,
                "version": version,
                "uptime_s": round(time.monotonic() - started_at, 1),
            }
        )

    return Router(routes=[Route("/health", health)])


def ready_router(cache: Cache) -> Router:
    async def ready(request: Request) -> JSONResponse:
        if cache.ping():
            return JSONResponse({"status": "ready"})
        return JSONResponse(
            status_code=503,
            content={"status": "unavailable", "checks": {"cache": "down"}},
        )

    return Router(routes=[Route("/ready", ready)])
