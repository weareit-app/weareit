import { describe, expect, it } from "vitest";
import {
  isoDateSchema,
  isoDatetimeSchema,
  nonEmptyTextSchema,
  slugIdSchema,
} from "./primitives";

describe("slugIdSchema", () => {
  it("accepts lowercase words joined by hyphens", () => {
    expect(slugIdSchema.safeParse("poor-sleep").success).toBe(true);
    expect(slugIdSchema.safeParse("esco2").success).toBe(true);
  });

  it.each(["Poor-sleep", "poor_sleep", "-poor", "poor--sleep", "poor-", ""])(
    "rejects %j",
    (value) => {
      const result = slugIdSchema.safeParse(value);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.message).toBe(
        "use lowercase words joined by hyphens",
      );
    },
  );
});

describe("nonEmptyTextSchema", () => {
  it("trims the text it returns", () => {
    expect(nonEmptyTextSchema.parse("  Sleep well  ")).toBe("Sleep well");
  });

  it("rejects text that is only whitespace", () => {
    expect(nonEmptyTextSchema.safeParse("   ").success).toBe(false);
  });

  it("checks a maximum a caller adds against the trimmed text", () => {
    const short = nonEmptyTextSchema.max(3);
    expect(short.safeParse(" abc ").success).toBe(true);
    expect(short.safeParse("abcd").success).toBe(false);
  });
});

describe("isoDateSchema", () => {
  it("accepts a calendar date", () => {
    expect(isoDateSchema.safeParse("2026-10-21").success).toBe(true);
  });

  it.each(["2026-13-01", "2026-10-21T00:00:00Z", "21/10/2026"])(
    "rejects %j",
    (value) => {
      expect(isoDateSchema.safeParse(value).success).toBe(false);
    },
  );
});

describe("isoDatetimeSchema", () => {
  it("accepts a UTC timestamp, with or without milliseconds", () => {
    expect(isoDatetimeSchema.safeParse("2026-10-21T19:48:55Z").success).toBe(
      true,
    );
    expect(
      isoDatetimeSchema.safeParse("2026-10-21T19:48:55.123Z").success,
    ).toBe(true);
  });

  it("rejects an offset and a bare date", () => {
    expect(
      isoDatetimeSchema.safeParse("2026-10-21T19:48:55+02:00").success,
    ).toBe(false);
    expect(isoDatetimeSchema.safeParse("2026-10-21").success).toBe(false);
  });
});
