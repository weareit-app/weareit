import { readFileSync } from "node:fs";
import { parseEnv as parseDotenv } from "node:util";
import { describe, expect, it } from "vitest";
import { databaseEnvSchema, InvalidEnvError, parseEnv } from "./env";

describe("database scripts env", () => {
  it("reads DATABASE_URL", () => {
    expect(
      parseEnv({ DATABASE_URL: "postgres://it:it@localhost:5432/it_dev" }),
    ).toEqual({ DATABASE_URL: "postgres://it:it@localhost:5432/it_dev" });
  });

  it.each([
    ["missing", undefined, "is required"],
    ["empty", "", "is required"],
    [
      "not Postgres",
      "mysql://user:hidden-password@db/it",
      "must be a postgres:// URL",
    ],
  ])("names DATABASE_URL when it is %s", (_, value, rule) => {
    const parse = () => parseEnv({ DATABASE_URL: value });
    expect(parse).toThrow(InvalidEnvError);
    expect(parse).toThrow("DATABASE_URL");
    expect(parse).toThrow(rule);
    if (value) expect(parse).not.toThrow(value);
  });
});

// The scripts share the root example with the API server, whose test checks
// that nothing else is listed there.
describe("root .env.example", () => {
  const example = parseDotenv(
    readFileSync(new URL("../../../.env.example", import.meta.url), "utf8"),
  );

  it("lists every variable the database scripts read", () => {
    const listed = Object.keys(example);
    expect(
      Object.keys(databaseEnvSchema.shape).filter(
        (key) => !listed.includes(key),
      ),
    ).toEqual([]);
  });

  it("parses with the database scripts' schema", () => {
    expect(() => parseEnv(example)).not.toThrow();
  });
});
