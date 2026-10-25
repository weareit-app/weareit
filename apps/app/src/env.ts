import { type AppEnv, type AppEnvInput, parseAppEnv } from "./app-env-schema";

// The app's public variables (docs/architecture/decisions.md, #171). This is
// the only app file that reads them. Expo inlines `process.env.EXPO_PUBLIC_X`
// only when written out by name, not through destructuring or
// `process.env[name]` (docs.expo.dev "Environment variables in Expo", checked
// 2026-10-25), so `source` lists each one, and `satisfies` keeps the list in
// step with the schema. Inlined values are plain text in the bundle, so none
// may hold a secret. `app.config.ts` imports this file, so every Expo command
// fails on a bad value.

// Expo inlines each value as a string, or leaves it undefined. Without the
// expo-env.d.ts that `expo start` generates (as in CI), `process.env` is typed
// `any`, so this says what the value is.
function text(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

const source = {
  EXPO_PUBLIC_API_URL: text(process.env.EXPO_PUBLIC_API_URL),
  EXPO_PUBLIC_REVENUECAT_IOS_API_KEY: text(
    process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY,
  ),
} satisfies Record<keyof AppEnvInput, string | undefined>;

export const appEnv: AppEnv = parseAppEnv(source);
