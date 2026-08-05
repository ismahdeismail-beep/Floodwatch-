import { PageHeader, Card, Badge } from "@floodwatch/ui";

interface Asset {
  id: string;
  name: string;
  type: "road" | "bridge" | "hospital" | "school" | "shelter" | "facility";
  county: string;
  status: "open" | "at-risk" | "closed" | "unknown";
  floodExposure: "low" | "moderate" | "high";
}

const ASSETS: Asset[] = [
  { id: "AST-2201", name: "Garsen–Lamu Road (B8)", type: "road", county: "Tana River", status: "at-risk", floodExposure: "high" },
  { id: "AST-2202", name: "Garissa Bridge (Tana)", type: "bridge", county: "Garissa", status: "at-risk", floodExposure: "high" },
  { id: "AST-2203", name: "County Referral Hospital — Garsen", type: "hospital", county: "Tana River", status: "open", floodExposure: "moderate" },
  { id: "AST-2204", name: "Mathare Primary School", type: "school", county: "Nairobi", status: "closed", floodExposure: "high" },
  { id: "AST-2205", name: "Kisumu Emergency Shelter 02", type: "shelter", county: "Kisumu", status: "open", floodExposure: "low" },
  { id: "AST-2206", name: "Nzoia River Crossing", type: "bridge", county: "Kakamega", status: "open", floodExposure: "moderate" },
  { id: "AST-2207", name: "Isiolo–Modogashe Road (A15)", type: "road", county: "Isiolo", status: "unknown", floodExposure: "low" },
];

const STATUS_TONE = {
  open: "success",
  "at-risk": "warning",
  closed: "danger",
  unknown: "default",
} as const;

const EXPOSURE_TONE = {
  low: "success",
  moderate: "warning",
  high: "danger",
} as const;

export default function InfrastructurePage() {
  return (
    <>
      <PageHeader
        title="Infrastructure Registry"
        description="Critical assets and their exposure to flood hazard. Sources: OpenStreetMap overlays and county asset registers."
        action={<Badge tone="info">7,412 assets registered</Badge>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Assets at risk" subtitle="High flood exposure"><p className="text-3xl font-bold text-orange-400">214</p></Card>
        <Card title="Closed / disrupted" subtitle="Current status"><p className="text-3xl font-bold text-red-400">38</p></Card>
        <Card title="Shelters available" subtitle="Evacuation capacity"><p className="text-3xl font-bold text-emerald-400">142</p></Card>
      </div>

      <Card title="Featured assets" className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                <th className="py-3 pr-4">Asset</th>
                <th className="py-3 pr-4">Type</th>
                <th className="py-3 pr-4">County</th>
                <th className="py-3 pr-4">Flood exposure</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {ASSETS.map((a) => (
                <tr key={a.id} className="border-b border-slate-800/60 last:border-0">
                  <td className="py-3 pr-4 font-medium text-slate-100">
                    {a.name}
                    <span className="ml-2 font-mono text-xs text-slate-600">{a.id}</span>
                  </td>
                  <td className="py-3 pr-4 capitalize text-slate-300">{a.type}</td>
                  <td className="py-3 pr-4 text-slate-300">{a.county}</td>
                  <td className="py-3 pr-4">
                    <Badge tone={EXPOSURE_TONE[a.floodExposure]}>{a.floodExposure}</Badge>
                  </td>
                  <td className="py-3">
                    <Badge tone={STATUS_TONE[a.status]}>{a.status}</Badge>
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
