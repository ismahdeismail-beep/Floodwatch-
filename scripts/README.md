# FloodWatch AI — Scripts

Helper scripts for setup, database bootstrap, demo seeding, and data fetching.

| Script | Purpose |
|--------|---------|
| `setup.ps1` / `setup.sh` | One-time dev environment setup (env files, core infra, JS deps) |
| `seed-demo-data.py` | Insert deterministic demo records into PostGIS (counties, gauges, alerts, communities, assets, users) |
| `fetch-demo-data.py` | Fetch a small public demo dataset (CHIRPS rainfall for Kenya) for local experimentation |
| `db-init.sql` | Reference bootstrap SQL (also mounted into Postgres via docker-init) |

## setup.ps1 (Windows PowerShell)

```powershell
.\scripts\setup.ps1
```

Steps: create `.env` from `.env.example` (if missing), start core infra
(`docker compose up -d postgres redis minio`), install JS deps (`npm install`).

## Seed demo data

```bash
# after postgres is up
python scripts/seed-demo-data.py --db-url "postgresql://floodwatch:floodwatch_dev@localhost:5432/floodwatch"
```

## Fetch demo data

```bash
python scripts/fetch-demo-data.py --out datasets/raw/chirps --year 2023
```
