# Product Requirements Document — FloodWatch AI

**Version:** 1.0
**Status:** Approved (scaffold baseline)
**Owner:** Platform Product

---

## 1. Product Summary

FloodWatch AI is an autonomous, AI-powered flood intelligence and early warning
platform. It continuously collects trusted environmental data (weather forecasts,
satellite imagery, river gauge telemetry, terrain, population, and infrastructure),
processes it with AI models, and delivers localized, actionable flood warnings
**before** floods occur.

The platform answers six questions for any location:

1. Will my neighborhood flood?
2. When will flooding begin?
3. How severe will it be?
4. Which roads will become impassable?
5. Which communities are most at risk?
6. What action should I take?

## 2. Goals & Non-Goals

### Goals

- Reduce flood-related fatalities and displacement through earlier, more accurate warnings.
- Provide a single trusted source of flood intelligence for government, agencies, NGOs, businesses, and citizens.
- Automate the full pipeline: data → prediction → alert delivery.
- Launch in Kenya, architected for continent-wide expansion (East Africa first).

### Non-Goals (v1)

- On-the-ground flood defense engineering (dams, dikes).
- Insurance underwriting products.
- Real-time flood *extent* mapping beyond the satellite-processing pipeline (deferred to v1.x).

## 3. Target Users & Personas

| Persona | Context | Key Needs |
|---------|---------|-----------|
| **National agency operator** | NDMA / KMD / WRMA staff | Live county risk posture, alert triage, broadcast tools |
| **County disaster officer** | County government | Local risk, infrastructure status, evacuation coordination |
| **Citizen** | Public web + mobile | "Will my neighborhood flood?", personal risk, shelters |
| **Humanitarian / NGO** | Response organizations | Prioritized community risk, population exposure, safe routes |
| **Media / partner** | News desks, private sector | Alert feed via public API and webhooks |
| **Platform operator** | FloodWatch technical staff | Service health, models, API keys, data sources |

## 4. Functional Requirements

### FR-1 Data Collection

- FR-1.1 Ingest weather forecasts (ECMWF, KMD, NOAA, OpenWeather, Meteostat).
- FR-1.2 Ingest rainfall data (NASA GPM/IMERG, CHIRPS).
- FR-1.3 Ingest river gauge telemetry (national gauge networks, GloFAS).
- FR-1.4 Ingest satellite imagery (Sentinel-1/2, Landsat, MODIS).
- FR-1.5 Ingest terrain (SRTM/Copernicus DEM), population (WorldPop), infrastructure (OSM).
- FR-1.6 Scheduled ingestion with retry, validation, and version tracking.

### FR-2 Data Processing

- FR-2.1 Cleaning, normalization, and validation of all ingested data.
- FR-2.2 Feature engineering (rainfall accumulation windows, soil moisture indices, river stage ratios, terrain indices).
- FR-2.3 Geospatial alignment (raster/vector standardization to PostGIS).

### FR-3 Geospatial Intelligence

- FR-3.1 Terrain analysis, watersheds, river networks, floodplain mapping.
- FR-3.2 Infrastructure exposure (roads, bridges, hospitals, schools, shelters).
- FR-3.3 Safe-route computation away from flood-prone areas.

### FR-4 AI Prediction

- FR-4.1 Flood probability, expected depth, duration, and extent per location.
- FR-4.2 Population, infrastructure, and economic impact estimation.
- FR-4.3 Confidence scoring and explainability (feature importance).
- FR-4.4 Model registry with versioning, A/B, and continuous retraining.

### FR-5 Decision Intelligence

- FR-5.1 Warning levels: Green / Yellow / Orange / Red (mapped to low / moderate / high / extreme).
- FR-5.2 Automated recommendations and evacuation advice.
- FR-5.3 Prioritization of communities for agency response.

### FR-6 Alert Engine

- FR-6.1 Multi-channel delivery: SMS, WhatsApp, push (FCM), email, browser, webhooks.
- FR-6.2 Alert templates with localized language support (English, Kiswahili, regional).
- FR-6.3 Delivery tracking, retries, and channel fallback.
- FR-6.4 Alert expiry and revocation.

### FR-7 Applications

- FR-7.1 **Public website**: live maps, risk checker, forecasts, preparedness content, historical floods.
- FR-7.2 **Mobile app**: personalized GPS alerts, safe routes, shelters, offline view, emergency contacts.
- FR-7.3 **Government dashboard**: national/county monitoring, infrastructure, analytics, reports, users.
- FR-7.4 **Admin console**: platform health, models, API keys, data sources, logs, backups.

### FR-8 Public API

- FR-8.1 Weather, flood risk, forecasts, alerts, communities, infrastructure, analytics endpoints.
- FR-8.2 API keys with scopes, rate limiting, and usage analytics.
- FR-8.3 OpenAPI (Swagger) documentation at `/docs` per service and `/api/v1` via the gateway.

## 5. Non-Functional Requirements

| Metric | Target |
|--------|--------|
| Prediction accuracy | > 90% |
| False alarm rate | < 10% |
| Prediction time | < 5 minutes |
| Alert delivery time | < 30 seconds |
| System availability | 99.9% |
| API response time | < 500 ms (p95) |
| Alert delivery reliability | ≥ 99% attempted delivery |

## 6. Release Scope (v1)

| In scope | Out of scope |
|----------|--------------|
| Kenya nationwide risk coverage (47 counties) | Other countries (post-v1) |
| Riverine + flash flood early warning | Coastal storm surge (pilot in v1.2) |
| SMS + WhatsApp + push + email + web | Voice calls / USSD (evaluated post-v1) |
| Daily + sub-daily forecasts (6-hourly) | Hourly deterministic forecasts (v1.1) |
| Public web + mobile + government dashboard | Enterprise on-prem delivery |

## 7. Success Metrics

- Warning lead time delivered (hours before onset).
- Alert delivery success rate by channel.
- False alarm rate.
- Monthly active users (web + mobile).
- Government agencies onboarded (counties using the dashboard).
- Communities covered vs. total flood-exposed population.
