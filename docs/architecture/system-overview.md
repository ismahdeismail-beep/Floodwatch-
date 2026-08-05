# System Overview

FloodWatch AI is **not a single application** — it is a cloud-native,
microservice-based AI ecosystem. This page summarizes the platform components
and how they interconnect.

## Platform Components

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

## Data Flow (end-to-end)

1. **Collect** — weather, rainfall, river gauges, satellite, terrain, population,
   and infrastructure data are ingested by the collection engine.
2. **Process** — data is cleaned, normalized, validated, and features are engineered.
3. **Geospatial** — data is aligned to geography (PostGIS) and floodplains,
   watersheds, and exposures are computed.
4. **Predict** — the AI core produces flood risk assessments (probability, depth,
   duration, extent, impact, confidence) for communities and locations.
5. **Decide** — risk scores map to warning levels and generate recommendations.
6. **Deliver** — alerts fan out through SMS/WhatsApp/push/email/web/webhooks to
   the apps, agencies, and the public API.

## Warning Levels

| Level | Risk | Meaning |
|-------|------|---------|
| Green | low | No significant flooding expected. |
| Yellow | moderate | Localized flooding possible; monitor updates. |
| Orange | high | Flooding likely; prepare and follow guidance. |
| Red | extreme | Severe flooding expected; act immediately. |

## Repository Mapping

The monorepo maps components to code:

- `services/*` — backend microservices (collection, processing, geospatial, AI, alerts, analytics, auth, gateway).
- `apps/web` — public website.
- `apps/dashboard` — government dashboard.
- `apps/admin` — administration console.
- `apps/mobile` — citizen mobile app.
- `packages/*` — shared types, UI, API client, utilities.
- `infrastructure/` — Terraform, Kubernetes, Docker, monitoring.
- `docs/` — this documentation set.

See [Services Reference](services.md) for the service-level breakdown.
