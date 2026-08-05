# @floodwatch/dashboard

Government operations dashboard for FloodWatch AI — the control surface used by
national and county disaster-management authorities to monitor live flood risk,
manage alerts, track infrastructure vulnerability, and coordinate response.

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Overview — KPIs, live risk map, recent alerts |
| `/live-monitoring` | Telemetry from river gauges, rain gauges, weather stations |
| `/alerts` | Alert triage, acknowledgment, and broadcast |
| `/counties` | County-level risk posture and breakdowns |
| `/infrastructure` | Asset registry (dams, bridges, roads) and vulnerability |
| `/analytics` | Historical trends and model performance |
| `/reports` | Generated operational reports |
| `/users` | User and role management (agency access) |
| `/settings` | Thresholds, notification channels, data sources |

## Development

```bash
npm install                                # from repo root (workspaces)
npm run dev --workspace=@floodwatch/dashboard
```

Open http://localhost:3001 (configured via `NEXT_PUBLIC_APP_URL`).

> **Auth note:** the dashboard is a protected surface. In production it sits
> behind the API gateway (JWT issued by the `auth` service) and enforces
> agency roles (`responder`, `county_admin`, `national_admin`).
