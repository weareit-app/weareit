# Feature Specification: Support page — "It's free for you—and you're not the product."

**Feature Branch**: `spec/009-support-page` (spec directory `specs/009-support-page`)

**Created**: 2026-10-17

**Status**: Draft (stops at founder review; no plan or tasks)

**Input**: User description: "Support It page from `docs/spec/features.md` §4. Embedded Stripe payment form on web instead of hosted Checkout (CONFLICTS C5). Once / monthly / annual. Link to the Stripe customer portal for managing recurring support. Skip is always available; the page never blocks progress. Copy says 'support', never 'donate'/'donation'; It is never described as a charity. The founder letter is a placeholder the founder writes. The ledger stays provider-neutral. iOS is optional and must not be blocked. Describe the spec as changes from what exists."

Binding sources: `AGENTS.md`, `docs/architecture/decisions.md` (Payments), `docs/spec/CONFLICTS.md` rows C5, C6, C7, C11. Candidate evidence only (not requirements): `docs/spec/drafts/it-spec-decisions.md` D10, `docs/spec/pieces.yaml` piece `donation`.

## What People See and Do *(mandatory, write this first)*

Matches `docs/spec/features.md` §4. Core items: founder letter, once/monthly/annual with an embedded form, link to the hosted portal, skip. Optional items (manage inside It, comparison sidebar) are not built here; see Must Not Block.

- **Screen: Support page, first view** - Shown to a signed-in person after signup ([NEEDS CLARIFICATION: exact position in the flow — straight after signup and before Help, or reachable only from a link? See questions.md Q1]). The headline "It's free for you—and you're not the product." Below it, a short letter from the founder. **The letter text is a placeholder until the founder writes it**; this spec does not draft it. A plain line says supporting is optional and does not unlock anything. A clear "Skip for now" (or similar) control is visible without scrolling past the payment form. - The person can read, skip straight on, or choose to support.
- **Screen: Choosing how to support** - Three choices of how often: once, monthly, or every year. A few amount choices plus "another amount" ([NEEDS CLARIFICATION: preset amounts, limits and whether presets differ by cadence — Q4]). The summary states exactly what will be charged and when, in words, e.g. "$15 every month until you cancel." - The person picks a cadence and an amount, or skips.
- **Screen: Paying, on the same page** - The payment form appears inside the Support page (not a redirect to another site). The person's account email is shown as the receipt address ([NEEDS CLARIFICATION: prefill and lock to the account email, or let the person enter any receipt email? — Q11]). A single button such as "Support $15 monthly" confirms. A line says that card details are handled by the payment provider and It never sees or stores them. - The person can enter payment details and confirm, go back to change amount or cadence, or skip.
- **Screen: Waiting for confirmation** - After confirming, the page says the payment is being confirmed and does not claim success until It's own records confirm it. Some payment methods take longer; the page says so honestly and lets the person continue without waiting. - The person can wait or move on.
- **Screen: Thank you** - A short thank-you that says what happened ("Your monthly support of $15 is active. The first payment was taken today.") and that a receipt was sent. For recurring support, a "Manage or cancel recurring support" link that opens the payment provider's hosted page. A clear way on to the next step of onboarding. - The person can continue, or open the management page.
- **Screen: Payment did not go through** - Plain words: no payment was taken (or, where true, that it is still pending), with the reason the provider gives in human terms, and options to try again, change method, or skip. - The person can retry or move on; nothing else is lost.
- **Screen: Returning supporter** - A signed-in person who already has active recurring support sees that fact (cadence, amount, next payment date if known) and the "Manage or cancel" link instead of being nudged to start another ([NEEDS CLARIFICATION: may one account hold more than one active recurring support? — Q9]). They can still give a one-time amount. - The person can manage, give once, or move on.
- **iOS (optional for v0.1)** - If the iOS app ships, the Support page either works with Apple's purchase flow or explains how to support on the web, depending on the App Store research outcome ([NEEDS CLARIFICATION: iOS behaviour for v0.1 — Q15]). Either way, iOS onboarding is never blocked by Support.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Skip without friction (Priority: P1)

A newly signed-up person reads the letter, decides not to support, and moves straight on to the rest of onboarding.

