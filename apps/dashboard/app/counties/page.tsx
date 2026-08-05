import { PageHeader, Card, RiskBadge } from "@floodwatch/ui";

interface CountyRow {
  name: string;
  code: string;
  population: string;
  risk: "low" | "moderate" | "high" | "extreme";
  alerts: number;
  gauges: number;
  vulnerableAssets: number;
}

const COUNTIES: CountyRow[] = [
  { name: "Tana River", code: "22", population: "315k", risk: "extreme", alerts: 6, gauges: 9, vulnerableAssets: 41 },
  { name: "Garissa", code: "12", population: "840k", risk: "high", alerts: 4, gauges: 7, vulnerableAssets: 28 },
  { name: "Kisumu", code: "20", population: "1.2M", risk: "high", alerts: 3, gauges: 11, vulnerableAssets: 36 },
  { name: "Kakamega", code: "09", population: "1.9M", risk: "moderate", alerts: 2, gauges: 8, vulnerableAssets: 22 },
  { name: "Nairobi", code: "01", population: "4.4M", risk: "moderate", alerts: 3, gauges: 14, vulnerableAssets: 47 },
  { name: "Mombasa", code: "02", population: "1.2M", risk: "moderate", alerts: 2, gauges: 6, vulnerableAssets: 31 },
  { name: "Isiolo", code: "11", population: "268k", risk: "low", alerts: 1, gauges: 4, vulnerableAssets: 9 },
  { name: "Uasin Gishu", code: "30", population: "1.2M", risk: "low", alerts: 1, gauges: 5, vulnerableAssets: 11 },
];

export default function CountiesPage() {
  return (
    <>
      <PageHeader
        title="County Risk Posture"
        description="Aggregated risk, alert activity, and vulnerability per county for the current forecast window."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Extreme risk" subtitle="Counties"><p className="text-3xl font-bold text-red-400">1</p></Card>
        <Card title="High risk" subtitle="Counties"><p className="text-3xl font-bold text-orange-400">2</p></Card>
        <Card title="Moderate risk" subtitle="Counties"><p className="text-3xl font-bold text-yellow-400">3</p></Card>
        <Card title="Low risk" subtitle="Counties"><p className="text-3xl font-bold text-emerald-400">2</p></Card>
      </div>

      <Card title="All counties" className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                <th className="py-3 pr-4">County</th>
                <th className="py-3 pr-4">Code</th>
                <th className="py-3 pr-4">Population</th>
                <th className="py-3 pr-4">Risk</th>
                <th className="py-3 pr-4">Active alerts</th>
                <th className="py-3 pr-4">Gauges</th>
                <th className="py-3">Vulnerable assets</th>
              </tr>
            </thead>
            <tbody>
              {COUNTIES.map((c) => (
                <tr key={c.code} className="border-b border-slate-800/60 last:border-0">
                  <td className="py-3 pr-4 font-medium text-slate-100">{c.name}</td>
                  <td className="py-3 pr-4 font-mono text-xs text-slate-500">{c.code}</td>
                  <td className="py-3 pr-4 text-slate-300">{c.population}</td>
                  <td className="py-3 pr-4"><RiskBadge level={c.risk} /></td>
                  <td className="py-3 pr-4 text-slate-300">{c.alerts}</td>
                  <td className="py-3 pr-4 text-slate-300">{c.gauges}</td>
                  <td className="py-3 text-slate-300">{c.vulnerableAssets}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
