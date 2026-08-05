"""Alert engine routes."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException

from .engine import add_rule, dispatch, render_template, rules, sent_history, TEMPLATES
from .schemas import AlertMessage, AlertRule, DeliveryResult, Template

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.post("/send", response_model=list[DeliveryResult])
async def send_alert(message: AlertMessage) -> list[DeliveryResult]:
    """Dispatch an alert across the requested channels."""
    return dispatch(message)


@router.get("/rules", response_model=list[AlertRule])
async def list_rules() -> list[dict]:
    """List alert rules."""
    return rules()


@router.post("/rules", response_model=AlertRule, status_code=201)
async def create_rule(rule: AlertRule) -> dict:
    """Create an alert rule."""
    return add_rule(rule)


@router.get("/templates", response_model=list[Template])
async def templates() -> list[Template]:
    """List message templates."""
    return TEMPLATES


@router.get("/sent")
async def history(limit: int = 50) -> list[dict]:
    """Recent delivery history."""
    return sent_history(limit)


@router.post("/templates/render")
async def render(template_id: str, variables: dict[str, str]) -> dict:
    """Render a template with variables (testing helper)."""
    try:
        text = render_template(template_id, **variables)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return {"template_id": template_id, "rendered": text}
