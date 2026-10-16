if (process.env.NODE_ENV === "production") {
  throw new Error("The local Stripe mock API cannot run in production.");
}

const mockStripePort = Number(process.env.MOCK_STRIPE_PORT || "12111");
if (
  !Number.isInteger(mockStripePort) ||
  mockStripePort < 1 ||
  mockStripePort > 65535
) {
  throw new Error("MOCK_STRIPE_PORT must be a valid TCP port.");
}

process.env.STRIPE_API_BASE = `http://127.0.0.1:${mockStripePort}`;
process.env.STRIPE_SECRET_KEY = "sk_test_local_mock";
process.env.STRIPE_SUPPORT_PRODUCT_ID = "prod_local_support_it";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_local_mock";

export {};

await import("./index");
