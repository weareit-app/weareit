// Failures of the payment services that their callers act on. The router
// maps the first three to declared contract errors. For webhooks, the server
// answers 503 while a webhook secret isn't set, and 400 to a bad signature.

// Stripe's secret key or support product isn't set.
export class PaymentsNotConfiguredError extends Error {
  constructor() {
    super(
      "Stripe is not configured: set STRIPE_SECRET_KEY and STRIPE_SUPPORT_PRODUCT_ID.",
    );
    this.name = "PaymentsNotConfiguredError";
  }
}

// No support with this reference belongs to the signed-in account. Records
// owned by another account (or by no account) report this too, so
// references can't be probed.
export class SupportContributionNotFoundError extends Error {
  constructor() {
    super("Support contribution not found for this account.");
    this.name = "SupportContributionNotFoundError";
  }
}

// The support is one-time, so there is no subscription to manage.
export class SupportNotRecurringError extends Error {
  constructor() {
    super("This support has no Stripe subscription to manage.");
    this.name = "SupportNotRecurringError";
  }
}

export class WebhookNotConfiguredError extends Error {
  constructor(readonly processor: "stripe" | "revenuecat") {
    super(`The ${processor} webhook secret is not set.`);
    this.name = "WebhookNotConfiguredError";
  }
}

// A webhook's signature header is missing parts, too old, or doesn't match
// the body.
export class WebhookSignatureError extends Error {
  constructor(readonly processor: "revenuecat") {
    super(`The ${processor} webhook signature didn't verify.`);
    this.name = "WebhookSignatureError";
  }
}
