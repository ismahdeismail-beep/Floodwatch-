"""Seed deterministic demo data into the local PostGIS database.

Usage:
    python scripts/seed-demo-data.py --db-url "postgresql://floodwatch:floodwatch_dev@localhost:5432/floodwatch"

This seeds demo records for counties, river gauges, communities, infrastructure
assets, alerts, and a demo user — mirroring the entities in docs/architecture.
"""

import argparse
import hashlib
from datetime import datetime, timedelta, timezone

# ─── Demo data (deterministic) ──────────────────────────────────────────

COUNTIES = [
    ("Tana River", "22", "extreme"),
    ("Garissa", "12", "high"),
    ("Kisumu", "20", "high"),
    ("Kakamega", "09", "moderate"),
    ("Nairobi", "01", "moderate"),
    ("Mombasa", "02", "moderate"),
    ("Isiolo", "11", "low"),
    ("Uasin Gishu", "30", "low"),
]

GAUGES = [
    ("G-041", "Tana @ Garissa Bridge", 3.21, 412.0, "warning", -0.4569, 39.658),
    ("G-038", "Tana @ Garsen", 4.82, 689.0, "critical", -2.55, 40.32),
    ("G-112", "Nzoia @ Mumias", 2.11, 96.0, "watch", 0.33, 34.49),
    ("G-077", "Nyando @ Ahero", 1.74, 54.0, "watch", -0.183, 35.03),
]

COMMUNITIES = [
    ("C-001", "Garsen", "Tana River", 51230, -2.55, 40.32, "extreme"),
    ("C-002", "Garissa Town", "Garissa", 163000, -0.4569, 39.658, "high"),
    ("C-003", "Mathare", "Nairobi", 206000, -1.2617, 36.8626, "moderate"),
]

ALERTS = [
    ("ALT-1041", "Tana River flooding — Garsen", "critical", "Tana River", "Garsen",
     "SMS,whatsapp,push", "6 h"),
    ("ALT-1040", "Persistent heavy rainfall — Garissa", "warning", "Garissa", None,
     "SMS,email", "12 h"),
    ("ALT-1039", "Lake Victoria levels rising — Kisumu", "warning", "Kisumu", None,
     "SMS,whatsapp", "24 h"),
]

ASSETS = [
    ("AST-2201", "Garsen–Lamu Road (B8)", "road", "Tana River", "at-risk"),
    ("AST-2202", "Garissa Bridge (Tana)", "bridge", "Garissa", "at-risk"),
    ("AST-2205", "Kisumu Emergency Shelter 02", "shelter", "Kisumu", "open"),
]


def seed(conn):
    cur = conn.cursor()
    now = datetime.now(timezone.utc)

    for code, name, risk in COUNTIES:
        cur.execute(
            "INSERT INTO counties (code, name, risk_level) VALUES (%s, %s, %s) "
            "ON CONFLICT (code) DO NOTHING",
            (code, name, risk),
        )

    for gid, name, level, flow, status, lat, lon in GAUGES:
        cur.execute(
            "INSERT INTO gauge_readings (gauge_id, level_m, flow_m3s, status, recorded_at) "
            "VALUES (%s, %s, %s, %s, %s) ON CONFLICT DO NOTHING",
            (gid, level, flow, status, now),
        )

    for cid, name, county, pop, lat, lon, risk in COMMUNITIES:
        cur.execute(
            "INSERT INTO communities (id, name, county, population, coordinates, risk_level) "
            "VALUES (%s, %s, %s, %s, ST_SetSRID(ST_MakePoint(%s, %s), 4326), %s) "
            "ON CONFLICT (id) DO NOTHING",
            (cid, name, county, pop, lon, lat, risk),
        )

    for aid, name, atype, county, status in ASSETS:
        cur.execute(
            "INSERT INTO infrastructure_assets (id, name, type, county, status) "
            "VALUES (%s, %s, %s, %s, %s) ON CONFLICT (id) DO NOTHING",
            (aid, name, atype, county, status),
        )

    for aid, title, severity, county, ward, channels, expires_in in ALERTS:
        expires = now + timedelta(hours=int(expires_in.split()[0]))
        cur.execute(
            "INSERT INTO alerts (id, title, body, severity, county, ward, channels, sent_at, expires_at) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT (id) DO NOTHING",
            (aid, title, f"{title} — automated demo alert.", severity, county, ward,
             channels, now, expires),
        )

    # Demo user (password: ChangeMe123! — demo only, bcrypt-style sha256 placeholder)
    pw_hash = hashlib.sha256(b"ChangeMe123!").hexdigest()
    cur.execute(
        "INSERT INTO users (id, email, full_name, role, password_hash) "
        "VALUES ('USR-001', 'admin@floodwatch.ai', 'Demo Admin', 'admin', %s) "
        "ON CONFLICT DO NOTHING",
        (pw_hash,),
    )

    conn.commit()
    print(f"Seeded {len(COUNTIES)} counties, {len(GAUGES)} gauges, "
          f"{len(COMMUNITIES)} communities, {len(ASSETS)} assets, {len(ALERTS)} alerts.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Seed FloodWatch AI demo data")
    parser.add_argument("--db-url", default="postgresql://floodwatch:floodwatch_dev@localhost:5432/floodwatch")
    args = parser.parse_args()

    try:
        import psycopg
    except ImportError:
        raise SystemExit("psycopg not installed: pip install psycopg[binary]")

    with psycopg.connect(args.db_url) as conn:
        seed(conn)


if __name__ == "__main__":
    main()
