import json
import logging

import pytest

from shared import __version__, get_request_id, set_request_id, setup_logging


def test_version():
    assert __version__ == "0.1.0"


def test_json_output(capsys):
    setup_logging(logging.DEBUG)
    logging.getLogger("svc").info("hello world")
    err = capsys.readouterr().err
    parsed = json.loads(err)
    assert "timestamp" in parsed
    assert "level" in parsed
    assert "logger" in parsed
    assert "message" in parsed
    assert parsed["level"] == "INFO"
    assert parsed["message"] == "hello world"


def test_request_id_in_output(capsys):
    setup_logging(logging.DEBUG)
    set_request_id("abc-123")
    try:
        logging.getLogger("svc").info("with request id")
        err = capsys.readouterr().err
        parsed = json.loads(err)
        assert parsed["request_id"] == "abc-123"
    finally:
        set_request_id("")


def test_request_id_default_empty(capsys):
    setup_logging(logging.DEBUG)
    logging.getLogger("svc").info("default")
    err = capsys.readouterr().err
    parsed = json.loads(err)
    assert parsed["request_id"] == ""
