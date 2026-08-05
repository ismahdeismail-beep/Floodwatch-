"""FloodWatch AI microservice entry point."""
from __future__ import annotations

import logging
from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings

logging.basicConfig(level=settings.log_level)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.service_title,
    description=settings.service_description,
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["system"])
def health() -> dict:
    """Liveness probe used by Docker/Kubernetes."""
    return {
        "status": "ok",
        "service": settings.service_name,
        "version": "0.1.0",
        "time": datetime.now(timezone.utc).isoformat(),
    }


from . import routes  # noqa: E402

app.include_router(routes.router, prefix="/api/v1")
