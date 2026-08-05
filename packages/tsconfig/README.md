# @floodwatch/tsconfig

Shared TypeScript configurations for FloodWatch AI.

| Config | Use for |
|--------|---------|
| `base.json` | All TypeScript packages |
| `nextjs.json` | Next.js apps (`apps/web`, `apps/dashboard`, `apps/admin`) |
| `react-native.json` | Expo app (`apps/mobile`) |

```json
{ "extends": "@floodwatch/tsconfig/nextjs.json" }
```
