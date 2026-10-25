import { readFileSync } from "node:fs";
import { parseEnv as parseDotenv } from "node:util";
import { describe, expect, it } from "vitest";
import { appEnvSchema, parseAppEnv } from "./app-env-schema";

describe("apps/app/.env.example", () => {
  const example = parseDotenv(readFileSync("apps/app/.env.example", "utf8"));

  it("lists exactly the public variables the app reads", () => {
    const read = Object.keys(appEnvSchema.shape);
    const listed = Object.keys(example);
    expect({
      missingFromExample: read.filter((key) => !listed.includes(key)),
      readByNothing: listed.filter((key) => !read.includes(key)),
    }).toEqual({ missingFromExample: [], readByNothing: [] });
  });

  it("parses with the app's schema", () => {
    expect(() =>
      parseAppEnv({
        EXPO_PUBLIC_API_URL: example.EXPO_PUBLIC_API_URL,
        EXPO_PUBLIC_REVENUECAT_IOS_API_KEY:
          example.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY,
      }),
    ).not.toThrow();
  });
});
