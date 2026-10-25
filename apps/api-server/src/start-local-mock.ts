import { readEnv, readLocalMockEnv } from "./env";
import { startApiServer } from "./server";

// Runs the API with a fake Stripe group that routes every Stripe SDK call to
// the local simulator (`mock-stripe.ts`). The values live only in this
// process; it refuses to run in production.
const mock = readLocalMockEnv();
const env = readEnv();
if (env.isProduction)
  throw new Error("The local Stripe mock API cannot run in production.");

await startApiServer({
  ...env,
  stripe: {
    secretKey: "sk_test_local_mock",
    productId: "prod_local_support_it",
    webhookSecret: "whsec_local_mock",
    apiBase: new URL(`http://127.0.0.1:${mock.MOCK_STRIPE_PORT}`),
  },
});
