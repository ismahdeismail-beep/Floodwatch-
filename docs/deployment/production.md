# Production Hosting Architecture

The production stack is fully managed, serverless-first, and organized around a
clear trust boundary: Cloudflare → Vercel → Google Cloud Run → Supabase.

## Topology

```
Internet Users
      │
      ▼
Cloudflare (DNS · CDN · WAF · DDoS protection)
      │
      ▼
Vercel (Web Frontend — Next.js: web, dashboard, admin)
      │
      ▼
FastAPI Backend (Google Cloud Run — 9 services)
      │
      ├──► PostgreSQL + PostGIS (Supabase)
      │        └── RLS, storage, backups, auth
      │
      ├──► AI Services (Gemini API / Python inference)
      │        └── MLflow model registry (Cloud Run job / Vertex AI-ready)
      │
      └──► Notification Services (Firebase Cloud Messaging · SMS/WhatsApp providers)
               │
               ▼
        External Data Sources
         ├── Kenya Meteorological Department
         ├── ECMWF / Copernicus Climate Data Store
         ├── NASA Earthdata (GPM, IMERG, MODIS)
         ├── Copernicus Data Space (Sentinel-1/2)
         ├── OpenStreetMap
         └── GloFAS
```

## Provider Responsibilities

| Concern | Provider | Notes |
|---------|----------|-------|
| Code & CI/CD | GitHub + GitHub Actions | PR checks, deploy workflows, CodeQL, Dependabot |
| DNS / CDN / WAF | Cloudflare | Proxied records, TLS, bot protection, rate limiting at edge |
| Web frontend | Vercel | Next.js apps; preview deployments per PR; edge caching |
| Backend services | Google Cloud Run | FastAPI containers; autoscaling to zero; regional |
| PostgreSQL + PostGIS | Supabase | Managed Postgres, RLS, storage buckets, auth, automatic backups |
| AI reasoning / intelligence | Google AI Studio (Gemini) | Natural-language flood intelligence features |
| Satellite data | Copernicus Data Space Ecosystem | Sentinel-1/2 access |
| Rainfall & Earth observation | NASA Earthdata | GPM/IMERG/MODIS |
| Weather forecasts | ECMWF / CDS | HRES + ENS |
| Mapping data | OpenStreetMap | Vector tiles for maps |
| Push notifications | Firebase Cloud Messaging | Mobile + web push |
| Object storage | Google Cloud Storage | Rasters, exports, model artifacts |
| Observability | Grafana Cloud (or self-hosted) | Prometheus metrics, Loki logs, alerting |

## Environments

| Environment | URL pattern | Purpose |
|-------------|-------------|---------|
| Preview | `preview-<sha>.floodwatch.ai` | Per-PR validation (Vercel preview + Cloud Run service) |
| Staging | `staging.floodwatch.ai` | Integration testing against staging data |
| Production | `floodwatch.ai`, `api.floodwatch.ai` | Live platform |

## Security Posture

- TLS everywhere (Cloudflare edge terminates; origin uses managed certificates).
- WAF managed rules + rate limiting at the edge; API key/JWT auth at the gateway.
- Supabase RLS enforces row-level access for multi-tenant data.
- Secrets in Cloud Secret Manager / Vercel env; never in repositories.
- Deployment is automated; production deploys require passing CI + review.

## Cost & Scale Notes

- Cloud Run scales to zero — dev/staging cost near zero when idle.
- Supabase free/pro tier handles pilot loads; upgrade path documented.
- Heavy raster processing (Sentinel mosaics) runs as Cloud Run jobs with
  concurrency 1 and larger memory, triggered by ingestion schedules.
