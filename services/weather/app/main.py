"""FloodWatch AI microservice entry point."""
from __future__ import annotations

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from shared import (
    RequestIDMiddleware,
    __version__,
    health_router,
    register_error_handlers,
    setup_logging,
)

from .config import settings

setup_logging(getattr(logging, settings.log_level.upper()))
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.service_title,
    description=settings.service_description,
    version=__version__,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RequestIDMiddleware)

register_error_handlers(app)

app.router.routes.extend(health_router(settings.service_name, __version__).routes)

from . import routes  # noqa: E402

app.include_router(routes.router, prefix="/api/v1")
