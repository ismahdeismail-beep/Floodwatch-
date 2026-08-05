import fakeredis
import redis
from starlette.applications import Starlette
from starlette.testclient import TestClient

from shared.cache import Cache
from shared.routes import health_router, ready_router


class DownClient:
    def ping(self):
        raise redis.exceptions.ConnectionError("redis is down")


def test_health_shape():
    app = Starlette(routes=health_router("weather", "0.1.0").routes)
    with TestClient(app) as client:
        response = client.get("/health")
        assert response.status_code == 200
        body = response.json()
        assert body["status"] == "ok"
        assert body["service"] == "weather"
        assert body["version"] == "0.1.0"
        assert isinstance(body["uptime_s"], (int, float))


def test_ready_200_with_cache():
    server = fakeredis.FakeServer()
    cache = Cache(fakeredis.FakeRedis(server=server))
    app = Starlette(routes=ready_router(cache).routes)
    with TestClient(app) as client:
        response = client.get("/ready")
        assert response.status_code == 200
        assert response.json() == {"status": "ready"}


def test_ready_503_when_cache_down():
    cache = Cache(DownClient())
    app = Starlette(routes=ready_router(cache).routes)
    with TestClient(app) as client:
        response = client.get("/ready")
        assert response.status_code == 503
        assert response.json() == {
            "status": "unavailable",
            "checks": {"cache": "down"},
        }
