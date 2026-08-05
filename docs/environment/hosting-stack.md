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

## Local Emulation (WSL2 Native)

No Docker required. Backend infrastructure runs natively in WSL2 Ubuntu:

| Service | Port | Management |
|---------|------|------------|
| `postgres` | 5432 | PostgreSQL + PostGIS (local Supabase substitute) |
| `redis` | 6379 | Cache, queues, pub/sub |
| `minio` | 9000/9001 | S3-compatible object storage (local GCS substitute) |

**Quick commands:**
```powershell
.\scripts\wsl-services.ps1 setup     # First-time install in WSL2
.\scripts\wsl-services.ps1 start     # Start all services
.\scripts\wsl-services.ps1 status    # Check what's running
.\scripts\wsl-services.ps1 stop      # Stop everything
```

Or directly in WSL2 Ubuntu:
```bash
bash ~/.floodwatch/start-services.sh
bash ~/.floodwatch/status-services.sh
bash ~/.floodwatch/stop-services.sh
```

**Docker Compose** (`docker-compose.yml`) is still available for CI/CD pipelines and developers who prefer containers.

## Security Rules

- Never commit real credentials; `.env*` files are git-ignored.
- Use service-role/API keys only server-side; browsers use anon keys + RLS.
- Rotate provider tokens per provider policy (NASA/CDS tokens support revocation).
