-- FloodWatch AI — PostGIS bootstrap (local Docker Compose)
-- Mirrors the production Supabase Postgres baseline (extensions + schema notes).

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Schema notes (tables are created by service migrations / seed scripts):
--   public.alerts              (id, title, body, severity, county, ward, channels, sent_at, expires_at)
--   public.risk_assessments    (id, lat, lon, probability, risk_level, expected_depth_m, duration_hours, extent_km2, confidence, model_version, generated_at, valid_until)
--   public.gauge_readings      (gauge_id, level_m, flow_m3s, status, recorded_at)
--   public.counties            (code, name, geometry)
--   public.communities         (id, name, county, ward, population, coordinates, risk_level)
--   public.infrastructure_assets (id, name, type, county, coordinates, status)
--   public.users               (id, email, full_name, role)
--   public.api_keys            (id, name, prefix, key_hash, scopes, status, created_at, last_used_at)
--   public.model_registry      (id, name, version, task, metrics, status, trained_at)

-- Sample spatial index pattern:
-- CREATE INDEX idx_communities_geom ON communities USING GIST (coordinates);
