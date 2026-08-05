import json
import logging
import sys
from contextvars import ContextVar
from datetime import datetime, timezone

request_id_var: ContextVar[str] = ContextVar("request_id", default="")

_STANDARD_ATTRIBUTES = set(logging.makeLogRecord({}).__dict__.keys())


def get_request_id() -> str:
    return request_id_var.get()


def set_request_id(value: str) -> None:
    request_id_var.set(value)


class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload = {
            "timestamp": datetime.fromtimestamp(
                record.created, tz=timezone.utc
            ).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "request_id": get_request_id(),
        }
        for key, value in record.__dict__.items():
            if key in _STANDARD_ATTRIBUTES:
                continue
            if not isinstance(value, (str, int, float, bool)) or value is None:
                value = str(value)
            payload[key] = value
        return json.dumps(payload)


def setup_logging(level: int = logging.INFO) -> logging.Handler:
    root = logging.getLogger()
    for handler in list(root.handlers):
        root.removeHandler(handler)
    handler = logging.StreamHandler(sys.stderr)
    handler.setFormatter(JsonFormatter())
    root.addHandler(handler)
    root.setLevel(level)
    return handler
