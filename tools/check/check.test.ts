import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ciCheckSteps, parseEnvExample, STEPS, skipReason } from "./check.mjs";

describe("check", () => {
  it("runs exactly the checks CI's check job runs, in the same order", () => {
    const workflow = readFileSync(".github/workflows/ci.yml", "utf8");
    expect(STEPS).toEqual(ciCheckSteps(workflow));
  });

  it("reads KEY=value lines and skips comments and blank lines", () => {
    expect(parseEnvExample("# public\nA=http://x/rpc?a=b\n\nB=\n")).toEqual({
      A: "http://x/rpc?a=b",
      B: "",
    });
  });

  it("skips check:generated without a test database and lint:py without uvx", () => {
    expect(skipReason("pnpm run check:generated", {}, true)).toMatch(
      /TEST_DATABASE_URL/,
    );
    expect(
      skipReason("pnpm run check:generated", { TEST_DATABASE_URL: "x" }, true),
    ).toBeNull();
    expect(skipReason("pnpm run lint:py", {}, false)).toMatch(/uvx/);
    expect(skipReason("pnpm run lint", {}, false)).toBeNull();
  });
});
