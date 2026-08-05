"""API gateway request/response models."""
from __future__ import annotations

from pydantic import BaseModel


class ServiceInfo(BaseModel):
    """Descriptor of a registered backend service."""

    name: str
    base_url: str
