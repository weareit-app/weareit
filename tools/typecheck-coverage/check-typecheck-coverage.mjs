// Fails when a tracked TypeScript file isn't in any project that `pnpm run typecheck`
// checks, so a tsconfig `include` that misses a folder can't let errors through
// unseen. The projects are read from each package's `typecheck` scripts.
// Run from the repo root: `node tools/typecheck-coverage/check-typecheck-coverage.mjs`.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const TYPESCRIPT = /\.(ts|tsx|mts|cts)$/;
// `typecheck` and `typecheck:<part>` scripts that run tsc, with an optional project.
const TYPECHECK_SCRIPT = /^typecheck(:.+)?$/;
const TSC = /(?:^|\s|&&)tsc(?:\s|$)/;
const PROJECT_FLAG = /\s(?:-p|--project)\s+(\S+)/;
// `tsc --listFilesOnly` prints every absolute path it loads (about 4,000), which
// passes Node's default 1 MB buffer in a deeply nested checkout (ENOBUFS).
const MAX_BUFFER = 64 * 1024 * 1024;

/**
 * @param {{ dir: string, scripts: Record<string, string> }[]} packages
 * @returns {string[]} the tsconfig path of each project a typecheck script runs.
 */
export function typecheckProjects(packages) {
  const projects = [];
  for (const { dir, scripts } of packages) {
    for (const [name, command] of Object.entries(scripts)) {
      if (!TYPECHECK_SCRIPT.test(name) || !TSC.test(command)) continue;
      const config = command.match(PROJECT_FLAG)?.[1] ?? "tsconfig.json";
      projects.push(dir === "." ? config : `${dir}/${config}`);
    }
  }
  return projects;
}

/**
 * @param {{ tracked: string[], checked: string[] }} input repo-relative paths
 * @returns {string[]} tracked TypeScript files that no project checks.
 */
export function uncheckedFiles({ tracked, checked }) {
  const seen = new Set(checked);
  return tracked.filter((path) => TYPESCRIPT.test(path) && !seen.has(path));
}

/** @returns {string[]} one message per unchecked file; empty when all are covered. */
export function checkRepo(root) {
  const git = (...args) =>
    execFileSync("git", args, { cwd: root, encoding: "utf8" })
      .split("\n")
      .filter(Boolean);
  const packages = git("ls-files", "package.json", "**/package.json").map(
    (path) => ({
      dir: path === "package.json" ? "." : path.replace(/\/package\.json$/, ""),
      scripts: JSON.parse(readFileSync(join(root, path), "utf8")).scripts ?? {},
    }),
  );
  const tsc = join(root, "node_modules", ".bin", "tsc");
  const checked = typecheckProjects(packages).flatMap((project) =>
    execFileSync(tsc, ["-p", project, "--listFilesOnly"], {
      cwd: root,
      encoding: "utf8",
      maxBuffer: MAX_BUFFER,
    })
      .split("\n")
      .filter(Boolean)
      .map((file) => relative(root, file)),
  );
  return uncheckedFiles({ tracked: git("ls-files"), checked }).map(
    (path) =>
      `${path} is in no typechecked project; add it to a tsconfig "include" that a typecheck script runs`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const problems = checkRepo(process.cwd());
  if (problems.length > 0) {
    console.error(problems.join("\n"));
    process.exit(1);
  }
  console.log(
    "Typecheck coverage: every tracked TypeScript file is in a typechecked project.",
  );
}
