"use client";

import { useState } from "react";
import { PageHeader, Card, Button } from "@floodwatch/ui";

export default function SettingsPage() {
  const [thresholds, setThresholds] = useState({
    watch: "2.0",
    warning: "3.0",
    critical: "4.0",
  });

  const [channels, setChannels] = useState({
    sms: true,
    whatsapp: true,
    push: true,
    email: false,
  });

  const [saved, setSaved] = useState(false);

  const toggleChannel = (key: keyof typeof channels) =>
    setChannels((c) => ({ ...c, [key]: !c[key] }));

  return (
    <>
      <PageHeader
        title="System Settings"
        description="Alert thresholds, notification channels, and platform configuration."
        action={
          <Button
            onClick={() => {
              setSaved(true);
              setTimeout(() => setSaved(false), 2500);
            }}
          >
            {saved ? "Saved ✓" : "Save changes"}
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="River gauge alert thresholds" subtitle="Level (meters) at which each severity triggers">
          <div className="space-y-4">
            {(["watch", "warning", "critical"] as const).map((key) => (
              <label key={key} className="flex items-center justify-between gap-4">
                <span className="text-sm capitalize text-slate-300">{key} level</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={thresholds[key]}
                    onChange={(e) =>
                      setThresholds((t) => ({ ...t, [key]: e.target.value }))
                    }
                    className="w-28 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
                  />
                  <span className="text-sm text-slate-500">m</span>
                </div>
              </label>
            ))}
          </div>
        </Card>

        <Card title="Notification channels" subtitle="Enabled broadcast channels for alert delivery">
          <ul className="space-y-3">
            {(
              [
                ["sms", "SMS (mobile networks)"],
                ["whatsapp", "WhatsApp Business API"],
                ["push", "Mobile app push (FCM)"],
                ["email", "Email digest"],
              ] as const
            ).map(([key, label]) => (
              <li key={key} className="flex items-center justify-between">
                <span className="text-sm text-slate-300">{label}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={channels[key]}
                  onClick={() => toggleChannel(key)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    channels[key] ? "bg-cyan-500" : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                      channels[key] ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Data sources" subtitle="Connected upstream providers">
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span className="text-slate-300">CHIRPS rainfall</span><span className="text-emerald-400">Connected</span></li>
            <li className="flex justify-between"><span className="text-slate-300">ECMWF HRES / CDS</span><span className="text-emerald-400">Connected</span></li>
            <li className="flex justify-between"><span className="text-slate-300">NASA Earthdata (GPM)</span><span className="text-emerald-400">Connected</span></li>
            <li className="flex justify-between"><span className="text-slate-300">Sentinel-1 SAR (Copernicus)</span><span className="text-yellow-400">Degraded</span></li>
            <li className="flex justify-between"><span className="text-slate-300">GloFAS river forecasts</span><span className="text-yellow-400">Not configured</span></li>
          </ul>
        </Card>

        <Card title="Platform" subtitle="Environment & gateway configuration">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-slate-400">Environment</dt><dd className="text-slate-200">Staging</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">API gateway</dt><dd className="font-mono text-slate-200">http://localhost:8000</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Model version</dt><dd className="font-mono text-slate-200">v0.1.0-baseline</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Timezone</dt><dd className="text-slate-200">Africa/Nairobi (EAT)</dd></div>
          </dl>
        </Card>
      </div>
    </>
  );
}
