"use client";

import { useState } from "react";
import { PageHeader, Card, Badge, SeverityBadge, Button } from "@floodwatch/ui";

interface AlertRow {
  id: string;
  title: string;
  severity: "info" | "watch" | "warning" | "critical";
  county: string;
  ward?: string;
  issuedAt: string;
  channels: string;
  status: "pending" | "acknowledged" | "broadcast" | "expired";
}

const INITIAL_ALERTS: AlertRow[] = [
  { id: "ALT-1041", title: "Tana River flooding — Garsen", severity: "critical", county: "Tana River", ward: "Garsen", issuedAt: "06:12 EAT", channels: "SMS · WhatsApp · Push", status: "pending" },
  { id: "ALT-1040", title: "Persistent heavy rainfall — Garissa", severity: "warning", county: "Garissa", issuedAt: "05:58 EAT", channels: "SMS · Email", status: "pending" },
  { id: "ALT-1039", title: "Lake Victoria levels rising — Kisumu", severity: "warning", county: "Kisumu", issuedAt: "05:35 EAT", channels: "SMS · WhatsApp", status: "acknowledged" },
  { id: "ALT-1038", title: "River Nzoia at watch level — Mumias", severity: "watch", county: "Kakamega", ward: "Mumias", issuedAt: "05:12 EAT", channels: "Web · Push", status: "broadcast" },
  { id: "ALT-1037", title: "Flash flood advisory — Mathare valley", severity: "warning", county: "Nairobi", ward: "Mathare", issuedAt: "04:48 EAT", channels: "SMS · Push", status: "broadcast" },
  { id: "ALT-1036", title: "Low water crossing advisory — Isiolo", severity: "info", county: "Isiolo", issuedAt: "03:20 EAT", channels: "Web", status: "expired" },
];

const STATUS_TONE = {
  pending: "warning",
  acknowledged: "info",
  broadcast: "success",
  expired: "default",
} as const;

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertRow[]>(INITIAL_ALERTS);

  const acknowledge = (id: string) =>
    setAlerts((rows) =>
      rows.map((a) => (a.id === id ? { ...a, status: "acknowledged" as const } : a)),
    );

  const broadcast = (id: string) =>
    setAlerts((rows) =>
      rows.map((a) => (a.id === id ? { ...a, status: "broadcast" as const } : a)),
    );

  return (
    <>
      <PageHeader
        title="Alert Management"
        description="Triage, acknowledge, and broadcast alerts to communities via SMS, WhatsApp, push, and email."
        action={
          <Button
            onClick={() => {
              // Reserved: opens the alert composer (integration with alerts service).
              alert("Alert composer — wires to POST /api/v1/alerts on the alerts service.");
            }}
          >
            + New alert
          </Button>
        }
      />

      <Card title={`Active queue (${alerts.filter((a) => a.status === "pending").length} pending)`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                <th className="py-3 pr-4">ID</th>
                <th className="py-3 pr-4">Alert</th>
                <th className="py-3 pr-4">Severity</th>
                <th className="py-3 pr-4">Location</th>
                <th className="py-3 pr-4">Issued</th>
                <th className="py-3 pr-4">Channels</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((a) => (
                <tr key={a.id} className="border-b border-slate-800/60 last:border-0">
                  <td className="py-3 pr-4 font-mono text-xs text-slate-500">{a.id}</td>
                  <td className="py-3 pr-4 font-medium text-slate-100">{a.title}</td>
                  <td className="py-3 pr-4"><SeverityBadge severity={a.severity} /></td>
                  <td className="py-3 pr-4 text-slate-300">
                    {a.county}
                    {a.ward ? <span className="text-slate-600"> · {a.ward}</span> : null}
                  </td>
                  <td className="py-3 pr-4 text-slate-400">{a.issuedAt}</td>
                  <td className="py-3 pr-4 text-xs text-slate-500">{a.channels}</td>
                  <td className="py-3 pr-4">
                    <Badge tone={STATUS_TONE[a.status]}>{a.status}</Badge>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      {a.status === "pending" && (
                        <>
                          <Button size="sm" variant="secondary" onClick={() => acknowledge(a.id)}>
                            Acknowledge
                          </Button>
                          <Button size="sm" onClick={() => broadcast(a.id)}>
                            Broadcast
                          </Button>
                        </>
                      )}
                      {a.status === "acknowledged" && (
                        <Button size="sm" onClick={() => broadcast(a.id)}>
                          Broadcast
                        </Button>
                      )}
                    </div>
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
