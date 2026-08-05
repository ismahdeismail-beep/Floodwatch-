"""Alert engine request/response models."""
from __future__ import annotations

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class AlertSeverity(str, Enum):
    """Warning level mapped from the decision engine."""

    INFO = "info"
    WATCH = "watch"
    WARNING = "warning"
    CRITICAL = "critical"


class AlertChannel(str, Enum):
    """Supported delivery channels."""

    SMS = "sms"
    WHATSAPP = "whatsapp"
    PUSH = "push"
    EMAIL = "email"
    WEB = "web"
    WEBHOOK = "webhook"


class AlertMessage(BaseModel):
    """An alert payload to dispatch."""

    title: str
    body: str
    severity: AlertSeverity
    county: str | None = None
    ward: str | None = None
    channels: list[AlertChannel] = Field(default_factory=list)
    recipients: list[str] | None = None


class AlertRule(BaseModel):
    """Routing rule: when a condition matches, use these channels."""

    id: str | None = None
    name: str
    min_severity: AlertSeverity = AlertSeverity.WATCH
    channels: list[AlertChannel]
    targets: list[str] = Field(default_factory=list)
    enabled: bool = True


class DeliveryResult(BaseModel):
    """Outcome of delivering via one channel."""

    channel: AlertChannel
    status: str
    message_id: str
    delivered_at: datetime


class Template(BaseModel):
    """A message template with {placeholders}."""

    id: str
    name: str
    content: str
