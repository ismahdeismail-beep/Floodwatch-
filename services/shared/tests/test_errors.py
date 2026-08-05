import pytest
from starlette.applications import Starlette
from starlette.routing import Route
from starlette.testclient import TestClient

from shared.errors import (
    ApiError,
    ConflictError,
    InternalError,
    NotFoundError,
    ServiceUnavailableError,
    UnauthorizedError,
    ValidationError,
    register_error_handlers,
)
from shared.middleware import RequestIDMiddleware


def build_app(route_func):
    app = Starlette(routes=[Route("/boom", route_func)])
    register_error_handlers(app)
    return app


async def raise_not_found(request):
    raise NotFoundError("county not found", details={"county_id": 7})


async def raise_boom(request):
    raise RuntimeError("kaboom")


def test_api_error_attributes():
    err = ApiError("nope", code="custom", status_code=418, details={"x": 1})
    assert err.message == "nope"
    assert err.code == "custom"
    assert err.status_code == 418
    assert err.details == {"x": 1}


def test_subclass_status_codes():
    assert NotFoundError().status_code == 404
    assert ValidationError().status_code == 422
    assert ConflictError().status_code == 409
    assert UnauthorizedError().status_code == 401
    assert ServiceUnavailableError().status_code == 503
    assert InternalError().status_code == 500


def test_subclass_envelope():
    client = TestClient(build_app(raise_not_found))
    response = client.get("/boom")
    assert response.status_code == 404
    body = response.json()
    assert body["error"]["code"] == "not_found"
    assert body["error"]["message"] == "county not found"
    assert body["error"]["details"] == {"county_id": 7}
    assert "request_id" in body["error"]


def test_unknown_exception_500_envelope():
    client = TestClient(build_app(raise_boom), raise_server_exceptions=False)
    response = client.get("/boom")
    assert response.status_code == 500
    body = response.json()
    assert body["error"]["code"] == "internal_error"
    assert body["error"]["message"] == "Internal server error"
    assert body["error"]["details"] is None
    assert "request_id" in body["error"]


def test_request_id_in_envelope():
    app = Starlette(routes=[Route("/boom", raise_not_found)])
    app.add_middleware(RequestIDMiddleware)
    register_error_handlers(app)
    with TestClient(app) as client:
        response = client.get("/boom", headers={"X-Request-ID": "abc-123"})
        assert response.status_code == 404
        assert response.json()["error"]["request_id"] == "abc-123"
        assert response.headers["x-request-id"] == "abc-123"
