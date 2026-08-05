"use client";

import { useRef } from "react";
import Map, { MapRef, Source, Layer, NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

const KENYA_CENTER = { latitude: 0.02, longitude: 37.9 };

export interface FloodMapProps {
  /** Optional GeoJSON FeatureCollection rendered as a source layer. */
  riskData?: GeoJSON.FeatureCollection | null;
  className?: string;
}

/**
 * Live flood map backed by MapLibre GL.
 *
 * NOTE: the default demo tiles (demotiles.maplibre.org) work without an API key.
 * Swap `mapStyle` for a Maplibre/MapTiler style and set NEXT_PUBLIC_MAPTILER_KEY
 * in production.
 */
export function FloodMap({ riskData = null, className = "" }: FloodMapProps) {
  const mapRef = useRef<MapRef>(null);

  return (
    <div className={`relative h-[480px] w-full overflow-hidden rounded-2xl border border-slate-800 ${className}`}>
      <Map
        ref={mapRef}
        initialViewState={{ ...KENYA_CENTER, zoom: 5.5 }}
        mapStyle="https://demotiles.maplibre.org/style.json"
        attributionControl={true}
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="top-right" />
        {riskData && (
          <>
            <Source id="risk" type="geojson" data={riskData} />
            <Layer
              id="risk-fill"
              source="risk"
              type="fill"
              paint={{ "fill-color": "#ef4444", "fill-opacity": 0.35 }}
            />
          </>
        )}
      </Map>
    </div>
  );
}
