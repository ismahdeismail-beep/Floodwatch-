"use client";

import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, string> = {
  "/": "Command Center",
  "/live-monitoring": "Live Monitoring",
  "/alerts": "Alert Management",
  "/counties": "County Risk Posture",
  "/infrastructure": "Infrastructure Registry",
  "/analytics": "Analytics",
  "/reports": "Reports",
  "/users": "Users & Roles",
  "/settings": "System Settings",
};

export function Topbar() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Dashboard";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 backdrop-blur">
      <div>
        <h1 className="text-lg font-semibold text-slate-100">{title}</h1>
        <p className="text-xs text-slate-500">
          Kenya National Flood Operations — live feed
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 sm:flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          Gateway connected
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 text-slate-300">
          <span aria-hidden>🔔</span>
        </div>
      </div>
    </header>
  );
}
