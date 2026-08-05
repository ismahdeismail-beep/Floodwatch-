/**
 * Shared React UI components for FloodWatch AI.
 * Tailwind-powered, dark-theme friendly, zero runtime dependencies.
 */
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import type { AlertSeverity, RiskLevel } from "@floodwatch/types";
import { RISK_STYLES, SEVERITY_STYLES } from "@floodwatch/utils";

// ─── Button ───────────────────────────────────────────────────────────

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
}

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold",
  secondary: "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700",
  ghost: "bg-transparent hover:bg-slate-800/60 text-slate-300",
  danger: "bg-red-600 hover:bg-red-500 text-white font-semibold",
};

const BUTTON_SIZES: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2 text-sm rounded-lg",
  lg: "px-6 py-3 text-base rounded-xl",
};

export function Button({ variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]} ${className}`}
      {...props}
    />
  );
}

// ─── Card ─────────────────────────────────────────────────────────────

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

export function Card({ title, subtitle, action, className = "", children, ...props }: CardProps) {
  return (
    <section className={`rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur ${className}`} {...props}>
      {(title || action) && (
        <header className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title && <h3 className="text-base font-semibold text-slate-100">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-sm text-slate-400">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

// ─── Badge / StatusPill ───────────────────────────────────────────────

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "default" | "success" | "warning" | "danger" | "info";
}

const BADGE_TONES: Record<NonNullable<BadgeProps["tone"]>, string> = {
  default: "bg-slate-800 text-slate-300 border-slate-700",
  success: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  warning: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  danger: "bg-red-500/15 text-red-300 border-red-500/30",
  info: "bg-sky-500/15 text-sky-300 border-sky-500/30",
};

export function Badge({ tone = "default", className = "", children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${BADGE_TONES[tone]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  return (
    <Badge className={SEVERITY_STYLES[severity]}>{severity.toUpperCase()}</Badge>
  );
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  return <Badge className={RISK_STYLES[level]}>{level.toUpperCase()}</Badge>;
}

// ─── Spinner ──────────────────────────────────────────────────────────

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      aria-label="Loading"
      className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-600 border-t-cyan-400 ${className}`}
    />
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────

export interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "success" | "warning" | "danger";
}

export function StatCard({ label, value, hint, tone = "default" }: StatCardProps) {
  const accent =
    tone === "danger" ? "text-red-400" : tone === "warning" ? "text-yellow-400" : tone === "success" ? "text-emerald-400" : "text-cyan-400";
  return (
    <Card>
      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${accent}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </Card>
  );
}

// ─── PageHeader ───────────────────────────────────────────────────────

export interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-slate-400">{description}</p>}
      </div>
      {action}
    </div>
  );
}
