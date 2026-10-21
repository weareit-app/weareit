import { describe, expect, it } from "vitest";
import { createApiRouter, type ApiContext } from "@it/api/router";
import type { ItDatabase } from "@it/database/database";
import { createApiDocs } from "../src/api-docs";

const reference = "00000000-0000-4000-8000-000000000001";

const context: ApiContext = {
  db: {} as ItDatabase,
  cmsActor: null,
  userId: "user_owner",
  supportPayments: {
    createCheckout: () => Promise.reject(new Error("unused")),
    getStatus: (ref, userId) =>
      ref === reference && userId === "user_owner"
        ? Promise.resolve({ frequency: "monthly", status: "active" })
        : Promise.reject(new Error("SUPPORT_CONTRIBUTION_NOT_FOUND")),
    createPortal: () => Promise.reject(new Error("unused")),
  },
};

function docs(enabled: boolean) {
  return createApiDocs({ router: createApiRouter({} as ItDatabase), enabled });
}

function request(path: string, init?: RequestInit) {
  return new Request(`http://localhost:3001${path}`, init);
}

// What Scalar's "Try it" sends for support.getStatus.
function getStatusRequest() {
  return request("/api/support/getStatus", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reference }),
  });
}

describe("local API docs", () => {
  it("runs an operation over the OpenAPI transport, as Try it does", async () => {
    const response = await docs(true).handle(getStatusRequest(), context);

    expect(response?.status).toBe(200);
    expect(await response?.json()).toEqual({
      frequency: "monthly",
      status: "active",
    });
  });

  it("serves a docs page whose Scalar script and spec both load", async () => {
    const apiDocs = docs(true);

    const page = await apiDocs.handle(request("/docs"), context);
    expect(page?.headers.get("content-type")).toMatch(/^text\/html/);
    const html = await page!.text();
    expect(html).toContain('"/openapi.json"');
    const scriptPath = /<script src="([^"]+)"/.exec(html)?.[1];
    expect(scriptPath).toBeDefined();

    const script = await apiDocs.handle(request(scriptPath!), context);
    expect(script?.headers.get("content-type")).toMatch(/^text\/javascript/);
    expect((await script!.text()).length).toBeGreaterThan(100_000);

    const spec = await apiDocs.handle(request("/openapi.json"), context);
    expect(spec?.headers.get("content-type")).toMatch(/^application\/json/);
    const document = (await spec!.json()) as { paths: object };
    expect(document.paths).toHaveProperty("/support/getStatus");
  });

  it("serves nothing when turned off", async () => {
    const apiDocs = docs(false);

    for (const path of ["/docs", "/docs/scalar.js", "/openapi.json"])
      expect(await apiDocs.handle(request(path), context)).toBeNull();
    expect(await apiDocs.handle(getStatusRequest(), context)).toBeNull();
  });
});
