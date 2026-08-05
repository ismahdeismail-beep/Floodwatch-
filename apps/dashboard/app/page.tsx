import { StatCard, Card, Badge, SeverityBadge, RiskBadge, PageHeader } from "@floodwatch/ui";
import { LiveMap, type FloodZone } from "@/components/LiveMap";

const ZONES: FloodZone[] = [
  { id: "z1", name: "Tana Delta", lat: -2.55, lng: 40.32, risk: "extreme", waterLevel: 4.82 },
  { id: "z2", name: "Garissa Town", lat: -0.4569, lng: 39.658, risk: "high", waterLevel: 3.21 },
  { id: "z3", name: "Kisumu Lakeshore", lat: -0.0917, lng: 34.768, risk: "high", waterLevel: 2.94 },
  { id: "z4", name: "Nairobi — Mathare", lat: -1.2617, lng: 36.8626, risk: "moderate", waterLevel: 1.32 },
  { id: "z5", name: "Mombasa — Tudor", lat: -4.0435, lng: 39.6682, risk: "moderate", waterLevel: 1.18 },
  { id: "z6", name: "Eldoret — Sosiani", lat: 0.5143, lng: 35.2698, risk: "low", waterLevel: 0.44 },
];

const RECENT_ALERTS = [
  {
    id: "alt-1041",
    title: "Tana River flooding — Garsen",
    severity: "critical" as const,
    county: "Tana River",
    time: "2 min ago",
    channels: "SMS · WhatsApp · Push",
  },
  {
    id: "alt-1040",
    title: "Persistent heavy rainfall expected — Garissa",
    severity: "warning" as const,
    county: "Garissa",
    time: "18 min ago",
    channels: "SMS · Email",
  },
  {
    id: "alt-1039",
    title: "Lake Victoria levels rising — Kisumu",
    severity: "warning" as const,
    county: "Kisumu",
    time: "41 min ago",
    channels: "SMS · WhatsApp",
  },
  {
    id: "alt-1038",
    title: "River Nzoia at watch level — Mumias",
    severity: "watch" as const,
    county: "Kakamega",
    time: "1 h ago",
    channels: "Web · Push",
  },
];

export default function CommandCenterPage() {
  return (
    <>
      <PageHeader
        title="National Command Center"
        description="Live operational picture across monitored counties. Data is refreshed from the FloodWatch AI gateway every 5 minutes."
        action={<Badge tone="success">● Live</Badge>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active Alerts" value="23" hint="4 critical · 9 warning" tone="danger" />
        <StatCard label="Counties at Risk" value="12" hint="High/extreme risk this week" tone="warning" />
        <StatCard label="Communities Monitored" value="1,847" hint="~2.1M people covered" />
        <StatCard label="Gauge Uptime" value="99.2%" hint="312 of 315 reporting" tone="success" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card
          title="Live Flood Risk Map"
          subtitle="Current risk posture by zone"
          className="xl:col-span-2"
          action={<Badge tone="info">EPSG:4326</Badge>}
        >
          <div className="h-[420px] overflow-hidden rounded-xl border border-slate-800">
            <LiveMap zones={ZONES} />
          </div>
        </Card>

        <Card title="Recent Alerts" subtitle="Latest broadcasts from the alerts service">
          <ul className="space-y-4">
            {RECENT_ALERTS.map((alert) => (
              <li key={alert.id} className="flex items-start gap-3">
                <SeverityBadge severity={alert.severity} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-100">{alert.title}</p>
                  <p className="text-xs text-slate-500">
                    {alert.county} · {alert.time}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-600">{alert.channels}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-2">
            <Badge tone="info">View all alerts</Badge>
            <Badge>Escalate</Badge>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card title="Counties — highest risk today" subtitle="Top 3 by aggregate score">
          <ul className="space-y-3">
            {[
              { name: "Tana River", level: "extreme" as const },
              { name: "Garissa", level: "high" as const },
              { name: "Kisumu", level: "high" as const },
            ].map((c) => (
              <li key={c.name} className="flex items-center justify-between">
                <span className="text-sm text-slate-200">{c.name}</span>
                <RiskBadge level={c.level} />
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Model status" subtitle="AI inference fleet">
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span className="text-slate-400">Precipitation nowcast</span><Badge tone="success">Healthy</Badge></li>
            <li className="flex justify-between"><span className="text-slate-400">Flood risk ensemble</span><Badge tone="success">Healthy</Badge></li>
            <li className="flex justify-between"><span className="text-slate-400">Satellite inundation</span><Badge tone="warning">Degraded</Badge></li>
          </ul>
        </Card>

        <Card title="Next scheduled broadcast" subtitle="Automated push plan">
          <p className="text-sm text-slate-300">
            Daily risk briefing to <strong>national_admin</strong> at 06:00 EAT.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Next run: <span className="text-slate-300">tomorrow 06:00</span> · all 47 counties
          </p>
        </Card>
      </div>
    </>
  );
}
