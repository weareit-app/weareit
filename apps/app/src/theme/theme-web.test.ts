import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Vitest runs from the repository root.
const read = (name: string) => readFileSync(`apps/app/${name}`, "utf8");
const vars = (css: string) =>
  Object.fromEntries(
    [...css.matchAll(/^\s*(--color-[a-z0-9-]+):\s*([^;]+);/gm)].map(
      ([, name, value]): [string, string] => [name!, value!.toLowerCase()],
    ),
  );
const block = (css: string, start: string) => {
  const from = css.indexOf(start);
  return css.slice(from, css.indexOf("\n}", from));
};

describe("web theme overrides", () => {
  const global = read("global.css");
  const web = read("theme-web.css");
  const light = vars(block(global, "@theme {"));
  const dark = vars(block(global, "@media (prefers-color-scheme: dark)"));

  it("match global.css's dark colors", () => {
    expect(vars(block(web, ':root[data-theme="dark"]'))).toEqual(dark);
  });

  it("restore global.css's light value for every dark color", () => {
    expect(vars(block(web, ':root[data-theme="light"]'))).toEqual(
      Object.fromEntries(Object.keys(dark).map((name) => [name, light[name]])),
    );
  });
});
