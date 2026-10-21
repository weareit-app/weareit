// Builds the generated essay modules from `essays/<slug>/essay.md` and the
// block files beside each essay. Fails, listing every problem, on an invalid
// essay. `--check` fails instead of writing when a module is out of date.
//
// - `src/essays.generated.ts`: published essays, and every essay's
//   `published` flag (for the link list).
// - `src/essay-drafts.generated.ts`: unpublished essays, for the development
//   `?draft` preview only. The app requires it behind `__DEV__`, so a release
//   bundle never carries an unapproved essay.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { format, resolveConfig } from "prettier";
import { loadEssays } from "../essay-build/load";
import { EssayError } from "../essay-build/parse";

const root = fileURLToPath(new URL("../essays", import.meta.url));
const target = (name: string) =>
  fileURLToPath(new URL(`../src/${name}`, import.meta.url));

const header = [
  "// Generated from essays/<slug>/essay.md by `pnpm --filter @it/content essays`.",
  "// Don't edit it by hand: edit the essay and run the script again.",
  'import type { Essay } from "./essay-schema";',
  "",
];

async function render(path: string, lines: string[]) {
  return format([...header, ...lines].join("\n"), {
    ...(await resolveConfig(path)),
    filepath: path,
  });
}

async function main() {
  const essays = loadEssays(root);
  const bySlug = (published: boolean) =>
    JSON.stringify(
      Object.fromEntries(
        essays
          .filter((essay) => essay.published === published)
          .map((essay) => [essay.slug, essay]),
      ),
    );
  const flags = JSON.stringify(
    Object.fromEntries(essays.map((essay) => [essay.slug, essay.published])),
  );
  const outputs = {
    [target("essays.generated.ts")]: await render(
      target("essays.generated.ts"),
      [
        "/** Every essay's `published` front matter, by slug. */",
        `export const essayPublished = ${flags} as const;`,
        "",
        "export type EssaySlug = keyof typeof essayPublished;",
        "",
        "/** Published essays only. */",
        `export const essays: Partial<Record<EssaySlug, Essay>> = ${bySlug(true)};`,
        "",
      ],
    ),
    [target("essay-drafts.generated.ts")]: await render(
      target("essay-drafts.generated.ts"),
      [
        "/** Unpublished essays, for the development `?draft` preview only. */",
        `export const draftEssays: Partial<Record<string, Essay>> = ${bySlug(false)};`,
        "",
      ],
    ),
  };

  if (process.argv.includes("--check")) {
    const stale = Object.entries(outputs).filter(([path, source]) => {
      try {
        return readFileSync(path, "utf8") !== source;
      } catch {
        return true;
      }
    });
    if (stale.length) {
      console.error(
        "Generated essay modules are out of date: run `pnpm --filter @it/content essays`.",
      );
      process.exit(1);
    }
    return;
  }
  for (const [path, source] of Object.entries(outputs))
    writeFileSync(path, source);
  console.log(`Built ${essays.length} essay(s).`);
}

main().catch((error: unknown) => {
  if (error instanceof EssayError) {
    console.error(`Essays have problems:\n${error.message}`);
    process.exit(1);
  }
  throw error;
});
