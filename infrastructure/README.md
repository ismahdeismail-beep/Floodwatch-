# Infrastructure

Operational infrastructure for FloodWatch AI: Terraform (Google Cloud), optional
Kubernetes manifests, Docker helpers, monitoring (Prometheus/Grafana/Loki),
Cloudflare, and nginx.

```
infrastructure/
├── terraform/          # GCP: Cloud Run services, Artifact Registry, GCS buckets
├── k8s/                # Optional Kubernetes manifests (cloud-run conversion-ready)
├── docker/
│   └── postgres-init/  # PostGIS bootstrap (extensions, roles, schema notes)
├── monitoring/
│   ├── prometheus/     # scrape config
│   └── grafana/        # datasource provisioning + dashboard JSON
├── cloudflare/         # DNS/WAF notes
└── nginx/              # dev reverse-proxy (optional)
```

## Terraform (GCP)

```bash
cd infrastructure/terraform
terraform init
terraform plan -var-file=terraform.tfvars.example
terraform apply
```

Provisioned: Artifact Registry repo, GCS bucket (rasters/artifacts), Cloud Run
services (9 services), service accounts, and IAM bindings. Frontends deploy via
Vercel (outside Terraform).

## Monitoring

```bash
docker compose up -d                      # start the core stack (creates the floodwatch network)
docker compose -f docker-compose.monitoring.yml up -d
# Prometheus: http://localhost:9090   Grafana: http://localhost:3000 (admin/admin)
```

In production, use GCP Managed Prometheus + Grafana Cloud or self-hosted Grafana;
Loki collects structured logs from containers.
