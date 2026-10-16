import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { recordRevenueCatSupportEvent } = vi.hoisted(() => ({
  recordRevenueCatSupportEvent: vi.fn(),
}));

vi.mock("@it/database/support-repository", () => ({
  recordRevenueCatSupportEvent,
}));

import {
  parseRevenueCatWebhook,
  processRevenueCatWebhook,
  verifyRevenueCatWebhook,
} from "../src/revenuecat-support";

const webhookSecret = "rc_whsec_test_payments";

function signedHeader(
  rawBody: Buffer,
  timestamp = Math.floor(Date.now() / 1000),
) {
  const signature = createHmac("sha256", webhookSecret)
    .update(`${timestamp}.`)
    .update(rawBody)
    .digest("hex");
  return `t=${timestamp},v1=${signature}`;
}

beforeEach(() => {
  vi.stubEnv("REVENUECAT_WEBHOOK_SECRET", webhookSecret);
  vi.clearAllMocks();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("RevenueCat support webhooks", () => {
  it("validates timestamped HMAC signatures over the raw request body", () => {
    const rawBody = Buffer.from('{"api_version":"1.0","event":{}}');
    const header = signedHeader(rawBody);

    expect(() => verifyRevenueCatWebhook(rawBody, header)).not.toThrow();
    expect(() =>
      verifyRevenueCatWebhook(Buffer.from(`${rawBody.toString()} `), header),
    ).toThrow("INVALID_REVENUECAT_SIGNATURE");
    expect(() =>
      verifyRevenueCatWebhook(rawBody, signedHeader(rawBody, 1)),
    ).toThrow("INVALID_REVENUECAT_SIGNATURE");
  });

  it("rejects malformed RevenueCat payloads before persistence", () => {
    expect(() => parseRevenueCatWebhook(Buffer.from("not-json"))).toThrow();
    expect(() =>
      parseRevenueCatWebhook(Buffer.from(JSON.stringify({ event: {} }))),
    ).toThrow();
    expect(recordRevenueCatSupportEvent).not.toHaveBeenCalled();
  });

  it("normalizes store transaction data without forwarding RevenueCat identity", async () => {
    const rawBody = Buffer.from(
      JSON.stringify({
        api_version: "1.0",
        event: {
          id: "rc_event_123",
          type: "NON_RENEWING_PURCHASE",
          store: "APP_STORE",
          transaction_id: "store_tx_456",
          original_transaction_id: "store_original_456",
          product_id: "it_support_15",
          price_in_purchased_currency: 15,
          currency: "USD",
          event_timestamp_ms: 1_791_950_400_000,
          app_user_id: "$RCAnonymousID:private-value",
        },
      }),
    );

    const event = parseRevenueCatWebhook(rawBody);
    await processRevenueCatWebhook({} as never, event);

    expect(recordRevenueCatSupportEvent).toHaveBeenCalledWith(
      {},
      expect.objectContaining({
        eventId: "rc_event_123",
        type: "NON_RENEWING_PURCHASE",
        store: "APP_STORE",
        transactionId: "store_tx_456",
        originalTransactionId: "store_original_456",
        productId: "it_support_15",
        price: 15,
        currency: "USD",
        occurredAt: new Date(1_791_950_400_000),
      }),
    );
    expect(recordRevenueCatSupportEvent.mock.calls[0]?.[1]).not.toHaveProperty(
      "appUserId",
    );
  });
});