**Why this priority**: The page must never block progress (features.md §4 "Skip without supporting"; constitution III). If only one thing works, it must be skipping.

**Independent Test**: Sign up, arrive on the Support page, choose skip; the next onboarding step loads, nothing was charged, no payment record was created, and no payment-provider code was loaded before the person chose to support.

**Acceptance Scenarios**:

1. **Given** a signed-in person on the Support page, **When** the page loads, **Then** a skip control is visible and usable without scrolling past the payment form and without entering anything.
2. **Given** the payment form has failed to load (provider outage or not configured), **When** the person views the page, **Then** the letter and skip still work and the page says support is temporarily unavailable.
3. **Given** a person who skipped, **When** they continue, **Then** no reminder, modal or later nag about support appears during onboarding.
4. **Given** a person who skipped, **When** they later want to support, **Then** they can reach the Support page again ([NEEDS CLARIFICATION: from where — Q2]).

---

### User Story 2 - Support once with the embedded form (Priority: P1)

A signed-in person chooses "once", picks an amount, pays inside the Support page, and sees a truthful confirmation.

**Why this priority**: The core money path for v0.1 and the decided replacement for hosted Checkout (C5).

**Independent Test**: In provider test mode, give a one-time amount; the person never leaves the page, the confirmation appears only after It's records show the payment succeeded, and the record is linked to the person's account.

**Acceptance Scenarios**:

1. **Given** cadence "once" and a valid amount, **When** the person confirms valid payment details, **Then** the payment completes on the Support page with no redirect to a hosted checkout page (an in-place bank or card authentication step is allowed).
2. **Given** a completed payment, **When** It's records have not yet confirmed it, **Then** the page shows "being confirmed", never "thank you".
3. **Given** a declined card, **When** the person confirms, **Then** the page explains in plain words that no payment was taken and offers retry and skip.
4. **Given** an amount outside the allowed range, **When** the person tries to confirm, **Then** the button is disabled or a clear message explains the limits before any payment is attempted.
5. **Given** any text on the page, **When** reviewed, **Then** it says "support" and never "donate", "donation", "donor" or "charity", and never implies tax deductibility.

---

### User Story 3 - Start monthly or annual support (Priority: P2)

A signed-in person chooses monthly or every year, pays inside the page, and understands exactly when they will be charged and how to stop.

**Why this priority**: Recurring support is decided for v0.1 (decisions.md Payments) and is the main source of steady funding, but a one-time path alone is still a viable slice.

**Independent Test**: In test mode, start annual support; the summary before paying states the yearly amount and that it renews until cancelled; after confirmation the account shows active annual support with a manage link.

**Acceptance Scenarios**:

1. **Given** cadence "monthly" or "every year", **When** the person reviews before paying, **Then** the page states the amount, the interval, that it renews until cancelled, and that it can be cancelled at any time.
2. **Given** a confirmed recurring support, **When** the thank-you appears, **Then** it shows cadence, amount and a "Manage or cancel recurring support" link.
3. **Given** a later renewal fails, **When** the person returns to the Support page, **Then** it says the latest payment did not go through and offers the manage link to update the payment method.

---

### User Story 4 - Manage or cancel recurring support (Priority: P2)

A person with recurring support wants to change their card or cancel, and does it through the payment provider's hosted management page reached from It.

**Why this priority**: Easy cancellation is a trust requirement and a core item (features.md §4 "Link to Stripe's hosted portal"). Managing inside It is optional and not in this spec.

**Independent Test**: With active monthly support, open the manage link from the Support page, cancel at period end in test mode, return to It; the Support page shows that support ends on the stated date.

**Acceptance Scenarios**:

1. **Given** a signed-in person with active recurring support, **When** they open the Support page, **Then** a manage link is shown.
2. **Given** a person who is not the owner of a recurring support, **When** they try to open its management page by any route, **Then** It refuses. Access is tied to the signed-in account, not to a link or reference that could be shared.
3. **Given** a cancellation made on the provider's page, **When** It receives the provider's confirmation, **Then** the Support page shows "ends on <date>" and later "ended".

---

### User Story 5 - iOS stays unblocked (Priority: P3)

A person using the iOS app moves through onboarding; Support either works under App Store rules or is clearly deferred, and nothing stops them continuing.

