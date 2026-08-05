import json
import logging
import re
import uuid

import pytest
from starlette.applications import Starlette
from starlette.responses import JSONResponse, Response
from starlette.routing import Route
from starlette.testclient import TestClient

from shared import get_request_id, set_request_id, setup_logging
from shared.middleware import RequestIDMiddleware

UUID4_HEX_RE = re.compile(r"^[0-9a-f]{32}$")


def build_app():
    async def root(request):
        return Response("ok")

    async def ctx(request):
        return JSONResponse({"request_id": get_request_id()})

    app = Starlette(routes=[Route("/", root), Route("/ctx", ctx)])
    app.add_middleware(RequestIDMiddleware)
    return app


def test_echoes_client_header():
    with TestClient(build_app()) as client:
        response = client.get("/", headers={"X-Request-ID": "abc-123"})
        assert response.headers["x-request-id"] == "abc-123"


def test_generates_distinct_ids():
    with TestClient(build_app()) as client:
        first = client.get("/")
        second = client.get("/")
        assert "x-request-id" in first.headers
        assert "x-request-id" in second.headers
        assert first.headers["x-request-id"] != second.headers["x-request-id"]
        assert UUID4_HEX_RE.match(first.headers["x-request-id"])
        assert UUID4_HEX_RE.match(second.headers["x-request-id"])
        assert len(first.headers["x-request-id"]) >= 20


def test_contextvar_set_during_request():
    with TestClient(build_app()) as client:
        response = client.get("/ctx")
        body = response.json()
        header_value = response.headers["x-request-id"]
        assert body["request_id"] == header_value
        assert body["request_id"] != ""


def test_contextvar_cleared_after_request():
    assert get_request_id() == ""
    with TestClient(build_app()) as client:
        client.get("/ctx")
    assert get_request_id() == ""


def test_access_log(capsys):
    setup_logging(logging.INFO)
    with TestClient(build_app()) as client:
        client.get("/", headers={"X-Request-ID": "abc-123"})
    err = capsys.readouterr().err
    records = [json.loads(line) for line in err.strip().splitlines()]
    middleware_records = [
        rec for rec in records if rec.get("logger") == "shared.middleware"
    ]
    assert middleware_records, "no INFO record from shared.middleware logger"
    assert middleware_records[-1]["level"] == "INFO"
    assert middleware_records[-1]["request_id"] == "abc-123"
    set_request_id("")
