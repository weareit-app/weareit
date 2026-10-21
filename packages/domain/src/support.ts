import { z } from "zod";

// Support It payments: how often, who processes them, and where they stand.

export const supportFrequencySchema = z.enum(["once", "monthly"]);
export type SupportFrequency = z.infer<typeof supportFrequencySchema>;

export const paymentProcessorSchema = z.enum([
  "stripe",
  "app_store",
  "play_store",
]);
export type PaymentProcessor = z.infer<typeof paymentProcessorSchema>;

export const contributionStatusSchema = z.enum([
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
export type ContributionStatus = z.infer<typeof contributionStatusSchema>;

export const transactionStatusSchema = z.enum([
  "succeeded",
  "failed",
  "refunded",
  "partially_refunded",
]);
export type TransactionStatus = z.infer<typeof transactionStatusSchema>;
