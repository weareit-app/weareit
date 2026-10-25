// Fails when a tracked test file isn't collected by any runner, so a test in a
// folder or with a name no runner matches can't sit unrun.
// It asks the runners themselves: `vitest list --filesOnly` and
// `jest --listTests` (the app's jest-expo config).
// Run from the repo root: `node tools/test-coverage/check-test-coverage.mjs`.
import { execFileSync } from "node:child_process";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const TEST_FILE =
  /\.test(\.(ios|android|native|web|node))?\.(ts|tsx|mts|cts|js|jsx|mjs|cjs)$/;

/**
 * @param {{ tracked: string[], collected: string[] }} input repo-relative paths
 * @returns {string[]} tracked test files that no runner collects.
 */
export function uncollectedTests({ tracked, collected }) {
  const seen = new Set(collected);
  return tracked.filter((path) => TEST_FILE.test(path) && !seen.has(path));
}

/** @returns {string[]} one message per uncollected test; empty when all run. */
export function checkRepo(root) {
  const run = (cwd, command, args) =>
    execFileSync(command, args, { cwd, encoding: "utf8" });
  const app = join(root, "apps", "app");
  const vitest = JSON.parse(
    run(root, join(root, "node_modules", ".bin", "vitest"), [
      "list",
      "--filesOnly",
      "--json",
    ]),
  ).map(({ file }) => file);
  const jest = run(app, join(app, "node_modules", ".bin", "jest"), [
    "--config",
    "jest.config.cjs",
    "--listTests",
  ])
    .split("\n")
    .filter(Boolean);
  const collected = [...vitest, ...jest].map((file) => relative(root, file));
  const tracked = run(root, "git", ["ls-files"]).split("\n").filter(Boolean);
  return uncollectedTests({ tracked, collected }).map(
    (path) =>
      `${path} is run by no test runner; name it "*.test.ts" for Vitest, or "*.test.tsx" under apps/app for jest-expo`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const problems = checkRepo(process.cwd());
  if (problems.length > 0) {
    console.error(problems.join("\n"));
    process.exit(1);
  }
  console.log(
    "Test coverage: every tracked test file is run by a test runner.",
  );
}
