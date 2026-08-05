import type { Metadata } from "next";
import { Card } from "@floodwatch/ui";

export const metadata: Metadata = {
  title: "About",
  description: "About the FloodWatch AI platform.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-100">About FloodWatch AI</h1>
      <p className="mt-3 text-slate-400">
        FloodWatch AI is an autonomous artificial intelligence platform that predicts floods before they occur by
        continuously collecting and analysing trusted environmental data: weather forecasts, satellite imagery, river
        levels, terrain, population and infrastructure.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card title="Vision">
          <p className="text-sm text-slate-400">
            To become Africa&apos;s leading AI-powered climate intelligence platform that protects lives, infrastructure
            and livelihoods through autonomous flood prediction and early warning.
          </p>
        </Card>
        <Card title="Mission">
          <p className="text-sm text-slate-400">
            Build an intelligent flood prediction ecosystem that continuously collects trusted environmental data,
            predicts flood risks using artificial intelligence, and automatically delivers actionable early warnings.
          </p>
        </Card>
      </div>

      <Card title="How predictions flow" className="mt-6">
        <ol className="space-y-2 text-sm text-slate-400">
          <li>1. Trusted data sources (Kenya Met, ECMWF, NASA, Copernicus, OSM, GloFAS…)</li>
          <li>2. Data collection → validation → cleaning → normalization</li>
          <li>3. Geospatial analysis (terrain, watersheds, floodplains)</li>
          <li>4. AI prediction (probability, depth, duration, extent)</li>
          <li>5. Decision engine (warning levels, recommendations)</li>
          <li>6. Automatic alerts (SMS, WhatsApp, push, email, web)</li>
        </ol>
      </Card>

      <Card title="Future expansion" className="mt-6">
        <p className="text-sm text-slate-400">
          The same architecture is designed to support drought, landslide, heatwave, wildfire and coastal-flood
          intelligence across Africa — a continental climate intelligence platform.
        </p>
      </Card>
    </div>
  );
}
