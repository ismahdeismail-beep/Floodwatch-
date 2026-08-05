# Platform Roadmap

## Phase 1 — Foundation (current scaffold)

- Monorepo with shared packages, web/dashboard/admin/mobile apps, 9 FastAPI services.
- Docker Compose local stack; CI/CD workflows; docs suite.
- Deterministic AI baseline `v0.1.0` serving end-to-end risk checks.
- Demo data and keyless map tiles for frictionless onboarding.

**Exit criteria:** full local stack runs; web risk checker returns live risk;
deployment pipeline deploys web + one service to staging.

## Phase 2 — Pilot (Kenya, 2–4 counties)

- Real gauge telemetry ingestion (WRMA/county networks).
- CHIRPS + GPM + ECMWF live ingestion; satellite flood-extent (Sentinel-1) pipeline.
- Alert delivery: SMS + WhatsApp + push + email with delivery tracking.
- Government dashboard pilot with NDMA + 3–4 counties.
- Mobile app public release (Play Store/App Store).

**Exit criteria:** ≥ 1 real flood event forecast with ≥ 6 h lead time; false
alarm rate < 15% in pilot counties; 10k+ app users.

## Phase 3 — National Expansion (47 counties)

- Full national gauge network coverage; GloFAS integration.
- Trained ML models promoted over baseline (XGBoost/LightGBM → deep learning).
- Daily + 6-hourly operational forecasts; multi-lingual alerts (EN/SW/regional).
- Analytics reports to agencies; public API commercial tier.

**Exit criteria:** 90%+ prediction accuracy; < 10% false alarms; 99.9% availability.

## Phase 4 — Continental Platform

- Regional expansion (East Africa first), new data partners, multi-language.
- Climate-AI backbones evaluation (GraphCast, Pangu-Weather, FourCastNet).
- Additional hazards: drought, heatwave, wildfire, coastal flooding, landslides.
- Climate-health surveillance and water resource intelligence modules.

## Cross-Cutting Themes

- Continuous model improvement (MLflow pipeline, drift detection, feedback loops).
- Community trust: explainable predictions, transparent uncertainty.
- Sustainability: serverless-first, scale-to-zero, energy-efficient inference.
