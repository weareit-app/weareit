import { describe, expect, it } from "vitest";
import {
  ALLOWLIST,
  checkRepo,
  specFolderReferences,
} from "./check-docs-only-inputs.mjs";

const file = (path: string, text: string) => ({ path, text });

describe("specFolderReferences", () => {
  it("finds a spec folder as a quoted string or a path segment, on every line", () => {
    expect(
      specFolderReferences({
        files: [
          file(
            "packages/a/src/load.ts",
            'const dir = path.join(root, "specs");\nconst b = "../../openspec/x";',
          ),
          file("tools/b/read.mjs", "readFileSync(root + `/openspec/changes`)"),
          file("apps/app/tests/c.test.ts", "x\nconst p = '.specify/memory';"),
        ],
        allowlist: {},
      }),
    ).toEqual({
      found: [
        { path: "packages/a/src/load.ts", line: 1 },
        { path: "packages/a/src/load.ts", line: 2 },
        { path: "tools/b/read.mjs", line: 1 },
        { path: "apps/app/tests/c.test.ts", line: 2 },
      ],
      stale: [],
    });
  });

  it("scans root scripts, configs, and package.json scripts, but not code comments", () => {
    expect(
      specFolderReferences({
        files: [
          file("vitest.config.mts", 'include: ["specs/**/*.test.ts"]'),
          file("package.json", '"test:specs": "node x.mjs specs/"'),
          file("packages/a/package.json", '"files": ["openspec/"]'),
          file("packages/b/package.json", '"test": "vitest run specs/x"'),
          file(
            "packages/b/src/note.ts",
            "// see specs/007-watercolor-dot/spec.md",
          ),
        ],
        allowlist: {},
      }),
    ).toEqual({
      found: [
        { path: "vitest.config.mts", line: 1 },
        { path: "package.json", line: 1 },
        { path: "packages/a/package.json", line: 1 },
        { path: "packages/b/package.json", line: 1 },
      ],
      stale: [],
    });
  });

  it("ignores bare words, Python, workflows, other folders, and its own files", () => {
    expect(
      specFolderReferences({
        files: [
          file(
            "packages/a/src/x.test.ts",
            'it("matches specs and openspec ideas")',
          ),
          file("tools/pains/catalog.py", "root / 'openspec/config.yaml'"),
          file(".github/workflows/ci.yml", "(docs|openspec|specs)/"),
          file("docs/notes.ts", 'const p = "specs/001";'),
          file("tools/docs-only-inputs/x.test.ts", '"specs/"'),
        ],
        allowlist: {},
      }),
    ).toEqual({ found: [], stale: [] });
  });

  it("covers only the allowlisted line, so a new reference in the same file fails", () => {
    expect(
      specFolderReferences({
        files: [
          file(
            "packages/a/src/cite.ts",
            'documentPath: "specs/001/spec.md",\nreadFileSync("specs/001/spec.md")',
          ),
        ],
        allowlist: {
          "packages/a/src/cite.ts": [
            { text: 'documentPath: "specs/001/spec.md"', reason: "a citation" },
          ],
        },
      }),
    ).toEqual({
      found: [{ path: "packages/a/src/cite.ts", line: 2 }],
      stale: [],
    });
  });

  it("reports entries whose line is gone", () => {
    expect(
      specFolderReferences({
        files: [file("packages/a/src/clean.ts", "export {};")],
        allowlist: {
          "packages/a/src/clean.ts": [
            { text: '"specs/001"', reason: "used to cite a spec" },
          ],
        },
      }),
    ).toEqual({
      found: [],
      stale: [{ path: "packages/a/src/clean.ts", text: '"specs/001"' }],
    });
  });
});

describe("checkRepo", () => {
  it("passes on this repository with its allowlist", () => {
    expect(checkRepo(process.cwd(), ALLOWLIST)).toEqual([]);
  });
});