**Why this priority**: iOS is optional for v0.1 (C7) but the Expo app must keep working on iOS (features.md Stages).

**Independent Test**: Run onboarding on an iOS build; the Support step can be skipped, no web payment form is shown inside the app unless the App Store research says it is allowed, and no purchase SDK starts before the person taps a purchase button.

**Acceptance Scenarios**:

1. **Given** the iOS app, **When** the person reaches Support, **Then** they can skip and continue.
2. **Given** the iOS app, **When** the Support page opens, **Then** no payment or purchase provider is initialised until the person explicitly starts a purchase (keeps the current rule in `docs/architecture/payments.md`).

### Edge Cases

- Provider not configured or down: letter and skip still work; payment area shows an honest "unavailable" message (current code already maps `STRIPE_NOT_CONFIGURED` to a message in `packages/api/src/router.ts`).
- Person closes the tab mid-payment: on return, the page shows the true state from It's records (pending, succeeded or not taken), never a stale success.
- Asynchronous payment methods that settle days later: page and ledger show "pending" until settled ([NEEDS CLARIFICATION: which payment methods are offered — Q6]).
- Double-click or retry on confirm: at most one charge per intended support.
- Recurring support already active: no accidental second subscription (see Q9).
- Refunds and disputes: shown honestly as refunded; refund policy text is the founder's ([NEEDS CLARIFICATION: refund policy — Q13]).
- Session expires while on the page: the person is asked to sign in again before paying; nothing is charged first.
- Account deleted: what happens to the support records and to active recurring support ([NEEDS CLARIFICATION: Q14]).
- Very large or zero amounts, non-numeric input: rejected before any provider call, validated again on the server.
- Person in a currency other than USD ([NEEDS CLARIFICATION: Q5]).

## Requirements *(mandatory)*

### Functional Requirements

**Placement and skipping**

- **FR-001**: The Support page MUST be shown only to signed-in people (C6 resolved: signup comes before Support). Support entry points that currently appear before signup MUST be removed or redirected to signup ([NEEDS CLARIFICATION: confirm — Q1, Q2]).
- **FR-002**: A skip control MUST be visible and work at all times on the page, including while the payment form is loading, has failed, or is mid-entry.
- **FR-003**: Skipping MUST NOT create any payment record, contact the payment provider, or cause later prompts during onboarding.
- **FR-004**: Payment-provider scripts or SDKs MUST NOT load on any pre-signup page, and MUST NOT load on the Support page until the person shows intent to support ([NEEDS CLARIFICATION: load the form when the page opens, or only after the person picks a cadence/amount? — Q7]).

**Letter and copy**

- **FR-005**: The page MUST show a founder letter. Until the founder supplies text, it MUST show a clearly marked placeholder; no AI-drafted letter text ships.
- **FR-006**: All copy MUST use "support" and MUST NOT use "donate", "donation", "donor", "charity", "charitable" or equivalents, MUST NOT claim or imply tax deductibility, and MUST state that supporting unlocks nothing. Whether to state "not tax-deductible" explicitly is open ([NEEDS CLARIFICATION: Q20]).
- **FR-007**: Editable page copy (letter, headings, legal lines) MUST be managed the same way as other product content ([NEEDS CLARIFICATION: CMS-managed or fixed in the app for v0.1? — Q10]).

**Choosing and paying**

- **FR-008**: People MUST be able to choose a cadence of once, monthly, or every year.
- **FR-009**: People MUST be able to choose a preset amount or enter another amount within limits set by the founder ([NEEDS CLARIFICATION: Q4]). The same limits MUST be enforced on the device and on the server.
- **FR-010**: Before confirming, the page MUST state in words the exact amount, currency, cadence, and (for recurring) that it renews until cancelled.
- **FR-011**: On web, payment details MUST be collected by an embedded payment-provider form within the Support page; the person MUST NOT be redirected to a hosted checkout page. Provider-required authentication steps (e.g. card-issuer verification) are allowed.
- **FR-012**: Card numbers and billing details MUST be handled only by the payment provider; It MUST NOT receive, log or store them.
- **FR-013**: Each support MUST be linked to the signed-in account that made it.
- **FR-014**: Repeated submissions MUST NOT produce duplicate charges.

