"""Geospatial intelligence engine.

Demo implementations return deterministic GeoJSON so the API is testable.
Production paths use PostGIS/GeoPandas/Rasterio with data sources listed in
docs/data/data-sources.md (SRTM, Copernicus DEM, OSM, Microsoft Footprints).
"""
from __future__ import annotations

import math
from typing import Any

COMMUNITIES: list[dict[str, Any]] = [
    {"id": "com_001", "name": "Garissa Township", "county": "Garissa", "ward": "Township", "population": 163000, "lat": -0.4569, "lon": 39.6461, "risk": "high"},
    {"id": "com_002", "name": "Budalangi", "county": "Busia", "ward": "Budalangi", "population": 74000, "lat": 0.2119, "lon": 33.9992, "risk": "extreme"},
    {"id": "com_003", "name": "Kibera", "county": "Nairobi", "ward": "Kibera", "population": 250000, "lat": -1.3144, "lon": 36.7844, "risk": "moderate"},
    {"id": "com_004", "name": "Mumias", "county": "Kakamega", "ward": "Mumias Central", "population": 99000, "lat": 0.3333, "lon": 34.4833, "risk": "high"},
    {"id": "com_005", "name": "Mpeketoni", "county": "Lamu", "ward": "Mpeketoni", "population": 42000, "lat": -2.3196, "lon": 40.7211, "risk": "moderate"},
]

FACILITIES: list[dict[str, Any]] = [
    {"id": "fac_001", "name": "Kenyatta National Hospital", "kind": "hospital", "lat": -1.3010, "lon": 36.8056},
    {"id": "fac_002", "name": "Garissa County Referral Hospital", "kind": "hospital", "lat": -0.4500, "lon": 39.6400},
    {"id": "fac_003", "name": "Coast General Teaching Hospital", "kind": "hospital", "lat": -4.0435, "lon": 39.6682},
    {"id": "fac_004", "name": "Kisumu County Hospital", "kind": "hospital", "lat": -0.1022, "lon": 34.7617},
    {"id": "fac_005", "name": "Moi Girls School Nairobi", "kind": "school", "lat": -1.2800, "lon": 36.8200},
    {"id": "fac_006", "name": "Riverside Shelter Camp", "kind": "shelter", "lat": -0.1022, "lon": 34.7617},
]


def _distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Haversine distance in kilometres."""
    r = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


def elevation(lat: float, lon: float) -> dict[str, Any]:
    """Deterministic elevation sample.

    TODO: read SRTM/Copernicus DEM tiles from datasets/geodata with rasterio.
    """
    seed = abs(int((lat * 1000) + (lon * 1000)))
    return {"lat": lat, "lon": lon, "elevation_m": round(300 + (seed % 2200) / 10, 1), "source": "SRTM/Copernicus DEM"}


def watershed(lat: float, lon: float) -> dict[str, Any]:
    """Demo catchment polygon.

    TODO: delineate with TauDEM/PyFlwDir from the DEM (hydrology service).
    """
    d = 0.12
    return {
        "lat": lat,
        "lon": lon,
        "area_km2": round(320 + abs(hash((lat, lon)) % 1500), 1),
        "geometry": {
            "type": "Polygon",
            "coordinates": [[[lon - d, lat - d], [lon + d, lat - d], [lon + d, lat + d], [lon - d, lat + d], [lon - d, lat - d]]],
        },
    }


def floodplain(river_id: str) -> dict[str, Any]:
    """Demo floodplain polygon for a river.

    TODO: derive from DEM + historical flood extents (satellite service).
    """
    seed = abs(hash(river_id) % 100)
    d = 0.08 + seed / 500
    return {
        "river_id": river_id,
        "area_km2": round(12 + seed * 1.6, 1),
        "geometry": {
            "type": "Polygon",
            "coordinates": [[[34.0, 0.15], [35.2, 0.15], [35.2, 0.35], [34.0, 0.35], [34.0, 0.15]]],
        },
    }


def buffer(lat: float, lon: float, radius_m: float) -> dict[str, Any]:
    """Approximate circle buffer in WGS84 degrees."""
    r = radius_m / 111320.0
    pts = [
        [lon + r * math.cos(math.radians(a)), lat + r * math.sin(math.radians(a))]
        for a in range(0, 360, 15)
    ]
    pts.append(pts[0])
    return {"lat": lat, "lon": lon, "radius_m": radius_m, "geometry": {"type": "Polygon", "coordinates": [pts]}}


def nearest_facilities(lat: float, lon: float, kinds: list[str]) -> list[dict[str, Any]]:
    """Return nearest facilities of the requested kinds."""
    matches = [f for f in FACILITIES if f["kind"] in kinds] if kinds else FACILITIES
    for f in matches:
        f["distance_km"] = round(_distance_km(lat, lon, f["lat"], f["lon"]), 2)
    return sorted(matches, key=lambda f: f["distance_km"])[:10]


def safe_route(f_lat: float, f_lon: float, t_lat: float, t_lon: float) -> dict[str, Any]:
    """Return a safe route as a GeoJSON LineString.

    TODO: route on the road network with OSMnx/NetworkX avoiding flooded
    segments flagged by the AI and satellite services.
    """
    distance = round(_distance_km(f_lat, f_lon, t_lat, t_lon), 2)
    return {
        "from_coordinates": [f_lon, f_lat],
        "to_coordinates": [t_lon, t_lat],
        "distance_km": distance,
        "geometry": {"type": "LineString", "coordinates": [[f_lon, f_lat], [t_lon, t_lat]]},
    }


def communities() -> dict[str, Any]:
    """At-risk communities as a GeoJSON FeatureCollection."""
    features = [
        {
            "type": "Feature",
            "properties": {k: v for k, v in c.items() if k not in {"lat", "lon"}},
            "geometry": {"type": "Point", "coordinates": [c["lon"], c["lat"]]},
        }
        for c in COMMUNITIES
    ]
    return {"type": "FeatureCollection", "features": features}
