import { expect, test, type Page } from "@playwright/test";
import { buildTier1ContentGraph } from "../../../packages/database/src/tier1-import";

const DOT = '[data-testid="watercolor-dot"]';

function serveContent(page: Page, delayMs: number) {
  const content = buildTier1ContentGraph();
  return page.route("**/rpc/**", async (route) => {
    await new Promise((r) => setTimeout(r, delayMs));
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        json: {
          version: 1,
          content,
          checksum: "0".repeat(64),
          publishedAt: "2026-10-14T12:00:00.000Z",
        },
      }),
    });
  });
}

function recordCanvasKit(page: Page) {
  const urls: string[] = [];
  page.on("request", (r) => {
    if (/canvaskit/i.test(r.url())) urls.push(r.url());
  });
  return urls;
}

test("shows the watercolor loader while content loads, then the content (US2)", async ({
  page,
}) => {
  const canvasKit = recordCanvasKit(page);
  await serveContent(page, 2500);
  await page.goto("/onboarding/personal");

  await expect(page.getByText("Loading…")).toBeVisible();
  await expect(page.locator(DOT)).toBeVisible();
  // The dot is decorative; the words carry the meaning.
  await expect(page.locator(DOT)).toHaveAttribute("aria-hidden", "true");

  await expect(
    page.getByRole("heading", { name: "What do you want to change?" }),
  ).toBeVisible({ timeout: 15_000 });
  await expect(page.locator(DOT)).toHaveCount(0);
  expect(canvasKit).toEqual([]);
});

test("draws dot B with WebGL on web, blooming in a loop", async ({ page }) => {
  const canvasKit = recordCanvasKit(page);
  await page.route("**/rpc/**", () => new Promise(() => {}));
  await page.goto("/onboarding/personal");
  const canvas = page.locator(`${DOT} canvas`);
  await expect(canvas).toBeVisible();

  // Paint coverage (share of non-transparent pixels) over one loop.
  const coverage = () =>
    canvas.evaluate((el: HTMLCanvasElement) => {
      const c = document.createElement("canvas");
      c.width = el.width;
      c.height = el.height;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(el, 0, 0);
      const px = ctx.getImageData(0, 0, c.width, c.height).data;
      let painted = 0;
      for (let i = 3; i < px.length; i += 4) if (px[i]! > 20) painted += 1;
      return painted / (px.length / 4);
    });
  const samples: number[] = [];
  for (let i = 0; i < 10; i += 1) {
    samples.push(await coverage());
    await page.waitForTimeout(450);
  }
  // It is drawn, and it changes: blooming, resting, fading.
  expect(Math.max(...samples)).toBeGreaterThan(0.3);
  expect(Math.max(...samples) - Math.min(...samples)).toBeGreaterThan(0.2);
  expect(canvasKit).toEqual([]);
});

test("shows retry and no dot when content fails to load (FR-013)", async ({
  page,
}) => {
  await page.route("**/rpc/**", (route) =>
    route.fulfill({ status: 500, body: "unavailable" }),
  );
  await page.goto("/onboarding/personal");

  await expect(page.getByText("Try again", { exact: true })).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.locator(DOT)).toHaveCount(0);
});

test("does not load Skia's web runtime outside the lab", async ({ page }) => {
  const canvasKit = recordCanvasKit(page);
  await serveContent(page, 0);
  await page.goto("/");
  await page.getByRole("link", { name: "Get started" }).click();
  await expect(
    page.getByRole("heading", { name: "What do you want to change?" }),
  ).toBeVisible({ timeout: 15_000 });
  expect(canvasKit).toEqual([]);
});
