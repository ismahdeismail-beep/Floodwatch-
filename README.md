# 🌊 FloodWatch AI

> **Predict. Warn. Protect.**

FloodWatch AI is an autonomous AI-powered flood intelligence & early warning platform. It continuously collects, processes, and analyses trusted environmental data from scientific and governmental sources — weather forecasts, satellite imagery, river gauges, terrain models, population and infrastructure data — and transforms it into localized, actionable flood intelligence **before** floods occur.

Unlike conventional weather apps that merely display rainfall forecasts, FloodWatch AI answers:

- Will my neighborhood flood?
- When will flooding begin?
- How severe will it be?
- Which roads will become impassable?
- Which communities are most at risk?
- What action should I take?

---

## Vision

Become Africa's leading AI-powered climate intelligence platform that protects lives, infrastructure, and livelihoods through autonomous flood prediction and early warning.

## Mission

Build an intelligent flood prediction ecosystem that continuously collects trusted environmental data, predicts flood risks using Artificial Intelligence, and automatically delivers actionable early warnings to governments, emergency agencies, NGOs, businesses, and citizens.

---

## The Platform

FloodWatch AI is **not a single application** — it is a cloud-native, microservice-based AI ecosystem composed of interconnected systems:

```
                 Trusted Environmental Data
                           │
                           ▼
                  Data Collection Platform
                           │
                           ▼
                Data Processing Platform
                           │
                           ▼
             Geospatial Intelligence Platform
                           │
                           ▼
                Artificial Intelligence Core
                           │
                           ▼
               Flood Intelligence Engine
                           │
                           ▼
                Decision Intelligence Engine
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
 Government Dashboard   Public Website   Mobile Application
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ▼
            Notification & API Platform
```

### Platform Components

| # | Component | Responsibility |
|---|-----------|----------------|
| 1 | **AI Prediction Engine** | Flood probability, depth, duration, extent, population/infrastructure/economic impact, confidence scoring, continuous learning |
| 2 | **Data Collection Engine** | Automated ingestion from trusted sources with scheduling, retry, validation, version tracking |
| 3 | **Data Processing Engine** | Cleaning, normalization, validation, transformation, feature engineering |
| 4 | **Geospatial Intelligence Engine** | Terrain, watersheds, rivers, floodplains, roads, buildings, boundaries, routing |
| 5 | **Flood Intelligence Engine** | Combined picture: flood maps, timelines, affected communities, safe routes, infrastructure risk |
| 6 | **Decision Intelligence Engine** | Warning levels (Green/Yellow/Orange/Red), recommendations, evacuation advice, prioritization |
| 7 | **Alert Engine** | SMS, WhatsApp, Push, Email, Browser notifications, Webhooks |
| 8 | **Web Application** | Live maps, forecasts, risk checker, preparedness, historical floods |
| 9 | **Mobile Application** | GPS alerts, safe routes, shelters, offline view, emergency contacts |
| 10 | **Government Dashboard** | National/county monitoring, infrastructure, analytics, reports |
| 11 | **Public API** | Weather, flood risk, forecasts, alerts, communities, infrastructure, analytics |

## Production Deployment Architecture

