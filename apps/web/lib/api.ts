import { createClient } from "@floodwatch/api-client";

/**
 * Shared typed API client for the public web app.
 * Base URL defaults to http://localhost:8000 (override via NEXT_PUBLIC_API_URL).
 */
export const api = createClient();
