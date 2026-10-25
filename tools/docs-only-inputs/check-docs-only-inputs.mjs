// Fails when code that docs-only pull requests skip names one of the spec folders that
// CI's docs-only allowlist covers (`openspec`, `specs`, `.specify`). A docs-only pull
// request skips the tests that code feeds, so a test that reads those folders would stop
// running on exactly the pull requests that change its input. Scans TypeScript and
// JavaScript under apps/, packages/, and tools/, root-level scripts and configs, and every
// package.json. Python is out of scope: the Python tool tests still run on docs-only pull
// requests. Workflow YAML is too: a change to .github/ already runs everything.
// Matches the folder as a quoted string or a path segment, so `path.join(root, "specs")`
// and `${dir}/openspec` count; a fully dynamic path doesn't.
// Run from the repo root: `node tools/docs-only-inputs/check-docs-only-inputs.mjs`.
// docs/architecture/dependency-policy.md ("Continuous integration").
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const SCANNED =
  /^((apps|packages|tools)\/.+\.(ts|tsx|mts|cts|js|jsx|mjs|cjs)|[^/]+\.(ts|mts|cts|js|mjs|cjs)|(.+\/)?package\.json)$/;
const SPEC_FOLDER = /['"`/](openspec|specs|\.specify)['"`/]/;
// package.json scripts are shell commands, where a path often follows a space
// (`vitest specs/`). Only there, since code comments cite specs the same way.
const SCRIPT_SPEC_FOLDER = /\s(openspec|specs|\.specify)\//;
const PACKAGE_JSON = /(^|\/)package\.json$/;
const SELF = "tools/docs-only-inputs/";

// Lines that name a spec folder without reading it, by file. Each entry covers the
// matching lines that contain its `text`, and needs a reason; an entry whose text no
// longer appears on a matching line is stale. Any other matching line in the same file
// still fails. Code that does read a spec folder doesn't belong here: drop the folder
// from the docs-only allowlist in .github/workflows/ci.yml.
export const ALLOWLIST = {
  "packages/content/src/essay-drafts.generated.ts": [
    {
      text: "https://github.com/weareit-app/weareit/tree/master/openspec/changes/public-pages",
      reason:
        "generated essay data; a GitHub link to an openspec change, not a file read",
    },
  ],
  "packages/content/src/tier-1-graph.ts": [
    {
      text: 'documentPath: "specs/001-personal-page/spec.md"',
      reason:
        "cites the spec as a content source's documentPath; nothing reads the file",
    },
  ],
};

/**
 * @param {{
 *   files: { path: string, text: string }[],
 *   allowlist: Record<string, { text: string, reason: string }[]>,
 * }} input
 * @returns {{ found: { path: string, line: number }[], stale: { path: string, text: string }[] }}
 *   every matching line no allowlist entry covers, and entries that cover no matching line.
 */
export function specFolderReferences({ files, allowlist }) {
  const found = [];
  const used = new Set();
  for (const { path, text } of files) {
    if (!SCANNED.test(path) || path.startsWith(SELF)) continue;
    const entries = allowlist[path] ?? [];
    const script = PACKAGE_JSON.test(path);
    text.split("\n").forEach((content, index) => {
      const names =
        SPEC_FOLDER.test(content) ||
        (script && SCRIPT_SPEC_FOLDER.test(content));
      if (!names) return;
      const covering = entries.filter((entry) => content.includes(entry.text));
      covering.forEach((entry) => used.add(entry));
      if (covering.length === 0) found.push({ path, line: index + 1 });
    });
  }
  const stale = Object.entries(allowlist).flatMap(([path, entries]) =>
    entries
      .filter((entry) => !used.has(entry))
      .map((entry) => ({ path, text: entry.text })),
  );
  return { found, stale };
}

/** @returns {string[]} one message per problem; empty when nothing new names a spec folder. */
export function checkRepo(root, allowlist = ALLOWLIST) {
  const files = execFileSync("git", ["ls-files"], {
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
        `${path}:${line} names a spec folder (openspec, specs, or .specify). If it reads one, remove that folder from the docs-only allowlist in .github/workflows/ci.yml; if not, add an ALLOWLIST entry for the line with a reason`,
    ),
    ...stale.map(
      ({ path, text }) =>
        `ALLOWLIST entry for ${path} (${text}) no longer matches a line that names a spec folder; remove it from tools/docs-only-inputs/check-docs-only-inputs.mjs`,
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
