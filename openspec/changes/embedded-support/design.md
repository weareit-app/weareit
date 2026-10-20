# Design

## Context

See proposal.md (Why). Current state, from `openspec/specs/support` and the code:

- `apps/app/app/support-it.tsx` is one screen: once/monthly, presets $5/$15/$30 plus "Another amount" ($1–$1,000), "Continue to secure checkout", which calls `support.createCheckout` and redirects to Stripe Checkout. Outcome is read from `?status=…&ref=…` and polled through `support.getStatus({ reference })`; `support.createPortal({ reference })` opens the billing portal. Copy says "contribution".
- `packages/api/src/router.ts` already requires a session for all three support operations and returns NOT_FOUND for records the caller does not own (the account-scoped fix is built).
- `apps/api-server/src/stripe-support.ts` uses the `stripe` Node SDK (^23) with Checkout Sessions (`mode: payment | subscription`, monthly only), a billing portal session, and webhook mapping for `checkout.session.*`, `payment_intent.*`, `charge.refunded`, `refund.*`, `invoice.*`, `customer.subscription.*`. `mock-stripe.ts` simulates Checkout and the portal locally.
- Ledger (`003_support_payments`, `004_payment_event_ordering`): `support_contributions` with inline `stripe_*`, `store_*`, `revenuecat_app_user_id`, `frequency in ('once','monthly')`, `amount_minor between 100 and 100000`, nullable `user_id` with `on delete set null`; `support_transactions`; `support_payment_events` (provider + event ID + body hash). No production data.
- iOS: `apps/app/src/payments/store-purchases.native.ts` configures RevenueCat on tap with no app user ID (anonymous); `revenuecat-support.ts` records `user_id: null`.
- `required-signup-gate` adds migration `006_signup_gate`, the shared header with a signed-in menu, the account screen, the `/all-set` route, and an app-side moment emitter with no subscribers. There is no account deletion anywhere.

## Goals / Non-Goals

**Goals:**
- One provider-neutral ledger that Stripe and App Store purchases both write to, with provider IDs only in reference records.
- Semantic, account-scoped support operations that a later in-It management view can reuse unchanged.
- Zero payment-provider code on any screen except Support step 2.

**Non-Goals:**
- Apple subscriptions and the iOS link-out (wait for App Review guideline 3.1.2 research and a founder answer, confirm.md Q4).
- Building account deletion; this change supplies the Support-side function it will call.
- Sending measurement.

## Decisions

1. **Stripe Payment Element with deferred intent creation, not Embedded Checkout.** Step 1 is It's own UI; on Next the app loads `@stripe/stripe-js` with `loadStripe` (dynamic import in a `.web.tsx` component) and mounts the Payment Element in deferred mode (`mode`, `amount`, `currency: 'usd'`), then on confirm calls `support.start`, which creates the PaymentIntent (once) or Subscription with `payment_behavior: 'default_incomplete'` (monthly/annual) and returns its client secret; the app calls `stripe.confirmPayment({ redirect: 'if_required' })`. Methods are set server-side to `card` plus wallets and Link (Stripe's saved-details option); no `us_bank_account`. *Alternative:* Stripe Embedded Checkout: less code, but it is Checkout UI in an iframe, owns the amount step and summary, and makes the two-step layout and locked-email rule harder. *Alternative:* create the intent on Next: creates abandoned intents and pending records for every person who looks at step 2.

2. **Prices.** Recurring support uses `price_data` with the support product (`STRIPE_SUPPORT_PRODUCT_ID`) and `recurring.interval` `month` or `year`, so custom amounts need no pre-made prices. The portal is configured for cancel and payment-method update only (not plan switching, which needs fixed prices).

3. **Customer per account.** A `support_customers (user_id unique, provider, provider_customer_id)` mapping is created on first web support, with the account's verified email and `receipt_email` set from it on every intent; the Payment Element's email field is filled from the session and the email is not editable (`defaultValues` plus read-only display, Link authentication shown as the provider allows). Creation uses an idempotency key derived from the user ID so two concurrent first supports cannot create two customers.

4. **Ledger restructure (migration after `006_signup_gate`, e.g. `007_support_ledger`).** Drop and recreate, since there is no production data:
   - `supports (id, user_id null references user on delete set null, cadence in ('once','monthly','annual'), amount_minor between 100 and <max>, currency 'usd', state, created_at, updated_at, last_provider_event_at)`.
   - `support_payments (id, support_id, amount_minor, currency, state in ('succeeded','failed','refunded','partially_refunded'), occurred_at, provider)`.
   - `support_provider_refs (id, support_id null, payment_id null, provider in ('stripe','app_store','play_store'), kind in ('customer','subscription','payment_intent','invoice','store_transaction','store_original_transaction','store_product','app_user'), value, unique (provider, kind, value))`.
   - `support_provider_events` (renamed from `support_payment_events`, same columns).
   - A partial unique index on `supports (user_id) where cadence <> 'once' and state in ('pending','active','past_due')` enforces one active recurring support at the database level (`cancel_scheduled` excluded, per confirm.md Q9). New rows require `user_id` through the repository (the column stays nullable only so deletion can unlink).
   "Contribution" leaves all table and function names. *Alternative:* keep inline columns and add annual; rejected by the founder (009 Q8).

