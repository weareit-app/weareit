import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { katexAssets, publicKatexDir } from "../../../scripts/katex-assets.mjs";

// The maths block serves KaTeX's stylesheet and fonts from this site. The
// copies in public/katex must match the pinned katex package; refresh them
// with `pnpm --filter @it/app katex:web`.
describe("self-hosted KaTeX assets", () => {
  const assets = katexAssets();

  it("serve every font as woff2 from this site", () => {
    const css = assets.get("katex.min.css")!.toString();
    expect(css).not.toMatch(/url\((?!fonts\/[\w-]+\.woff2\))/);
    expect(
      [...assets.keys()].filter((name) => name.endsWith(".woff2")),
    ).toHaveLength(20);
  });

  it("match the pinned katex package", () => {
    for (const [name, contents] of assets) {
      expect(
        readFileSync(`${publicKatexDir}/${name}`).equals(contents),
        `${name} is out of date`,
      ).toBe(true);
    }
  });
});
