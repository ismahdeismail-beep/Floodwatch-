# FloodWatch Web — Public Platform

The public-facing web application for FloodWatch AI: live flood maps, risk checking, weather and forecasts, alerts, preparedness guides and emergency contacts.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript (strict)
- Tailwind CSS (dark theme)
- MapLibre GL via react-map-gl
- Shared packages: `@floodwatch/ui`, `@floodwatch/api-client`, `@floodwatch/utils`, `@floodwatch/types`

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/map` | Live flood map |
| `/risk` | Location risk checker |
| `/alerts` | Alert feed |
| `/weather` | Weather conditions |
| `/forecast` | Multi-day forecast |
| `/preparedness` | Preparedness guides |
| `/emergency` | Emergency contacts |
| `/about` | Platform info |

## Run

```bash
npm install            # from repo root (workspaces)
npm run dev --workspace=@floodwatch/web
# or: cd apps/web && npm run dev
```

Open http://localhost:3000. The API client targets `NEXT_PUBLIC_API_URL` (default `http://localhost:8000` — the API gateway).

## Map tiles

Development uses the keyless MapLibre demo tiles. For production, set `NEXT_PUBLIC_MAPTILER_KEY` (or a Mapbox token) and point `components/FloodMap.tsx` at your map style URL.
