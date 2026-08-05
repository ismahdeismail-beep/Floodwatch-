# Monitoring & Observability

## Stack

| Concern | Tool | Notes |
|---------|------|-------|
| Metrics | Prometheus | `/metrics` endpoint on every service; scrape via WSL2 in dev, GCP Managed Prometheus in prod |
| Dashboards | Grafana | Dashboards for services, pipeline, alerts, model drift |
| Logs | Loki | Structured JSON logs collected from services (Alloy in prod) |
| Traces | OpenTelemetry | Prepared; spans for request lifecycle across gateway → service |

## Service Exports

Each FastAPI service exposes:

- `GET /health` — liveness (status, service, version)
- `GET /metrics` — Prometheus text format (request count, latency histogram,
  errors, ingestion lag, prediction latency)

## SLOs & Alerts

| SLO | Target | Alert |
|-----|--------|-------|
| Availability | 99.9% monthly | Page if < 99.9% over rolling 30d |
| API p95 latency | < 500 ms | Warn at 600 ms, page at 1 s |
| Alert delivery | < 30 s end-to-end | Page on delivery lag > 60 s |
| Prediction time | < 5 min (target < 2 s baseline) | Warn on > 60 s |
| Data freshness | per-source cadence | Warn on stale ingestion (e.g., gauge telemetry > 15 min) |

## Dashboards

1. **Service fleet** — status, latency, error rate per service.
2. **Data pipeline** — ingest success/failure, freshness per source, queue depth.
3. **Alerts** — sent/attempted/delivered per channel, delivery latency, failures.
4. **AI/ML** — prediction latency, model version mix, drift indicators, confidence distribution.
5. **Business/operational** — active alerts, counties at risk, recipients reached.

## Runbooks

See [Operations Runbook](runbook.md) for incident procedures (service down,
satellite ingest failure, alert delivery outage, database degradation).