```
Internet Users
       │
       ▼
Cloudflare (DNS, CDN, WAF)
       │
       ▼
Vercel (Web Frontend — Next.js)
       │
       ▼
FastAPI Backend (Google Cloud Run)
       │
 ┌─────┼──────────────────┐
 ▼     ▼                  ▼
PostgreSQL          AI Services        Notification Service
(Supabase + PostGIS)  (Gemini/Python)   (Firebase/SMS)
 │
 ▼
Geospatial Data (PostGIS)
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

| Concern | Provider |
|---------|----------|
| Code & CI/CD | GitHub + GitHub Actions |
| Web frontend | Vercel |
| Backend services & storage | Google Cloud Platform (Cloud Run, GCS) |
| DNS, CDN, security | Cloudflare |
| PostgreSQL + PostGIS | Supabase |
| AI reasoning | Google AI Studio (Gemini) |
| Satellite data | Copernicus Data Space Ecosystem |
| Rainfall & Earth observation | NASA Earthdata |
| Weather forecasts | ECMWF / Copernicus Climate Data Store |
| Mapping data | OpenStreetMap |
| Push notifications | Firebase Cloud Messaging |

---

## Repository Structure

```
FloodWatch-AI/
├── apps/                    # Frontend applications
│   ├── web/                 # Public website (Next.js + TypeScript + Tailwind + MapLibre)
│   ├── dashboard/           # Government dashboard (Next.js)
│   ├── admin/               # Administration dashboard (Next.js)
│   └── mobile/              # Citizen mobile app (Expo / React Native)
├── packages/                # Shared libraries (@floodwatch/*)
│   ├── types/               # Domain types shared across apps/services
│   ├── ui/                  # React component library
│   ├── api-client/          # Typed REST API client
│   ├── utils/               # Formatting, geo, risk utilities
│   ├── tsconfig/            # Shared TypeScript configs
│   └── eslint-config/       # Shared ESLint flat config
├── services/                # Backend microservices (FastAPI / Python)
│   ├── api-gateway/         # Entry point, routing, rate limiting (port 8000)
│   ├── auth/                # JWT, OAuth2, RBAC, API keys (8001)
│   ├── weather/             # Weather provider aggregation (8002)
│   ├── hydrology/           # River gauges, watersheds, soil moisture (8003)
│   ├── satellite/           # Sentinel/Landsat/MODIS ingestion + flood extent (8004)
│   ├── gis/                 # Geospatial processing, floodplain, routing (8005)
│   ├── ai/                  # ML prediction engine, model registry (8006)
│   ├── alerts/              # Multi-channel notification engine (8007)
│   └── analytics/           # Trends, model accuracy, impact analytics (8008)
├── infrastructure/          # Terraform, K8s, Docker, monitoring, Cloudflare, nginx
├── docs/                    # Documentation (see docs/README.md)
├── datasets/                # raw/ processed/ geodata/ historical_floods/
├── models/                  # Versioned model registry
├── scripts/                 # Setup, DB init, seeding, data fetch helpers
├── tests/                   # e2e (Playwright) + load (Locust)
└── .github/                 # CI/CD workflows, Dependabot, CodeQL, Release Please
```

---

## Technology Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, React Query, Framer Motion, MapLibre GL |
| Backend | Python, FastAPI, Node.js (where appropriate) |
| AI/ML | PyTorch, scikit-learn, XGBoost, LightGBM, CatBoost, Optuna, MLflow, ONNX Runtime |
| GIS | PostGIS, GeoPandas, Rasterio, GDAL, Shapely, OSMnx, xarray, rioxarray |
| Climate AI | GraphCast, Pangu-Weather, FourCastNet (evaluation track) |
| Database | PostgreSQL + PostGIS, Redis, MinIO (object storage) |
| Infra | Docker, Kubernetes, GitHub Actions, Cloudflare, Vercel, Google Cloud |
| Observability | Prometheus, Grafana, Loki, OpenTelemetry |

---

## Performance Targets (from PRD)

| Metric | Target |
|--------|--------|
| Prediction accuracy | > 90% |
| False alarm rate | < 10% |
| Prediction time | < 5 minutes |
| Alert delivery time | < 30 seconds |
| System availability | 99.9% |
| API response time | < 500 ms |
| Initial country | Kenya (expandable across Africa) |

---

## Quickstart

### Prerequisites

- Node.js 20+, Python 3.12+, Git, WSL2 with Ubuntu

### 1. Environment setup

```powershell
# PowerShell (Windows)
.\scripts\setup.ps1

# bash / macOS / Linux
./scripts/setup.sh
```

The setup script copies `.env.example` → `.env`, starts core infrastructure (PostGIS, Redis, MinIO), and installs JS dependencies.

### 2. Start core infrastructure (WSL2 Native)

No Docker required — runs natively in your existing WSL2 Ubuntu:

```powershell
# First-time setup
.\scripts\wsl-services.ps1 setup

# Start services
.\scripts\wsl-services.ps1 start
```

This starts PostgreSQL+PostGIS (5432), Redis (6379), and MinIO (9000/9001) natively in WSL2.

### 3. Run a backend service

```bash
cd services/ai
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8006
# Swagger UI: http://localhost:8006/docs
```

### 4. Run the public web app

```bash
cd apps/web
npm install
npm run dev
# http://localhost:3000
```

### 5. Run everything

```bash
npm run dev          # all JS apps (turbo)
# Backend services run individually via uvicorn (see step 3)
```

---

## Data Sources

| Domain | Sources |
|--------|---------|
| Weather | Kenya Meteorological Department, ECMWF, NOAA, OpenWeather, Meteostat |
| Rainfall | NASA GPM, CHIRPS, IMERG |
| Hydrology | GloFAS, HydroSHEDS |
| Satellite | Sentinel-1/2, Landsat, MODIS, Copernicus |
| Terrain | SRTM, Copernicus DEM |
| Infrastructure | OpenStreetMap, Microsoft Building Footprints |
| Population | WorldPop, HDX, Meta Population Dataset |

---

## Documentation

See [docs/README.md](docs/README.md) — architecture, API reference, data models, deployment, operations, ADRs, and the AI development environment.

---

## Development Principles

AI-first · Cloud-native · Modular microservices · Event-driven · API-first · Geospatial intelligence at the core · Explainable AI · Open standards · Security by design · Mobile-first · Reproducible ML · Data quality before model quality

---

## Long-Term Vision

FloodWatch AI is the first module of a continental **Climate Intelligence Platform** — later supporting drought, landslide, heatwave, wildfire, coastal flooding, water resource intelligence, and climate-health surveillance across Africa.

---

## License

MIT — see [LICENSE](LICENSE).
