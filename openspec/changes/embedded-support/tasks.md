# Tasks

Launch (Nov 2, moved from Oct 26): groups 4 and 7 and tasks 9.2 and 9.3 are deferred until after launch, along with the funding total in 1.2, 2.1 (`getFundingTotal`) and 5.1; the founder letter ships as fixed text in the app (see proposal.md "Launch scope").

Prerequisites: `required-signup-gate` merged (migration `006_signup_gate`, header/menu chrome, `/all-set`, moment emitter); founder answers to `confirm.md` (all answered 2026-10-19) Q1, Q4, Q5, Q9 and Q10 before groups 1, 7 and 3.5.

## 1. Ledger

- [ ] 1.1 Write migration `007_support_ledger` (drop and recreate): `supports` with cadence once/monthly/annual and the confirmed amount maximum, `support_payments`, `support_provider_refs` with unique (provider, kind, value), `support_customers` with unique `user_id`, `support_provider_events`; partial unique index for one active recurring support; verify `pnpm --filter @it/database test` runs the migration up and down on a clean database
- [ ] 1.2 Update `packages/database/src/types.ts` and rewrite `support-repository.ts` with provider-neutral functions (create pending support for an account, attach provider refs, record provider event, read by owner, read active recurring, funding total, unlink on deletion); verify repository tests for ownership, one-active-recurring refusal, idempotent events, order safety and funding total net of refunds
- [ ] 1.3 Verify no table, column or function name in `packages/database` contains "contribution" (grep in a test or lint check)

## 2. Contracts

- [ ] 2.1 Replace `support.createCheckout` with `support.start`, change `getStatus` to take `supportId`, change `createPortal` to take no input, add `getMine` and `getFundingTotal` in `packages/api/src/contract.ts` with Zod limits shared with the app; verify contract tests reject out-of-range amounts, unknown cadences and extra fields
- [ ] 2.2 Implement the operations in `router.ts` behind `requireUserId` (except `getFundingTotal`); verify router tests: signed-out calls fail with UNAUTHORIZED, other accounts get NOT_FOUND, `getFundingTotal` returns only total, currency, definition and as-of time

## 3. Stripe and RevenueCat adapters

- [ ] 3.1 In `stripe-support.ts`, create or reuse one customer per account (idempotency key from user ID) and create PaymentIntents (once) or Subscriptions with `price_data` month/year and `default_incomplete` (recurring), with `receipt_email` set to the verified account email and methods limited to card, wallets and Link; verify adapter tests with a stubbed SDK, including repeated `start` with the same attempt key returning the same intent
- [ ] 3.2 Rework webhook mapping onto the new ledger (`payment_intent.*`, `invoice.*`, `customer.subscription.*`, refunds) and drop `checkout.session.*`; verify `apps/api-server/tests/stripe-support.test.ts` covers duplicate, out-of-order, refund, past-due and cancel-at-period-end events
- [ ] 3.3 Billing portal for the caller's own customer, configured for cancel and payment-method update; verify a test that another account cannot obtain a portal URL
- [ ] 3.4 Add `cancelSupportsForDeletedAccount(userId)`; verify a test that an active subscription is cancelled and records remain with no account link
- [ ] 3.5 Per confirm.md Q4/Q5: in `revenuecat-support.ts` resolve the app user ID to an account, refuse unmatched events, store store IDs as provider refs; verify `revenuecat-support.test.ts` covers matched and unmatched purchases
- [ ] 3.6 Remove the Checkout and portal pages from `mock-stripe.ts` and `start-local-mock.ts`; verify `pnpm --filter api-server test` passes

## 4. Founder letter in the CMS

- [ ] 4.1 Add a `support-letter` entry to the CMS content model and published snapshot, served through the existing content operation; verify a CMS test publishes and reads it, and the app shows the marked placeholder when it is absent

## 5. Support page (web)

