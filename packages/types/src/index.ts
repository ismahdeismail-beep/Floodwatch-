/**
 * Shared domain types for FloodWatch AI.
 * These types are consumed by the web app, dashboard, admin app,
 * mobile app, and the API client so that one source of truth exists
 * across every TypeScript surface.
 */

// ─── Geo ──────────────────────────────────────────────────────────────

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface BoundingBox {
  minLat: number;
  minLon: number;
  maxLat: number;
  maxLon: number;
}

export interface GeoJsonGeometry {
  type: "Point" | "LineString" | "Polygon" | "MultiPolygon";
  coordinates: unknown;
}

export interface GeoJsonFeature<TProperties = Record<string, unknown>> {
  type: "Feature";
  geometry: GeoJsonGeometry;
  properties: TProperties;
}

export interface GeoJsonFeatureCollection<TProperties = Record<string, unknown>> {
  type: "FeatureCollection";
  features: GeoJsonFeature<TProperties>[];
}

// ─── Alerts ───────────────────────────────────────────────────────────

export type AlertSeverity = "info" | "watch" | "warning" | "critical";

export type AlertChannel = "sms" | "whatsapp" | "push" | "email" | "web" | "webhook";

export interface Alert {
  id: string;
  title: string;
  body: string;
  severity: AlertSeverity;
  county?: string;
  ward?: string;
  channels: AlertChannel[];
  sentAt: string;
  expiresAt?: string;
}

// ─── Risk ─────────────────────────────────────────────────────────────

export type RiskLevel = "low" | "moderate" | "high" | "extreme";

export interface FloodRiskAssessment {
  probability: number;
  riskLevel: RiskLevel;
  expectedDepthM: number;
  durationHours: number;
  extentKm2: number;
  confidence: number;
  modelVersion: string;
  featureImportance: Record<string, number>;
  generatedAt: string;
  validUntil: string;
}

// ─── Weather & hydrology ──────────────────────────────────────────────

export interface WeatherObservation {
  lat: number;
  lon: number;
  temperatureC: number;
  humidityPct: number;
  windSpeedKmh: number;
  precipitationMmH: number;
  cloudCoverPct: number;
  observedAt: string;
  source: string;
}

export interface ForecastDay {
  date: string;
  precipMm: number;
  precipProbabilityPct: number;
  tMinC: number;
  tMaxC: number;
  windSpeedKmh: number;
}

export interface WeatherForecast {
  lat: number;
  lon: number;
  generatedAt: string;
  days: ForecastDay[];
}

export type GaugeStatus = "normal" | "watch" | "warning" | "critical";

export interface RiverGaugeReading {
  gaugeId: string;
  levelM: number;
  flowM3S: number;
  status: GaugeStatus;
  recordedAt: string;
}

// ─── Communities & infrastructure ─────────────────────────────────────

export interface Community {
  id: string;
  name: string;
  county: string;
  ward: string;
  population: number;
  coordinates: Coordinates;
  riskLevel: RiskLevel;
}

export type InfrastructureType = "road" | "bridge" | "hospital" | "school" | "shelter" | "building" | "facility";

export interface InfrastructureAsset {
  id: string;
  name: string;
  type: InfrastructureType;
  county: string;
  coordinates: Coordinates;
  status: "open" | "at-risk" | "closed" | "unknown";
}

// ─── Platform ─────────────────────────────────────────────────────────

export type UserRole = "admin" | "operator" | "analyst" | "viewer";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface Organization {
  id: string;
  name: string;
  type: "government" | "ngo" | "business" | "research" | "media";
  country: string;
}

// ─── API envelope ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  meta?: {
    generatedAt: string;
    modelVersion?: string;
  };
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

// ─── AI models ────────────────────────────────────────────────────────

export interface ModelInfo {
  id: string;
  version: string;
  task: string;
  metrics?: Record<string, number>;
  status: string;
}

export interface ModelPrediction {
  modelVersion: string;
  probability: number;
  confidence: number;
  featureImportance: Record<string, number>;
  generatedAt: string;
}
