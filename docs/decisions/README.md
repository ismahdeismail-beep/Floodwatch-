# Architecture Decision Records

This directory records significant architectural decisions (ADRs) for FloodWatch AI.

| ADR | Decision | Status |
|-----|----------|--------|
| [ADR-001](ADR-001.md) | Monorepo with npm workspaces + Turborepo | Accepted |
| [ADR-002](ADR-002.md) | Python FastAPI microservices backend | Accepted |
| [ADR-003](ADR-003.md) | PostgreSQL + PostGIS (Supabase-managed) as the geospatial store | Accepted |
| [ADR-004](ADR-004.md) | MapLibre GL as the map rendering engine | Accepted |
| [ADR-005](ADR-005.md) | Dedicated multi-channel alert service | Accepted |
| [ADR-006](ADR-006.md) | MLflow model registry with deterministic baseline serving | Accepted |

## Template

Each ADR follows the classic structure: **Status → Context → Decision → Consequences**.
