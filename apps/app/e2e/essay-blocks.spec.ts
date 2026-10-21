import { expect, test } from "@playwright/test";

// The diagram and math blocks on the development lab page, until essays
// render them (public-essays: Named blocks, Text without scripts).
const LAB = "/lab/diagram-math";
const FLOW_DESCRIPTION = /^A flow from left to right: a pain you name/;
// The app's own API (EXPO_PUBLIC_API_URL in playwright.config.ts), which
// the site menu asks whether someone is signed in.
const API_HOST = "localhost:3001";
// Every test here opens the lab page, which loads Mermaid's chunk. Whichever
// test runs first makes the dev server compile it, which takes longer than the
// 30-second default in CI; a release serves the chunk prebuilt.
test.describe.configure({ timeout: 90_000 });

const QUADRATIC_TEX = "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}";

test("draws diagrams and typesets math from this site only", async ({
  page,
}) => {
  const hosts = new Set<string>();
  page.on("request", (request) => hosts.add(new URL(request.url()).host));
  // The dev server builds Mermaid's lazy chunk (about 5 MB) on first request,
  // which can take longer than an assertion's wait on a cold or busy machine;
  // a release serves it prebuilt. Wait for it to arrive, then for the drawing.
  const mermaidChunk = page.waitForResponse((response) =>
    /\/mermaid\/dist\/mermaid\.core\.bundle/.test(response.url()),
  );
  await page.goto(LAB);
  await mermaidChunk;

  await expect(page.locator("svg[aria-roledescription]")).toHaveCount(2);
  // The description stays as the diagram's text equivalent.
  await expect(page.getByText(FLOW_DESCRIPTION)).toBeVisible();
  // MathML is what screen readers read.
  await expect(page.locator("math")).toHaveCount(2);
  // The TeX fallback is gone; it stays only as the MathML annotation.
  await expect(
    page
      .getByText(QUADRATIC_TEX, { exact: true })
      .and(page.locator(":not(annotation)")),
  ).toHaveCount(0);
  await page.evaluate(() => document.fonts.ready);

  const own = new Set([new URL(page.url()).host, API_HOST]);
  expect([...hosts].filter((host) => !own.has(host))).toEqual([]);
});

test("keeps the TeX until KaTeX's stylesheet has loaded", async ({ page }) => {
  // Without the stylesheet, KaTeX's typeset HTML and its MathML both show.
  let release = () => {};
  const held = new Promise<void>((resolve) => (release = resolve));
  let requested = () => {};
  const stylesheetRequested = new Promise<void>(
    (resolve) => (requested = resolve),
  );
  await page.route("**/katex/katex.min.css", async (route) => {
    requested();
    await held;
    await route.continue();
  });
  await page.goto(LAB);
  await stylesheetRequested;
  // Long enough for KaTeX to have typeset, were it not waiting.
  await page.waitForTimeout(500);

  await expect(page.getByText(QUADRATIC_TEX, { exact: true })).toBeVisible();
  await expect(page.locator(".katex-mathml")).toHaveCount(0);

  release();
  await expect(page.locator("math")).toHaveCount(2);
  // The stylesheet visually hides the MathML (a 1px clip, which Playwright
  // still counts as visible), so check it applied.
  await expect(page.locator(".katex-mathml").first()).toHaveCSS(
    "position",
    "absolute",
  );
});

test("keeps the TeX when KaTeX's stylesheet fails to load", async ({
  page,
}) => {
  let failed = () => {};
  const stylesheetFailed = new Promise<void>((resolve) => (failed = resolve));
  await page.route("**/katex/katex.min.css", async (route) => {
    await route.abort();
    failed();
  });
  await page.goto(LAB);
  await stylesheetFailed;
  await page.waitForTimeout(500);

  await expect(page.getByText(QUADRATIC_TEX, { exact: true })).toBeVisible();
  await expect(page.locator(".katex")).toHaveCount(0);
});

test.describe("with scripts off", () => {
  test.use({ javaScriptEnabled: false });

  test("shows each diagram's description and each formula's TeX", async ({
    page,
  }) => {
    await page.goto(LAB);
    await expect(page.getByText(FLOW_DESCRIPTION)).toBeVisible();
    await expect(page.getByText(QUADRATIC_TEX, { exact: true })).toBeVisible();
    await expect(page.locator("svg[aria-roledescription], math")).toHaveCount(
      0,
    );
  });
});
