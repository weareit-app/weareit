// Fails when TypeScript or JavaScript under apps/, packages/, or tools/ names one of the
// spec folders that CI's docs-only allowlist skips tests for (`openspec`, `specs`,
// `.specify`). A docs-only pull request skips the tests that code feeds, so a test that
// reads those folders would stop running on exactly the pull requests that change its
// input. Python is out of scope: the Python tool tests still run on docs-only pull requests.
// Matches the folder as a quoted string or a path segment, so `path.join(root, "specs")`
// and `${dir}/openspec` count; a fully dynamic path doesn't.
// Run from the repo root: `node tools/docs-only-inputs/check-docs-only-inputs.mjs`.
// docs/architecture/dependency-policy.md ("Continuous integration").
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const SCANNED = /^(apps|packages|tools)\/.+\.(ts|tsx|mts|cts|js|jsx|mjs|cjs)$/;
const SPEC_FOLDER = /['"`/](openspec|specs|\.specify)['"`/]/;
const SELF = "tools/docs-only-inputs/";

// Files that name a spec folder without reading it. Each needs a reason; remove its
// entry when the file no longer matches. A file that does read a spec folder doesn't
// belong here: drop the folder from the docs-only allowlist in .github/workflows/ci.yml.
export const ALLOWLIST = {
  "packages/content/src/essay-drafts.generated.ts":
    "generated essay data; a GitHub link to an openspec change, not a file read",
  "packages/content/src/tier-1-graph.ts":
    "cites specs/001-personal-page/spec.md as a content source's documentPath; nothing reads the file",
};

/**
 * @param {{ files: { path: string, text: string }[], allowlist: Record<string, string> }} input
 * @returns {{ found: { path: string, line: number }[], stale: string[] }} first matching line
 *   of each scanned file not on the allowlist, and allowlist entries that no longer match.
 */
export function specFolderReferences({ files, allowlist }) {
  const matching = new Map();
  for (const { path, text } of files) {
    if (!SCANNED.test(path) || path.startsWith(SELF)) continue;
    const index = text.split("\n").findIndex((line) => SPEC_FOLDER.test(line));
    if (index >= 0) matching.set(path, index + 1);
  }
  return {
    found: [...matching]
      .filter(([path]) => !(path in allowlist))
      .map(([path, line]) => ({ path, line })),
    stale: Object.keys(allowlist).filter((path) => !matching.has(path)),
  };
}

/** @returns {string[]} one message per problem; empty when nothing new names a spec folder. */
export function checkRepo(root, allowlist = ALLOWLIST) {
  const files = execFileSync("git", ["ls-files", "apps", "packages", "tools"], {
    cwd: root,
    encoding: "utf8",
  })
    .split("\n")
    .filter((path) => SCANNED.test(path))
    .map((path) => ({ path, text: readFileSync(join(root, path), "utf8") }));
  const { found, stale } = specFolderReferences({ files, allowlist });
  return [
    ...found.map(
      ({ path, line }) =>
        `${path}:${line} names a spec folder (openspec, specs, or .specify). If it reads one, remove that folder from the docs-only allowlist in .github/workflows/ci.yml; if not, add an ALLOWLIST entry with a reason`,
    ),
    ...stale.map(
      (path) =>
        `ALLOWLIST entry ${path} no longer names a spec folder; remove it from tools/docs-only-inputs/check-docs-only-inputs.mjs`,
    ),
  ];
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const problems = checkRepo(process.cwd());
  if (problems.length > 0) {
    console.error(problems.join("\n"));
    process.exit(1);
  }
  console.log(
    "Docs-only inputs: no code that docs-only pull requests skip names a spec folder.",
  );
}
