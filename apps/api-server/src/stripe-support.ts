import { createHash, randomUUID } from "node:crypto";
import Stripe from "stripe";
import type { ItDatabase } from "@it/database/database";
import type { SupportFrequency } from "@it/domain/support";
import {
  attachStripeCheckout,
  createPendingStripeContribution,
  readSupportContributionStatus,
  recordStripeEvent,
  readSupportContributionForPortal,
} from "@it/database/support-repository";

function objectId(value: string | { id: string } | null | undefined) {
  return typeof value === "string" ? value : (value?.id ?? null);
}

function contributionStatus(
  status: Stripe.Subscription.Status,
): "active" | "past_due" | "canceled" | "pending" {
  if (status === "active" || status === "trialing") return "active";
  if (status === "past_due" || status === "unpaid") return "past_due";
  if (status === "canceled" || status === "incomplete_expired")
    return "canceled";
  return "pending";
}

function stripeClient(secretKey: string) {
  const apiBase = process.env.STRIPE_API_BASE;
  if (!apiBase) return new Stripe(secretKey);
  if (process.env.NODE_ENV === "production") {
    throw new Error("STRIPE_API_BASE is only allowed outside production.");
  }

  const url = new URL(apiBase);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.pathname !== "/" ||
    url.search ||
    url.hash ||
    url.username ||
    url.password
  ) {
    throw new Error("STRIPE_API_BASE must be a bare HTTP(S) origin.");
  }
  return new Stripe(secretKey, {
    host: url.hostname,
    ...(url.port ? { port: Number(url.port) } : {}),
    protocol: url.protocol.slice(0, -1) as "http" | "https",
  });
}

export function createStripeSupport(db: ItDatabase) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const productId = process.env.STRIPE_SUPPORT_PRODUCT_ID;
  const stripe = secretKey ? stripeClient(secretKey) : null;
  const appUrl = process.env.PUBLIC_APP_URL ?? "http://localhost:8082";

  return {
    async createCheckout(input: {
      amountMinor: number;
      frequency: SupportFrequency;
      userId: string;
    }) {
      if (!stripe || !productId) throw new Error("STRIPE_NOT_CONFIGURED");

      const id = randomUUID();
      await createPendingStripeContribution(db, {
        id,
        userId: input.userId,
        amountMinor: input.amountMinor,
        currency: "usd",
        frequency: input.frequency,
      });

      try {
        const session = await stripe.checkout.sessions.create(
          {
            mode: input.frequency === "once" ? "payment" : "subscription",
            line_items: [
              {
                quantity: 1,
                price_data: {
                  currency: "usd",
                  unit_amount: input.amountMinor,
                  product: productId,
                  ...(input.frequency === "monthly"
                    ? { recurring: { interval: "month" as const } }
                    : {}),
                },
              },
            ],
            ...(input.frequency === "once"
              ? { customer_creation: "always" as const }
              : {}),
            client_reference_id: id,
            metadata: { supportContributionId: id },
            ...(input.frequency === "once"
              ? {
                  payment_intent_data: {
                    metadata: { supportContributionId: id },
                  },
                }
              : {}),
            ...(input.frequency === "monthly"
              ? {
                  subscription_data: {
                    metadata: { supportContributionId: id },
                  },
                }
              : {}),
            success_url: `${appUrl}/support-it?status=success&ref=${id}`,
            cancel_url: `${appUrl}/support-it?status=cancelled&ref=${id}`,
          },
          { idempotencyKey: `it-support-${id}` },
        );

        if (!session.url)
          throw new Error("Stripe did not return a Checkout URL.");
        await attachStripeCheckout(db, {
          id,
          checkoutSessionId: session.id,
          customerId: objectId(session.customer),
        });
        return { url: session.url, reference: id };
      } catch (error) {
        await db
          .updateTable("support_contributions")
          .set({ status: "failed", updated_at: new Date() })
          .where("id", "=", id)
          .execute();
        throw error;
      }
    },
    async getStatus(reference: string, userId: string) {
      const record = await readSupportContributionStatus(db, reference, userId);
      if (!record) throw new Error("SUPPORT_CONTRIBUTION_NOT_FOUND");
      return record;
    },
    async createPortal(reference: string, userId: string) {
      if (!stripe) throw new Error("STRIPE_NOT_CONFIGURED");
      const contribution = await readSupportContributionForPortal(
        db,
        reference,
        userId,
      );
      if (!contribution) throw new Error("SUPPORT_CONTRIBUTION_NOT_FOUND");
      if (
        !contribution.stripe_customer_id ||
        !contribution.stripe_subscription_id
      )
        throw new Error("SUPPORT_PORTAL_NOT_AVAILABLE");
      const session = await stripe.billingPortal.sessions.create({
        customer: contribution.stripe_customer_id,
        return_url: `${appUrl}/support-it`,
      });
      return { url: session.url };
    },
  };
}

export function parseStripeWebhook(rawBody: Buffer, signature: string) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("STRIPE_WEBHOOK_NOT_CONFIGURED");
  const stripe = process.env.STRIPE_SECRET_KEY
    ? stripeClient(process.env.STRIPE_SECRET_KEY)
    : null;
  if (!stripe) throw new Error("STRIPE_NOT_CONFIGURED");
  return stripe.webhooks.constructEvent(rawBody, signature, secret);
}

