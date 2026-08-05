import time

import fakeredis
import redis
import pytest

from shared.cache import Cache


def build_cache():
    server = fakeredis.FakeServer()
    client = fakeredis.FakeRedis(server=server)
    return Cache(client), client


class FlakyClient:
    def __init__(self, real):
        self._real = real
        self.calls = 0

    def get(self, key):
        self.calls += 1
        if self.calls == 1:
            raise redis.exceptions.ConnectionError("transient boom")
        return self._real.get(key)


def test_roundtrip():
    cache, _ = build_cache()
    payload = {"county": "Nairobi", "stations": [1, 2, 3]}
    cache.set_json("county:nairobi", payload)
    assert cache.get_json("county:nairobi") == payload


def test_missing_key_returns_none():
    cache, _ = build_cache()
    assert cache.get_json("nope") is None


def test_ttl_expiry():
    cache, _ = build_cache()
    cache.set_json("key:short", {"v": 1}, ttl=1)
    assert cache.get_json("key:short") == {"v": 1}
    time.sleep(1.2)
    assert cache.get_json("key:short") is None


def test_delete_prefix():
    cache, client = build_cache()
    for key in ("a:1", "a:2", "b:1"):
        cache.set_json(key, {"k": key})
    assert cache.delete_prefix("a:") == 2
    assert cache.get_json("a:1") is None
    assert cache.get_json("a:2") is None
    assert cache.get_json("b:1") == {"k": "b:1"}
    assert cache.delete_prefix("zz:") == 0


def test_retry_after_transient_failure():
    server = fakeredis.FakeServer()
    real = fakeredis.FakeRedis(server=server)
    flaky = FlakyClient(real)
    cache = Cache(flaky)
    real.set("county:nairobi", '{"ok": true}')
    assert cache.get_json("county:nairobi") == {"ok": True}
    assert flaky.calls == 2


def test_ping_true():
    cache, _ = build_cache()
    assert cache.ping() is True


class DownClient:
    def ping(self):
        raise redis.exceptions.ConnectionError("redis is down")


def test_ping_false_when_client_down():
    cache = Cache(DownClient())
    assert cache.ping() is False


def test_from_url_returns_cache():
    cache = Cache.from_url("redis://localhost:6379/0")
    assert isinstance(cache, Cache)
