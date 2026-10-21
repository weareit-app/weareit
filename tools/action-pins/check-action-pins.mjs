// Fails when an action used by a workflow or a local composite action isn't pinned to a
// reviewed release.
// The rules and the pins are in docs/architecture/ci-actions.md.
// Run from the repo root: `node tools/action-pins/check-action-pins.mjs`.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const PINS_PATH = "docs/architecture/ci-actions.md";
const WORKFLOWS_DIR = ".github/workflows";
const ACTIONS_DIR = ".github/actions";
// A block-style `uses:` key, optionally a list item and optionally quoted.
const USES_LINE = /^\s*(?:-\s+)?(["']?)uses\1:\s*(.*)$/;
// Any `uses` key, including flow style (`{uses: ...}`), which USES_LINE can't read.
const ANY_USES_KEY = /(?:^|[\s{,])["']?uses["']?\s*:/;
const PINNED = /^[\w.-]+\/[\w./-]+@([0-9a-f]{40}) # v\d+\.\d+\.\d+$/;
const SHA_TOKEN = /(?<![0-9a-f])[0-9a-f]{40}(?![0-9a-f])/g;
const REVIEW_NOTE = /Reviewed \d{4}-\d{2}-\d{2}:[\s\S]*dist\//;
// A key whose value is a literal or folded block (`run: |`, `script: >-`).
const BLOCK_SCALAR_START = /:\s*[|>][-+0-9]*\s*(?:#.*)?$/;

/** Each Markdown list item in the pins file, keyed by every full commit SHA it contains. */
function pinEntries(pins) {
  const items = [];
  // The list item an indented line continues, or null outside a list.
  let current = null;
  for (const line of pins.split(/\r?\n/)) {
    if (line.startsWith("- ")) {
      current = items.push(line) - 1;
    } else if (current !== null && /^\s+\S/.test(line)) {
      items[current] += `\n${line}`;
    } else {
      current = null;
    }
  }
  const entries = new Map();
  for (const item of items) {
    for (const sha of item.match(SHA_TOKEN) ?? []) entries.set(sha, item);
  }
  return entries;
}

/** Removes the quotes around a `uses:` value, keeping any trailing comment. */
function unquote(value) {
  return value.replace(/^(["'])(.*)\1(\s*#.*)?$/, "$2$3");
}

function indentOf(line) {
  return line.match(/^\s*/)[0].length;
}

/**
 * @param {{ files: { path: string, text: string }[], pins: string }} input
 * @returns {string[]} one message per problem; empty when every pin is valid.
 */
export function checkActionPins({ files, pins }) {
  const entries = pinEntries(pins);
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
      } else if (!entries.has(pinned[1])) {
        problems.push(
          `${where}: ${pinned[1]} isn't recorded in ${PINS_PATH}; review the action and record it there`,
        );
      } else if (!REVIEW_NOTE.test(entries.get(pinned[1]))) {
        problems.push(
          `${where}: the entry for ${pinned[1]} in ${PINS_PATH} has no "Reviewed YYYY-MM-DD:" note saying whether dist/ was compared with the source`,
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

/** Reads the workflows, local composite actions and the pins file from a repo checkout and checks them. */
export function checkRepo(root) {
  const workflows = listFiles(root, WORKFLOWS_DIR, (path) =>
    /\.ya?ml$/.test(path),
  );
  if (workflows.length === 0) {
    return [`found no workflows in ${WORKFLOWS_DIR} to check`];
  }
  const paths = [
    ...workflows,
    ...listFiles(root, ACTIONS_DIR, (path) => /\/action\.ya?ml$/.test(path), {
      recursive: true,
    }),
  ];
  const files = paths.map((path) => ({
    path,
    text: readFileSync(join(root, path), "utf8"),
  }));
  if (!existsSync(join(root, PINS_PATH))) {
    return [`${PINS_PATH} is missing; it records each action's pin and review`];
  }
  const pins = readFileSync(join(root, PINS_PATH), "utf8");
  return checkActionPins({ files, pins });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const problems = checkRepo(process.cwd());
  if (problems.length > 0) {
    console.error(problems.join("\n"));
    process.exit(1);
  }
  console.log(
    "Action pins: every action in the workflows and local actions is pinned, recorded and has a review note.",
  );
}
