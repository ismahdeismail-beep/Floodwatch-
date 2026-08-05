# @floodwatch/types

Shared domain types for FloodWatch AI — the single source of truth for TypeScript types across the web app, dashboard, admin app, mobile app and API client.

## Contents

- Geo: `Coordinates`, `BoundingBox`, GeoJSON types
- Alerts: `Alert`, `AlertSeverity`, `AlertChannel`
- Risk: `FloodRiskAssessment`, `RiskLevel`
- Weather/hydrology: `WeatherObservation`, `WeatherForecast`, `RiverGaugeReading`
- Communities & infrastructure: `Community`, `InfrastructureAsset`
- Platform: `User`, `Organization`
- API envelope: `ApiResponse`, `Paginated`, `ApiError`
- AI: `ModelInfo`, `ModelPrediction`

## Usage

```ts
import type { FloodRiskAssessment, RiskLevel } from "@floodwatch/types";
```
