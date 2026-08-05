import { PageHeader, Card, StatCard, Badge } from "@floodwatch/ui";

interface ServiceStatus {
  name: string;
  port: number;
  status: "healthy" | "degraded" | "down";
  latencyMs: number;
  version: string;
}

const SERVICES: ServiceStatus[] = [
  { name: "api-gateway", port: 8000, status: "healthy", latencyMs: 34, version: "0.1.0" },
  { name: "auth", port: 8001, status: "healthy", latencyMs: 41, version: "0.1.0" },
  { name: "weather", port: 8002, status: "healthy", latencyMs: 128, version: "0.1.0" },
  { name: "hydrology", port: 8003, status: "healthy", latencyMs: 76, version: "0.1.0" },
  { name: "satellite", port: 8004, status: "degraded", latencyMs: 1420, version: "0.1.0" },
  { name: "gis", port: 8005, status: "healthy", latencyMs: 52, version: "0.1.0" },
  { name: "ai", port: 8006, status: "healthy", latencyMs: 310, version: "0.1.0" },
  { name: "alerts", port: 8007, status: "healthy", latencyMs: 48, version: "0.1.0" },
  { name: "analytics", port: 8008, status: "healthy", latencyMs: 61, version: "0.1.0" },
];

const STATUS_TONE = {
  healthy: "success",
  degraded: "warning",
  down: "danger",
} as const;

export default function HealthPage() {
  const healthy = SERVICES.filter((s) => s.status === "healthy").length;

  return (
    <>
      <PageHeader
        title="Platform Health"
        description="Service registry, health checks, and latency across the microservice fleet."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Services healthy" value={`${healthy}/${SERVICES.length}`} tone="success" />
        <StatCard label="Degraded" value="1" hint="satellite — ingest slow" tone="warning" />
        <StatCard label="Avg. latency" value="241 ms" hint="Gateway round-trip" />
        <StatCard label="Uptime (30d)" value="99.93%" tone="success" />
      </div>

      <Card title="Service registry" subtitle="Health endpoint: GET /health" className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                <th className="py-3 pr-4">Service</th>
                <th className="py-3 pr-4">Port</th>
                <th className="py-3 pr-4">Version</th>
                <th className="py-3 pr-4">Latency</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {SERVICES.map((s) => (
                <tr key={s.name} className="border-b border-slate-800/60 last:border-0">
                  <td className="py-3 pr-4 font-mono text-sm text-cyan-400">{s.name}</td>
                  <td className="py-3 pr-4 font-mono text-xs text-slate-500">{s.port}</td>
                  <td className="py-3 pr-4 font-mono text-xs text-slate-500">v{s.version}</td>
                  <td className="py-3 pr-4 font-mono text-xs text-slate-400">{s.latencyMs} ms</td>
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
