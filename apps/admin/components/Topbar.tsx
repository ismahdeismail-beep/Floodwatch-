"use client";

import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, string> = {
  "/": "Platform Health",
  "/users": "Platform Users",
  "/roles": "Roles & Permissions",
  "/api-keys": "API Keys",
  "/models": "AI Model Registry",
  "/data-sources": "Data Sources",
  "/logs": "System Logs",
  "/backups": "Backups",
  "/settings": "Platform Settings",
};

export function Topbar() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Admin";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 backdrop-blur">
      <div>
        <h1 className="text-lg font-semibold text-slate-100">{title}</h1>
        <p className="text-xs text-slate-500">FloodWatch AI control plane</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400 sm:flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
          Staging · v0.1.0
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 text-slate-300">
          <span aria-hidden>☰</span>
        </div>
      </div>
    </header>
  );
}
