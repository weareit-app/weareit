import { describe, expect, it } from "vitest";
import { layoutProblems, uncollectedTests } from "./check-test-coverage.mjs";

describe("uncollectedTests", () => {
  it("reports tracked test files that no runner collects", () => {
    expect(
      uncollectedTests({
        tracked: [
          "packages/api/src/openapi.test.ts",
          "packages/api/src/forgotten.test.mts",
          "apps/app/src/essays/essay-screen.test.tsx",
        ],
        collected: [
          "packages/api/src/openapi.test.ts",
          "apps/app/src/essays/essay-screen.test.tsx",
        ],
      }),
    ).toEqual(["packages/api/src/forgotten.test.mts"]);
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

describe("layoutProblems", () => {
  it("fails on JavaScript or TypeScript in a tests or __tests__ folder", () => {
    expect(
      layoutProblems([
        "packages/content/tests/graph.test.ts",
        "apps/app/src/__tests__/choice-card.test.tsx",
        "tools/pains/tests/helpers.mjs",
        "packages/content/src/graph.test.ts",
      ]),
    ).toEqual([
      expect.stringContaining("packages/content/tests/graph.test.ts"),
      expect.stringContaining("apps/app/src/__tests__/choice-card.test.tsx"),
      expect.stringContaining("tools/pains/tests/helpers.mjs"),
    ]);
  });

  it("leaves Python tests in a tool's tests folder alone", () => {
    expect(
      layoutProblems([
        "tools/possibilities/tests/test_cards.py",
        "tools/pains/tests/test_catalog.py",
      ]),
    ).toEqual([]);
  });

  it("fails on a test inside apps/app/app/", () => {
    expect(
      layoutProblems([
        "apps/app/app/(onboarding)/index.test.tsx",
        "apps/app/app/(onboarding)/index.tsx",
        "apps/app/src/app-shell.test.tsx",
      ]),
    ).toEqual([
      expect.stringContaining("apps/app/app/(onboarding)/index.test.tsx"),
    ]);
  });

  it("fails on a *.spec.ts outside apps/app/e2e", () => {
    expect(
      layoutProblems([
        "packages/database/src/repository.spec.ts",
        "apps/app/e2e/onboarding.spec.ts",
      ]),
    ).toEqual([
      expect.stringContaining("packages/database/src/repository.spec.ts"),
    ]);
  });
});
