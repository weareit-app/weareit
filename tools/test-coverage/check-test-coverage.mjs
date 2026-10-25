// Fails when a tracked test file isn't collected by any runner, so a test in a
// folder or with a name no runner matches can't sit unrun.
// It asks the runners themselves: `vitest list --filesOnly` and
// `jest --listTests` (the app's jest-expo config).
// It also fails on the test layout rules: no JavaScript or TypeScript in a
// `tests/` or `__tests__` folder (Python tests in `tools/*/tests` are exempt),
// no test inside `apps/app/app/`, and `*.spec.ts` only in `apps/app/e2e`.
// Run from the repo root: `node tools/test-coverage/check-test-coverage.mjs`.
import { execFileSync } from "node:child_process";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const TEST_FILE =
  /\.test(\.(ios|android|native|web|node))?\.(ts|tsx|mts|cts|js|jsx|mjs|cjs)$/;

const SCRIPT_FILE = /\.(ts|tsx|mts|cts|js|jsx|mjs|cjs)$/;
const SPEC_FILE = /\.spec\.(ts|tsx|mts|cts|js|jsx|mjs|cjs)$/;
const TESTS_FOLDER = /(^|\/)(tests|__tests__)\//;

/**
 * @param {string[]} tracked repo-relative paths
 * @returns {string[]} one message per tracked file that breaks a layout rule.
 */
export function layoutProblems(tracked) {
  return tracked.flatMap((path) => {
    if (SCRIPT_FILE.test(path) && TESTS_FOLDER.test(path)) {
      return [
        `${path} is in a tests folder; put it beside the file it tests, as "foo.test.ts" next to "foo.ts"`,
      ];
    }
    if (path.startsWith("apps/app/app/") && TEST_FILE.test(path)) {
      return [
        `${path} is under apps/app/app/, where Expo Router treats every file as a route; move it beside the component it tests in apps/app/src`,
      ];
    }
    if (SPEC_FILE.test(path) && !path.startsWith("apps/app/e2e/")) {
      return [
        `${path} is a "*.spec.ts" file outside apps/app/e2e; only Playwright journeys there use that name, so name it "*.test.ts"`,
      ];
    }
    return [];
  });
}

/**
 * @param {{ tracked: string[], collected: string[] }} input repo-relative paths
 * @returns {string[]} tracked test files that no runner collects.
 */
export function uncollectedTests({ tracked, collected }) {
  const seen = new Set(collected);
  return tracked.filter((path) => TEST_FILE.test(path) && !seen.has(path));
}

/**
 * @returns {string[]} one message per uncollected test or layout problem;
 * empty when every test runs and sits where it belongs.
 */
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
  return [
    ...layoutProblems(tracked),
    ...uncollectedTests({ tracked, collected }).map(
      (path) =>
        `${path} is run by no test runner; name it "*.test.ts" for Vitest, or "*.test.tsx" under apps/app for jest-expo`,
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
    "Test coverage: every tracked test file is run by a test runner and sits where it belongs.",
  );
}
