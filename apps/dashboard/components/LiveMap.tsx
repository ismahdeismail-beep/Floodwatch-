"use client";

import { useMemo, useState } from "react";
import Map, { Marker, NavigationControl, Popup } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import type { RiskLevel } from "@floodwatch/types";
import { RISK_STYLES } from "@floodwatch/utils";

export interface FloodZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  risk: RiskLevel;
  waterLevel: number; // meters
}

const DEFAULT_VIEW = {
  latitude: Number(process.env.NEXT_PUBLIC_DEFAULT_LAT ?? -1.2921),
  longitude: Number(process.env.NEXT_PUBLIC_DEFAULT_LNG ?? 36.8219),
  zoom: Number(process.env.NEXT_PUBLIC_DEFAULT_ZOOM ?? 5),
};

const MAP_STYLE =
  process.env.NEXT_PUBLIC_MAP_STYLE ?? "https://demotiles.maplibre.org/style.json";

export function LiveMap({ zones }: { zones: FloodZone[] }) {
  const [selected, setSelected] = useState<FloodZone | null>(null);

  const riskColors = useMemo(
    () => ({
      low: "#22c55e",
      moderate: "#eab308",
      high: "#f97316",
      extreme: "#ef4444",
    }),
    [],
  );

  return (
    <Map
      initialViewState={DEFAULT_VIEW}
      style={{ width: "100%", height: "100%" }}
      mapStyle={MAP_STYLE}
      attributionControl={true}
    >
      <NavigationControl position="top-right" />
      {zones.map((zone) => (
        <Marker
          key={zone.id}
          latitude={zone.lat}
          longitude={zone.lng}
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setSelected(zone);
          }}
        >
          <div
            className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-white/80 shadow"
            style={{ backgroundColor: riskColors[zone.risk] }}
            title={zone.name}
          />
        </Marker>
      ))}

      {selected && (
        <Popup
          latitude={selected.lat}
          longitude={selected.lng}
          onClose={() => setSelected(null)}
          closeButton={true}
          offset={12}
        >
          <div className="space-y-1 text-slate-900">
            <div className="text-sm font-semibold">{selected.name}</div>
            <div className="text-xs">
              Risk:{" "}
              <span
                className={`rounded border px-1.5 py-0.5 font-semibold ${RISK_STYLES[selected.risk]}`}
              >
                {selected.risk}
              </span>
            </div>
            <div className="text-xs text-slate-600">
              Water level: {selected.waterLevel.toFixed(2)} m
            </div>
          </div>
        </Popup>
      )}
    </Map>
  );
}
