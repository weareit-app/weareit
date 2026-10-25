import { z } from "zod";

// The app's public variables (docs/architecture/decisions.md, #171). This is
// the only app file that reads them. Expo inlines `process.env.EXPO_PUBLIC_X`
// only when written out by name, not through destructuring or
// `process.env[name]` (docs.expo.dev "Environment variables in Expo", checked
// 2026-10-25), so `source` lists each one, and `satisfies` keeps the list in
// step with the schema. Inlined values are plain text in the bundle, so none
// may hold a secret. `app.config.ts` imports this file, so every Expo command
// fails on a bad value.

export const appEnvSchema = z.object({
  EXPO_PUBLIC_API_URL: z.url({
    protocol: /^https?$/,
    error: (issue) =>
      issue.input === undefined
        ? "is required (copy apps/app/.env.example to apps/app/.env)"
        : "must be an HTTP(S) URL",
  }),
  // RevenueCat's public iOS SDK key; App Store purchases are off without it.
  EXPO_PUBLIC_REVENUECAT_IOS_API_KEY: z.string().optional(),
});

export type AppEnvInput = z.input<typeof appEnvSchema>;

const source = {
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_REVENUECAT_IOS_API_KEY:
    process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY,
} satisfies Record<keyof AppEnvInput, string | undefined>;

export class InvalidAppEnvError extends Error {
  constructor(error: z.ZodError) {
    super(`Invalid environment variables:\n${z.prettifyError(error)}`);
    this.name = "InvalidAppEnvError";
  }
}

// An empty string counts as unset. Errors name the variable and rule, never
// the value.
export function parseAppEnv(
  input: Record<keyof AppEnvInput, string | undefined>,
) {
  const result = appEnvSchema.safeParse(
    Object.fromEntries(
      Object.entries(input).filter(([, value]) => value !== ""),
    ),
  );
  if (!result.success) throw new InvalidAppEnvError(result.error);
  return {
    apiUrl: result.data.EXPO_PUBLIC_API_URL,
    revenueCatIosApiKey: result.data.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY ?? null,
  };
}

export type AppEnv = ReturnType<typeof parseAppEnv>;

export const appEnv: AppEnv = parseAppEnv(source);
