# FloodWatch AI — Documentation

Central documentation for the FloodWatch AI platform.

## Product & Design

| Document | Description |
|----------|-------------|
| [Product Requirements Document](product/PRD.md) | PRD v1.0 — goals, personas, features, requirements, metrics |
| [System Design Document](product/SDD.md) | SDD v1.0 — architecture, components, data flows, interfaces |

## Architecture

| Document | Description |
|----------|-------------|
| [System Overview](architecture/system-overview.md) | Platform components and how they fit together |
| [Services Reference](architecture/services.md) | Microservice layout, ports, responsibilities, health checks |
| [Decision Records](decisions/README.md) | ADR-001 … ADR-006 — key architectural decisions |

## API

| Document | Description |
|----------|-------------|
| [API Overview](api/overview.md) | API conventions, authentication, error handling, endpoint index |

## Data

| Document | Description |
|----------|-------------|
| [Data Sources & Ecosystem](data/data-sources.md) | Upstream providers, ingestion cadence, licensing notes |

## Deployment & Infrastructure

| Document | Description |
|----------|-------------|
| [Production Hosting Architecture](deployment/production.md) | Cloudflare → Vercel → Cloud Run → Supabase; providers table |
| [Deployment Pipeline](deployment/pipeline.md) | CI/CD via GitHub Actions, environments, rollout |

## Environment & Development

| Document | Description |
|----------|-------------|
| [Local Development Setup](../scripts/wsl-setup.sh) | WSL2 native services (PostgreSQL, Redis, MinIO) — no Docker required |
| [AI Development Environment](environment/ai-development-environment.md) | ML toolchain, GPUs, model training setup |
| [Hosting & Platform Services](environment/hosting-stack.md) | Platform services used by the platform |
| [Development Guide](development/contributing.md) | Monorepo conventions, workspace commands, PR workflow |

## Operations

| Document | Description |
|----------|-------------|
| [Monitoring & Observability](operations/monitoring.md) | Prometheus, Grafana, Loki, SLOs |
| [Operations Runbook](operations/runbook.md) | Common operational procedures |

## Roadmap

- [Platform Roadmap](../docs/product/roadmap.md) — phased delivery plan
