import { PageHeader, Card, Badge, Button } from "@floodwatch/ui";

interface ModelEntry {
  id: string;
  task: string;
  version: string;
  status: "staging" | "production" | "deprecated";
  precision: string;
  recall: string;
  trainedAt: string;
}

const MODELS: ModelEntry[] = [
  { id: "flood-risk-ensemble", task: "Flood risk probability (0–1)", version: "v1.2.0", status: "production", precision: "0.87", recall: "0.82", trainedAt: "2026-07-20" },
  { id: "precip-nowcast", task: "Short-range precipitation nowcast", version: "v2.0.1", status: "production", precision: "0.91", recall: "0.86", trainedAt: "2026-07-15" },
  { id: "inundation-sar", task: "Sentinel-1 inundation classification", version: "v0.9.3", status: "staging", precision: "0.79", recall: "0.74", trainedAt: "2026-07-28" },
  { id: "leadtime-regressor", task: "Warning lead-time regression", version: "v0.4.0", status: "staging", precision: "—", recall: "—", trainedAt: "2026-07-05" },
  { id: "baseline-v0.1", task: "Deterministic sigmoid baseline", version: "v0.1.0", status: "deprecated", precision: "0.61", recall: "0.55", trainedAt: "2026-05-01" },
];

const STATUS_TONE = {
  staging: "info",
  production: "success",
  deprecated: "default",
} as const;

export default function ModelsPage() {
  return (
    <>
      <PageHeader
        title="AI Model Registry"
        description="Model lifecycle managed via the MLflow registry. The AI service serves the promoted production version."
        action={<Button>Register model</Button>}
      />

      <Card title="Registered models">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                <th className="py-3 pr-4">Model</th>
                <th className="py-3 pr-4">Task</th>
                <th className="py-3 pr-4">Version</th>
                <th className="py-3 pr-4">Precision</th>
                <th className="py-3 pr-4">Recall</th>
                <th className="py-3 pr-4">Trained</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {MODELS.map((m) => (
                <tr key={`${m.id}-${m.version}`} className="border-b border-slate-800/60 last:border-0">
                  <td className="py-3 pr-4 font-mono text-sm text-cyan-400">{m.id}</td>
                  <td className="py-3 pr-4 text-slate-300">{m.task}</td>
                  <td className="py-3 pr-4 font-mono text-xs text-slate-400">{m.version}</td>
                  <td className="py-3 pr-4 font-mono text-xs text-slate-300">{m.precision}</td>
                  <td className="py-3 pr-4 font-mono text-xs text-slate-300">{m.recall}</td>
                  <td className="py-3 pr-4 text-slate-400">{m.trainedAt}</td>
                  <td className="py-3">
                    <Badge tone={STATUS_TONE[m.status]}>{m.status}</Badge>
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
