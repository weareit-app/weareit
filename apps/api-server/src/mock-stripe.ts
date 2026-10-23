import { randomUUID } from "node:crypto";
import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";
import Stripe from "stripe";
import { createLog } from "@it/log/log";

if (process.env.NODE_ENV === "production") {
  throw new Error("The local Stripe simulator cannot run in production.");
}

const log = createLog({ level: "info" });
const port = Number(process.env.MOCK_STRIPE_PORT ?? 12111);
const apiBase = process.env.MOCK_IT_API_BASE ?? "http://localhost:3001";
const appBase = process.env.PUBLIC_APP_URL ?? "http://localhost:8082";
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "whsec_local_mock";

type MockCheckout = {
  id: string;
  customerId: string;
  contributionId: string;
  amountMinor: number;
  currency: string;
  mode: "payment" | "subscription";
  metadata: Record<string, string>;
  paymentIntentId: string;
  subscriptionId: string;
  successUrl: string;
  cancelUrl: string;
  created: number;
  completed: boolean;
  refunded: boolean;
};

type MockPortal = {
  id: string;
  checkout: MockCheckout;
  returnUrl: string;
};

const checkouts = new Map<string, MockCheckout>();
const portals = new Map<string, MockPortal>();

function id(prefix: string) {
  return `${prefix}_${randomUUID().replaceAll("-", "")}`;
}

