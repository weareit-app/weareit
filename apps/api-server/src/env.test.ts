import { readFileSync } from "node:fs";
import { parseEnv as parseDotenv } from "node:util";
import { describe, expect, it } from "vitest";
import {
  InvalidEnvError,
  localMockEnvSchema,
  parseEnv,
  serverEnvSchema,
} from "./env";

const base = {
  NODE_ENV: "development",
  DATABASE_URL: "postgres://it:it@localhost:5432/it_dev",
  CMS_ADMIN_TOKEN: "cms-token-for-tests",
  BETTER_AUTH_SECRET: "a-random-secret-of-at-least-32-characters",
};

const smtp = {
  SMTP_HOST: "smtp.example.test",
  SMTP_USER: "it",
  SMTP_PASSWORD: "smtp-password-for-tests",
  SMTP_FROM: "It <hello@example.test>",
};

const stripe = {
  STRIPE_SECRET_KEY: "sk_test_env",
  STRIPE_SUPPORT_PRODUCT_ID: "prod_env",
  STRIPE_WEBHOOK_SECRET: "whsec_env",
};

const revenueCat = { REVENUECAT_WEBHOOK_SECRET: "rc_env" };

function messageFor(source: Record<string, string | undefined>) {
  try {
    parseEnv(source);
  } catch (error) {
    if (error instanceof InvalidEnvError) return error.message;
    throw error;
  }
  throw new Error("Expected the environment to be invalid.");
}

describe("server env", () => {
  it("keeps the local fallbacks when no group is set outside production", () => {
    const env = parseEnv(base);
    expect(env).toMatchObject({
      nodeEnv: "development",
      isProduction: false,
      port: 3001,
      logLevel: "info",
      isApiDocsEnabled: false,
      smtp: null,
      stripe: null,
      revenueCat: null,
    });
  });

  it("builds each group once all of it is set", () => {
    const env = parseEnv({ ...base, ...smtp, ...stripe, ...revenueCat });
    expect(env.smtp).toMatchObject({ host: "smtp.example.test", port: 587 });
    expect(env.stripe).toEqual({
      secretKey: "sk_test_env",
      productId: "prod_env",
      webhookSecret: "whsec_env",
    });
    expect(env.revenueCat).toEqual({ webhookSecret: "rc_env" });
  });

  it("requires NODE_ENV and lists every problem at once", () => {
    const message = messageFor({
      ...base,
      NODE_ENV: undefined,
      DATABASE_URL: "not-a-url",
    });
    expect(message).toContain("NODE_ENV");
    expect(message).toContain("must be development, test, or production");
    expect(message).toContain("DATABASE_URL");
  });

  it("names the missing variables of a half group", () => {
    const message = messageFor({
      ...base,
      STRIPE_SECRET_KEY: "sk_test_env",
    });
    expect(message).toContain("STRIPE_SUPPORT_PRODUCT_ID");
    expect(message).toContain("STRIPE_WEBHOOK_SECRET");
    expect(message).toContain("the rest of the Stripe group");
  });

  it("refuses production without SMTP and names the group", () => {
    const message = messageFor({
      ...base,
      NODE_ENV: "production",
      ...stripe,
      ...revenueCat,
    });
    expect(message).toContain("SMTP_HOST");
    expect(message).toContain("required in production (the SMTP group)");
    expect(message).not.toContain("STRIPE");
  });

  it("refuses the Stripe mock origin in production", () => {
    const message = messageFor({
      ...base,
      NODE_ENV: "production",
      ...smtp,
      ...stripe,
      ...revenueCat,
      STRIPE_API_BASE: "http://127.0.0.1:12111",
    });
    expect(message).toContain("STRIPE_API_BASE");
    expect(message).toContain("must be unset in production");
  });

  it("counts an empty string as unset", () => {
    const env = parseEnv({
      ...base,
      SMTP_HOST: "",
      SMTP_PORT: "",
      STRIPE_SECRET_KEY: "",
      STRIPE_API_BASE: "",
    });
    expect(env.smtp).toBeNull();
    expect(env.stripe).toBeNull();
    expect(messageFor({ ...base, NODE_ENV: "" })).toContain("NODE_ENV");
  });

  it("names the variable and rule without printing the value", () => {
    const values = {
      DATABASE_URL: "mysql://secret-database-password@db.example.test/it",
      BETTER_AUTH_SECRET: "short-auth-secret",
      STRIPE_SECRET_KEY: "pk_live_secret_stripe_key",
      STRIPE_SUPPORT_PRODUCT_ID: "price_secret_product",
      STRIPE_WEBHOOK_SECRET: "secret_webhook_value",
      STRIPE_API_BASE: "http://user:secret-mock-password@127.0.0.1:1/path",
      SMTP_PORT: "secret-port",
      LOG_LEVEL: "secret-level",
    };
    const message = messageFor({ ...base, ...values });
    expect(message).toContain("STRIPE_SECRET_KEY");
    expect(message).toContain("must start with sk_ or rk_");
    expect(message).toContain("BETTER_AUTH_SECRET");
    expect(message).toContain("must be at least 32 characters");
    for (const value of Object.values(values))
      expect(message).not.toContain(value);
    expect(message).not.toContain("secret-");
  });
});

// The root example is shared with the database scripts, which read only
// DATABASE_URL, a server variable too; their own test checks it is listed.
// If they ever read a variable the server doesn't, list it here.
describe("root .env.example", () => {
  const example = parseDotenv(
    readFileSync(new URL("../../../.env.example", import.meta.url), "utf8"),
  );
  const read = new Set([
    ...Object.keys(serverEnvSchema.shape),
    ...Object.keys(localMockEnvSchema.shape),
  ]);

  it("lists exactly the variables the server and its local mock read", () => {
    const listed = Object.keys(example);
    expect({
      missingFromExample: [...read].filter((key) => !listed.includes(key)),
      readByNothing: listed.filter((key) => !read.has(key)),
    }).toEqual({ missingFromExample: [], readByNothing: [] });
  });

  it("parses with the server schema", () => {
    expect(() => parseEnv(example)).not.toThrow();
  });
});