export async function processStripeWebhook(
  db: ItDatabase,
  event: Stripe.Event,
  rawBody: Buffer,
) {
  const data = event.data.object;
  const base = {
    eventId: event.id,
    bodySha256: createHash("sha256").update(rawBody).digest("hex"),
    type: event.type,
    createdAt: new Date(event.created * 1000),
  };

  if (event.type === "checkout.session.completed") {
    const session = data as Stripe.Checkout.Session;
    const paid = session.payment_status === "paid";
    await recordStripeEvent(db, {
      ...base,
      contributionId:
        session.metadata?.supportContributionId ??
        session.client_reference_id ??
        undefined,
      checkoutSessionId: session.id,
      customerId: objectId(session.customer) ?? undefined,
      subscriptionId: objectId(session.subscription) ?? undefined,
      paymentIntentId: objectId(session.payment_intent) ?? undefined,
      transactionId:
        objectId(session.payment_intent) ??
        (session.mode === "payment" && paid ? session.id : undefined),
      amountMinor: session.amount_total ?? undefined,
      currency: session.currency ?? undefined,
      transactionStatus: paid ? "succeeded" : undefined,
      contributionStatus: paid
        ? session.mode === "subscription"
          ? "active"
          : "succeeded"
        : "pending",
    });
    return;
  }

  if (event.type === "checkout.session.async_payment_succeeded") {
    const session = data as Stripe.Checkout.Session;
    await recordStripeEvent(db, {
      ...base,
      contributionId:
        session.metadata?.supportContributionId ??
        session.client_reference_id ??
        undefined,
      checkoutSessionId: session.id,
      customerId: objectId(session.customer) ?? undefined,
      transactionId: objectId(session.payment_intent) ?? session.id,
      paymentIntentId: objectId(session.payment_intent) ?? undefined,
      amountMinor: session.amount_total ?? undefined,
      currency: session.currency ?? undefined,
      transactionStatus: "succeeded",
      contributionStatus: "succeeded",
    });
    return;
  }

  if (event.type === "checkout.session.async_payment_failed") {
    const session = data as Stripe.Checkout.Session;
    await recordStripeEvent(db, {
      ...base,
      contributionId:
        session.metadata?.supportContributionId ??
        session.client_reference_id ??
        undefined,
      checkoutSessionId: session.id,
      contributionStatus: "failed",
    });
    return;
  }

  if (event.type === "checkout.session.expired") {
    const session = data as Stripe.Checkout.Session;
    await recordStripeEvent(db, {
      ...base,
      contributionId:
        session.metadata?.supportContributionId ??
        session.client_reference_id ??
        undefined,
      checkoutSessionId: session.id,
      contributionStatus: "expired",
    });
    return;
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = data as Stripe.PaymentIntent;
    await recordStripeEvent(db, {
      ...base,
      contributionId: paymentIntent.metadata.supportContributionId ?? undefined,
      paymentIntentId: paymentIntent.id,
      transactionId: paymentIntent.id,
      amountMinor: paymentIntent.amount_received,
      currency: paymentIntent.currency,
      transactionStatus: "succeeded",
      contributionStatus: "succeeded",
    });
    return;
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = data as Stripe.PaymentIntent;
    await recordStripeEvent(db, {
      ...base,
      contributionId: paymentIntent.metadata.supportContributionId ?? undefined,
      paymentIntentId: paymentIntent.id,
      contributionStatus: "failed",
    });
    return;
  }

  if (
    event.type === "refund.created" ||
    event.type === "refund.updated" ||
    event.type === "refund.failed"
  ) {
    const refund = data as Stripe.Refund;
    const transactionStatus =
      refund.status === "succeeded"
        ? "refunded"
        : refund.status === "failed" || refund.status === "canceled"
          ? "failed"
          : undefined;
    await recordStripeEvent(db, {
      ...base,
      paymentIntentId: objectId(refund.payment_intent) ?? undefined,
      transactionId: transactionStatus ? refund.id : undefined,
      amountMinor: transactionStatus ? refund.amount : undefined,
      currency: transactionStatus ? (refund.currency ?? undefined) : undefined,
      transactionStatus,
    });
    return;
  }

  if (event.type === "charge.refunded") {
    const charge = data as Stripe.Charge;
    const refund = charge.refunds?.data.at(-1);
    await recordStripeEvent(db, {
      ...base,
      paymentIntentId: objectId(charge.payment_intent) ?? undefined,
      transactionId: refund?.id ?? undefined,
      amountMinor: refund?.amount ?? charge.amount_refunded,
      currency: charge.currency,
      transactionStatus: "refunded",
      contributionStatus:
        charge.amount_refunded >= charge.amount ? "refunded" : undefined,
    });
    return;
  }

  if (
    event.type === "invoice.paid" ||
    event.type === "invoice.payment_failed"
  ) {
    const invoice = data as Stripe.Invoice;
    const subscriptionId =
      objectId(invoice.parent?.subscription_details?.subscription) ?? undefined;
    await recordStripeEvent(db, {
      ...base,
      subscriptionId,
      transactionId: invoice.id,
      amountMinor:
        event.type === "invoice.paid"
          ? invoice.amount_paid
          : invoice.amount_due,
      currency: invoice.currency,
      transactionStatus: event.type === "invoice.paid" ? "succeeded" : "failed",
      contributionStatus: event.type === "invoice.paid" ? "active" : "past_due",
    });
    return;
  }

  if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const subscription = data as Stripe.Subscription;
    await recordStripeEvent(db, {
      ...base,
      contributionId: subscription.metadata.supportContributionId ?? undefined,
      subscriptionId: subscription.id,
      customerId: objectId(subscription.customer) ?? undefined,
      contributionStatus:
        event.type === "customer.subscription.deleted"
          ? "canceled"
          : subscription.cancel_at_period_end
            ? "cancel_scheduled"
            : contributionStatus(subscription.status),
    });
  }
}
