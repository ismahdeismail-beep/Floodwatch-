import type { Metadata } from "next";
import { Card } from "@floodwatch/ui";

export const metadata: Metadata = {
  title: "Weather",
  description: "Current weather conditions aggregated from trusted providers.",
};

const STATIONS = [
  { name: "Nairobi (Dagoretti)", temp: "21°C", humidity: "68%", wind: "14 km/h", rain: "0.2 mm/h" },
  { name: "Garissa", temp: "33°C", humidity: "55%", wind: "18 km/h", rain: "0.0 mm/h" },
  { name: "Kisumu", temp: "24°C", humidity: "74%", wind: "9 km/h", rain: "1.4 mm/h" },
  { name: "Mombasa", temp: "29°C", humidity: "80%", wind: "22 km/h", rain: "0.6 mm/h" },
];

export default function WeatherPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-100">Weather Intelligence</h1>
      <p className="mt-1 text-sm text-slate-400">
        Aggregated from Kenya Meteorological Department, ECMWF, NOAA, OpenWeather and Meteostat. Demo values shown.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STATIONS.map((station) => (
          <Card key={station.name} title={station.name}>
            <p className="text-3xl font-bold text-cyan-400">{station.temp}</p>
            <dl className="mt-3 space-y-1 text-sm text-slate-400">
              <div className="flex justify-between"><dt>Humidity</dt><dd>{station.humidity}</dd></div>
              <div className="flex justify-between"><dt>Wind</dt><dd>{station.wind}</dd></div>
              <div className="flex justify-between"><dt>Rain</dt><dd>{station.rain}</dd></div>
            </dl>
          </Card>
        ))}
      </div>
    </div>
  );
}
