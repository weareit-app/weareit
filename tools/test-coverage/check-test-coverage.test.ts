import { describe, expect, it } from "vitest";
import { uncollectedTests } from "./check-test-coverage.mjs";

describe("uncollectedTests", () => {
  it("reports tracked test files that no runner collects", () => {
    expect(
      uncollectedTests({
        tracked: [
          "packages/api/tests/openapi.test.ts",
          "packages/api/tests/new-folder/forgotten.test.ts",
          "apps/app/tests/essay-screen.test.tsx",
        ],
        collected: [
          "packages/api/tests/openapi.test.ts",
          "apps/app/tests/essay-screen.test.tsx",
        ],
      }),
    ).toEqual(["packages/api/tests/new-folder/forgotten.test.ts"]);
  });

  it("counts jest-expo's platform-specific test names as tests", () => {
    expect(
      uncollectedTests({
        tracked: [
          "apps/app/src/components/choice-card.test.native.tsx",
          "apps/app/src/essays/blocks/table.test.web.tsx",
          "apps/app/dynamic-import-to-require.test-support.cjs",
        ],
        collected: ["apps/app/src/components/choice-card.test.native.tsx"],
      }),
    ).toEqual(["apps/app/src/essays/blocks/table.test.web.tsx"]);
  });

  it("ignores files that aren't tests, including Playwright specs", () => {
    expect(
      uncollectedTests({
        tracked: [
          "packages/api/src/openapi.ts",
          "apps/app/e2e/watercolor.spec.ts",
          "tools/pains/tests/test_ingest.py",
        ],
        collected: [],
      }),
    ).toEqual([]);
  });
});
