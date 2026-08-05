import Link from "next/link";
import { Button, Card } from "@floodwatch/ui";

const FEATURES = [
  {
    title: "AI Flood Prediction",
    description: "Flood probability, depth, duration and extent predicted by ensemble ML models before water rises.",
  },
  {
    title: "Live Flood Risk Maps",
    description: "Interactive maps with flood probability, expected depth, extent and safe routes.",
  },
  {
    title: "Weather Intelligence",
    description: "Continuously aggregated forecasts from Kenya Met, ECMWF, NOAA, OpenWeather and Meteostat.",
  },
  {
    title: "Hydrological Monitoring",
    description: "River gauges, watersheds, drainage systems, soil moisture and runoff in near real time.",
  },
  {
    title: "Satellite Intelligence",
    description: "Automatic analysis of Sentinel/Landsat/MODIS imagery to detect water accumulation and flood progression.",
  },
  {
    title: "Smart Alert System",
    description: "Automatic warnings via SMS, WhatsApp, push, email and browser notifications.",
  },
];

const DATA_SOURCES = [
  "Kenya Met Department",
  "ECMWF",
  "NOAA",
  "NASA GPM / IMERG",
  "CHIRPS",
  "Sentinel-1/2",
  "Landsat",
  "Copernicus",
  "GloFAS",
  "OpenStreetMap",
  "WorldPop",
  "SRTM / Copernicus DEM",
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-800">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.15),transparent_60%)]"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-24 text-center sm:px-6">
          <p className="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1 text-xs font-medium text-cyan-300">
            Autonomous AI Flood Intelligence for Africa
          </p>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-slate-100 sm:text-6xl">
            Predict. <span className="text-cyan-400">Warn.</span> Protect.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            FloodWatch AI continuously transforms weather forecasts, satellite imagery, river data and terrain into
            localized flood predictions — before floods occur.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/risk">
              <Button size="lg">Check My Flood Risk</Button>
            </Link>
            <Link href="/map">
              <Button size="lg" variant="secondary">
                View Live Map
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-slate-100">Beyond a Weather App</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-400">
          Traditional systems broadcast rainfall forecasts. FloodWatch AI answers: will my neighborhood flood, when,
          how severe, and what should I do?
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Card title="Traditional Systems" subtitle="People interpret the warning">
            <ol className="space-y-2 text-sm text-slate-400">
              <li>1. Weather forecast</li>
              <li>2. “Heavy rain expected”</li>
              <li>3. Public warning broadcast</li>
              <li>4. People interpret the warning</li>
            </ol>
          </Card>
          <Card title="FloodWatch AI" subtitle="Machines interpret — people act">
            <ol className="space-y-2 text-sm text-slate-400">
              <li>1. Weather + satellite + river + terrain data</li>
              <li>2. AI flood prediction</li>
              <li>3. Risk analysis & decision engine</li>
              <li>4. Automatic community alerts</li>
            </ol>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-slate-800 bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-slate-100">Key Features</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <Card key={feature.title}>
                <h3 className="text-base font-semibold text-cyan-400">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Data sources */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-slate-100">Trusted Data Sources</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-400">
          Every prediction is built on trusted scientific and governmental data.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {DATA_SOURCES.map((source) => (
            <span
              key={source}
              className="rounded-full border border-slate-700 bg-slate-900 px-4 py-1.5 text-sm text-slate-300"
            >
              {source}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-slate-100">Protect your community</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            Check the risk where you live, follow preparedness guides, and act early when warnings are issued.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/preparedness">
              <Button size="lg">Preparedness Guides</Button>
            </Link>
            <Link href="/emergency">
              <Button size="lg" variant="secondary">
                Emergency Contacts
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
