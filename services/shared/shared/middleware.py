import logging
import uuid

from starlette.middleware.base import BaseHTTPMiddleware

from shared.logging import set_request_id

logger = logging.getLogger("shared.middleware")


class RequestIDMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        header = request.headers.get("X-Request-ID")
        request_id = header.strip() if header else uuid.uuid4().hex
        set_request_id(request_id)
        response = None
        try:
            response = await call_next(request)
            response.headers["X-Request-ID"] = request_id
            return response
        finally:
            logger.info(
                "access_log path=%s method=%s status_code=%s",
                request.url.path,
                request.method,
                response.status_code if response is not None else "unknown",
            )
            set_request_id("")
