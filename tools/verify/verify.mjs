// Runs the checks CI's `check` job runs, in the same order, and prints one line per step
// with a summary at the end. Every step runs even after one fails, so one run shows every
// problem. Run from the repo root: `pnpm verify`.
//
// Locally it fills the app's public variables from `apps/app/.env.example` when they are
// unset (CI sets the same values), skips `check:generated` without `TEST_DATABASE_URL`
// (the Postgres unit tests then skip too), and skips `lint:py` without `uvx`.
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/** CI's `check` job, step by step; `verify.test.ts` fails if the two drift apart. */
export const STEPS = [
  "node tools/action-pins/check-action-pins.mjs",
  "node tools/decision-records/check-no-adr-folder.mjs",
  "node tools/skills-sync/sync-skills.mjs --check",
  "pnpm run check:generated",
  "pnpm run typecheck",
  "node tools/typecheck-coverage/check-typecheck-coverage.mjs",
  "node tools/test-coverage/check-test-coverage.mjs",
  "node tools/story-coverage/check-story-coverage.mjs",
  "pnpm run lint",
  "pnpm run lint:py",
  "pnpm run knip",
  "pnpm run sherif",
  "pnpm run test:unit",
  "pnpm run test:expo",
  "pnpm run test:tools",
];

/** Steps CI runs only to set up the runner, not checks of the repo. */
const SETUP = /^pipx install /;

/** The `run:` commands of the `check` job in a CI workflow, in order, without setup steps. */
export function ciCheckSteps(workflow) {
  const job = workflow.split(/^ {2}check:$/m)[1]?.split(/^ {2}\S+:$/m)[0] ?? "";
  return [...job.matchAll(/^\s+- run: (.+)$/gm)]
    .map((match) => match[1].trim())
    .filter((command) => !SETUP.test(command));
}

/** `KEY=value` lines of an example env file, skipping comments and blank lines. */
export function parseEnvExample(text) {
  return Object.fromEntries(
    text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => [
        line.slice(0, line.indexOf("=")),
        line.slice(line.indexOf("=") + 1),
      ]),
  );
}

/** Why a step is skipped in this environment, or null when it runs. */
export function skipReason(step, env, hasUvx) {
  if (step === "pnpm run check:generated" && !env.TEST_DATABASE_URL) {
    return "needs TEST_DATABASE_URL (see the README); the Postgres unit tests skip too";
  }
  if (step === "pnpm run lint:py" && !hasUvx)
    return "needs uv's uvx (see CONTRIBUTING.md)";
  return null;
}

function main(root) {
  const appExample = parseEnvExample(
    readFileSync(join(root, "apps/app/.env.example"), "utf8"),
  );
  // biome-ignore lint/style/noProcessEnv: verify passes the caller's environment on to each check, filling only the app's unset public variables from its example file.
  const env = { ...appExample, ...process.env };
  const hasUvx =
    spawnSync("uvx", ["--version"], { stdio: "ignore" }).status === 0;
  const results = STEPS.map((step) => {
    const reason = skipReason(step, env, hasUvx);
    if (reason) {
      console.log(`- skip  ${step} (${reason})`);
      return "skip";
    }
    const { status } = spawnSync(step, {
      cwd: root,
      env,
      shell: true,
      stdio: "ignore",
    });
    console.log(`${status === 0 ? "✓ pass" : "✗ FAIL"}  ${step}`);
    return status === 0 ? "pass" : "fail";
  });
  const failed = results.filter((result) => result === "fail").length;
  const skipped = results.filter((result) => result === "skip").length;
  console.log(
    `\nVerify: ${results.length - failed - skipped} passed, ${failed} failed, ${skipped} skipped.` +
      (failed ? " Re-run a failing step on its own to see its output." : ""),
  );
  return failed ? 1 : 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = main(join(fileURLToPath(import.meta.url), "../../.."));
}
