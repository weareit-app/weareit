import { expect, test } from "@playwright/test";
import { buildTier1ContentGraph } from "../../../packages/database/src/tier1-import";

test.beforeEach(async ({ page }) => {
  const content = buildTier1ContentGraph();
  await page.route("**/rpc/**", (route) =>
    route.fulfill({
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
    }),
  );
});

test("keeps choices on device and connects them to futures and first actions", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: /^Purpose/ }).click();
  await page.getByRole("checkbox", { name: /Procrastination/ }).click();
  await page.getByRole("checkbox", { name: "Follow-through" }).click();
  await expect(page.getByText("Ways it can be better")).toBeVisible();
  await page
    .getByRole("checkbox", { name: "Map a route to your goal" })
    .click();
  await expect(
    page.getByRole("button", { name: /Done for now/ }),
  ).toBeVisible();
  await expect(
    page.getByText("1 selected · kept on this device"),
  ).toBeVisible();
  await page.getByRole("link", { name: "Continue" }).click();

  await expect(
    page.getByRole("heading", { name: "What could be better for us?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: /^Making change/ }).click();
  await page.getByRole("checkbox", { name: /Gridlock/ }).click();
  await page.getByRole("checkbox", { name: "Momentum" }).click();
  await page.getByRole("link", { name: "Continue" }).click();

  await expect(
    page.getByRole("heading", { name: "Picture a life with more room in it." }),
  ).toBeVisible();
  await expect(page.getByText("Follow-through").last()).toBeVisible();
  await expect(page.getByText("Momentum").last()).toBeVisible();
  await expect(page.getByText("Make the first step smaller")).toBeVisible();
  await expect(
    page.getByText("Invite one person to explore with you"),
  ).toBeVisible();

  const savedDraft = await page.evaluate(() =>
    JSON.parse(window.localStorage.getItem("it-onboarding-draft-v1") ?? "null"),
  );
  expect(savedDraft.state.personalPainIds).toContain("procrastination");
  expect(savedDraft.state.personalPaths).toEqual([
    {
      painId: "procrastination",
      dreamIds: ["follow-through"],
      fixIds: ["map-a-route-to-your-goal"],
    },
  ]);
  expect(savedDraft.state.worldPainIds).toContain("nothing-ever-changes");
  expect(savedDraft.state.worldPaths).toEqual([
    { painId: "nothing-ever-changes", dreamIds: ["momentum"], fixIds: [] },
  ]);

  await page.reload();
  await expect(page.getByText("Follow-through").last()).toBeVisible();
  await expect(page.getByText("Momentum").last()).toBeVisible();

  await page.getByRole("link", { name: "See ways to help" }).click();
  await expect(
    page.getByRole("heading", { name: "There is room for you in this." }),
  ).toBeVisible();
  const helpInterest = page.getByRole("checkbox", {
    name: /Invite one person/,
  });
  await helpInterest.click();
  await expect(helpInterest).toHaveAttribute("aria-checked", "true");

  const savedHelpInterest = await page.evaluate(() =>
    JSON.parse(window.localStorage.getItem("it-onboarding-draft-v1") ?? "null"),
  );
  expect(savedHelpInterest.state.helpInterests).toContain("recruiting");
});

test("lets someone clear their local choices after confirmation", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: /^Mind/ }).click();
  await page.getByRole("checkbox", { name: /Anxiety/ }).click();
  await expect(
    page.getByText("1 selected · kept on this device"),
  ).toBeVisible();

  await page.getByText("Clear saved choices from this device").click();
  await page.getByRole("button", { name: "Clear choices" }).click();

  await expect(
    page.getByText("0 selected · kept on this device"),
  ).toBeVisible();
});

test("shows Support It as optional and starts the selected monthly checkout", async ({
  page,
  baseURL,
}) => {
  const checkoutUrl = `${baseURL}/mock-stripe-checkout`;
  await page.route("**/rpc/support/createCheckout", async (route) => {
    expect(route.request().postDataJSON()).toEqual({
      json: { amountMinor: 1500, frequency: "monthly" },
    });
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        json: {
          url: checkoutUrl,
          reference: "00000000-0000-4000-8000-000000000001",
        },
      }),
    });
  });
  await page.route(checkoutUrl, (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<h1>Local Stripe simulator</h1><p>$15 each month</p>",
    }),
  );

  await page.goto("/support-it");
  await expect(page.getByText("Supporting It is optional")).toBeVisible();

  await page.getByRole("radio", { name: "Monthly" }).click();
  await page
    .getByRole("button", { name: "Continue to secure checkout" })
    .click();

  await expect(
    page.getByRole("heading", { name: "Local Stripe simulator" }),
  ).toBeVisible();
  await expect(page.getByText("$15 each month")).toBeVisible();
});

test("shows a refunded one-time contribution as refunded", async ({ page }) => {
  await page.route("**/rpc/support/getStatus", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ json: { frequency: "once", status: "refunded" } }),
    }),
  );

  await page.goto(
    "/support-it?status=success&ref=00000000-0000-4000-8000-000000000001",
  );

  await expect(
    page.getByText("Your contribution has been refunded."),
  ).toBeVisible();
  await expect(
    page.getByText("The payment was returned to your payment method."),
  ).toBeVisible();
});

test("confirms monthly support remains active when cancellation is scheduled", async ({
  page,
}) => {
  await page.route("**/rpc/support/getStatus", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        json: { frequency: "monthly", status: "cancel_scheduled" },
      }),
    }),
  );

  await page.goto(
    "/support-it?status=success&ref=00000000-0000-4000-8000-000000000001",
  );

  await expect(page.getByText("Thank you for supporting It.")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Manage monthly support" }),
  ).toBeVisible();
});
