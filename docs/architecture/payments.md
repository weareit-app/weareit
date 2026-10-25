# Support payments

> **Update 2026-10-16 (founder):** web payment moves from hosted Checkout to an embedded Stripe form inside It; support can be one-time, monthly or annual on web and iOS. Sections below still describe the hosted-Checkout implementation and need revising. See `docs/architecture/decisions.md`.

## Provider boundaries

- Stripe is It's web payments platform. Stripe owns Checkout, recurring billing, customer records, invoices, refunds, and customer-portal actions.
- It keeps a provider-neutral contribution and transaction ledger in PostgreSQL. It stores the authenticated It user ID when one is available, Stripe customer/session/subscription/payment-intent IDs, store transaction IDs, amounts, currencies, status, and timestamps. It does not copy card or billing-address data.
- Stripe webhooks are verified against the raw request body and deduplicated by event ID before updating It's records. Contribution and transaction state advances only when the provider event is at least as recent as the last event applied, so delayed deliveries can't undo a newer cancellation or refund. The return page reads It's ledger; a browser redirect alone never confirms payment.
- Webhook handlers return `200` only after the ledger write succeeds. Invalid signatures or malformed payloads return `400`; a database or processing failure returns `500`, allowing the provider's delivery retry policy to recover the event.
- RevenueCat is an optional adapter for Apple and Google store purchases. Store transactions bypass Stripe. RevenueCat webhook events update the same It-owned ledger, keyed by store and original transaction ID. It does not retain RevenueCat's anonymous app-user ID or use RevenueCat for product access decisions.
- The iOS app does not initialize RevenueCat or request offerings when the support screen opens. It initializes the SDK only after someone taps the Apple purchase button, avoiding provider-side anonymous identity creation during onboarding and browsing.
- Web checkout does not route through RevenueCat. Removing RevenueCat leaves Stripe products, subscriptions, customer records, and web checkout intact; only the native store adapter/webhook path would need replacement.
- Contributions do not grant product access and are never described as charitable donations.

## MVP purchase paths

- Web: Stripe Checkout supports one-time amounts from $1 to $1,000 and monthly recurring support. Stripe's customer portal manages monthly subscriptions. The selected amount and cadence come from the app; secrets and Checkout creation stay server-side.
- iOS: RevenueCat presents three StoreKit consumable tips (`it_support_5`, `it_support_15`, `it_support_30`). The screen shows USD-denominated choices, and StoreKit displays its localized price on the purchase confirmation. It offers one-time tips only; monthly patronage remains on web because the app does not currently provide ongoing subscription benefits.
- RevenueCat SDKs require a custom Expo development build; Expo Go cannot complete real store purchases. App Store products and agreements must be ready in App Store Connect before sandbox purchases can succeed.
- Stripe Connect and third-party payouts are out of scope for this MVP. The current support flow collects optional contributions for It and has no recipient or disbursement workflow.

## Local and provider setup

1. Create a Stripe test-mode product named **Support It** and set its product ID as `STRIPE_SUPPORT_PRODUCT_ID`. Use test keys in `STRIPE_SECRET_KEY`; never put a Stripe secret in an Expo `EXPO_PUBLIC_` variable.
2. Set `PUBLIC_APP_URL` to the public web origin. Locally it defaults to `http://localhost:8082`.
3. Forward Stripe events to `http://localhost:3001/webhooks/stripe` (for local CLI testing, `stripe listen --forward-to localhost:3001/webhooks/stripe`) and set the signing secret it prints as `STRIPE_WEBHOOK_SECRET`. Enable Checkout, refund, and subscription events: `checkout.session.completed`, `checkout.session.expired`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `payment_intent.succeeded`, `payment_intent.payment_failed`, `refund.created`, `refund.updated`, `refund.failed`, `charge.refunded`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated`, and `customer.subscription.deleted`.
4. In RevenueCat, add the iOS app, create the three consumable products above, and put them in the current offering. Set its public iOS SDK key as `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY`.
5. Configure a RevenueCat webhook at `/webhooks/revenuecat`, enable HMAC signing, and set its signing secret as `REVENUECAT_WEBHOOK_SECRET`. Select production and sandbox store events.
6. Apply the database schema with `pnpm db:migrate` and make a fresh iOS development build with `pnpm --filter @it/app exec expo run:ios` after the SDK or native dependencies change.

### Local Stripe API mock

Stripe's official [`stripe-mock`](https://github.com/stripe/stripe-mock) can validate the Stripe SDK's HTTP request paths and parameter types without a Stripe account or network access. It returns hardcoded, stateless responses, including a Checkout URL that does not represent a usable hosted session, so it cannot simulate Checkout's payment lifecycle or replace a test-mode checkout. Install it with `brew install stripe/stripe-mock/stripe-mock`, start it with `stripe-mock`, and set `STRIPE_API_BASE=http://localhost:12111`, `STRIPE_SECRET_KEY=sk_test_123`, `STRIPE_SUPPORT_PRODUCT_ID=prod_123`, and `STRIPE_WEBHOOK_SECRET=whsec_123` in `.env`; the server refuses part of the Stripe group. Keep `STRIPE_API_BASE` unset in production. Use Stripe test mode and the Stripe CLI for an end-to-end provider test.

For a complete web flow without Stripe credentials, run the stateful It simulator in one terminal with `pnpm --filter @it/api-server mock-stripe`. In a second terminal, run the API with its local mock configuration using `pnpm --filter @it/api-server dev:mock`. The simulator serves Checkout and billing portal pages on `http://127.0.0.1:12111`, then sends Stripe-signed simulated events to the local It API. The checkout page can simulate success or cancellation; after a successful one-time payment, reopen that checkout URL to simulate a full refund. The portal can simulate cancellation at the end of a monthly billing period. The `dev:mock` command sets a fake Stripe key, product ID, webhook secret, and API origin in process memory, always routing Stripe SDK calls to the local simulator. It never contacts Stripe and refuses to run when `NODE_ENV=production`. Run Stripe test mode separately before launch.

`.env.example` lists all app-side values. Credentials belong only in the ignored `.env` file or the deployment secret store. Do not use live Stripe keys for local development.

## Operational notes

- Stripe's webhook event IDs and RevenueCat's event IDs are stored with body hashes for idempotency; full webhook payloads are not retained.
- Apple/Google transactions use the store's transaction ID for individual ledger entries and original transaction ID for the contribution relationship. This supports store-side receipts/refunds without making RevenueCat the system of record.
- Support is optional, has no product entitlements, and uses clear price/cadence copy before checkout.
- Before launch, review refund handling and financial-record retention, configure Stripe's customer portal and cancellation behavior, and test Stripe and App Store sandbox flows.

## References

- [Stripe Checkout Sessions](https://docs.stripe.com/api/checkout/sessions)
- [Stripe webhooks](https://docs.stripe.com/webhooks)
- [Stripe customer portal](https://docs.stripe.com/customer-management)
- [RevenueCat Stripe Billing integration](https://www.revenuecat.com/docs/web/integrations/stripe)
- [RevenueCat Expo installation](https://www.revenuecat.com/docs/getting-started/installation/expo)
- [RevenueCat webhooks](https://www.revenuecat.com/docs/integrations/webhooks)
- [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
