import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import type { ItDatabase } from "@it/database/database";
import {
  recordRevenueCatSupportEvent,
  type RevenueCatSupportEvent,
} from "@it/database/support-repository";
import {
  WebhookNotConfiguredError,
  WebhookSignatureError,
} from "./payment-errors";
import type { RevenueCatConfig } from "./env";

const webhookSchema = z.looseObject({
  event: z.looseObject({
    id: z.string().min(1),
    type: z.string().min(1),
    store: z.string().optional().default(""),
    transaction_id: z.string().nullish(),
    original_transaction_id: z.string().nullish(),
    product_id: z.string().nullish(),
    price_in_purchased_currency: z.number().nullish(),
    currency: z.string().nullish(),
    event_timestamp_ms: z.number().nullish(),
    cancel_reason: z.string().nullish(),
  }),
});

export function verifyRevenueCatWebhook(
  rawBody: Buffer,
  signature: string,
  config: RevenueCatConfig | null,
) {
  if (!config) throw new WebhookNotConfiguredError("revenuecat");
  const secret = config.webhookSecret;
  const parts = Object.fromEntries(
    signature.split(",").map((part) => {
      const separator = part.indexOf("=");
      return [part.slice(0, separator), part.slice(separator + 1)];
    }),
  );
  const timestamp = Number(parts.t);
  const received = parts.v1;
  if (
    !Number.isInteger(timestamp) ||
    !received ||
    Math.abs(Date.now() / 1000 - timestamp) > 300
  )
    throw new WebhookSignatureError("revenuecat");
  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.`)
    .update(rawBody)
    .digest();
  const actual = Buffer.from(received, "hex");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected))
    throw new WebhookSignatureError("revenuecat");
}

export function parseRevenueCatWebhook(rawBody: Buffer) {
  const payload = webhookSchema.parse(JSON.parse(rawBody.toString("utf8")));
  const event = payload.event;
  const normalized: RevenueCatSupportEvent = {
    eventId: event.id,
    bodySha256: createHash("sha256").update(rawBody).digest("hex"),
    type: event.type,
    store: event.store,
    transactionId: event.transaction_id ?? undefined,
    originalTransactionId: event.original_transaction_id ?? undefined,
    productId: event.product_id ?? undefined,
    price: event.price_in_purchased_currency ?? undefined,
    currency: event.currency ?? undefined,
    occurredAt: event.event_timestamp_ms
      ? new Date(event.event_timestamp_ms)
      : undefined,
    cancellationReason: event.cancel_reason ?? undefined,
  };
  return normalized;
}

export async function processRevenueCatWebhook(
  db: ItDatabase,
  event: RevenueCatSupportEvent,
) {
  await recordRevenueCatSupportEvent(db, event);
}
