import { PageHeader, Card, Badge, Button } from "@floodwatch/ui";

interface DataSource {
  name: string;
  service: string;
  type: "satellite" | "weather" | "hydrology" | "open-data";
  cadence: string;
  status: "connected" | "degraded" | "not-configured";
  lastSync: string;
}

const SOURCES: DataSource[] = [
  { name: "CHIRPS rainfall", service: "weather", type: "weather", cadence: "Daily", status: "connected", lastSync: "04:00 UTC" },
  { name: "ECMWF HRES / CDS", service: "weather", type: "weather", cadence: "6-hourly", status: "connected", lastSync: "05:30 UTC" },
  { name: "NASA GPM IMERG", service: "satellite", type: "satellite", cadence: "30 min", status: "connected", lastSync: "05:45 UTC" },
  { name: "Sentinel-1 SAR", service: "satellite", type: "satellite", cadence: "12 days", status: "degraded", lastSync: "03:10 UTC (delayed)" },
  { name: "GloFAS river forecast", service: "hydrology", type: "hydrology", cadence: "Daily", status: "not-configured", lastSync: "—" },
  { name: "OpenStreetMap", service: "gis", type: "open-data", cadence: "Weekly", status: "connected", lastSync: "2026-08-01" },
];

const STATUS_TONE = {
  connected: "success",
  degraded: "warning",
  "not-configured": "default",
} as const;

export default function DataSourcesPage() {
  return (
    <>
      <PageHeader
        title="Data Sources"
        description="Upstream providers and ingestion pipelines feeding the weather, hydrology, satellite, and GIS services."
        action={<Button>Add source</Button>}
      />

      <Card title="Configured sources">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                <th className="py-3 pr-4">Source</th>
                <th className="py-3 pr-4">Ingested by</th>
                <th className="py-3 pr-4">Type</th>
                <th className="py-3 pr-4">Cadence</th>
                <th className="py-3 pr-4">Last sync</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {SOURCES.map((s) => (
                <tr key={s.name} className="border-b border-slate-800/60 last:border-0">
                  <td className="py-3 pr-4 font-medium text-slate-100">{s.name}</td>
                  <td className="py-3 pr-4 font-mono text-xs text-cyan-400">{s.service}</td>
                  <td className="py-3 pr-4 capitalize text-slate-400">{s.type}</td>
                  <td className="py-3 pr-4 text-slate-300">{s.cadence}</td>
                  <td className="py-3 pr-4 text-slate-400">{s.lastSync}</td>
                  <td className="py-3">
                    <Badge tone={STATUS_TONE[s.status]}>{s.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
