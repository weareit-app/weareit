import { z } from "zod";

// The app's public variables: their schema and how they're parsed. Only
// `env.ts` reads them; this file reads nothing, so the example check in
// `app-env-schema.test.ts` can import it.

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

class InvalidAppEnvError extends Error {
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
