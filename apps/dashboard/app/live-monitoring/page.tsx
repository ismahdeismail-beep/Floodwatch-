import { PageHeader, Card, Badge } from "@floodwatch/ui";

interface Station {
  id: string;
  name: string;
  county: string;
  kind: "River gauge" | "Rain gauge" | "Weather station";
  value: string;
  trend: "▲" | "▼" | "—";
  status: "normal" | "watch" | "warning" | "critical";
  lastUpdate: string;
}

const STATIONS: Station[] = [
  { id: "G-041", name: "Tana @ Garissa Bridge", county: "Garissa", kind: "River gauge", value: "3.21 m · 412 m³/s", trend: "▲", status: "warning", lastUpdate: "2 min" },
  { id: "G-038", name: "Tana @ Garsen", county: "Tana River", kind: "River gauge", value: "4.82 m · 689 m³/s", trend: "▲", status: "critical", lastUpdate: "2 min" },
  { id: "G-112", name: "Nzoia @ Mumias", county: "Kakamega", kind: "River gauge", value: "2.11 m · 96 m³/s", trend: "▲", status: "watch", lastUpdate: "5 min" },
  { id: "G-077", name: "Nyando @ Ahero", county: "Kisumu", kind: "River gauge", value: "1.74 m · 54 m³/s", trend: "—", status: "watch", lastUpdate: "5 min" },
  { id: "R-203", name: "Mathare Station", county: "Nairobi", kind: "Rain gauge", value: "12.4 mm/h", trend: "▲", status: "watch", lastUpdate: "1 min" },
  { id: "R-118", name: "Chepkoilel", county: "Uasin Gishu", kind: "Rain gauge", value: "3.1 mm/h", trend: "▼", status: "normal", lastUpdate: "1 min" },
  { id: "W-031", name: "Mombasa MET", county: "Mombasa", kind: "Weather station", value: "28.4 °C · 86% RH", trend: "—", status: "normal", lastUpdate: "10 min" },
  { id: "W-017", name: "Kisumu Airport", county: "Kisumu", kind: "Weather station", value: "24.1 °C · 91% RH", trend: "▲", status: "watch", lastUpdate: "10 min" },
];

const STATUS_TONE = {
  normal: "success",
  watch: "warning",
  warning: "warning",
  critical: "danger",
} as const;

export default function LiveMonitoringPage() {
  return (
    <>
      <PageHeader
        title="Live Monitoring"
        description="Telemetry stream from river gauges, rain gauges, and automated weather stations. Ingestion via the hydrology & weather services."
        action={<Badge tone="success">315 stations reporting</Badge>}
      />

      <Card title="Station telemetry" subtitle="Sorted by alert priority">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                <th className="py-3 pr-4">Station</th>
                <th className="py-3 pr-4">County</th>
                <th className="py-3 pr-4">Type</th>
                <th className="py-3 pr-4">Reading</th>
                <th className="py-3 pr-4">Trend</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3">Updated</th>
              </tr>
            </thead>
            <tbody>
              {STATIONS.map((s) => (
                <tr key={s.id} className="border-b border-slate-800/60 last:border-0">
                  <td className="py-3 pr-4 font-medium text-slate-100">
                    {s.name}
                    <span className="ml-2 text-xs text-slate-600">{s.id}</span>
                  </td>
                  <td className="py-3 pr-4 text-slate-300">{s.county}</td>
                  <td className="py-3 pr-4 text-slate-400">{s.kind}</td>
                  <td className="py-3 pr-4 font-mono text-slate-200">{s.value}</td>
                  <td className="py-3 pr-4 text-cyan-400">{s.trend}</td>
                  <td className="py-3 pr-4">
                    <Badge tone={STATUS_TONE[s.status]}>{s.status}</Badge>
                  </td>
                  <td className="py-3 text-slate-500">{s.lastUpdate} ago</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card title="Data pipelines">
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex justify-between"><span>CHIRPS rainfall</span><Badge tone="success">On time</Badge></li>
            <li className="flex justify-between"><span>ECMWF HRES forecasts</span><Badge tone="success">On time</Badge></li>
            <li className="flex justify-between"><span>Sentinel-1 SAR</span><Badge tone="warning">2 h delayed</Badge></li>
          </ul>
        </Card>
        <Card title="Alert thresholds">
          <p className="text-sm text-slate-300">
            Gauge level thresholds are managed in <strong>Settings → Alert thresholds</strong>.
          </p>
        </Card>
        <Card title="Gateway health">
          <p className="text-sm text-slate-300">
            api-gateway <span className="font-mono text-xs text-slate-500">:8000</span> — latency{" "}
            <span className="font-mono text-emerald-400">34 ms</span>
          </p>
        </Card>
      </div>
    </>
  );
}
