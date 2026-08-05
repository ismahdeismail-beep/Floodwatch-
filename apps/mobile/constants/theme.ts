export const Colors = {
  background: "#020617",
  surface: "#0f172a",
  surfaceAlt: "#1e293b",
  border: "#1e293b",
  text: "#e2e8f0",
  textMuted: "#64748b",
  brand: "#06b6d4",
  brandSoft: "#22d3ee",
  success: "#34d399",
  warning: "#fbbf24",
  danger: "#f87171",
  info: "#38bdf8",
  white: "#ffffff",
} as const;

export const RiskColors: Record<string, string> = {
  low: "#22c55e",
  moderate: "#eab308",
  high: "#f97316",
  extreme: "#ef4444",
};

export const SeverityColors: Record<string, string> = {
  info: "#38bdf8",
  watch: "#fbbf24",
  warning: "#fb923c",
  critical: "#ef4444",
};
