// Fails when a workflow action is not pinned to a reviewed release.
// Every `uses:` in .github/workflows/*.yml must read `owner/repo@<40-hex SHA> # vX.Y.Z`,
// and that SHA must be recorded under "GitHub Actions" in docs/architecture/dependency-policy.md.
// Local actions (`./...`) are exempt. Run from the repo root: `node tools/action-pins/check-action-pins.mjs`.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const POLICY_PATH = "docs/architecture/dependency-policy.md";
const WORKFLOWS_DIR = ".github/workflows";
const USES_LINE = /^\s*(?:-\s+)?uses:\s*(.*)$/;
const PINNED = /^[\w.-]+\/[\w./-]+@([0-9a-f]{40}) # v\d+\.\d+\.\d+$/;

/** The text of the "## GitHub Actions" section, or "" when it is missing. */
export function actionsSection(policy) {
  const match = policy.match(
    /^## GitHub Actions\s*$([\s\S]*?)(?=^## |(?![\s\S]))/m,
  );
  return match ? match[1] : "";
}

/**
 * @param {{ workflows: { path: string, text: string }[], policy: string }} input
 * @returns {string[]} one message per problem; empty when every pin is valid.
 */
export function checkActionPins({ workflows, policy }) {
  const recorded = actionsSection(policy);
  const problems = [];
  for (const { path, text } of workflows) {
    text.split("\n").forEach((line, index) => {
      const uses = line.match(USES_LINE);
      if (!uses) return;
      const value = uses[1].trim().replace(/^(["'])(.*)\1(\s*#.*)?$/, "$2$3");
      if (value.startsWith("./")) return;
      const where = `${path}:${index + 1}`;
      const pinned = value.match(PINNED);
      if (!pinned) {
        problems.push(
          `${where}: "${value}" is not pinned as owner/repo@<40-char SHA> # vX.Y.Z`,
        );
      } else if (!recorded.includes(pinned[1])) {
        problems.push(
          `${where}: ${pinned[1]} is not recorded under "GitHub Actions" in ${POLICY_PATH}; review the action and record it there`,
        );
      }
    });
  }
  return problems;
}

/** Reads the workflows and the policy from a repo checkout and checks them. */
export function checkRepo(root) {
  const dir = join(root, WORKFLOWS_DIR);
  const workflows = readdirSync(dir)
    .filter((name) => /\.ya?ml$/.test(name))
    .sort()
    .map((name) => ({
      path: `${WORKFLOWS_DIR}/${name}`,
      text: readFileSync(join(dir, name), "utf8"),
    }));
  const policy = readFileSync(join(root, POLICY_PATH), "utf8");
  return checkActionPins({ workflows, policy });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const problems = checkRepo(process.cwd());
  if (problems.length > 0) {
    console.error(problems.join("\n"));
    process.exit(1);
  }
  console.log("Action pins: every workflow action is pinned and recorded.");
}