**Confirmation and status**

- **FR-015**: The page MUST show success only after It's own records confirm the payment from a verified provider notification; a browser return alone never confirms (keeps the rule in `docs/architecture/payments.md`).
- **FR-016**: The page MUST show honest states: being confirmed, succeeded, active, ending on a date, ended, payment needs attention, not taken, refunded.
- **FR-017**: Receipts MUST be sent for each successful payment ([NEEDS CLARIFICATION: by the provider or by It; and which email — Q11]).

**Managing recurring support**

- **FR-018**: A signed-in person with recurring support MUST be able to reach the payment provider's hosted management page from the Support page to update payment details or cancel.
- **FR-019**: Access to the management page MUST be authorised by the signed-in account that owns the support, not by possession of a reference or link.
- **FR-020**: Cancellations and changes made on the provider's page MUST be reflected in It's records and on the Support page after the provider notifies It.

**Ledger**

- **FR-021**: It's support records MUST stay provider-neutral: the core record describes who supported (account), how much, which currency, which cadence, current state and timestamps. Provider identifiers (payment provider customer, subscription, payment, store transaction IDs) MUST live in separate provider-reference records linked to the core record, so a new provider (e.g. Apple) adds references without changing the core record ([NEEDS CLARIFICATION: restructure the existing ledger now, or keep the current inline provider columns for v0.1? — Q8]).
- **FR-022**: Provider notifications MUST be signature-verified, idempotent and order-safe (keeps current behaviour).
- **FR-023**: Annual cadence MUST be representable in the ledger alongside once and monthly for every provider.

**iOS**

- **FR-024**: Nothing in this feature MAY prevent the iOS app from building, running or completing onboarding. On iOS, Support MUST be skippable and MUST follow the outcome of the App Store research (Q15).

### Key Entities

- **Support** (existing as `support_contributions`): one person's intention to support: account, amount, currency, cadence (once / monthly / annual), state, created/updated times, last provider event time. Provider-neutral.
- **Support payment** (existing as `support_transactions`): one money movement under a Support: amount, currency, state (succeeded, failed, refunded, partially refunded), when it happened, which provider.
- **Provider reference** (new, per FR-021): links a Support or payment to a provider's own identifiers (provider name, kind of identifier, value). Replaces inline provider columns.
- **Provider event receipt** (existing as `support_payment_events`): provider + event ID + body hash, for idempotency; no payload stored.
- **Account** (from 008 signup): the signed-in person; one provider customer per account is a candidate ([NEEDS CLARIFICATION: Q12]).

## Changes From What Exists

A Support It flow already exists, built on Stripe hosted Checkout before the 2026-10-16 decisions. This spec changes it as follows.

