import { describe, expect, it } from "vitest";
import {
  ALLOWLIST,
  checkRepo,
  specFolderReferences,
} from "./check-docs-only-inputs.mjs";

const file = (path: string, text: string) => ({ path, text });

describe("specFolderReferences", () => {
  it("finds a spec folder as a quoted string or a path segment", () => {
    expect(
      specFolderReferences({
        files: [
          file(
            "packages/a/src/load.ts",
            'const dir = path.join(root, "specs");',
          ),
          file("tools/b/read.mjs", "readFileSync(`${root}/openspec/changes`)"),
          file("apps/app/tests/c.test.ts", "x\nconst p = '.specify/memory';"),
        ],
        allowlist: {},
      }),
    ).toEqual({
      found: [
        { path: "packages/a/src/load.ts", line: 1 },
        { path: "tools/b/read.mjs", line: 1 },
        { path: "apps/app/tests/c.test.ts", line: 2 },
      ],
      stale: [],
    });
  });

  it("ignores bare words, Python, other folders, and its own files", () => {
    expect(
      specFolderReferences({
        files: [
          file(
            "packages/a/src/x.test.ts",
            'it("matches specs and openspec ideas")',
          ),
          file("tools/pains/catalog.py", "root / 'openspec/config.yaml'"),
          file("docs/notes.ts", 'const p = "specs/001";'),
          file("tools/docs-only-inputs/x.test.ts", '"specs/"'),
        ],
        allowlist: {},
      }),
    ).toEqual({ found: [], stale: [] });
  });

  it("skips allowlisted files and reports entries that no longer match", () => {
    expect(
      specFolderReferences({
        files: [
          file("packages/a/src/cite.ts", 'documentPath: "specs/001/spec.md"'),
          file("packages/a/src/clean.ts", "export {};"),
        ],
        allowlist: {
          "packages/a/src/cite.ts": "a citation",
          "packages/a/src/clean.ts": "used to cite a spec",
        },
      }),
    ).toEqual({ found: [], stale: ["packages/a/src/clean.ts"] });
  });
});

describe("checkRepo", () => {
  it("passes on this repository with its allowlist", () => {
    expect(checkRepo(process.cwd(), ALLOWLIST)).toEqual([]);
  });
});
