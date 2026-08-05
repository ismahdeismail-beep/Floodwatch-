"""Multi-channel alert delivery engine (adapter pattern).

All channels honour settings.alert_dry_run: when True (default in dev) they
log instead of sending, so the platform is safe to test without credentials.
"""
from __future__ import annotations

import logging
import smtplib
import uuid
from abc import ABC, abstractmethod
from datetime import datetime, timezone
from string import Template as StrTemplate

import httpx

from .config import settings
from .schemas import AlertMessage, AlertRule, AlertSeverity, DeliveryResult, Template

logger = logging.getLogger(__name__)

_RULES: list[dict] = [
    {
        "id": "rule_001",
        "name": "Critical broadcast",
        "min_severity": "critical",
        "channels": ["sms", "whatsapp", "push", "email"],
        "targets": ["all"],
        "enabled": True,
    },
    {
        "id": "rule_002",
        "name": "County watch",
        "min_severity": "watch",
        "channels": ["push", "web"],
        "targets": ["all"],
        "enabled": True,
    },
]

_SENT: list[dict] = []

TEMPLATES: list[Template] = [
    Template(id="tpl_001", name="flood-warning", content="Flood warning for {county} ({ward}): {body}. Severity: {severity}."),
    Template(id="tpl_002", name="evacuation", content="EVACUATION advised for {county} ({ward}): {body}. Move to {shelter}."),
    Template(id="tpl_003", name="all-clear", content="All-clear for {county} ({ward}). Monitor {link} for updates."),
]


def render_template(template_id: str, **variables: str) -> str:
    """Render a template with variables (safe_substitute)."""
    template = next((t for t in TEMPLATES if t.id == template_id), None)
    if template is None:
        raise ValueError(f"Unknown template: {template_id}")
    return StrTemplate(template.content).safe_substitute(**variables)


class DeliveryChannel(ABC):
    """Base class for all delivery channels."""

    channel_name = "base"

    @abstractmethod
    def send(self, message: AlertMessage) -> DeliveryResult:
        """Deliver a message; return a delivery result."""


class SmsChannel(DeliveryChannel):
    """SMS via Twilio (https://www.twilio.com/docs/sms)."""

    channel_name = "sms"

    def send(self, message: AlertMessage) -> DeliveryResult:
        if settings.alert_dry_run:
            logger.info("[dry-run] SMS to %s: %s", message.recipients, message.title)
        else:
            # TODO: twilio.rest.Client(settings.twilio_account_sid, settings.twilio_auth_token)
            #       .messages.create(from_=settings.twilio_from_number, to=..., body=...)
            raise NotImplementedError("Twilio integration pending")
        return DeliveryResult(channel="sms", status="delivered", message_id=uuid.uuid4().hex, delivered_at=datetime.now(timezone.utc))


class WhatsAppChannel(DeliveryChannel):
    """WhatsApp Business Platform API."""

    channel_name = "whatsapp"

    def send(self, message: AlertMessage) -> DeliveryResult:
        if settings.alert_dry_run:
            logger.info("[dry-run] WhatsApp to %s: %s", message.recipients, message.title)
        else:
            # TODO: POST to https://graph.facebook.com/v20.0/<phone-id>/messages
            raise NotImplementedError("WhatsApp Business API integration pending")
        return DeliveryResult(channel="whatsapp", status="delivered", message_id=uuid.uuid4().hex, delivered_at=datetime.now(timezone.utc))


class EmailChannel(DeliveryChannel):
    """Email via SMTP."""

    channel_name = "email"

    def send(self, message: AlertMessage) -> DeliveryResult:
        if settings.alert_dry_run:
            logger.info("[dry-run] Email to %s: %s", message.recipients, message.title)
        else:
            with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
                server.starttls()
                server.login(settings.smtp_user, settings.smtp_password)
                # TODO: server.send_message(...)
        return DeliveryResult(channel="email", status="delivered", message_id=uuid.uuid4().hex, delivered_at=datetime.now(timezone.utc))


class PushChannel(DeliveryChannel):
    """Mobile push via FCM."""

    channel_name = "push"

    def send(self, message: AlertMessage) -> DeliveryResult:
        if settings.alert_dry_run:
            logger.info("[dry-run] Push to %s: %s", message.recipients, message.title)
        else:
            # TODO: FCM HTTP v1 API with settings.fcm_server_key
            raise NotImplementedError("FCM integration pending")
        return DeliveryResult(channel="push", status="delivered", message_id=uuid.uuid4().hex, delivered_at=datetime.now(timezone.utc))


class WebhookChannel(DeliveryChannel):
    """Outbound webhook to third-party systems."""

    channel_name = "webhook"

    def send(self, message: AlertMessage) -> DeliveryResult:
        if settings.alert_dry_run:
            logger.info("[dry-run] Webhook: %s", message.title)
            return DeliveryResult(channel="webhook", status="delivered", message_id=uuid.uuid4().hex, delivered_at=datetime.now(timezone.utc))
        # TODO: POST message.model_dump() to configured webhook URL
        raise NotImplementedError("Webhook integration pending")


_CHANNELS: dict[str, DeliveryChannel] = {
    "sms": SmsChannel(),
    "whatsapp": WhatsAppChannel(),
    "email": EmailChannel(),
    "push": PushChannel(),
    "webhook": WebhookChannel(),
}


def dispatch(message: AlertMessage) -> list[DeliveryResult]:
    """Dispatch an alert across the requested channels."""
    results: list[DeliveryResult] = []
    for channel_name in message.channels:
        channel = _CHANNELS.get(channel_name)
        if channel is None:
            results.append(
                DeliveryResult(channel=channel_name, status="failed", message_id=uuid.uuid4().hex, delivered_at=datetime.now(timezone.utc))
            )
            continue
        try:
            results.append(channel.send(message))
        except Exception as exc:  # noqa: BLE001
            logger.error("Channel %s failed: %s", channel_name, exc)
            results.append(
                DeliveryResult(channel=channel_name, status="failed", message_id=uuid.uuid4().hex, delivered_at=datetime.now(timezone.utc))
            )
    _SENT.append(
        {
            "title": message.title,
            "severity": message.severity,
            "county": message.county,
            "channels": [c.value for c in message.channels],
            "results": [r.model_dump() for r in results],
            "sent_at": datetime.now(timezone.utc).isoformat(),
        }
    )
    return results


def rules() -> list[dict]:
    """Return alert rules."""
    return _RULES


def add_rule(rule: AlertRule) -> dict:
    """Create an alert rule."""
    record = rule.model_dump()
    record["id"] = f"rule_{len(_RULES) + 1:03d}"
    _RULES.append(record)
    return record


def sent_history(limit: int = 50) -> list[dict]:
    """Return recent delivery history."""
    return _SENT[-limit:]
