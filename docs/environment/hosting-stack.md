# Hosting & Platform Services

FloodWatch AI runs on a managed, serverless-first platform stack. This document
lists the platform services used and the configuration contract each one expects.

## Core Services

| Service | Role | Config keys (see `.env.example`) |
|---------|------|----------------------------------|
| **Cloudflare** | DNS, CDN, WAF, DDoS protection | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ZONE_ID` |
| **Vercel** | Next.js hosting (web, dashboard, admin), previews | `VERCEL_TOKEN`, `VERCEL_ORG_ID`, project ids |
| **Google Cloud (Cloud Run + GCS)** | FastAPI services, job processing, object storage | `GCP_PROJECT_ID`, `GCP_REGION`, `GCP_SA_KEY` |
| **Supabase** | PostgreSQL + PostGIS, RLS, Storage, Auth | `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| **Google AI Studio (Gemini)** | AI reasoning & intelligence features | `GEMINI_API_KEY` |
| **Firebase** | Cloud Messaging (push) | `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL` |

## Data Provider Credentials

| Provider | Config key |
|----------|-----------|
| NASA Earthdata (GPM/IMERG/MODIS) | `NASA_EARTHDATA_TOKEN`, `NASA_EARTHDATA_USERNAME`, `NASA_EARTHDATA_PASSWORD` |
| ECMWF / Copernicus CDS | `CDS_API_KEY`, `CDS_API_URL` |
| Copernicus Data Space | `CDSE_CLIENT_ID`, `CDSE_CLIENT_SECRET` |
| OpenStreetMap | none (open) |
| GloFAS | via CDS credentials |
| SMS aggregator (e.g., Africa's Talking) | `SMS_PROVIDER_API_KEY`, `SMS_SENDER_ID` |
| WhatsApp Business API | `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` |
| SMTP | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` |
| Map tiles (Maptiler) | `NEXT_PUBLIC_MAPTILER_KEY`, `NEXT_PUBLIC_MAP_STYLE` |

## Environment Variables by Surface

- **Services (Python)**: each `services/<name>/.env.example`; loaded via
  `app/config.py` (pydantic-settings). Both `SERVICE_*` and lowercase forms are accepted.
- **Web apps (Next.js)**: `NEXT_PUBLIC_*` variables are inlined at build time
  (`apps/*/.env.example`).
- **Mobile (Expo)**: `EXPO_PUBLIC_*` variables are inlined at build time
  (`apps/mobile/.env.example`).
- **CI/CD**: secrets stored in GitHub Actions secrets; deployed as Cloud Run env
  or Vercel project env.

## Local Emulation

Docker Compose (`docker-compose.yml`) provides:

- `postgres` — postgis/postgis:16-3.4 (local Supabase substitute)
- `redis` — redis:7 (cache, queues, pub/sub)
- `minio` + `minio-init` — S3-compatible object storage (local GCS substitute)
- All 9 services (`api-gateway` … `analytics`)

## Security Rules

- Never commit real credentials; `.env*` files are git-ignored.
- Use service-role/API keys only server-side; browsers use anon keys + RLS.
- Rotate provider tokens per provider policy (NASA/CDS tokens support revocation).
