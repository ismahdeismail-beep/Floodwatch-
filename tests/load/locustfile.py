"""Load test for the FloodWatch AI gateway.

Usage:
    pip install locust
    locust -f tests/load/locustfile.py --host http://localhost:8000
"""

from locust import HttpUser, between, task


class FloodWatchUser(HttpUser):
    """Simulates a public user hitting the gateway."""

    wait_time = between(1, 3)

    @task(5)
    def risk_check(self) -> None:
        self.client.post(
            "/api/v1/ai/predict",
            json={"lat": -1.2617, "lon": 36.8626, "leadHours": 48},
            headers={"X-API-Key": "demo-key"},
        )

    @task(3)
    def current_weather(self) -> None:
        self.client.get("/api/v1/weather/current?lat=-1.2921&lon=36.8219")

    @task(2)
    def active_alerts(self) -> None:
        self.client.get("/api/v1/alerts")

    @task(1)
    def live_map_data(self) -> None:
        self.client.get("/api/v1/gis/communities?bbox=34,4,42,-4")