5. **API operations (`packages/api`, Zod-validated).** `support.start({ cadence, amountMinor })` → `{ supportId, clientSecret, publishableKey }`, idempotent per (account, client-generated attempt key) so double taps reuse one intent; `support.getStatus({ supportId })` (owner only, NOT_FOUND otherwise); `support.getMine()` → active recurring support and latest states for the returning-supporter view; `support.createPortal()` → URL for the caller's own customer (no reference input); `support.getFundingTotal()` → `{ amountMinor, currency, definition, asOf }`, the only unauthenticated support operation. `support.createCheckout` is removed. `STRIPE_NOT_CONFIGURED` keeps mapping to the "temporarily unavailable" message.

6. **Webhooks.** Keep signature verification, raw body, event dedupe and order-safe updates. Map `payment_intent.*`, `invoice.paid` / `invoice.payment_failed`, `customer.subscription.*`, `charge.refunded` / `refund.*` to `supports` and `support_payments` through `support_provider_refs`; drop `checkout.session.*`. The page polls `support.getStatus` while "being confirmed".

7. **Funding run rate and comparison.** Run rate = active monthly support amounts × 12 + active annual support amounts, from It's own ledger, all providers, before fees, USD, with an as-of time; plus the sum of one-time payments (minus refunds) in the current calendar year. A founder-maintained list of comparison figures (company, figure, unit, source URL, date) lives in CMS content and is shown only when every field is filled (founder, 2026-10-19).

8. **Founder letter.** Stored as a single published CMS entry (`support-letter`) in the versioned content snapshot and served through the existing content operation; when absent the app shows the marked placeholder. Legal lines are constants in the app.

9. **iOS (founder, 2026-10-19: one-time only, $10/$20/$50/$100/$250/$500).** RevenueCat is configured on tap with `appUserID` set to the It account ID; the purchase button only shows when signed in. `revenuecat-support.ts` resolves the app user ID to an account and refuses to record a support when it matches none. Store IDs go into `support_provider_refs`.

10. **Support moments.** Reuse the `required-signup-gate` emitter with three typed moments: `support-reached`, `support-completed` (fired when `getStatus` first reports confirmed), `support-skipped`. No payload beyond the name. The measurement change maps them to spec 013 stages 14–16 and owns sending and linking.

11. **Deletion hook.** `cancelSupportsForDeletedAccount(userId)` in the API server: cancels any active Stripe subscription immediately, then lets `on delete set null` unlink the records. Tested directly; wired in by whichever change adds account deletion.

12. **Local development.** Unit tests stub the Stripe SDK; `mock-stripe.ts` Checkout pages are removed; e2e uses Stripe test mode when keys are present and otherwise checks that step 2 shows "temporarily unavailable" and skip works.

## Overlaps

- `required-signup-gate` adds the `support` requirement "Place in the flow" (after the name step, skip and payment lead to "You're all set", no pre-signup links). This change does not touch that block; all its `support` deltas are ADDED except "Support page", "Web checkout requires an account" and "iOS App Store support" (MODIFIED) and "Payment outcome after Checkout" (REMOVED), none of which that change modifies.
- The persistent "Support It" link lives in the header/menu and footer chrome that `required-signup-gate` introduces (`account-settings` menu); this change only adds the link.
- The receipt email relies on `required-signup-gate` guaranteeing a verified email at signup.
- The Support moments reuse that change's emitter (its design decision 8). Build `required-signup-gate` first; this change's migration is numbered after `006_signup_gate`.
- The privacy page (`privacy-page`, new in `required-signup-gate`; full text in spec 010) must disclose Stripe and RevenueCat processing, Stripe's fraud signals on step 2, what It stores, the deletion behaviour, the not-tax-deductible status and We Are It LLC. That is left to the privacy change; no delta here.

## Risks / Trade-offs

- [Link (saved details) shares the email with Stripe's consumer product] → Founder chose it (009 Q6); disclose on the privacy page.
- [Stripe's script collects fraud signals in the browser] → Loaded only on step 2; disclosed on the privacy page.
- [Deferred intents mean the amount shown in the Element and the server amount could differ] → The server is the source of truth; the client secret's amount is checked against the summary before confirm.
- [Subscriptions with `default_incomplete` leave incomplete subscriptions when people abandon] → They expire after 23 hours; the record stays `pending` and then `expired`, never counted.
- [Partial unique index blocks a legitimate restart after a stuck `pending` recurring support] → `pending` rows expire with the incomplete subscription; `support.start` clears an expired pending row first.
- [Funding total reveals a single person's amount while totals are tiny] → Founder chose a public total (009 Q17); confirm.md Q10 asks whether to show it from the first payment.

## Migration Plan

- Ship after `required-signup-gate`. Migration `007_support_ledger` drops and recreates the support tables (no production data; confirm before running against any shared database).
- Deploy API (new operations, webhooks for both old and new event types), then the app; then remove `createCheckout` and `checkout.session.*` handling.
- Configure in Stripe test mode: payment methods (cards, wallets, Link; no bank debits), portal (cancel, payment method), statement descriptor; in production after the account belongs to We Are It LLC.
- Rollback: revert the app and API together; the old ledger shape is not restored (test data only).

## Open Questions

Founder questions are in proposal.md and `confirm.md`. Technical items deferrable to implementation: exact Stripe API version pin, and whether Link's email step can be fully locked or only prefilled (if only prefilled, `receipt_email` on the intent still forces receipts to the account email).
