import { logLevels } from "@it/log/log";
import { z } from "zod";

// The API server's environment (docs/architecture/decisions.md, #171). The
// entry points call `readEnv` once and pass the typed result to each module;
// no other server file reads `process.env`. Errors name the variable and the
// rule it broke, never its value, so secrets stay out of host and CI logs.

const nodeEnvs = ["development", "test", "production"] as const;

const port = z.coerce
  .number()
  .int()
  .min(1, "must be a TCP port")
  .max(65535, "must be a TCP port");

const bareOrigin = z
  .url({ protocol: /^https?$/, error: "must be an HTTP(S) URL" })
  .refine((value) => {
    const url = new URL(value);
    return (
      url.pathname === "/" &&
      !url.search &&
      !url.hash &&
      !url.username &&
      !url.password
    );
  }, "must be a bare HTTP(S) origin");

export const serverEnvSchema = z.object({
  NODE_ENV: z.enum(nodeEnvs, {
    error: "must be development, test, or production",
  }),
  DATABASE_URL: z.url({
    protocol: /^postgres(ql)?$/,
    error: "must be a postgres:// URL",
  }),
  CMS_ADMIN_TOKEN: z.string({ error: "is required" }),
  PORT: port.default(3001),
  WEB_ORIGINS: z
    .string()
    .default("http://localhost:8081,http://127.0.0.1:8081")
    .transform((value) =>
      value
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    ),
  BETTER_AUTH_URL: z
    .url({ error: "must be a URL" })
    .default("http://localhost:3001"),
  BETTER_AUTH_SECRET: z
    .string({ error: "is required" })
    .min(32, "must be at least 32 characters"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: port.default(587),
  SMTP_SECURE: z
    .enum(["true", "false"], { error: "must be true or false" })
    .default("false")
    .transform((value) => value === "true"),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  PUBLIC_APP_URL: z
    .url({ error: "must be a URL" })
    .default("http://localhost:8082"),
  STRIPE_SECRET_KEY: z
    .string()
    .regex(/^(sk|rk)_/, "must start with sk_ or rk_")
    .optional(),
  STRIPE_SUPPORT_PRODUCT_ID: z
    .string()
    .startsWith("prod_", "must start with prod_")
    .optional(),
  STRIPE_WEBHOOK_SECRET: z
    .string()
    .startsWith("whsec_", "must start with whsec_")
    .optional(),
  // Points the Stripe SDK at a local mock. Never set in production.
  STRIPE_API_BASE: bareOrigin.optional(),
  REVENUECAT_WEBHOOK_SECRET: z.string().optional(),
  // Only the dev script sets API_DOCS (docs/architecture/decisions.md, 2026-10-21).
  API_DOCS: z.literal("1", { error: "must be 1 or unset" }).optional(),
  LOG_LEVEL: z
    .enum(logLevels, { error: "must be debug, info, warn, or error" })
    .default("info"),
});

// Each group is all-or-none, and all are required in production. Without a
// group outside production, the server keeps its local mock or console
// fallback. SMTP_PORT and SMTP_SECURE have defaults, so they aren't members.
const groups = {
  SMTP: ["SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD", "SMTP_FROM"],
  Stripe: [
    "STRIPE_SECRET_KEY",
    "STRIPE_SUPPORT_PRODUCT_ID",
    "STRIPE_WEBHOOK_SECRET",
  ],
  RevenueCat: ["REVENUECAT_WEBHOOK_SECRET"],
} as const satisfies Record<string, (keyof ServerEnvInput)[]>;

type ServerEnvInput = z.input<typeof serverEnvSchema>;
type ParsedServerEnv = z.output<typeof serverEnvSchema>;

interface SmtpConfig {
  host: string;
  port: number;
  isSecure: boolean;
  user: string;
  password: string;
  from: string;
}

export interface StripeConfig {
  secretKey: string;
  productId: string;
  webhookSecret: string;
  // A local mock's origin; the real Stripe API when absent.
  apiBase?: URL;
}

export interface RevenueCatConfig {
  webhookSecret: string;
}

export interface ServerEnv {
  nodeEnv: (typeof nodeEnvs)[number];
  isProduction: boolean;
  databaseUrl: string;
  cmsAdminToken: string;
  port: number;
  webOrigins: string[];
  logLevel: ParsedServerEnv["LOG_LEVEL"];
  isApiDocsEnabled: boolean;
  publicAppUrl: string;
  auth: { baseUrl: string; secret: string };
  smtp: SmtpConfig | null;
  stripe: StripeConfig | null;
  revenueCat: RevenueCatConfig | null;
}

export class InvalidEnvError extends Error {
  constructor(issues: z.core.$ZodIssue[]) {
    super(
      `Invalid environment variables:\n${z.prettifyError(new z.ZodError(issues))}`,
    );
    this.name = "InvalidEnvError";
  }
}

// Entry points stop with just the list of problems: no stack trace, and
// nothing that could hold a value.
function orExit<T>(parse: () => T): T {
  try {
    return parse();
  } catch (error) {
    if (!(error instanceof InvalidEnvError)) throw error;
    console.error(error.message);
    process.exit(1);
  }
}

// An empty string counts as unset, so `KEY=` in a `.env` file is the same as
// leaving the line out.
function withoutEmpty(source: Record<string, string | undefined>) {
  return Object.fromEntries(
    Object.entries(source).filter(([, value]) => value !== ""),
  );
}

function groupIssues(values: Record<string, string | undefined>) {
  const issues: z.core.$ZodIssue[] = [];
  const isProduction = values.NODE_ENV === "production";
  for (const [group, keys] of Object.entries(groups)) {
    const missing = keys.filter((key) => values[key] === undefined);
    if (missing.length === 0) continue;
    if (missing.length === keys.length && !isProduction) continue;
    const rule =
      missing.length === keys.length
        ? `is required in production (the ${group} group)`
        : `is required with the rest of the ${group} group (${keys.join(", ")})`;
    for (const key of missing)
      issues.push({
        code: "custom",
        path: [key],
        message: rule,
        input: undefined,
      });
  }
  if (isProduction && values.STRIPE_API_BASE !== undefined)
    issues.push({
      code: "custom",
      path: ["STRIPE_API_BASE"],
      message: "must be unset in production",
      input: undefined,
    });
  return issues;
}

// Parses an environment once, reporting every problem together.
export function parseEnv(
  source: Record<string, string | undefined>,
): ServerEnv {
  const values = withoutEmpty(source);
  const result = serverEnvSchema.safeParse(values);
  const issues = [
    ...(result.success ? [] : result.error.issues),
    ...groupIssues(values),
  ];
  if (!result.success || issues.length > 0) throw new InvalidEnvError(issues);
  const env = result.data;
  return {
    nodeEnv: env.NODE_ENV,
    isProduction: env.NODE_ENV === "production",
    databaseUrl: env.DATABASE_URL,
    cmsAdminToken: env.CMS_ADMIN_TOKEN,
    port: env.PORT,
    webOrigins: env.WEB_ORIGINS,
    logLevel: env.LOG_LEVEL,
    isApiDocsEnabled: env.API_DOCS === "1",
    publicAppUrl: env.PUBLIC_APP_URL,
    auth: { baseUrl: env.BETTER_AUTH_URL, secret: env.BETTER_AUTH_SECRET },
    smtp:
      env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASSWORD && env.SMTP_FROM
        ? {
            host: env.SMTP_HOST,
            port: env.SMTP_PORT,
            isSecure: env.SMTP_SECURE,
            user: env.SMTP_USER,
            password: env.SMTP_PASSWORD,
            from: env.SMTP_FROM,
          }
        : null,
    stripe:
      env.STRIPE_SECRET_KEY &&
      env.STRIPE_SUPPORT_PRODUCT_ID &&
      env.STRIPE_WEBHOOK_SECRET
        ? {
            secretKey: env.STRIPE_SECRET_KEY,
            productId: env.STRIPE_SUPPORT_PRODUCT_ID,
            webhookSecret: env.STRIPE_WEBHOOK_SECRET,
            ...(env.STRIPE_API_BASE
              ? { apiBase: new URL(env.STRIPE_API_BASE) }
              : {}),
          }
        : null,
    revenueCat: env.REVENUECAT_WEBHOOK_SECRET
      ? { webhookSecret: env.REVENUECAT_WEBHOOK_SECRET }
      : null,
  };
}

export function readEnv() {
  return orExit(() => parseEnv(process.env));
}

// The local Stripe simulator (`mock-stripe`) and the API's `dev:mock` wrapper,
// which are development tools and refuse to run in production.
export const localMockEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test"], {
      error: "must be development or test for the local Stripe mock",
    })
    .optional(),
  MOCK_STRIPE_PORT: port.default(12111),
  MOCK_IT_API_BASE: bareOrigin.default("http://localhost:3001"),
  PUBLIC_APP_URL: z
    .url({ error: "must be a URL" })
    .default("http://localhost:8082"),
  STRIPE_WEBHOOK_SECRET: z
    .string()
    .startsWith("whsec_", "must start with whsec_")
    .default("whsec_local_mock"),
});

export type LocalMockEnv = z.output<typeof localMockEnvSchema>;

export function readLocalMockEnv(): LocalMockEnv {
  return orExit(() => {
    const result = localMockEnvSchema.safeParse(withoutEmpty(process.env));
    if (!result.success) throw new InvalidEnvError(result.error.issues);
    return result.data;
  });
}
