import type { Metadata } from "next";
import { Card } from "@floodwatch/ui";

export const metadata: Metadata = {
  title: "Forecast",
  description: "Multi-day weather and flood forecast.",
};

const DAYS = [
  { day: "Today", rain: "42 mm", risk: "Moderate", note: "Scattered thunderstorms over highlands" },
  { day: "Tomorrow", rain: "78 mm", risk: "High", note: "Persistent heavy rainfall; rivers rising" },
  { day: "Day 3", rain: "35 mm", risk: "Moderate", note: "Rain easing but soils saturated" },
  { day: "Day 4", rain: "8 mm", risk: "Low", note: "Clearing conditions" },
  { day: "Day 5", rain: "2 mm", risk: "Low", note: "Dry and sunny" },
];

export default function ForecastPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-100">Flood Forecast</h1>
      <p className="mt-1 text-sm text-slate-400">
        Five-day outlook combining weather, hydrology and AI flood models. Demo values shown.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {DAYS.map((item) => (
          <Card key={item.day}>
            <p className="text-sm font-semibold text-slate-200">{item.day}</p>
            <p className="mt-2 text-2xl font-bold text-cyan-400">{item.rain}</p>
            <p className={`mt-1 text-xs font-medium ${item.risk === "High" ? "text-orange-400" : item.risk === "Moderate" ? "text-yellow-400" : "text-emerald-400"}`}>
              {item.risk} risk
            </p>
            <p className="mt-2 text-xs text-slate-500">{item.note}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
