import { PageHeader, Card, Badge } from "@floodwatch/ui";

const WEEKLY_ALERTS = [
  { label: "Mon", value: 18 },
  { label: "Tue", value: 22 },
  { label: "Wed", value: 27 },
  { label: "Thu", value: 31 },
  { label: "Fri", value: 23 },
  { label: "Sat", value: 17 },
  { label: "Sun", value: 15 },
];

const COUNTY_SHARE = [
  { name: "Tana River", pct: 26 },
  { name: "Garissa", pct: 18 },
  { name: "Kisumu", pct: 14 },
  { name: "Nairobi", pct: 12 },
  { name: "Kakamega", pct: 9 },
  { name: "Others", pct: 21 },
];

export default function AnalyticsPage() {
  const maxAlerts = Math.max(...WEEKLY_ALERTS.map((d) => d.value));

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Operational trends, model performance, and coverage metrics. Underlying data from the analytics service."
        action={<Badge tone="info">Updated hourly</Badge>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card title="Alerts this week" subtitle="vs. −12% last week"><p className="text-3xl font-bold text-slate-100">153</p></Card>
        <Card title="Model precision (7d)" subtitle="Flood nowcast"><p className="text-3xl font-bold text-emerald-400">87.3%</p></Card>
        <Card title="Avg. lead time" subtitle="Warning → onset"><p className="text-3xl font-bold text-cyan-400">9.4 h</p></Card>
        <Card title="Recipients reached" subtitle="Unique contacts"><p className="text-3xl font-bold text-slate-100">412k</p></Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card title="Alerts issued — last 7 days" subtitle="Volume by day">
          <div className="flex h-48 items-end gap-3">
            {WEEKLY_ALERTS.map((d) => (
              <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-cyan-500/70 transition-all"
                  style={{ height: `${(d.value / maxAlerts) * 100}%` }}
                />
                <span className="text-xs text-slate-500">{d.label}</span>
                <span className="text-[10px] text-slate-600">{d.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Alert share by county" subtitle="Percentage of issued alerts">
          <ul className="space-y-3">
            {COUNTY_SHARE.map((c) => (
              <li key={c.name} className="flex items-center gap-3">
                <span className="w-28 text-sm text-slate-300">{c.name}</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-cyan-400"
                    style={{ width: `${c.pct}%` }}
                  />
                </div>
                <span className="w-10 text-right text-sm font-mono text-slate-400">{c.pct}%</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="Model performance" subtitle="Live metrics from the AI service" className="mt-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { name: "Flood risk ensemble", precision: "0.87", recall: "0.82", f1: "0.84" },
            { name: "Precipitation nowcast", precision: "0.91", recall: "0.86", f1: "0.88" },
            { name: "Inundation classifier", precision: "0.79", recall: "0.74", f1: "0.76" },
          ].map((m) => (
            <div key={m.name} className="rounded-xl border border-slate-800 p-4">
              <p className="text-sm font-medium text-slate-100">{m.name}</p>
              <p className="mt-2 text-xs text-slate-500">
                Precision <span className="font-mono text-slate-300">{m.precision}</span> · Recall{" "}
                <span className="font-mono text-slate-300">{m.recall}</span> · F1{" "}
                <span className="font-mono text-slate-300">{m.f1}</span>
              </p>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
