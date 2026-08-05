/**
 * Typed REST API client for FloodWatch AI.
 * Points at the API gateway (default http://localhost:8000).
 */
import type {
  Alert,
  FloodRiskAssessment,
  WeatherForecast,
  WeatherObservation,
} from "@floodwatch/types";

const DEFAULT_BASE_URL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) || "http://localhost:8000";

export interface ClientOptions {
  baseUrl?: string;
  token?: string;
  apiKey?: string;
  fetchImpl?: typeof fetch;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class FloodWatchClient {
  private readonly baseUrl: string;
  private token?: string;
  private apiKey?: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: ClientOptions = {}) {
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
    this.token = options.token;
    this.apiKey = options.apiKey;
    this.fetchImpl = options.fetchImpl ?? (typeof fetch !== "undefined" ? fetch : (() => { throw new ApiError(0, "FETCH_UNAVAILABLE", "fetch is not available"); }) as typeof fetch);
  }

  setToken(token: string): void {
    this.token = token;
  }

  setApiKey(key: string): void {
    this.apiKey = key;
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init.headers as Record<string, string> | undefined),
    };
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    if (this.apiKey) headers["X-API-Key"] = this.apiKey;

    const response = await this.fetchImpl(`${this.baseUrl}${path}`, { ...init, headers });

    if (!response.ok) {
      let body: unknown = null;
      try {
        body = await response.json();
      } catch {
        /* non-JSON error body */
      }
      const error = (body as { error?: { code?: string; message?: string; details?: Record<string, unknown> } })?.error;
      throw new ApiError(
        response.status,
        error?.code ?? "UNKNOWN_ERROR",
        error?.message ?? `Request failed with status ${response.status}`,
        error?.details,
      );
    }

    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  }

  // ─── Weather ──────────────────────────────────────────────────────

  getCurrentWeather(lat: number, lon: number): Promise<WeatherObservation> {
    return this.request(`/api/v1/weather/current?lat=${lat}&lon=${lon}`);
  }

  getForecast(lat: number, lon: number, days = 5): Promise<WeatherForecast> {
    return this.request(`/api/v1/weather/forecast?lat=${lat}&lon=${lon}&days=${days}`);
  }

  // ─── Flood risk ───────────────────────────────────────────────────

  predictFloodRisk(features: Record<string, unknown>): Promise<FloodRiskAssessment> {
    return this.request("/api/v1/ai/predict/flood-risk", {
      method: "POST",
      body: JSON.stringify(features),
    });
  }

  // ─── Alerts ───────────────────────────────────────────────────────

  getAlerts(limit = 50): Promise<Alert[]> {
    return this.request(`/api/v1/alerts/sent?limit=${limit}`);
  }

  // ─── GIS ──────────────────────────────────────────────────────────

  getCommunities(): Promise<GeoJSON.FeatureCollection> {
    return this.request("/api/v1/gis/communities");
  }

  getNearestFacilities(lat: number, lon: number, types = "hospital,school,shelter") {
    return this.request(`/api/v1/gis/nearest-facilities?lat=${lat}&lon=${lon}&types=${types}`);
  }

  // ─── Auth ─────────────────────────────────────────────────────────

  async login(email: string, password: string): Promise<{ access_token: string; refresh_token: string }> {
    const response = await this.request<{ access_token: string; refresh_token: string }>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    this.token = response.access_token;
    return response;
  }
}

export function createClient(options?: ClientOptions): FloodWatchClient {
  return new FloodWatchClient(options);
}
