# @floodwatch/mobile

Community mobile app for FloodWatch AI — built with Expo (React Native) and
expo-router. Delivers personalized flood risk, push alerts (via FCM), shelter
locations, and emergency guidance to the public.

## Tabs

| Tab | Purpose |
|-----|---------|
| Home | Personalized risk summary for the user's location |
| Map | Live flood risk map (react-native-maps) |
| Alerts | Push and in-app alert feed |
| Shelters | Nearest evacuation shelters |
| Settings | Location, notifications, language, about |

## Development

```bash
npm install                                # from repo root (workspaces)
npm run start --workspace=@floodwatch/mobile
```

Then scan the QR with Expo Go, or press `a` for Android / `i` for iOS.
The `metro.config.js` is pre-configured for the npm-workspaces monorepo.

> **Note:** the shared `@floodwatch/ui` package is Tailwind/React-DOM based and
> intentionally NOT used here. Shared types (`@floodwatch/types`), utilities
> (`@floodwatch/utils`), and the API client (`@floodwatch/api-client`) are all
> framework-agnostic and safe for React Native.
