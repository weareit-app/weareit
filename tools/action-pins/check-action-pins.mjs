// Fails when an action used by a workflow or a local composite action isn't pinned to a
// reviewed release.
// The rules are in the "Continuous integration" section of docs/architecture/dependency-policy.md.
// Run from the repo root: `node tools/action-pins/check-action-pins.mjs`.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const POLICY_PATH = "docs/architecture/dependency-policy.md";
const WORKFLOWS_DIR = ".github/workflows";
const ACTIONS_DIR = ".github/actions";
const SECTION = "## Continuous integration";
// A block-style `uses:` key, optionally a list item and optionally quoted.
const USES_LINE = /^\s*(?:-\s+)?(["']?)uses\1:\s*(.*)$/;
// Any `uses` key, including flow style (`{uses: ...}`), which USES_LINE can't read.
const ANY_USES_KEY = /(?:^|[\s{,])["']?uses["']?\s*:/;
const PINNED = /^[\w.-]+\/[\w./-]+@([0-9a-f]{40}) # v\d+\.\d+\.\d+$/;
const SHA_TOKEN = /(?<![0-9a-f])[0-9a-f]{40}(?![0-9a-f])/g;
// A key whose value is a literal or folded block (`run: |`, `script: >-`).
const BLOCK_SCALAR_START = /:\s*[|>][-+0-9]*\s*(?:#.*)?$/;

/** The text of the policy section that records action pins, or null when it is missing. */
function pinsSection(policy) {
  const lines = policy.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === SECTION);
  if (start === -1) return null;
  const end = lines.findIndex((line, i) => i > start && line.startsWith("## "));
  return lines.slice(start + 1, end === -1 ? undefined : end).join("\n");
}

/** Removes the quotes around a `uses:` value, keeping any trailing comment. */
function unquote(value) {
  return value.replace(/^(["'])(.*)\1(\s*#.*)?$/, "$2$3");
}

function indentOf(line) {
  return line.match(/^\s*/)[0].length;
}

/**
 * @param {{ files: { path: string, text: string }[], policy: string }} input
 * @returns {string[]} one message per problem; empty when every pin is valid.
 */
export function checkActionPins({ files, policy }) {
  const section = pinsSection(policy);
  if (section === null) {
    return [
      `${POLICY_PATH} has no "${SECTION}" section to record action pins in`,
    ];
  }
  const recorded = new Set(section.match(SHA_TOKEN) ?? []);
  const problems = [];
  for (const { path, text } of files) {
    // Indent of the key that opened the block scalar we're inside, if any.
    let blockIndent = null;
    text.split(/\r?\n/).forEach((line, index) => {
      if (blockIndent !== null) {
        if (line.trim() === "" || indentOf(line) > blockIndent) return;
        blockIndent = null;
      }
      if (BLOCK_SCALAR_START.test(line)) blockIndent = indentOf(line);
      if (line.trim().startsWith("#")) return;

      const where = `${path}:${index + 1}`;
      const uses = line.match(USES_LINE);
      if (!uses) {
        if (ANY_USES_KEY.test(line.replace(/\s#.*$/, ""))) {
          problems.push(
            `${where}: write each \`uses:\` on its own block-style line so it can be checked`,
          );
        }
        return;
      }
      const value = unquote(uses[2].trim());
      if (value.startsWith("./")) return;
      const pinned = value.match(PINNED);
      if (!pinned) {
        problems.push(
          `${where}: "${value}" isn't pinned as owner/repo@<40-char lowercase SHA> # vX.Y.Z`,
        );
      } else if (!recorded.has(pinned[1])) {
        problems.push(
          `${where}: ${pinned[1]} isn't recorded under "${SECTION.slice(3)}" in ${POLICY_PATH}; review the action and record it there`,
        );
      }
    });
  }
  return problems;
}

/** Paths, relative to `root`, of the files in `dir` (searched recursively when asked) that `keep` accepts. */
function listFiles(root, dir, keep, { recursive = false } = {}) {
  if (!existsSync(join(root, dir))) return [];
  return readdirSync(join(root, dir), { recursive })
    .map((name) => `${dir}/${name.split("\\").join("/")}`)
    .filter(keep)
    .sort();
}

/** Reads the workflows, local composite actions and the policy from a repo checkout and checks them. */
export function checkRepo(root) {
  const paths = [
    ...listFiles(root, WORKFLOWS_DIR, (path) => /\.ya?ml$/.test(path)),
    ...listFiles(root, ACTIONS_DIR, (path) => /\/action\.ya?ml$/.test(path), {
      recursive: true,
    }),
  ];
  const files = paths.map((path) => ({
    path,
    text: readFileSync(join(root, path), "utf8"),
  }));
  const policy = readFileSync(join(root, POLICY_PATH), "utf8");
  return checkActionPins({ files, policy });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const problems = checkRepo(process.cwd());
  if (problems.length > 0) {
    console.error(problems.join("\n"));
    process.exit(1);
  }
  console.log("Action pins: every workflow action is pinned and recorded.");
}
