import { readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join } from "node:path";
import type { Essay } from "@it/domain/essays";
import { EssayError, parseEssay } from "./parse";

/** Reads `<dir>/essay.md` and the block files beside it. */
export function loadEssay(dir: string): Essay {
  const files: Record<string, string> = {};
  for (const name of readdirSync(dir))
    if (name !== "essay.md" && /\.(json|ya?ml)$/.test(name))
      files[name] = readFileSync(join(dir, name), "utf8");
  return parseEssay({
    slug: basename(dir),
    markdown: readFileSync(join(dir, "essay.md"), "utf8"),
    files,
  });
}

/** Every essay under `root`, by slug; fails with all problems at once. */
export function loadEssays(root: string): Essay[] {
  const essays: Essay[] = [];
  const problems: string[] = [];
  for (const name of readdirSync(root).sort()) {
    const dir = join(root, name);
    if (!statSync(dir).isDirectory()) continue;
    try {
      essays.push(loadEssay(dir));
    } catch (error) {
      if (!(error instanceof EssayError)) throw error;
      problems.push(...error.problems);
    }
  }
  if (problems.length) throw new EssayError(problems);
  return essays;
}
