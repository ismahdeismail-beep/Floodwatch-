"use client";

import { Card, SeverityBadge } from "@floodwatch/ui";
import { timeAgo } from "@floodwatch/utils";
import type { Alert, AlertSeverity } from "@floodwatch/types";

const DEMO_ALERTS: Alert[] = [
  {
    id: "alt_001",
    title: "Nzoia River approaching flood stage",
    body: "Water levels at Budalangi are above the warning threshold. Communities in low-lying areas should prepare for possible flooding within 24 hours.",
    severity: "warning",
    county: "Busia",
    ward: "Budalangi",
    channels: ["sms", "whatsapp", "push", "email"],
    sentAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: "alt_002",
    title: "Heavy rainfall expected over Garissa",
    body: "ECMWF forecasts >80 mm over 48 hours. Monitor river levels and avoid crossing flooded roads.",
    severity: "watch",
    county: "Garissa",
    ward: "Township",
    channels: ["push", "web"],
    sentAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
  },
  {
    id: "alt_003",
    title: "Critical: flash flood risk in Kibera",
    body: "Intense convection and saturated soils. Move valuables to higher ground; follow county guidance.",
    severity: "critical",
    county: "Nairobi",
    ward: "Kibera",
    channels: ["sms", "whatsapp", "push"],
    sentAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
  },
  {
    id: "alt_004",
    title: "All clear for Lamu coastal belt",
    body: "Sea levels and river flows have returned to normal ranges. Monitor https://floodwatch.ai for updates.",
    severity: "info",
    county: "Lamu",
    channels: ["push", "email"],
    sentAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
  },
];

const SEVERITY_ORDER: Record<AlertSeverity, number> = { critical: 0, warning: 1, watch: 2, info: 3 };

export default function AlertsPage() {
  const alerts = [...DEMO_ALERTS].sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-100">Alerts</h1>
      <p className="mt-1 text-sm text-slate-400">
        Automated warnings from the FloodWatch decision engine. Demo data — wire to the alerts service for live feeds.
      </p>

      <div className="mt-8 space-y-4">
        {alerts.map((alert) => (
          <Card key={alert.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <SeverityBadge severity={alert.severity} />
                  {alert.county && <span className="text-xs text-slate-500">{alert.county}</span>}
                  {alert.ward && <span className="text-xs text-slate-600">· {alert.ward}</span>}
                </div>
                <h3 className="mt-2 text-base font-semibold text-slate-100">{alert.title}</h3>
                <p className="mt-1 max-w-2xl text-sm text-slate-400">{alert.body}</p>
              </div>
              <span className="text-xs text-slate-600">{timeAgo(alert.sentAt)}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {alert.channels.map((channel) => (
                <span key={channel} className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] uppercase tracking-wide text-slate-400">
                  {channel}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