- [ ] 5.1 Rebuild step 1 in `apps/app/app/support-it.tsx`: headline, letter, optional line, funding total, skip, cadence radio group (Monthly preselected), six presets in two rows of three per cadence ($5 Monthly preselected), custom field with limits, charge summary, Next; verify component tests for defaults, cadence switch and out-of-range input
- [ ] 5.2 Build step 2 as a `.web.tsx` component that dynamically imports `@stripe/stripe-js` and `@stripe/react-stripe-js` only after Next and mounts the Payment Element in deferred mode with the locked account email, card-handling line and not-tax-deductible line beside the confirm button; verify a Playwright network check that no Stripe request occurs on any page or before Next
- [ ] 5.3 Confirm flow: `support.start`, `confirmPayment({ redirect: 'if_required' })`, "being confirmed" while polling `getStatus`, thank-you only on a confirmed record, decline and failure states with retry, change method and skip; verify e2e in Stripe test mode (success, decline, double tap gives one charge)
- [ ] 5.4 Returning-supporter view from `getMine`: cadence, amount, next date, "Manage support", Once still available, needs-attention state; verify e2e with a seeded active and a past-due support
- [ ] 5.5 Provider-unavailable state when keys are missing or the script fails; verify e2e without Stripe keys shows the message and skip works
- [ ] 5.6 Pin the Stripe web packages and expose the publishable key (`EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` in `.env.example`); record pins in `docs/architecture/dependency-policy.md`
- [ ] 5.7 Update `apps/app/e2e/onboarding.spec.ts` for the new copy and verify a copy check finds no "donate", "donation", "donor", "contribution" or "charity" in Support screens

## 6. Support link, moments and accessibility

- [ ] 6.1 Point the Support entry in the shared link list from `public-pages` (`apps/app/src/navigation/site-links.ts`) at the embedded Support page; it is already signed-in only; verify it appears in the footer and menu only when signed in
- [ ] 6.2 Emit `support-reached`, `support-completed` and `support-skipped` through the existing emitter with no payload; verify a unit test that each fires once and carries no amount or cadence
- [ ] 6.3 Accessibility pass: radio-group keyboard behaviour and announced selection, focus to step 2 heading, live-region status, reduced motion, non-colour selection cues; verify with a keyboard-only e2e and an accessibility audit of both steps

## 7. iOS

- [ ] 7.1 Per confirm.md Q4/Q5: show App Store purchase only when signed in and configure RevenueCat on tap with `appUserID` = account ID, with the agreed products; verify `store-purchases.test.ts` asserts the app user ID and that configuring does not happen before a tap
- [ ] 7.2 Verify on an iOS simulator build that Support can be skipped and no web payment form is embedded

## 8. Docs and integration

- [ ] 8.1 Revise `docs/architecture/payments.md` from hosted Checkout to the embedded form, ledger shape and account rules; verify it names no Checkout Session flow
- [ ] 8.2 Configure Stripe test mode (methods, portal, statement descriptor "WE ARE IT" until weareit.app is live, then "WEAREIT.APP") and record the settings in `docs/architecture/payments.md`
- [ ] 8.3 Full run: `pnpm test` and the onboarding e2e from signup through Support to "You're all set", with skip, once, monthly and annual paths

## Workflow follow-up

- Update `docs/spec/MIGRATION.md` row for `specs/009-support-page/` once this change is approved (not edited by this change).
- Archive the change after review; the archive replaces the "Known divergence" notes in `openspec/specs/support/spec.md`.

## 9. Founder answers (2026-10-19)

- [ ] 9.1 Per-cadence maximums (once $10,000, monthly $1,000, annual $10,000) on device and server, with "For larger support, get in touch" linking to the contact email
- [ ] 9.2 Compute the public funding figure as the yearly run rate plus the one-time line for the year, and tests for the definition
- [ ] 9.3 Add CMS content for comparison figures (company, figure, unit, source, date) and show them beside the run rate only when complete
- [ ] 9.4 Ship the not-tax-deductible line
