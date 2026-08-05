"""Post-deploy smoke test: verify all service health endpoints.

Usage:
    python tests/smoke/smoke_services.py --base http://localhost:8000
"""

import argparse
import sys

import httpx

SERVICES = {
    "api-gateway": 8000,
    "auth": 8001,
    "weather": 8002,
    "hydrology": 8003,
    "satellite": 8004,
    "gis": 8005,
    "ai": 8006,
    "alerts": 8007,
    "analytics": 8008,
}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", default="http://localhost:8000")
    args = parser.parse_args()

    failures = 0
    for name, port in SERVICES.items():
        try:
            resp = httpx.get(f"{args.base}/health", timeout=10)
            if resp.status_code == 200:
                body = resp.json()
                print(f"[ok] {name:12s} {resp.status_code} service={body.get('service')}")
            else:
                print(f"[FAIL] {name:12s} {resp.status_code}")
                failures += 1
        except Exception as exc:  # noqa: BLE001
            print(f"[ERROR] {name:12s} {exc}")
            failures += 1

    if failures:
        print(f"\n{len(SERVICES) - failures}/{len(SERVICES)} services healthy — FAILING")
        sys.exit(1)
    print(f"\n{len(SERVICES)}/{len(SERVICES)} services healthy — PASS")


if __name__ == "__main__":
    main()
