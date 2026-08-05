import type { Metadata } from "next";
import { FloodMap } from "@/components/FloodMap";
import { Card } from "@floodwatch/ui";

export const metadata: Metadata = {
  title: "Live Flood Map",
  description: "Live flood risk map for Kenya — probability, depth, extent and safe routes.",
};

const LEGEND = [
  { label: "Extreme risk", color: "bg-red-500" },
  { label: "High risk", color: "bg-orange-500" },
  { label: "Moderate risk", color: "bg-yellow-500" },
  { label: "Low risk", color: "bg-emerald-500" },
  { label: "Water bodies", color: "bg-sky-500" },
];

export default function MapPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-100">Live Flood Map</h1>
      <p className="mt-1 text-sm text-slate-400">
        Interactive flood probability, expected depth and extent. Powered by the FloodWatch AI prediction engine.
      </p>

      <div className="mt-6">
        <FloodMap />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <Card title="Legend">
          <ul className="space-y-2">
            {LEGEND.map((item) => (
              <li key={item.label} className="flex items-center gap-3 text-sm text-slate-300">
                <span className={`h-3 w-3 rounded-full ${item.color}`} />
                {item.label}
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Layers">
          <ul className="space-y-2 text-sm text-slate-400">
            <li>• Flood probability</li>
            <li>• Expected depth</li>
            <li>• Flood extent</li>
            <li>• Safe routes</li>
            <li>• Critical infrastructure</li>
          </ul>
        </Card>
        <Card title="Note">
          <p className="text-sm text-slate-400">
            Development preview uses keyless demo tiles. Production maps use MapTiler/Sentinel-derived basemaps via
            Cloudflare-delivered vector tiles.
          </p>
        </Card>
      </div>
    </div>
  );
}
