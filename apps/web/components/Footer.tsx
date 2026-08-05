import Link from "next/link";

const COLUMNS = [
  {
    title: "Platform",
    links: [
      { href: "/map", label: "Live Flood Map" },
      { href: "/risk", label: "Risk Checker" },
      { href: "/forecast", label: "Forecast" },
      { href: "/alerts", label: "Alerts" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/preparedness", label: "Preparedness Guides" },
      { href: "/emergency", label: "Emergency Contacts" },
      { href: "/about", label: "About" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="text-lg font-bold text-cyan-400">🌊 FloodWatch AI</p>
          <p className="mt-3 max-w-md text-sm text-slate-400">
            Autonomous AI-powered flood intelligence and early warning for Africa.
            Predict. Warn. Protect.
          </p>
        </div>
        {COLUMNS.map((column) => (
          <div key={column.title}>
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">{column.title}</p>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-cyan-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-600">
        © 2026 FloodWatch AI. Built with trusted scientific and governmental data.
      </div>
    </footer>
  );
}
