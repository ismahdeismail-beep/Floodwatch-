/**
 * Shared utilities for FloodWatch AI: formatting, geo math and risk mapping.
 */
import type { AlertSeverity, RiskLevel } from "@floodwatch/types";

// ─── Dates ────────────────────────────────────────────────────────────

/** Format an ISO date string as a human-readable local date. */
export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions): string {
  return new Date(iso).toLocaleDateString(undefined, opts ?? { day: "numeric", month: "short", year: "numeric" });
}

/** Format an ISO date string as a local date + time. */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Relative time such as "2h ago" from an ISO timestamp. */
export function timeAgo(iso: string): string {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// ─── Numbers ──────────────────────────────────────────────────────────

/** Format a number with thousands separators. */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value);
}

/** Format a probability (0–1) as a percentage. */
export function formatPercent(probability: number): string {
  return `${Math.round(probability * 100)}%`;
}

// ─── Geo ──────────────────────────────────────────────────────────────

/** Haversine distance in kilometres between two coordinates. */
export function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const r = 6371;
  const toRad = (deg: number): number => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * r * Math.asin(Math.sqrt(a));
}

// ─── Risk mapping ─────────────────────────────────────────────────────

/** Map a raw risk score (0–1) to a RiskLevel. */
export function riskLevelFromScore(score: number): RiskLevel {
  if (score >= 0.8) return "extreme";
  if (score >= 0.6) return "high";
  if (score >= 0.35) return "moderate";
  return "low";
}

/** Tailwind classes for severity badges. */
export const SEVERITY_STYLES: Record<AlertSeverity, string> = {
  info: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  watch: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  warning: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  critical: "bg-red-500/15 text-red-300 border-red-500/30",
};

/** Tailwind classes for risk levels. */
export const RISK_STYLES: Record<RiskLevel, string> = {
  low: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  moderate: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  high: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  extreme: "bg-red-500/15 text-red-300 border-red-500/30",
};

/** Short helper to keep the display name of a risk level. */
export function riskLabel(level: RiskLevel): string {
  return level.charAt(0).toUpperCase() + level.slice(1);
}

// ─── Misc ─────────────────────────────────────────────────────────────

/** Truncate a string to a maximum length with an ellipsis. */
export function truncate(value: string, max = 120): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

/** Promise-based sleep. */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
