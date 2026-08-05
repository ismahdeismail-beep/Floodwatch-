# @floodwatch/api-client

Typed REST API client for FloodWatch AI, pointed at the API gateway.

```ts
import { createClient } from "@floodwatch/api-client";

const api = createClient({ baseUrl: process.env.NEXT_PUBLIC_API_URL });
const forecast = await api.getForecast(-1.29, 36.82, 5);
const risk = await api.predictFloodRisk({ rainfall_mm_24h: 72, river_level_ratio: 0.85 });
```

Handles: bearer/API-key auth, unified error envelope (`ApiError`), JSON encoding.
