// Copies KaTeX's stylesheet and woff2 fonts into public/katex, so the math
// block loads them from this site. Run after changing the katex version:
// pnpm --filter @it/app katex:web
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
export const publicKatexDir = join(here, "../public/katex");

/** The files to serve, by path under public/katex. */
export function katexAssets() {
  const dist = join(
    dirname(createRequire(import.meta.url).resolve("katex/package.json")),
    "dist",
  );
  // Every modern browser reads woff2, so the woff and ttf fallbacks are
  // dropped rather than copied.
  const css = readFileSync(join(dist, "katex.min.css"), "utf8").replace(
    /,url\(fonts\/[\w-]+\.(?:woff|ttf)\) format\("(?:woff|truetype)"\)/g,
    "",
  );
  const assets = new Map([["katex.min.css", Buffer.from(css)]]);
  for (const font of readdirSync(join(dist, "fonts"))) {
    if (font.endsWith(".woff2")) {
      assets.set(`fonts/${font}`, readFileSync(join(dist, "fonts", font)));
    }
  }
  const license = join(dist, "..", "LICENSE");
  assets.set("LICENSE", readFileSync(license));
  return assets;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  mkdirSync(join(publicKatexDir, "fonts"), { recursive: true });
  for (const [name, contents] of katexAssets()) {
    writeFileSync(join(publicKatexDir, name), contents);
  }
}
