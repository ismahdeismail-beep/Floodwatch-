import json

from redis import Redis
from redis.exceptions import ConnectionError
from tenacity import retry, retry_if_exception_type, stop_after_attempt, wait_fixed


class Cache:
    def __init__(self, client: Redis):
        self._client = client

    @classmethod
    def from_url(cls, url: str) -> "Cache":
        return cls(Redis.from_url(url))

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_fixed(0.1),
        retry=retry_if_exception_type(ConnectionError),
    )
    def get_json(self, key: str):
        raw = self._client.get(key)
        return json.loads(raw) if raw is not None else None

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_fixed(0.1),
        retry=retry_if_exception_type(ConnectionError),
    )
    def set_json(self, key: str, value, ttl: int | None = None) -> None:
        self._client.set(key, json.dumps(value), ex=ttl)

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_fixed(0.1),
        retry=retry_if_exception_type(ConnectionError),
    )
    def delete_prefix(self, prefix: str) -> int:
        keys = list(self._client.scan_iter(f"{prefix}*"))
        if not keys:
            return 0
        return self._client.delete(*keys)

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_fixed(0.1),
        retry=retry_if_exception_type(ConnectionError),
    )
    def ping(self) -> bool:
        try:
            return bool(self._client.ping())
        except Exception:
            return False