async function readBody(request: IncomingMessage) {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = Buffer.from(chunk);
    size += buffer.length;
    if (size > 1_000_000) throw new Error("Request body too large.");
    chunks.push(buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function sendHtml(response: ServerResponse, title: string, body: string) {
  response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  response.end(`<!doctype html>
<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>body{font:16px system-ui;max-width:36rem;margin:12vh auto;padding:0 1.25rem;color:#17251d}main{border:1px solid #d9dfd9;border-radius:1.25rem;padding:2rem}h1{font-size:1.5rem}p{line-height:1.5;color:#526257}button,a.button{display:inline-block;border:0;border-radius:999px;background:#286d4e;color:#fff;font:inherit;font-weight:650;padding:.85rem 1.25rem;text-decoration:none;cursor:pointer;margin:.25rem .5rem .25rem 0}.secondary{background:#eef2ed!important;color:#17251d!important}form{display:inline}</style>
<main><h1>${title}</h1>${body}</main></html>`);
}

async function sendStripeEvent(type: string, data: Record<string, unknown>) {
  const payload = JSON.stringify({
    id: id("evt"),
    object: "event",
    api_version: "2026-09-30.clover",
    created: Math.floor(Date.now() / 1000),
    data: { object: data },
    livemode: false,
    pending_webhooks: 1,
    type,
  });
  const signature = Stripe.webhooks.generateTestHeaderString({
    payload,
    secret: webhookSecret,
  });
  const result = await fetch(`${apiBase}/webhooks/stripe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Stripe-Signature": signature,
    },
    body: payload,
  });
  if (!result.ok) {
    throw new Error(
      `It rejected the simulated Stripe event (${result.status}).`,
    );
  }
}

function checkoutMarkup(checkout: MockCheckout) {
  const amount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: checkout.currency.toUpperCase(),
  }).format(checkout.amountMinor / 100);
  const cadence = checkout.mode === "subscription" ? " each month" : " once";
  const actions = checkout.completed
    ? checkout.mode === "payment"
      ? checkout.refunded
        ? "<p>This simulated payment has been fully refunded.</p>"
        : `<form method="post" action="/checkout/${checkout.id}/refund"><button>Simulate full refund</button></form>`
      : "<p>This simulated monthly checkout has completed.</p>"
    : `<form method="post" action="/checkout/${checkout.id}/complete"><button>Simulate successful payment</button></form>
<form method="post" action="/checkout/${checkout.id}/cancel"><button class="secondary">Cancel checkout</button></form>`;
  return `<p>This local simulator exercises It’s Checkout and signed webhook path. It does not contact Stripe or take a real payment.</p>
<p><strong>${amount}${cadence}</strong></p>
${actions}`;
}

function portalMarkup(portal: MockPortal) {
  return `<p>This local simulator exercises It’s subscription management return path. No billing settings are changed at Stripe.</p>
<p>Monthly support is currently set to continue.</p>
<form method="post" action="/portal/${portal.id}/cancel"><button>Simulate cancel at period end</button></form>
<a class="button secondary" href="${portal.returnUrl}">Return to It</a>`;
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", `http://127.0.0.1:${port}`);
    if (request.method === "GET" && url.pathname === "/health") {
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ status: "ok", mode: "local-mock" }));
      return;
    }

    if (request.method === "POST" && url.pathname === "/v1/checkout/sessions") {
      const form = new URLSearchParams(await readBody(request));
      const contributionId =
        form.get("metadata[supportContributionId]") ??
        form.get("client_reference_id");
      const amountMinor = Number(
        form.get("line_items[0][price_data][unit_amount]"),
      );
      const currency = form.get("line_items[0][price_data][currency]");
      const mode = form.get("mode");
      if (
        !contributionId ||
        !Number.isSafeInteger(amountMinor) ||
        !currency ||
        (mode !== "payment" && mode !== "subscription")
      ) {
        response.writeHead(400).end("Invalid Checkout request");
        return;
      }

      const checkout: MockCheckout = {
        id: id("cs_test"),
        customerId: id("cus_test"),
        contributionId,
        amountMinor,
        currency,
        mode,
        metadata: { supportContributionId: contributionId },
        paymentIntentId: id("pi_test"),
        subscriptionId: id("sub_test"),
        successUrl:
          form.get("success_url") ??
          `${appBase}/support-it?status=success&ref=${contributionId}`,
        cancelUrl:
          form.get("cancel_url") ??
          `${appBase}/support-it?status=cancelled&ref=${contributionId}`,
        created: Math.floor(Date.now() / 1000),
        completed: false,
        refunded: false,
      };
      checkouts.set(checkout.id, checkout);
      const base = `http://127.0.0.1:${port}`;
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(
        JSON.stringify({
          id: checkout.id,
          object: "checkout.session",
          url: `${base}/checkout/${checkout.id}`,
          customer: checkout.customerId,
          subscription:
            checkout.mode === "subscription" ? checkout.subscriptionId : null,
          payment_intent:
            checkout.mode === "payment" ? checkout.paymentIntentId : null,
          client_reference_id: checkout.contributionId,
          metadata: checkout.metadata,
          mode: checkout.mode,
          status: "open",
          payment_status: "unpaid",
          amount_total: checkout.amountMinor,
          currency: checkout.currency,
          created: checkout.created,
          livemode: false,
        }),
      );
      return;
    }

    if (
      request.method === "POST" &&
      url.pathname === "/v1/billing_portal/sessions"
    ) {
      const form = new URLSearchParams(await readBody(request));
      const customerId = form.get("customer");
      const checkout = [...checkouts.values()].find(
        (candidate) => candidate.customerId === customerId,
      );
      if (!checkout || checkout.mode !== "subscription") {
        response.writeHead(404).end("No local subscription for this customer");
        return;
      }
      const portal: MockPortal = {
        id: id("bps_test"),
        checkout,
        returnUrl: form.get("return_url") ?? `${appBase}/support-it`,
      };
      portals.set(portal.id, portal);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(
        JSON.stringify({
          id: portal.id,
          object: "billing_portal.session",
          url: `http://127.0.0.1:${port}/portal/${portal.id}`,
          customer: customerId,
          return_url: portal.returnUrl,
        }),
      );
      return;
    }

    const checkoutRoute = url.pathname.match(/^\/checkout\/([^/]+)$/);
    if (request.method === "GET" && checkoutRoute) {
      const checkout = checkouts.get(checkoutRoute[1]!);
      if (!checkout) {
        response.writeHead(404).end("Local Checkout session not found");
        return;
      }
      sendHtml(
        response,
        "Support It · Local Stripe simulator",
        checkoutMarkup(checkout),
      );
      return;
    }

    const completeRoute = url.pathname.match(/^\/checkout\/([^/]+)\/complete$/);
    if (request.method === "POST" && completeRoute) {
      const checkout = checkouts.get(completeRoute[1]!);
      if (!checkout) {
        response.writeHead(404).end("Local Checkout session not found");
        return;
      }
      await readBody(request);
      await sendStripeEvent("checkout.session.completed", {
        id: checkout.id,
        object: "checkout.session",
        client_reference_id: checkout.contributionId,
        metadata: checkout.metadata,
        customer: checkout.customerId,
        subscription:
          checkout.mode === "subscription" ? checkout.subscriptionId : null,
        payment_intent:
          checkout.mode === "payment" ? checkout.paymentIntentId : null,
        mode: checkout.mode,
        status: "complete",
        payment_status: "paid",
        amount_total: checkout.amountMinor,
        currency: checkout.currency,
        created: checkout.created,
      });
      if (checkout.mode === "subscription") {
        await sendStripeEvent("invoice.paid", {
          id: id("in_test"),
          object: "invoice",
          amount_paid: checkout.amountMinor,
          amount_due: checkout.amountMinor,
          currency: checkout.currency,
          parent: {
            type: "subscription_details",
            subscription_details: { subscription: checkout.subscriptionId },
          },
        });
      }
      checkout.completed = true;
      response.writeHead(303, { Location: checkout.successUrl });
      response.end();
      return;
    }

    const refundRoute = url.pathname.match(/^\/checkout\/([^/]+)\/refund$/);
    if (request.method === "POST" && refundRoute) {
      const checkout = checkouts.get(refundRoute[1]!);
      if (!checkout || checkout.mode !== "payment" || !checkout.completed) {
        response.writeHead(409).end("No completed one-time payment to refund");
        return;
      }
      if (checkout.refunded) {
        response.writeHead(303, { Location: checkout.successUrl });
        response.end();
        return;
      }
      await readBody(request);
      const refundId = id("re_test");
      await sendStripeEvent("charge.refunded", {
        id: id("ch_test"),
        object: "charge",
        amount: checkout.amountMinor,
        amount_refunded: checkout.amountMinor,
        currency: checkout.currency,
        paid: true,
        payment_intent: checkout.paymentIntentId,
        refunded: true,
        refunds: {
          object: "list",
          data: [
            {
              id: refundId,
              object: "refund",
              amount: checkout.amountMinor,
              currency: checkout.currency,
              payment_intent: checkout.paymentIntentId,
              status: "succeeded",
            },
          ],
          has_more: false,
          url: "/v1/charges/ch_test/refunds",
        },
      });
      checkout.refunded = true;
      response.writeHead(303, { Location: checkout.successUrl });
      response.end();
      return;
    }

    const cancelRoute = url.pathname.match(/^\/checkout\/([^/]+)\/cancel$/);
    if (request.method === "POST" && cancelRoute) {
      const checkout = checkouts.get(cancelRoute[1]!);
      if (!checkout) {
        response.writeHead(404).end("Local Checkout session not found");
        return;
      }
      await readBody(request);
      await sendStripeEvent("checkout.session.expired", {
        id: checkout.id,
        object: "checkout.session",
        client_reference_id: checkout.contributionId,
        metadata: checkout.metadata,
        mode: checkout.mode,
      });
      response.writeHead(303, { Location: checkout.cancelUrl });
      response.end();
      return;
    }

    const portalRoute = url.pathname.match(/^\/portal\/([^/]+)$/);
    if (request.method === "GET" && portalRoute) {
      const portal = portals.get(portalRoute[1]!);
      if (!portal) {
        response.writeHead(404).end("Local billing portal session not found");
        return;
      }
      sendHtml(
        response,
        "Manage monthly support · Local simulator",
        portalMarkup(portal),
      );
      return;
    }

    const cancelPortalRoute = url.pathname.match(/^\/portal\/([^/]+)\/cancel$/);
    if (request.method === "POST" && cancelPortalRoute) {
      const portal = portals.get(cancelPortalRoute[1]!);
      if (!portal) {
        response.writeHead(404).end("Local billing portal session not found");
        return;
      }
      await readBody(request);
      await sendStripeEvent("customer.subscription.updated", {
        id: portal.checkout.subscriptionId,
        object: "subscription",
        customer: portal.checkout.customerId,
        status: "active",
        cancel_at_period_end: true,
        metadata: portal.checkout.metadata,
      });
      response.writeHead(303, { Location: portal.returnUrl });
      response.end();
      return;
    }

    response.writeHead(404).end("Not found");
  } catch (error) {
    log.error("stripe_simulator_request_failed", { cause: error });
    response.writeHead(502).end("Local payment simulator could not reach It");
  }
});

server.listen(port, "127.0.0.1", () => {
  log.info("stripe_simulator_listening", { url: `http://127.0.0.1:${port}` });
});

process.on("SIGINT", () => server.close());
process.on("SIGTERM", () => server.close());
