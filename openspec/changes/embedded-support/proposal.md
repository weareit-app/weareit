# Proposal

## Why

The Support page still sends people to Stripe's hosted Checkout, offers only once or monthly, says "contribution", and stores App Store purchases without an account. The founder decided (2026-10-16 decisions, spec 009 answers of 2026-10-18, commit 322cd92) on an embedded Stripe form with once, monthly and annual support, a fixed amount layout, a public funding total, a provider-neutral ledger, and every support tied to an account on every platform (features.md §4).

## What Changes

What people see and do, screen by screen. Where the page sits in the flow (after the name step, then "You're all set") is already in `required-signup-gate` and is not repeated here.

- **Support page, step 1 (letter and amount)** — only for signed-in people. Headline "It's free for you—and you're not the product." (features.md §4), then the founder's letter, loaded from the CMS and shown as a marked placeholder until the founder writes it. A plain line says support is optional and unlocks nothing. A public funding total says how much It has received, what the number counts and its as-of date, and names no one. A "Skip for now" control is always there.
  - A segmented control: Monthly, Every year, Once. Monthly is preselected.
  - Six preset amounts in two rows of three, then a custom amount field. Monthly $3/5/10/20/50/100 ($5 preselected); Every year $30/50/100/200/500/1,000; Once $10/20/50/100/250/500. Custom: $1 minimum; maximum to confirm (see Open questions). USD only.
  - A sentence states exactly what will be charged and when, e.g. "$5 every month until you cancel." "Next" moves to step 2.
- **Support page, step 2 (paying on the same page)** — the Stripe form loads only now, inside the page, with no redirect. Cards, wallets (Apple Pay, Google Pay) and Stripe's saved-details option; no bank debits and no "cover the fees". The receipt email is the account's verified email, shown and locked. One plain line near the button says support is not tax-deductible (the founder approves the wording). A line says Stripe handles card details and It never sees them. One button, e.g. "Support $5 monthly". "Back" returns to step 1; skip still works.
- **Being confirmed** — after paying, the page says the payment is being confirmed and never claims success until It's own records confirm it.
- **Thank you** — says what happened ("Your monthly support of $5 is active.") and that Stripe has emailed a receipt; recurring support gets a "Manage support" link to Stripe's hosted page (features.md §4 "Link to Stripe's hosted portal"). Then on to the next screen.
- **Payment did not go through** — no payment was taken (or it is still pending), the reason in plain words, and try again, change method, or skip.
- **Returning supporter** — a person with active recurring support sees its cadence, amount and next payment date when known, and "Manage support"; they cannot start a second recurring support, but can still give once. A failed renewal is shown with the manage link.
- **Reaching Support later** — after signup, a persistent "Support It" link: footer on large screens, menu or settings on small screens and whenever signed in.
- **iOS** — Support stays skippable and never blocks onboarding. Any App Store purchase starts only when signed in and is recorded against the account; the purchase SDK starts only when the person taps to buy. What iOS offers in this change is an open question.
- **Behind the scenes, visible to people** — one Stripe customer per account; refunds on request, made by the founder and shown as refunded; deleting an account cancels active web recurring support and keeps payment records with the account link removed; the merchant is We Are It LLC.
- **BREAKING (API and data)**: the hosted-Checkout operation is replaced by a "start support" operation for the embedded form; the support ledger is restructured with provider IDs moved into separate provider-reference records (no production data exists).
- **Wording**: every Support screen says "support", never "donation", "donate", "donor", "contribution" or "charity".

Founder answers (2026-10-19) changed three things from the draft: per-cadence maximums (once $10,000, monthly $1,000, annual $10,000) with "get in touch" above them; the public number is the yearly run rate plus a one-time line, beside a sourced comparison with other companies; the statement descriptor is "WEAREIT.APP" ("WE ARE IT" until the site is live).

Out of scope: the flow position and "You're all set" screen (`required-signup-gate`); sending and linking measurement (the measurement change owning spec 013; this change only emits the Support moments); the full privacy page text (spec 010, `privacy-page`); account deletion itself (no deletion flow exists yet); Apple subscriptions and the iOS link-out to web, which wait for App Review research; managing support inside It and the comparison sidebar (optional, deferred by the founder, 009 Q22); admin support list and totals (features.md §6, optional); production Stripe and App Store Connect account setup.

Must leave room for (features.md §4, §6 and Stages): managing or cancelling recurring support inside It (status stays account-scoped and semantic); the comparison sidebar (space beside the funding total, no build); native iOS once/monthly/annual (annual cadence and provider-reference records accept Apple purchases without changing the core record); admin support totals (the funding-total query works from It's records alone); Help build It replacing "You're all set" as the next screen.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `support`: embedded two-step web payment with once/monthly/annual, per-cadence presets and limits, founder letter and funding total, account-only support on every platform, one customer and one active recurring support per account, honest confirmation states, returning-supporter view, provider-reference ledger, refunds and deletion handling, persistent link after signup, Support moments for measurement, and privacy, honest-status and accessibility requirements. Hosted Checkout and its return page are removed.

## Impact

- App: `apps/app/app/support-it.tsx` (rewritten as two steps), a Stripe web form component loaded on demand, `apps/app/src/payments/store-purchases.native.ts` (account-tied purchases), the shared page chrome for the persistent link, e2e `apps/app/e2e/onboarding.spec.ts`.
- API contract: `packages/api/src/contract.ts` and `router.ts` (`support.createCheckout` replaced by `support.start`; status and portal read by account; new `support.getMine` and `support.getFundingTotal`).
- API server: `apps/api-server/src/stripe-support.ts` (Payment Intents and Subscriptions instead of Checkout Sessions, yearly prices, customer per account, receipts), `revenuecat-support.ts` (account ID), `mock-stripe.ts` and `start-local-mock.ts`.
- Data: `packages/database` migration after `required-signup-gate`'s `006_signup_gate`, `support-repository.ts` rewritten provider-neutral.
- CMS: a place for the founder letter.
- Dependencies: `@stripe/stripe-js` and `@stripe/react-stripe-js` (versions to pin per `docs/architecture/dependency-policy.md`); a Stripe publishable key exposed to the web app.
- Docs: `docs/architecture/payments.md` revised from hosted Checkout to the embedded form.

## Open questions

All eleven were answered by the founder on 2026-10-19; see `confirm.md`. Still to set outside this change: the refund window N (founder) and final copy (founder).
