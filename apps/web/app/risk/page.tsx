"use client";

import { useState } from "react";
import { Button, Card, RiskBadge } from "@floodwatch/ui";
import { formatNumber, riskLevelFromScore } from "@floodwatch/utils";
import type { FloodRiskAssessment } from "@floodwatch/types";

const COUNTIES = ["Garissa", "Busia", "Nairobi", "Kakamega", "Lamu", "Kisumu", "Homa Bay", "Kwale", "Migori"];

function mockAssessment(county: string, ward: string): FloodRiskAssessment {
  // Deterministic demo — replace with api.predictFloodRisk() when the gateway is live.
  const seed = (county + ward).split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const score = (seed % 100) / 100;
  const riskLevel = riskLevelFromScore(score);
  const now = new Date();
  const validUntil = new Date(now.getTime() + 6 * 3600 * 1000);
  return {
    probability: score,
    riskLevel,
    expectedDepthM: Math.round(score * 2.8 * 100) / 100,
    durationHours: Math.round(6 + score * 42),
    extentKm2: Math.round(score * score * 18 * 100) / 100,
    confidence: Math.min(0.98, Math.round((0.55 + score * 0.4) * 1000) / 1000),
    modelVersion: "v0.1-baseline",
    featureImportance: { rainfall_24h: 0.25, river_level: 0.3, rainfall_72h: 0.15, soil_moisture: 0.1, terrain: 0.1, upstream: 0.1 },
    generatedAt: now.toISOString(),
    validUntil: validUntil.toISOString(),
  };
}

export default function RiskPage() {
  const [county, setCounty] = useState("");
  const [ward, setWard] = useState("");
  const [result, setResult] = useState<FloodRiskAssessment | null>(null);

  const check = (event: React.FormEvent) => {
    event.preventDefault();
    setResult(mockAssessment(county, ward || county));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-100">Flood Risk Checker</h1>
      <p className="mt-1 text-sm text-slate-400">
        Find out how likely your location is to flood and what to expect.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card title="Your location">
          <form onSubmit={check} className="space-y-4">
            <label className="block">
              <span className="text-sm text-slate-400">County</span>
              <select
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="">Select county</option>
                {COUNTIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm text-slate-400">Ward / town (optional)</span>
              <input
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                placeholder="e.g. Township"
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </label>
            <Button type="submit" className="w-full">
              Check Risk
            </Button>
          </form>
        </Card>

        {result ? (
          <Card title="Risk assessment" subtitle={`Model ${result.modelVersion}`}>
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">Risk level</p>
              <RiskBadge level={result.riskLevel} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-950/60 p-4">
                <p className="text-xs text-slate-500">Flood probability</p>
                <p className="mt-1 text-2xl font-bold text-cyan-400">{Math.round(result.probability * 100)}%</p>
              </div>
              <div className="rounded-xl bg-slate-950/60 p-4">
                <p className="text-xs text-slate-500">Expected depth</p>
                <p className="mt-1 text-2xl font-bold text-cyan-400">{result.expectedDepthM.toFixed(1)} m</p>
              </div>
              <div className="rounded-xl bg-slate-950/60 p-4">
                <p className="text-xs text-slate-500">Duration</p>
                <p className="mt-1 text-2xl font-bold text-cyan-400">{result.durationHours} h</p>
              </div>
              <div className="rounded-xl bg-slate-950/60 p-4">
                <p className="text-xs text-slate-500">Extent</p>
                <p className="mt-1 text-2xl font-bold text-cyan-400">{result.extentKm2.toFixed(1)} km²</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Confidence {Math.round(result.confidence * 100)}% · Valid until {result.validUntil.slice(0, 16).replace("T", " ")}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Populated area at risk: ~{formatNumber(Math.round(result.probability * 120000))} people (demo estimate)
            </p>
          </Card>
        ) : (
          <Card title="How to read the result">
            <ul className="space-y-3 text-sm text-slate-400">
              <li>• <strong className="text-slate-200">Probability</strong> — likelihood of flooding in the next 48 hours.</li>
              <li>• <strong className="text-slate-200">Depth</strong> — expected maximum water depth.</li>
              <li>• <strong className="text-slate-200">Duration</strong> — how long flooding may persist.</li>
              <li>• <strong className="text-slate-200">Confidence</strong> — model certainty from feature importance.</li>
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
}
