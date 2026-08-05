from starlette.requests import Request
from starlette.responses import JSONResponse

from shared.logging import get_request_id


class ApiError(Exception):
    status_code = 500
    code = "internal_error"
    message = "Internal server error"
    details = None

    def __init__(
        self,
        message: str | None = None,
        *,
        code: str | None = None,
        status_code: int | None = None,
        details=None,
    ):
        if message is not None:
            self.message = message
        if code is not None:
            self.code = code
        if status_code is not None:
            self.status_code = status_code
        if details is not None:
            self.details = details
        super().__init__(self.message)


class NotFoundError(ApiError):
    status_code = 404
    code = "not_found"
    message = "Resource not found"


class ValidationError(ApiError):
    status_code = 422
    code = "validation_error"
    message = "Validation failed"


class ConflictError(ApiError):
    status_code = 409
    code = "conflict"
    message = "Resource conflict"


class UnauthorizedError(ApiError):
    status_code = 401
    code = "unauthorized"
    message = "Authentication required"


class ServiceUnavailableError(ApiError):
    status_code = 503
    code = "service_unavailable"
    message = "Service unavailable"


class InternalError(ApiError):
    status_code = 500
    code = "internal_error"
    message = "Internal server error"


def _envelope(exc: ApiError) -> dict:
    return {
        "error": {
            "code": exc.code,
            "message": exc.message,
            "details": exc.details,
            "request_id": get_request_id(),
        }
    }


async def _api_error_handler(request: Request, exc: ApiError) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content=_envelope(exc))


async def _unexpected_error_handler(request: Request, exc: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=InternalError.status_code,
        content=_envelope(InternalError()),
    )


def register_error_handlers(app) -> None:
    app.add_exception_handler(ApiError, _api_error_handler)
    app.add_exception_handler(Exception, _unexpected_error_handler)
