import { describe, expect, it } from "vitest";
import { InvalidEnvError, parseEnv } from "./env";

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
