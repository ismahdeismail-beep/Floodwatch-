"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_SECTIONS = [
  {
    label: "Platform",
    items: [{ href: "/", label: "Health", icon: "❤" }],
  },
  {
    label: "Access",
    items: [
      { href: "/users", label: "Users", icon: "☻" },
      { href: "/roles", label: "Roles & Permissions", icon: "⚿" },
      { href: "/api-keys", label: "API Keys", icon: "⌁" },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { href: "/models", label: "AI Models", icon: "✦" },
      { href: "/data-sources", label: "Data Sources", icon: "⇅" },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/logs", label: "Logs", icon: "≡" },
      { href: "/backups", label: "Backups", icon: "⤓" },
      { href: "/settings", label: "Settings", icon: "⚙" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-slate-800 bg-slate-900/60">
      <div className="flex h-16 items-center gap-2 border-b border-slate-800 px-5">
        <span aria-hidden className="text-xl">
          🌊
        </span>
        <div className="leading-tight">
          <div className="text-sm font-bold text-cyan-400">FloodWatch AI</div>
          <div className="text-[10px] uppercase tracking-widest text-slate-500">
            Admin Console
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              {section.label}
            </div>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const active =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={
                        active
                          ? "flex items-center gap-3 rounded-lg bg-cyan-500/10 px-3 py-2 text-sm font-semibold text-cyan-400 transition-colors"
                          : "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-slate-100"
                      }
                    >
                      <span aria-hidden className="w-4 text-center">
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/20 text-sm font-bold text-cyan-400">
            PA
          </div>
          <div className="leading-tight">
            <div className="text-sm font-medium text-slate-200">Platform Admin</div>
            <div className="text-[11px] text-slate-500">ops@floodwatch.ai</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
