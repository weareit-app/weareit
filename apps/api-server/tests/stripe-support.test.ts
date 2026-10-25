import Stripe from "stripe";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { recordStripeEvent } = vi.hoisted(() => ({
  recordStripeEvent: vi.fn(),
}));

vi.mock("@it/database/support-repository", () => ({
  attachStripeCheckout: vi.fn(),
  createPendingStripeContribution: vi.fn(),
  readSupportContributionForPortal: vi.fn(),
  readSupportContributionStatus: vi.fn(),
  recordStripeEvent,
}));

import {
  parseStripeWebhook,
  processStripeWebhook,
} from "../src/stripe-support";

const webhookSecret = "whsec_test_payments";
const stripe = {
  secretKey: "sk_test_payments",
  productId: "prod_test_payments",
  webhookSecret,
};

function signedEvent(event: Record<string, unknown>) {
  const rawBody = Buffer.from(JSON.stringify(event));
  const signature = Stripe.webhooks.generateTestHeaderString({
    payload: rawBody.toString("utf8"),
    secret: webhookSecret,
  });
  return { rawBody, signature };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Stripe support webhooks", () => {
  it("verifies Stripe signatures against the exact raw request body", () => {
    const event = {
      id: "evt_checkout",
      object: "event",
      api_version: "2026-09-30.clover",
      created: 1_791_950_400,
      data: { object: { id: "cs_test_checkout" } },
      livemode: false,
      pending_webhooks: 1,
      type: "checkout.session.completed",
    };
    const { rawBody, signature } = signedEvent(event);

    expect(parseStripeWebhook(rawBody, signature, stripe).id).toBe(
      "evt_checkout",
    );
    expect(() =>
      parseStripeWebhook(
        Buffer.from(`${rawBody.toString()} `),
        signature,
        stripe,
      ),
    ).toThrow();
  });

  it("rejects a Stripe signature created with another endpoint secret", () => {
    const { rawBody } = signedEvent({ id: "evt_bad_secret" });
    const wrongSignature = Stripe.webhooks.generateTestHeaderString({
      payload: rawBody.toString("utf8"),
      secret: "whsec_another_endpoint",
    });

    expect(() => parseStripeWebhook(rawBody, wrongSignature, stripe)).toThrow();
  });

  it("records a successful one-time checkout with its It contribution reference", async () => {
    const created = 1_791_950_400;
    const event = {
      id: "evt_checkout_paid",
      object: "event",
      api_version: "2026-09-30.clover",
      created,
      data: {
        object: {
          id: "cs_test_paid",
          object: "checkout.session",
          mode: "payment",
          payment_status: "paid",
          amount_total: 1500,
          currency: "usd",
          client_reference_id: "00000000-0000-4000-8000-000000000001",
          metadata: {
            supportContributionId: "00000000-0000-4000-8000-000000000001",
          },
          customer: "cus_test_paid",
          payment_intent: "pi_test_paid",
          subscription: null,
        },
      },
      livemode: false,
      pending_webhooks: 1,
      type: "checkout.session.completed",
    };

    await processStripeWebhook(
      {} as never,
      event as unknown as Stripe.Event,
      Buffer.from(JSON.stringify(event)),
    );

    expect(recordStripeEvent).toHaveBeenCalledWith(
      {},
      expect.objectContaining({
        eventId: "evt_checkout_paid",
        type: "checkout.session.completed",
        contributionId: "00000000-0000-4000-8000-000000000001",
        checkoutSessionId: "cs_test_paid",
        customerId: "cus_test_paid",
        paymentIntentId: "pi_test_paid",
        transactionId: "pi_test_paid",
        amountMinor: 1500,
        currency: "usd",
        transactionStatus: "succeeded",
        contributionStatus: "succeeded",
        createdAt: new Date(created * 1000),
      }),
    );
  });

  it("links paid subscription invoices by subscription ID", async () => {
    const event = {
      id: "evt_invoice_paid",
      object: "event",
      api_version: "2026-09-30.clover",
      created: 1_791_950_400,
      data: {
        object: {
          id: "in_test_monthly",
          object: "invoice",
          parent: {
            subscription_details: { subscription: "sub_test_monthly" },
          },
          amount_paid: 1500,
          amount_due: 1500,
          currency: "usd",
        },
      },
      livemode: false,
      pending_webhooks: 1,
      type: "invoice.paid",
    };

    await processStripeWebhook(
      {} as never,
      event as unknown as Stripe.Event,
      Buffer.from(JSON.stringify(event)),
    );

    expect(recordStripeEvent).toHaveBeenCalledWith(
      {},
      expect.objectContaining({
        eventId: "evt_invoice_paid",
        subscriptionId: "sub_test_monthly",
        transactionId: "in_test_monthly",
        amountMinor: 1500,
        transactionStatus: "succeeded",
        contributionStatus: "active",
      }),
    );
  });

  it("records a full charge refund against its payment intent", async () => {
    const event = {
      id: "evt_charge_refunded",
      object: "event",
      api_version: "2026-09-30.clover",
      created: 1_791_950_400,
      data: {
        object: {
          id: "ch_test_refunded",
          object: "charge",
          amount: 1500,
          amount_refunded: 1500,
          currency: "usd",
          payment_intent: "pi_test_refunded",
          refunds: {
            object: "list",
            data: [
              {
                id: "re_test_refunded",
                object: "refund",
                amount: 1500,
                currency: "usd",
                payment_intent: "pi_test_refunded",
                status: "succeeded",
              },
            ],
            has_more: false,
            url: "/v1/charges/ch_test_refunded/refunds",
          },
        },
      },
      livemode: false,
      pending_webhooks: 1,
      type: "charge.refunded",
    };

    await processStripeWebhook(
      {} as never,
      event as unknown as Stripe.Event,
      Buffer.from(JSON.stringify(event)),
    );

    expect(recordStripeEvent).toHaveBeenCalledWith(
      {},
      expect.objectContaining({
        eventId: "evt_charge_refunded",
        type: "charge.refunded",
        paymentIntentId: "pi_test_refunded",
        transactionId: "re_test_refunded",
        amountMinor: 1500,
        currency: "usd",
        transactionStatus: "refunded",
        contributionStatus: "refunded",
      }),
    );
  });
});
