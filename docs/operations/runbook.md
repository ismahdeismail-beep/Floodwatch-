# Operations Runbook

Procedures for common operational situations. Always start from the admin
console **Health** page (`apps/admin`, route `/`) and the Grafana dashboards.

## 1. Service Down or Unhealthy

**Symptom:** `/health` fails or latency spikes for a service.

1. Check Grafana service dashboard → error rate, latency, restarts.
2. Check logs in Loki for the service (`service=<name>`).
3. Cloud Run: check revisions/instances; view startup logs.
4. Common causes: missing env var, failed migration, upstream provider outage.
5. Remediate → redeploy the last known-good image tag (`deploy.yml` with
   `IMAGE_TAG` input).
6. If the gateway is down: bring up the gateway first (it is the entry point),
   then `auth` (token validation), then data services.

## 2. Satellite Ingest Failure (Sentinel-1)

**Symptom:** `satellite` degraded; last sync old; admin Data Sources shows `degraded`.

1. Verify credentials: `CDSE_CLIENT_ID/SECRET` rotation (Copernicus rotates).
2. Check provider status page for Copernicus Data Space outages.
3. Re-trigger the ingest job from the admin console or via
   `POST /api/v1/satellite/ingest`.
4. Inundation products will catch up on the next successful pass; the AI baseline
   does not depend on satellite inputs, so risk predictions remain available.

## 3. Alert Delivery Outage

**Symptom:** delivery latency > 60 s or failure rate up on one channel.

1. Check alerts service dashboard → per-channel success/latency.
2. Check provider status: SMS aggregator, WhatsApp Business API, FCM console.
3. Enable channel fallback (alerts service config) so SMS falls back to WhatsApp/email.
4. If all channels fail: keep alerts queued (Redis); retries continue with backoff.
5. Communicate internally; do NOT fake deliveries.

## 4. Database Degradation (Supabase/Postgres)

**Symptom:** slow queries, connection limits, disk warnings.

1. Check Supabase dashboard: CPU, connections, disk, slow queries.
2. Identify heavy queries (PostGIS rasters, analytics aggregates) — move to
   scheduled jobs / read replicas.
3. Increase pooler settings or scale compute if sustained.
4. Verify nightly backups succeeded; test restore in staging first.

## 5. Model Serving Issue

**Symptom:** `ai` prediction errors or anomalous outputs.

1. Check model version served (`GET /api/v1/ai/models` and response `modelVersion`).
2. If a promoted model misbehaves: rollback registry stage to previous production
   model and redeploy `ai`.
3. Compare metrics vs. baseline; file an ML issue with experiment hash.

## 6. Incident Communication

- Incident channels: #incident (internal), status page for external users.
- Severity: SEV-1 (alert delivery down / platform down) → page on-call immediately;
  SEV-2 (single service degraded) → fix within business hours; SEV-3 (cosmetic).
- After resolution: postmortem within 3 days (timeline, root cause, actions).
