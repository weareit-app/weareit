import { describe, expect, it } from "vitest";
import {
  contributionStatusSchema,
  paymentEventProcessorSchema,
  paymentProcessorSchema,
  supportFrequencySchema,
  transactionStatusSchema,
} from "./support";

// These values are stored in the support tables, whose SQL checks list the
// same ones (migrations 003 and 008). A change here needs a migration too.
describe("support enums", () => {
  it("lists the frequencies", () => {
    expect(supportFrequencySchema.options).toEqual(["once", "monthly"]);
  });

  it("lists the processors", () => {
    expect(paymentProcessorSchema.options).toEqual([
      "stripe",
      "app_store",
      "play_store",
    ]);
  });

  it("lists the payment event processors", () => {
    expect(paymentEventProcessorSchema.options).toEqual([
      "stripe",
      "revenuecat",
    ]);
  });

  it("lists the contribution statuses", () => {
    expect(contributionStatusSchema.options).toEqual([
      "pending",
      "active",
      "succeeded",
      "past_due",
      "cancel_scheduled",
      "canceled",
      "expired",
      "failed",
      "refunded",
    ]);
  });

  it("lists the transaction statuses", () => {
    expect(transactionStatusSchema.options).toEqual([
      "succeeded",
      "failed",
      "refunded",
      "partially_refunded",
    ]);
  });
});