| Area | Exists today | Change |
|---|---|---|
| Screen | `apps/app/app/support-it.tsx`: eyebrow "Optional support", title "Help keep the work moving.", presets $5/$15/$30 + another amount ($1–$1,000), cadence once/monthly, button "Continue to secure checkout" that redirects to Stripe hosted Checkout; success/cancel read from URL params; "Explore other ways to help" link | New headline per features.md §4; founder-letter placeholder; add "every year"; embedded payment form in place of redirect; visible skip that continues onboarding; returning-supporter view; remove "contribution" wording in favour of "support" (C11); status shown from account, not URL reference |
| Entry points | `apps/app/app/onboarding/futures.tsx` (line ~164) and `apps/app/app/ways-to-help.tsx` (line ~77) link to `/support-it` before signup | Pre-signup links removed or routed through signup (FR-001, Q2) |
| API contract | `packages/api/src/contract.ts` `support.createCheckout({amountMinor, frequency: once/monthly}) → {url, reference}`, `support.getStatus({reference})`, `support.createPortal({reference})` | Replace checkout-URL operation with a semantic "start support" operation that returns what the embedded form needs; add annual; status and portal operations keyed to the signed-in account, not a bare reference (FR-013, FR-019) |
| API handlers | `packages/api/src/router.ts` passes `userId` (nullable) into `createCheckout`; `getStatus` and `createPortal` do not check the caller | Require a signed-in account for all support operations; authorise portal and status by ownership |
| Stripe adapter | `apps/api-server/src/stripe-support.ts`: Checkout Sessions (`mode: payment/subscription`), monthly only, success/cancel URLs, billing portal session, webhook mapping for `checkout.session.*`, `payment_intent.*`, `refund.*`, `charge.refunded`, `invoice.*`, `customer.subscription.*` | Move from Checkout Sessions to embedded-form payment and subscription creation; add yearly interval; drop `checkout.session.*` handling once unused; keep portal session; keep verification/idempotency |
| Local simulator | `apps/api-server/src/mock-stripe.ts`, `start-local-mock.ts` simulate hosted Checkout and portal pages | Needs an equivalent for the embedded flow, or rely on provider test mode (plan decision) |
| Ledger schema | `packages/database/src/migrations/003_support_payments.ts`: `support_contributions` with inline `stripe_customer_id`, `stripe_checkout_session_id`, `stripe_subscription_id`, `stripe_payment_intent_id`, `store_*`, `revenuecat_app_user_id`; `frequency in ('once','monthly')`; `amount_minor between 100 and 100000`; `user_id` nullable, `on delete set null`. `004_payment_event_ordering.ts` adds `last_payment_event_at` | Add annual cadence; move provider IDs into provider-reference records (FR-021, Q8); require account link for new web supports; revisit amount limits (Q4) and deletion behaviour (Q14) |
| Repository | `packages/database/src/support-repository.ts`: `createPendingStripeContribution`, `attachStripeCheckout`, `readSupportContributionStatus`, `readSupportContributionForPortal`, `recordStripeEvent`, `recordRevenueCatSupportEvent` | Provider-neutral naming and functions; read-by-account |
| iOS | `apps/app/src/payments/store-purchases.native.ts` + `apps/api-server/src/revenuecat-support.ts`: RevenueCat consumable tips `it_support_5/15/30`, one-time only, SDK configured only on tap | Keep the "no SDK until tap" rule; iOS cadence and whether to keep RevenueCat depend on Q15 and App Store research |
| Tests | `apps/api-server/tests/stripe-support.test.ts`, `revenuecat-support.test.ts`, `apps/app/e2e/onboarding.spec.ts` (expects "Supporting It is optional", "Continue to secure checkout", "Your contribution has been refunded.") | Update to embedded flow, annual, account-scoped access, new copy |
| Docs | `docs/architecture/payments.md` still describes hosted Checkout (banner says it needs revising) | Revise when the plan is written |
| Config | `.env.example`: `STRIPE_SECRET_KEY`, `STRIPE_SUPPORT_PRODUCT_ID`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_API_BASE`, `REVENUECAT_WEBHOOK_SECRET`, `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY` | Embedded form needs a publishable key exposed to the web app (public by design); secrets stay server-side |

Kept as is: webhook signature verification and raw-body handling (`apps/api-server/src/index.ts`), event dedupe by event ID + body hash, order-safe state updates, 200/400/500 semantics, no card or address data stored, support grants no product access.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of people who reach the Support page can continue onboarding without paying, in one action, in every tested state (form loading, form failed, provider unconfigured, mid-entry).
- **SC-002**: A one-time support can be completed in under 90 seconds from arriving on the page, without leaving it (test mode, valid card).
- **SC-003**: Zero cases in testing where the page shows "thank you" before It's records confirm the payment.
- **SC-004**: A person with recurring support can reach the cancel option in at most two actions from the Support page.
- **SC-005**: A copy review of every Support screen and message finds zero uses of "donate", "donation", "donor" or "charity", and no claim of tax deductibility.
- **SC-006**: No payment-provider network request is made by any pre-signup page (verified in a browser network log).
- **SC-007**: An annual and a monthly support, and an Apple purchase if iOS ships, all appear in the same support records with the same fields.

## It Checks *(mandatory)*

### Privacy

- **Before signup, stays on device**: everything; the Support page is not reachable before signup. No payment-provider code loads before signup (FR-004).
- **Before signup, sent**: nothing from this feature. Whether reaching Support is a post-signup funnel stage is open ([NEEDS CLARIFICATION: Q16]).
- **After signup, stored on server**: account link, amount, currency, cadence, state, timestamps, provider reference IDs, provider event IDs and body hashes. Not stored: card data, billing address, full provider payloads. The payment provider stores card and billing data and its own fraud signals (which its embedded script collects from the browser); the privacy page (spec 010) must disclose this.
- **Never public by default**: whether someone supported, how much, or how often. No public supporter lists or counts unless the founder decides otherwise (Q17).

### Honest Status

No ideas are shown on this page. Honesty rules that apply: never imply charity or tax deductibility; never show success before confirmation; never show fake funding numbers or social proof (the optional comparison sidebar, if later built, must be sourced and dated).

### Must Not Block

- Manage or cancel recurring support inside It (optional): keep account-scoped status and management operations semantic so an in-It view can be added without changing the ledger.
- Comparison sidebar (optional): leave room on the page layout; do not build.
- Native iOS app with once/monthly/annual (optional): provider-neutral ledger with annual cadence and provider-reference records so Apple purchases land in the same place; no web-only assumptions in the core record.
- Admin support list and totals (optional, features.md §6): records carry enough (amount, currency, cadence, state, time) to total without provider calls.
- Invitations (optional): no effect.

### Accessibility

- Keyboard: cadence and amount are radio groups operable by arrow keys; skip, confirm and manage are reachable in a logical tab order; the embedded form is keyboard-operable (provider responsibility, verify in testing).
- Screen reader: cadence and amount announce selected state; the charge summary is read before the confirm button; status changes (confirming, succeeded, failed) are announced as live updates; the skip control has a clear name.
- Reduced motion: no animated transitions required to understand state; any loading indicator respects reduced motion.
- Meaning never by colour alone: selected amount/cadence and error states use text and shape, not colour only.

### Research Questions

- Under current App Store Review Guidelines, may an iOS app accept one-time, monthly and annual payments that unlock nothing (support of the developer) through in-app purchase, through an external link, or not at all? Do the 2025-2026 US external-link rulings change this? What do comparable apps do?
- What do supporters of open, non-charity projects (e.g. patronage models) expect on a support page: cadence defaults, preset amounts, "cover the fees" options, and how does a visible skip affect conversion and trust?
- Does an embedded payment form, compared with hosted checkout, change completion rate or trust for small support payments?
- What data does the payment provider's embedded browser script collect (fraud signals, cookies), and how should that be disclosed under GDPR/ePrivacy and US state laws?
- What financial-record retention obligations apply to support records when a person deletes their account?

## Dependencies and Cross-Spec Notes

- **008 Signup gate**: This spec assumes signup comes before Support (C4, C6) and that every support is tied to an account. 008 must provide a signed-in session on arrival, and decide what happens to a person who signs in later on another device (they should see their recurring support). Shared question: is the account email the receipt email (Q11)? Note: `specs/001-personal-page/spec.md` refers to an earlier split where support was "004"; this lane uses 009.
- **010 Safety floor + privacy page**: must disclose that the payment provider (and Apple/RevenueCat if iOS ships) processes card and billing data and collects fraud-prevention signals on the Support page; what It stores (account link, amount, cadence, state, timestamps, provider IDs) and does not (card, address); retention after account deletion (Q14); that support is not a charitable donation. Reporting/safety floor has no direct dependency.
- **011 Help page**: assessment only. Likely the next step after Support or Skip; ordering of Support vs Help is Q1. Support copy must not imply that money is the main or preferred way to help.
- **`docs/spec/pieces.yaml`**: piece id `donation` and funnel event "donated" use wording this spec forbids in UI. Ids must stay stable for the research pipeline, so this is noted, not changed; the founder may want a label change.

## Assumptions

- Stripe remains the web payment provider (decided); "embedded payment form" means a provider-hosted form embedded in It's page, keeping card data out of It's systems.
- USD is the only currency for v0.1 unless the founder decides otherwise (current code is USD-only; Q5).
- The founder letter, legal lines and refund wording are written or approved by the founder; this spec only reserves space.
- The provider's hosted management page is configured to allow cancellation and payment-method updates (setup task in `docs/roadmap/mvp.md`).
- Production Stripe account, legal entity and statement descriptor are setup tasks outside this spec (decisions.md "Open implementation decisions"; Q18).
