# API Overview

All platform APIs follow a consistent contract through the `api-gateway`.

## Base URL

- Local: `http://localhost:8000` (gateway) — each service also exposes its own port directly.
- Production: `https://api.floodwatch.ai` (via Cloudflare → Cloud Run).

## Conventions

- Versioned under `/api/v1/*`.
- JSON everywhere; OpenAPI (Swagger) at `/docs` per service and aggregated at the gateway.
- Response envelope: `{ "data": ..., "meta": { "generatedAt", "modelVersion? } }`.
- Error envelope: `{ "error": { "code", "message", "details? } }`.

## Authentication

| Method | For | Mechanism |
|--------|-----|-----------|
| JWT Bearer | Interactive users (web, dashboard, mobile) | `POST /api/v1/auth/login` (OAuth2 password) → `access_token` |
| API Key (`X-API-Key`) | Machine clients | Keys issued by `auth`, scoped (e.g., `alerts:read`) |

## Rate Limiting

- Default: 15,000 req/min per key (gateway), configurable.
- 429 response uses the standard error envelope.

## Endpoint Index (v1)

| Service | Prefix | Example endpoints |
|---------|--------|-------------------|
| auth | `/api/v1/auth` | `POST /login`, `POST /refresh`, `GET /me`, `POST /api-keys` |
| weather | `/api/v1/weather` | `GET /current`, `GET /forecast?lat=&lon=` |
| hydrology | `/api/v1/hydrology` | `GET /gauges`, `GET /gauges/{id}`, `GET /watersheds` |
| satellite | `/api/v1/satellite` | `GET /flood-extent`, `GET /ndwi`, `POST /ingest` |
| gis | `/api/v1/gis` | `GET /floodplains`, `GET /communities?bbox=`, `GET /exposure` |
| ai | `/api/v1/ai` | `POST /predict` (risk assessment), `GET /models`, `GET /health` |
| alerts | `/api/v1/alerts` | `GET /alerts`, `POST /alerts`, `GET /alerts/{id}`, `GET /channels` |
| analytics | `/api/v1/analytics` | `GET /trends`, `GET /accuracy`, `GET /impact` |

## Example: Risk Assessment

```http
POST /api/v1/ai/predict
Authorization: Bearer <token>
Content-Type: application/json

{
  "lat": -1.2617,
  "lon": 36.8626,
  "leadHours": 48
}
```

```json
{
  "data": {
    "probability": 0.74,
    "riskLevel": "high",
    "expectedDepthM": 1.4,
    "durationHours": 9,
    "extentKm2": 3.2,
    "confidence": 0.82,
    "modelVersion": "v0.1.0",
    "featureImportance": { "precipitation_72h": 0.52, "upstream_stage": 0.31, "soil_moisture": 0.12, "terrain_index": 0.05 },
    "generatedAt": "2026-08-04T06:00:00Z",
    "validUntil": "2026-08-06T06:00:00Z"
  },
  "meta": { "generatedAt": "2026-08-04T06:00:00Z", "modelVersion": "v0.1.0" }
}
```

## Client Library

TypeScript consumers use `@floodwatch/api-client` (created via `createClient`),
which maps these conventions to typed methods (`client.risk.get(...)`, etc.).
