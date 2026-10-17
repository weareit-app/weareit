import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { createRouterClient } from "@orpc/server";
import {
  DummyDriver,
  Kysely,
  PostgresAdapter,
  PostgresIntrospector,
  PostgresQueryCompiler,
  type CompiledQuery,
  type DatabaseConnection,
  type QueryResult,
} from "kysely";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createApiRouter } from "@it/api/router";
import type { ItDatabase } from "@it/database/database";
import { createStripeSupport } from "../src/stripe-support";

const ownerId = "user_owner";
const otherId = "user_other";
const monthlyRef = "00000000-0000-4000-8000-000000000001";
const guestRef = "00000000-0000-4000-8000-000000000002";

const contributions: Record<string, unknown>[] = [
  {
    id: monthlyRef,
    user_id: ownerId,
    processor: "stripe",
    frequency: "monthly",
    status: "active",
    stripe_customer_id: "cus_owner",
    stripe_subscription_id: "sub_owner",
  },
  {
    id: guestRef,
    user_id: null,
    processor: "stripe",
    frequency: "monthly",
    status: "active",
    stripe_customer_id: "cus_guest",
    stripe_subscription_id: "sub_guest",
  },
];

// Evaluates the simple `"column" = $n and ...` selects the support repository
// issues, so a missing ownership filter would return another account's row.
function selectContributions(query: CompiledQuery): QueryResult<unknown> {
  const match = /^select (.+) from "support_contributions" where (.+)$/.exec(
    query.sql,
  );
  if (!match) throw new Error(`Unexpected query: ${query.sql}`);
  const columns = [...match[1]!.matchAll(/"(\w+)"/g)].map((m) => m[1]!);
  const conditions = [...match[2]!.matchAll(/"(\w+)" = \$(\d+)/g)].map(
    (m) => [m[1]!, query.parameters[Number(m[2]) - 1]] as const,
  );
  const rows = contributions
    .filter((row) =>
      conditions.every(([column, value]) => row[column] === value),
    )
    .map((row) =>
      Object.fromEntries(columns.map((column) => [column, row[column]])),
    );
  return { rows };
}

class FakeDriver extends DummyDriver {
  override async acquireConnection(): Promise<DatabaseConnection> {
    return {
      executeQuery: async <R>(query: CompiledQuery) =>
        selectContributions(query) as QueryResult<R>,
      streamQuery: () => {
        throw new Error("Streaming is not supported.");
      },
    };
  }
}

const db = new Kysely({
  dialect: {
    createAdapter: () => new PostgresAdapter(),
    createDriver: () => new FakeDriver(),
    createIntrospector: (kysely) => new PostgresIntrospector(kysely),
    createQueryCompiler: () => new PostgresQueryCompiler(),
  },
}) as unknown as ItDatabase;

let stripeServer: Server;
let portalCustomers: string[] = [];

beforeAll(async () => {
  stripeServer = createServer((request, response) => {
    let body = "";
    request.on("data", (chunk) => (body += chunk));
    request.on("end", () => {
      if (request.url !== "/v1/billing_portal/sessions") {
        response.writeHead(404).end();
        return;
      }
      portalCustomers.push(new URLSearchParams(body).get("customer") ?? "");
      response.writeHead(200, { "Content-Type": "application/json" }).end(
        JSON.stringify({
          id: "bps_test",
          object: "billing_portal.session",
          url: "https://billing.stripe.test/session",
        }),
      );
    });
  });
  await new Promise<void>((resolve) =>
    stripeServer.listen(0, "127.0.0.1", resolve),
  );
  const { port } = stripeServer.address() as AddressInfo;
  process.env.STRIPE_SECRET_KEY = "sk_test_support_access";
  process.env.STRIPE_API_BASE = `http://127.0.0.1:${port}`;
});

afterAll(async () => {
  delete process.env.STRIPE_SECRET_KEY;
  delete process.env.STRIPE_API_BASE;
  await new Promise((resolve) => stripeServer.close(resolve));
});

beforeEach(() => {
  portalCustomers = [];
});

function clientFor(userId: string | null) {
  return createRouterClient(createApiRouter(db), {
    context: {
      db,
      cmsActor: null,
      userId,
      supportPayments: createStripeSupport(db),
    },
  });
}

describe("support status and portal access", () => {
  it("returns status to the account that owns the support", async () => {
    await expect(
      clientFor(ownerId).support.getStatus({ reference: monthlyRef }),
    ).resolves.toEqual({ frequency: "monthly", status: "active" });
  });

  it("opens the billing portal for the owner's Stripe customer", async () => {
    await expect(
      clientFor(ownerId).support.createPortal({ reference: monthlyRef }),
    ).resolves.toEqual({ url: "https://billing.stripe.test/session" });
    expect(portalCustomers).toEqual(["cus_owner"]);
  });

  it("reports another account's support as not found", async () => {
    const client = clientFor(otherId);
    await expect(
      client.support.getStatus({ reference: monthlyRef }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(
      client.support.createPortal({ reference: monthlyRef }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
    expect(portalCustomers).toEqual([]);
  });

  it("does not expose support without an account to anyone", async () => {
    const client = clientFor(ownerId);
    await expect(
      client.support.getStatus({ reference: guestRef }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(
      client.support.createPortal({ reference: guestRef }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
    expect(portalCustomers).toEqual([]);
  });

  it("requires a signed-in session", async () => {
    const client = clientFor(null);
    await expect(
      client.support.createCheckout({ amountMinor: 1500, frequency: "once" }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(
      client.support.getStatus({ reference: monthlyRef }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(
      client.support.createPortal({ reference: monthlyRef }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    expect(portalCustomers).toEqual([]);
  });
});
