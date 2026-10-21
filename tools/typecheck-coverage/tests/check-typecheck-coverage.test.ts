import { describe, expect, it } from "vitest";
import {
  typecheckProjects,
  uncheckedFiles,
} from "../check-typecheck-coverage.mjs";

describe("typecheckProjects", () => {
  it("finds the tsconfig each typecheck script runs", () => {
    expect(
      typecheckProjects([
        { dir: "apps/app", scripts: { typecheck: "tsc --noEmit" } },
        {
          dir: ".",
          scripts: {
            typecheck: "turbo typecheck typecheck:root",
            "typecheck:root": "tsc -p tsconfig.root.json",
          },
        },
        {
          dir: "packages/api",
          scripts: { typecheck: "tsc --noEmit --project tsconfig.build.json" },
        },
      ]),
    ).toEqual([
      "apps/app/tsconfig.json",
      "tsconfig.root.json",
      "packages/api/tsconfig.build.json",
    ]);
  });

  it("skips packages whose scripts don't run tsc", () => {
    expect(
      typecheckProjects([
        { dir: "packages/content", scripts: { lint: "prettier --check ." } },
        { dir: "tools/icon-trace", scripts: {} },
      ]),
    ).toEqual([]);
  });
});

describe("uncheckedFiles", () => {
  it("lists tracked TypeScript files no project checks", () => {
    expect(
      uncheckedFiles({
        tracked: [
          "apps/app/src/page.tsx",
          "apps/app/scripts/review.mts",
          "vitest.config.mts",
          "apps/app/nativewind-env.d.ts",
        ],
        checked: ["apps/app/src/page.tsx", "apps/app/nativewind-env.d.ts"],
      }),
    ).toEqual(["apps/app/scripts/review.mts", "vitest.config.mts"]);
  });

  it("ignores JavaScript and other files", () => {
    expect(
      uncheckedFiles({
        tracked: ["tools/action-pins/check-action-pins.mjs", "README.md"],
        checked: [],
      }),
    ).toEqual([]);
  });
});
