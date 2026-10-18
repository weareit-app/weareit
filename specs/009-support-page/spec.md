# Feature Specification: Support page — "It's free for you—and you're not the product."

**Feature Branch**: `spec/009-support-page` (spec directory `specs/009-support-page`)

**Created**: 2026-10-17

**Status**: Draft. Founder answers recorded 2026-10-18 (see `questions.md`); three open items remain. Stops at founder review; no plan or tasks.

**Input**: User description: "Support It page from `docs/spec/features.md` §4. Embedded Stripe payment form on web instead of hosted Checkout (CONFLICTS C5). Once / monthly / annual. Link to the Stripe customer portal for managing recurring support. Skip is always available; the page never blocks progress. Copy says 'support', never 'donate'/'donation'; It is never described as a charity. The founder letter is a placeholder the founder writes. The ledger stays provider-neutral. iOS is optional and must not be blocked. Describe the spec as changes from what exists."

Binding sources: `AGENTS.md`, `docs/architecture/decisions.md` (Payments), `docs/spec/CONFLICTS.md` rows C5, C6, C7, C11, and the founder answers to this spec's questions (2026-10-18, recorded in `questions.md`). Candidate evidence only (not requirements): `docs/spec/drafts/it-spec-decisions.md` D10.

## What People See and Do *(mandatory, write this first)*

Matches `docs/spec/features.md` §4. Core items: founder letter, once/monthly/annual with an embedded form, link to the hosted portal, skip. The optional items (managing support inside It, comparison sidebar) are deferred (Q22). An aggregate funding total is shown on its own (Q17).

**Flow (Q1)**: signup (spec 008) → required name step → **Support** → Help build It (spec 011). Support and Help are both skippable. Thank-you and skip both lead to Help build It.

- **Screen: Support page, step 1 (letter and amount)** - Shown only to a signed-in person. The headline "It's free for you—and you're not the product." Below it, a short letter from the founder. **The letter text is a placeholder until the founder writes it** (managed in the CMS, Q10); this spec does not draft it. A plain line says supporting is optional and unlocks nothing. An aggregate funding total: how much It has received in support, what the number counts, and an as-of date, never naming any supporter (Q17). A clear "Skip for now" (or similar) control. - The person can read, skip straight on, or choose an amount and tap Next.
- **Choosing how to support (part of step 1)** - A segmented control at the top for how often: Monthly, Every year, Once. **Monthly is preselected** (Q3). Below it, six preset amount buttons in two rows of three, then a custom amount field (Q4):
  - Monthly: $3, $5, $10, $20, $50, $100 (**$5 preselected**)
  - Every year: $30, $50, $100, $200, $500, $1,000
  - Once: $10, $20, $50, $100, $250, $500
  - Custom: $1 minimum; maximum [NEEDS CLARIFICATION: custom amount maximum, left to the plan by the founder; today's limit is $1,000].
  - All amounts are in USD (Q5). A summary states in words exactly what will be charged and when, e.g. "$5 every month until you cancel." A "Next" button moves to step 2. - The person picks a cadence and an amount (or keeps the default), taps Next, or skips.
- **Screen: Support page, step 2 (paying on the same page)** - The payment form loads only now, after the person taps Next (Q7). It sits inside the Support page (no redirect to another site) and offers cards, wallets where the browser supports them (Apple Pay, Google Pay) and the payment provider's saved-details option; no bank debits (Q6). The receipt email is the person's verified account email, shown prefilled and locked (Q11). One plain line near the confirm button says support is not tax-deductible (wording approved by the founder, Q20). A single button such as "Support $5 monthly" confirms. A line says the payment provider handles card details and It never sees or stores them. - The person can enter payment details and confirm, go back to change amount or cadence, or skip.
- **Screen: Waiting for confirmation** - After confirming, the page says the payment is being confirmed and does not claim success until It's own records confirm it. - The person can wait or move on to Help build It.
- **Screen: Thank you** - A short thank-you that says what happened ("Your monthly support of $5 is active. The first payment was taken today.") and that the payment provider has emailed a receipt. For recurring support, a "Manage support" link that opens the payment provider's hosted page. A clear way on to Help build It. - The person can continue, or open the management page.
- **Screen: Payment did not go through** - Plain words: no payment was taken (or, where true, that it is still pending), the provider's reason in human terms, and options to try again, change method, or skip. - The person can retry or move on; nothing else is lost.
- **Screen: Returning supporter** - A signed-in person with active recurring support sees it (cadence, amount, next payment date if known) and a "Manage support" link; they cannot start a second recurring support (Q9). They can still give once. - The person can manage, give once, or move on.
- **Reaching Support later** - After signup, a persistent "Support It" link: in the footer on large screens; in the menu or settings on mobile and whenever signed in (Q2). No Support links appear before signup.
- **iOS (optional for v0.1)** - Primary option: Apple in-app purchase through RevenueCat for once, monthly and annual support, tied to the person's account, built only after research into App Review guideline 3.1.2 ("ongoing value") risk. Secondary option: a link out to web Support, explaining that It receives more that way and optionally showing how much more for the selected amount (Apple's 15% versus the web provider's fees); where this is allowed is a research question. Recurring support bought through Apple is managed in iPhone settings; web recurring support is managed through the payment provider's hosted page (Q15). Either way, iOS onboarding is never blocked by Support.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Skip without friction (Priority: P1)

A newly signed-up person reads the letter, decides not to support, and moves straight on to Help build It.

**Why this priority**: The page must never block progress (features.md §4 "Skip without supporting"; constitution III). If only one thing works, it must be skipping.

**Independent Test**: Sign up, complete the name step, arrive on Support, choose skip; Help build It loads, nothing was charged, no payment record was created, and no payment-provider code was loaded.

**Acceptance Scenarios**:

1. **Given** a signed-in person on the Support page, **When** the page loads, **Then** a skip control is visible and usable without entering anything, and skipping leads to Help build It.
2. **Given** the payment form has failed to load (provider outage or not configured), **When** the person views the page, **Then** the letter and skip still work and the page says support is temporarily unavailable.
3. **Given** a person who skipped, **When** they continue, **Then** no reminder, modal or later nag about support appears during onboarding.
4. **Given** a person who skipped, **When** they later want to support, **Then** they can reach the Support page from the persistent "Support It" link (footer on large screens; menu or settings on mobile and when signed in).

---

### User Story 2 - Support once with the embedded form (Priority: P1)

A signed-in person chooses "Once", picks an amount, pays inside the Support page, and sees a truthful confirmation.

**Why this priority**: The core money path for v0.1 and the decided replacement for hosted Checkout (C5).

**Independent Test**: In provider test mode, give a one-time amount; the person never leaves the page, the confirmation appears only after It's records show the payment succeeded, and the record is linked to the person's account.

**Acceptance Scenarios**:

1. **Given** the Support page is open, **When** the person has not yet tapped Next, **Then** no payment-provider script has loaded.
2. **Given** cadence "Once" and a valid amount, **When** the person confirms valid payment details, **Then** the payment completes on the Support page with no redirect to a hosted checkout page (an in-place card authentication step is allowed).
3. **Given** a completed payment, **When** It's records have not yet confirmed it, **Then** the page shows "being confirmed", never "thank you".
4. **Given** a declined card, **When** the person confirms, **Then** the page explains in plain words that no payment was taken and offers retry and skip.
5. **Given** a custom amount below $1 or above the maximum, **When** the person tries to continue, **Then** Next is disabled or a clear message explains the limits before any payment is attempted.
6. **Given** any text on the page, **When** reviewed, **Then** it says "support" and never "donate", "donation", "donor" or "charity", and one plain line near the confirm button says support is not tax-deductible.

---

### User Story 3 - Start monthly or annual support (Priority: P2)

A signed-in person keeps the monthly default or chooses every year, pays inside the page, and understands exactly when they will be charged and how to stop.

**Why this priority**: Recurring support is decided for v0.1 (decisions.md Payments) and is the main source of steady funding, but a one-time path alone is still a viable slice.

**Independent Test**: In test mode, start annual support; the summary before paying states the yearly amount and that it renews until cancelled; after confirmation the account shows active annual support with a "Manage support" link.

**Acceptance Scenarios**:

1. **Given** a person opening the Support page, **When** step 1 appears, **Then** Monthly and $5 are preselected.
2. **Given** cadence "Monthly" or "Every year", **When** the person reviews before paying, **Then** the page states the amount, the interval, that it renews until cancelled, and that it can be cancelled at any time.
3. **Given** a confirmed recurring support, **When** the thank-you appears, **Then** it shows cadence, amount and a "Manage support" link.
4. **Given** a person who already has active recurring support, **When** they open the Support page, **Then** they see "Manage support" and can give once, but cannot start a second recurring support.
5. **Given** a later renewal fails, **When** the person returns to the Support page, **Then** it says the latest payment did not go through and offers the manage link to update the payment method.

---

### User Story 4 - Manage or cancel recurring support (Priority: P2)

A person with recurring web support wants to change their card or cancel, and does it through the payment provider's hosted management page reached from It.

**Why this priority**: Easy cancellation is a trust requirement and a core item (features.md §4 "Link to Stripe's hosted portal"). Managing inside It is deferred (Q22).

**Independent Test**: With active monthly support, open "Manage support" from the Support page, cancel at period end in test mode, return to It; the Support page shows that support ends on the stated date.

**Acceptance Scenarios**:

1. **Given** a signed-in person with active recurring web support, **When** they open the Support page, **Then** a "Manage support" link is shown.
2. **Given** a person who is not the owner of a recurring support, **When** they try to open its management page by any route, **Then** It refuses. Access is tied to the signed-in account, not to a link or reference that could be shared.
3. **Given** a cancellation made on the provider's page, **When** It receives the provider's confirmation, **Then** the Support page shows "ends on <date>" and later "ended".

---

### User Story 5 - iOS stays unblocked (Priority: P3)

A person using the iOS app moves through onboarding; Support works through Apple in-app purchase (primary) or a link out to web Support (secondary), as the App Store research allows, and nothing stops them continuing.

**Why this priority**: iOS is optional for v0.1 (C7) but the Expo app must keep working on iOS (features.md Stages).

**Independent Test**: Run onboarding on an iOS build; the Support step can be skipped, no web payment form is embedded in the app, no purchase SDK starts before the person taps a purchase button, and any sandbox purchase appears in It's records against the signed-in account.

**Acceptance Scenarios**:

1. **Given** the iOS app, **When** the person reaches Support, **Then** they can skip and continue to Help build It.
2. **Given** the iOS app, **When** the Support page opens, **Then** no payment or purchase provider is initialised until the person explicitly starts a purchase (keeps the current rule in `docs/architecture/payments.md`).
3. **Given** an Apple purchase of monthly or annual support, **When** the person wants to cancel, **Then** It tells them it is managed in iPhone settings.

### Edge Cases

- Provider not configured or down: letter and skip still work; payment area shows an honest "unavailable" message (current code already maps `STRIPE_NOT_CONFIGURED` to a message in `packages/api/src/router.ts`).
- Person closes the tab mid-payment: on return, the page shows the true state from It's records (pending, succeeded or not taken), never a stale success.
- Slow confirmations: bank debits are not offered (Q6), but a card or wallet payment can still need extra authentication or take time to confirm; page and records show "pending" until confirmed.
- Double-click or retry on confirm: at most one charge per intended support.
- Recurring support already active, on web or through Apple: no second recurring support can be started (Q9); one-time support stays available.
- Refunds and disputes: refunds on request within [NEEDS CLARIFICATION: refund window N days, set by the founder], handled manually by the founder (Q13); shown honestly as refunded.
- Session expires while on the page: the person is asked to sign in again before paying; nothing is charged first.
- Account deleted: active web recurring support is cancelled; payment records are kept for accounting but unlinked from the person; the privacy page (010) says so (Q14). It cannot cancel Apple subscriptions, so the person is told to cancel those in iPhone settings.
- Very large or zero amounts, non-numeric input: rejected before any provider call, validated again on the server.
- Person outside the US: amounts are shown and charged in USD (Q5); their card issuer may convert.

## Requirements *(mandatory)*

### Functional Requirements

**Placement and skipping**

- **FR-001**: The Support page MUST be shown only to signed-in people (C6). It sits after signup and the required name step, before Help build It (Q1). Support entry points that currently appear before signup MUST be removed (Q2).
- **FR-001a**: After signup, a persistent "Support It" link MUST be available: in the footer on large screens; in the menu or settings on mobile and whenever signed in (Q2).
- **FR-002**: A skip control MUST be visible and work at all times on the page, including while the payment form is loading, has failed, or is mid-entry.
- **FR-003**: Skipping MUST NOT create any payment record, contact the payment provider, or cause later prompts during onboarding. Skip and thank-you MUST both lead to Help build It (Q1, Q21).
- **FR-004**: The Support page MUST have two steps: amount, then payment. The payment provider's script MUST load only on the Support screen, only after the person taps Next on the amount step, and never site-wide (Q7).

**Letter and copy**

- **FR-005**: The page MUST show a founder letter. Until the founder supplies text, it MUST show a clearly marked placeholder; no AI-drafted letter text ships.
- **FR-006**: All copy MUST use "support" and MUST NOT use "donate", "donation", "donor", "charity", "charitable" or equivalents, MUST NOT claim or imply tax deductibility, and MUST state that supporting unlocks nothing. One plain line near the confirm button MUST say support is not tax-deductible; the founder approves the wording (Q20).
- **FR-007**: The founder letter MUST be managed in the CMS like other product content; short legal lines (not tax-deductible, card handling) are fixed in the app (Q10).
- **FR-007a**: The page MUST show an aggregate funding total that comes from It's own support records, states what it counts and its as-of date, and never identifies individual supporters (Q17).

**Choosing and paying**

- **FR-008**: People MUST be able to choose a cadence of Monthly, Every year or Once with a segmented control; Monthly MUST be preselected (Q3).
- **FR-009**: People MUST be able to choose one of six preset amounts for the selected cadence (Monthly $3/5/10/20/50/100, default $5; Every year $30/50/100/200/500/1,000; Once $10/20/50/100/250/500), shown in two rows of three, or enter a custom amount of at least $1 and at most [NEEDS CLARIFICATION: custom maximum, left to the plan] (Q4). All amounts are USD (Q5). The same limits MUST be enforced on the device and on the server.
- **FR-009a**: The embedded form MUST offer cards, wallets (Apple Pay, Google Pay on web) and the provider's saved-details option, and MUST NOT offer bank debits (Q6). There is no "cover the fees" option (Q19).
- **FR-010**: Before confirming, the page MUST state in words the exact amount, currency, cadence, and (for recurring) that it renews until cancelled.
- **FR-011**: On web, payment details MUST be collected by an embedded payment-provider form within the Support page; the person MUST NOT be redirected to a hosted checkout page. Provider-required authentication steps (e.g. card-issuer verification) are allowed.
- **FR-012**: Card numbers and billing details MUST be handled only by the payment provider; It MUST NOT receive, log or store them.
- **FR-013**: Each support MUST be linked to the signed-in account that made it, on every platform. No support record is created without an account (no guest supports).
- **FR-013a**: Each It account MUST have at most one web payment-provider customer, created on its first support (Q12).
- **FR-013b**: An account MUST have at most one active recurring support across all providers. A person with one sees "Manage support" instead of a new recurring option; one-time support stays available (Q9).
- **FR-014**: Repeated submissions MUST NOT produce duplicate charges.

**Confirmation and status**

- **FR-015**: The page MUST show success only after It's own records confirm the payment from a verified provider notification; a browser return alone never confirms (keeps the rule in `docs/architecture/payments.md`).
- **FR-016**: The page MUST show honest states: being confirmed, succeeded, active, ending on a date, ended, payment needs attention, not taken, refunded.
- **FR-017**: The payment provider MUST send a receipt for each successful web payment to the verified account email, which the form shows prefilled and locked (Q11).

**Managing recurring support, refunds and deletion**

- **FR-018**: A signed-in person with recurring web support MUST be able to reach the payment provider's hosted management page from the Support page ("Manage support") to update payment details or cancel. For Apple subscriptions, It MUST point to iPhone settings (Q15).
- **FR-019**: Access to the management page MUST be authorised by the signed-in account that owns the support, not by possession of a reference or link.
- **FR-020**: Cancellations and changes made on the provider's page MUST be reflected in It's records and on the Support page after the provider notifies It.
- **FR-020a**: Refunds MUST be available on request within [NEEDS CLARIFICATION: refund window N days, set by the founder] and are handled manually by the founder (Q13).
- **FR-020b**: When an account is deleted, active web recurring support MUST be cancelled, and support records MUST be kept for accounting with the account link removed (Q14).

**Ledger**

- **FR-021**: It's support records MUST be provider-neutral: the core record describes who supported (account), how much, which currency, which cadence, current state and timestamps. Provider identifiers (payment-provider customer, subscription, payment and store transaction IDs) MUST live in separate provider-reference records linked to the core record, so a new provider (e.g. Apple) adds references without changing the core record. The existing ledger MUST be restructured this way now, while there is no production data (Q8).
- **FR-021a**: The merchant on record is We Are It LLC (Q18). The card-statement descriptor wording is [NEEDS CLARIFICATION: statement descriptor wording, left to the plan].
- **FR-022**: Provider notifications MUST be signature-verified, idempotent and order-safe (keeps current behaviour).
- **FR-023**: Annual cadence MUST be representable in the ledger alongside once and monthly for every provider.

**iOS**

- **FR-024**: Nothing in this feature MAY prevent the iOS app from building, running or completing onboarding. On iOS, Support MUST be skippable. The primary iOS option is Apple in-app purchase through RevenueCat for once, monthly and annual support (Apple subscriptions plus one-time purchases); it MUST NOT be built until the App Review guideline 3.1.2 research is done. The secondary option is a link out to web Support that explains It receives more that way (optionally showing the difference for the selected amount), only where allowed (Q15).
- **FR-025**: Any App Store purchase that iOS offers MUST be linked to the signed-in It account (FR-013): purchases start only after sign-in, the store purchase is tied to the account (for example, the RevenueCat app user ID is the It account ID), and the server records the account on the support. Today App Store purchases are recorded with no account (see Changes From What Exists, iOS); this MUST be fixed before any iOS purchase ships, whichever iOS option ships (a link-out to web Support satisfies it through the web account flow).

**Measurement**

- **FR-026**: Reaching the Support page, completing a support, and skipping MUST be recorded as funnel stages defined by the measurement spec (Q16), carrying no amount or cadence, and assumed to be unlinked from the account like the other stages (confirm in review).

### Key Entities

- **Support** (existing as `support_contributions`): one person's intention to support: account, amount, currency, cadence (once / monthly / annual), state, created/updated times, last provider event time. Provider-neutral.
- **Support payment** (existing as `support_transactions`): one money movement under a Support: amount, currency, state (succeeded, failed, refunded, partially refunded), when it happened, which provider.
- **Provider reference** (new, per FR-021): links a Support or payment to a provider's own identifiers (provider name, kind of identifier, value). Replaces inline provider columns.
- **Provider event receipt** (existing as `support_payment_events`): provider + event ID + body hash, for idempotency; no payload stored.
- **Account** (from 008 signup): the signed-in person; at most one web payment-provider customer, created on first support (Q12).
- **Funding total** (derived): an aggregate over Support payments from all providers, with its definition and as-of date (Q17).

## Changes From What Exists

A Support It flow already exists, built on Stripe hosted Checkout before the 2026-10-16 decisions. This spec changes it as follows.

| Area | Exists today | Change |
|---|---|---|
| Screen | `apps/app/app/support-it.tsx`: eyebrow "Optional support", title "Help keep the work moving.", presets $5/$15/$30 + another amount ($1–$1,000), cadence once/monthly with "once" and $15 preselected, button "Continue to secure checkout" that redirects to Stripe hosted Checkout; success/cancel read from URL params; "Explore other ways to help" link | New headline per features.md §4; CMS founder letter; funding total; two steps (amount, then embedded payment form); segmented cadence adding "Every year", Monthly $5 preselected; per-cadence presets in a 2×3 grid plus custom field; not-tax-deductible line; skip and thank-you lead to Help build It; returning-supporter "Manage support" view; "support" not "contribution" (C11); status shown from account, not URL reference |
| Entry points | `apps/app/app/onboarding/futures.tsx` (line ~164) and `apps/app/app/ways-to-help.tsx` (line ~77) link to `/support-it` before signup | Pre-signup links removed (specs 008 and 011 retire both routes); persistent post-signup "Support It" link in footer / menu / settings (FR-001a) |
| API contract | `packages/api/src/contract.ts` `support.createCheckout({amountMinor, frequency: once/monthly}) → {url, reference}`, `support.getStatus({reference})`, `support.createPortal({reference})` | Replace checkout-URL operation with a semantic "start support" operation that returns what the embedded form needs; add annual; status and portal operations keyed to the signed-in account, not a bare reference (FR-013, FR-019); a read operation for the funding total |
| API handlers | `packages/api/src/router.ts` passes `userId` (nullable) into `createCheckout`; `getStatus` and `createPortal` do not check the caller | Require a signed-in account for all support operations; authorise portal and status by ownership. Done for the current hosted-Checkout operations on branch `claude/vigorous-hawking-2ad1c8` (commits 20462bf, 3dad463; not yet merged): `createCheckout`, `getStatus` and `createPortal` require a session; status and portal return not-found for anyone but the owning account |
| Stripe adapter | `apps/api-server/src/stripe-support.ts`: Checkout Sessions (`mode: payment/subscription`), monthly only, success/cancel URLs, billing portal session, webhook mapping for `checkout.session.*`, `payment_intent.*`, `refund.*`, `charge.refunded`, `invoice.*`, `customer.subscription.*` | Move from Checkout Sessions to embedded-form payment and subscription creation; add yearly interval; one customer per account, created on first support, receipts to the account email; cards + wallets + saved details, no bank debits; drop `checkout.session.*` handling once unused; keep portal session; keep verification/idempotency |
| Local simulator | `apps/api-server/src/mock-stripe.ts`, `start-local-mock.ts` simulate hosted Checkout and portal pages | Needs an equivalent for the embedded flow, or rely on provider test mode (plan decision) |
| Ledger schema | `packages/database/src/migrations/003_support_payments.ts`: `support_contributions` with inline `stripe_customer_id`, `stripe_checkout_session_id`, `stripe_subscription_id`, `stripe_payment_intent_id`, `store_*`, `revenuecat_app_user_id`; `frequency in ('once','monthly')`; `amount_minor between 100 and 100000`; `user_id` nullable, `on delete set null`. `004_payment_event_ordering.ts` adds `last_payment_event_at` | Restructure now: provider IDs into provider-reference records (FR-021, Q8); add annual cadence; require an account link on all new supports; at most one active recurring support per account; maximum amount per the plan (Q4). `on delete set null` already matches the deletion answer (Q14); add cancelling web recurring support on deletion |
| Repository | `packages/database/src/support-repository.ts`: `createPendingStripeContribution`, `attachStripeCheckout`, `readSupportContributionStatus`, `readSupportContributionForPortal`, `recordStripeEvent`, `recordRevenueCatSupportEvent` | Provider-neutral naming and functions; read-by-account; funding-total query |
| iOS | `apps/app/src/payments/store-purchases.native.ts` + `apps/api-server/src/revenuecat-support.ts`: RevenueCat consumable tips `it_support_5/15/30`, one-time only, SDK configured only on tap; the purchase is not tied to the It account and `recordRevenueCatSupportEvent` stores `user_id: null` | Link every App Store purchase to the signed-in account (FR-025); keep RevenueCat and the "no SDK until tap" rule; after the guideline 3.1.2 research, extend from one-time tips to once/monthly/annual (Apple subscriptions + one-time purchases), or ship the link-out to web Support (Q15) |
| Measurement | No funnel stages exist for Support | Add reached / supported / skipped stages, defined in the measurement spec (FR-026) |
| Tests | `apps/api-server/tests/stripe-support.test.ts`, `revenuecat-support.test.ts`, `apps/app/e2e/onboarding.spec.ts` (expects "Supporting It is optional", "Continue to secure checkout", "Your contribution has been refunded.") | Update to embedded flow, annual, account-scoped access, new copy |
| Docs | `docs/architecture/payments.md` still describes hosted Checkout (banner says it needs revising) | Revise when the plan is written |
| Config | `.env.example`: `STRIPE_SECRET_KEY`, `STRIPE_SUPPORT_PRODUCT_ID`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_API_BASE`, `REVENUECAT_WEBHOOK_SECRET`, `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY` | Embedded form needs a publishable key exposed to the web app (public by design); secrets stay server-side |

Kept as is: webhook signature verification and raw-body handling (`apps/api-server/src/index.ts`), event dedupe by event ID + body hash, order-safe state updates, 200/400/500 semantics, no card or address data stored, support grants no product access.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of people who reach the Support page can continue to Help build It without paying, in one action, in every tested state (form loading, form failed, provider unconfigured, mid-entry).
- **SC-002**: A person who keeps the defaults can complete monthly support in under 90 seconds from arriving on the page, without leaving it (test mode, valid card).
- **SC-003**: Zero cases in testing where the page shows "thank you" before It's records confirm the payment.
- **SC-004**: A person with recurring web support can reach the cancel option in at most two actions from the Support page.
- **SC-005**: A copy review of every Support screen and message finds zero uses of "donate", "donation", "donor" or "charity", no claim of tax deductibility, and the not-tax-deductible line present near the confirm button.
- **SC-006**: No payment-provider network request is made by any page other than the Support screen, nor on the Support screen before the person taps Next (verified in a browser network log).
- **SC-007**: An annual and a monthly web support, and an Apple purchase if iOS ships, all appear in the same support records with the same fields and the account link.

## It Checks *(mandatory)*

### Privacy

- **Before signup, stays on device**: everything; the Support page is not reachable before signup. No payment-provider code loads before signup or anywhere outside step 2 of the Support screen (FR-004).
- **Before signup, sent**: nothing from this feature.
- **After signup, measurement**: reaching Support, supporting and skipping are funnel stages (Q16), assumed to be unlinked from the account like the other stages (confirm in review). The stage list and how it is sent belong to the measurement spec (not yet written); this spec only names the three stages.
- **After signup, stored on server**: account link, amount, currency, cadence, state, timestamps, provider reference IDs, provider event IDs and body hashes. Not stored: card data, billing address, full provider payloads. The payment provider stores card and billing data and its own fraud signals (which its embedded script collects from the browser on step 2); the privacy page (spec 010) must disclose this.
- **Never public by default**: whether someone supported, how much, or how often. The only public figure is an aggregate funding total, sourced and dated, with no individual supporters (Q17).

### Honest Status

No ideas are shown on this page. Honesty rules that apply: never imply charity or tax deductibility (the page says plainly it is not tax-deductible); never show success before confirmation; never show fake funding numbers or social proof. The aggregate funding total comes from It's own support records and states what it counts and its as-of date (Q17). The comparison sidebar, if built later, must be sourced and dated too.

### Must Not Block

- Manage or cancel recurring support inside It (optional, deferred by Q22): keep account-scoped status and management operations semantic so an in-It view can be added without changing the ledger.
- Comparison sidebar (optional, deferred by Q22): leave room on the page next to the funding total; do not build.
- Native iOS app with once/monthly/annual (optional): provider-neutral ledger with annual cadence and provider-reference records so Apple purchases land in the same place; no web-only assumptions in the core record.
- Admin support list and totals (optional, features.md §6): records carry enough (amount, currency, cadence, state, time) to total without provider calls; the same query can feed the public funding total.
- Invitations (optional): no effect.

### Accessibility

- Keyboard: the cadence segmented control and the preset amounts are radio groups operable by arrow keys; Next, Back, skip, confirm and "Manage support" are reachable in a logical tab order; the embedded form is keyboard-operable (provider responsibility, verify in testing).
- Screen reader: cadence and amount announce selected state; the charge summary is read before Next and before the confirm button; moving to step 2 moves focus to the step heading; status changes (confirming, succeeded, failed) are announced as live updates; the skip control has a clear name.
- Reduced motion: no animated transitions required to understand state; any loading indicator respects reduced motion.
- Meaning never by colour alone: selected cadence/amount and error states use text and shape, not colour only.

### Research Questions

- App Review guideline 3.1.2 ("ongoing value"): how likely is rejection of monthly/annual auto-renewing subscriptions that unlock nothing, and what do comparable support-only apps do? Must be answered before building iOS recurring (Q15).
- In which regions may the iOS app link out to web Support (the US after the Epic v. Apple ruling; elsewhere), and may it state how much more It receives (Apple 15% versus Stripe fees)?
- How do a visible skip and a monthly default affect completion and trust on support pages for open, non-charity projects?
- Does an embedded payment form, compared with hosted checkout, change completion rate or trust for small support payments?
- What data does the payment provider's embedded browser script collect (fraud signals, cookies), and how should that be disclosed under GDPR/UK GDPR and US state laws?
- What financial-record retention obligations apply to support records kept after a person deletes their account?

## Dependencies and Cross-Spec Notes

- **008 Signup gate**: Flow is signup → required name step → Support (Q1). Every support is tied to an account (C4, C6, FR-013), and the verified account email is the receipt email (Q11), so 008 must guarantee the email is verified and provide a signed-in session on arrival. A person who signs in later on another device should see their recurring support. Note: `specs/001-personal-page/spec.md` refers to an earlier split where support was "004"; this lane uses 009.
- **010 Safety floor + privacy page**: must disclose that the payment provider (and Apple/RevenueCat if iOS ships) processes card and billing data and collects fraud-prevention signals on step 2 of the Support page; what It stores (account link, amount, cadence, state, timestamps, provider IDs) and does not (card, address); that on account deletion recurring web support is cancelled and payment records are kept unlinked (Q14); that support is not a charitable donation and not tax-deductible; that the merchant and data controller is We Are It LLC (Q18); the Support funnel stages (through the measurement spec). The persistent footer / menu placement is shared with 010's privacy link.
- **011 Help build It**: the next step after Support, whether the person supports or skips (Q1, Q21). Support copy must not imply that money is the main or preferred way to help.
- **Measurement spec (new, not yet written)**: owns the funnel stage list, including Support reached / supported / skipped (Q16), and confirms whether those stages are unlinked from the account.

## Assumptions

- Stripe remains the web payment provider (decided); "embedded payment form" means a provider-hosted form embedded in It's page, keeping card data out of It's systems.
- USD is the only currency for v0.1 (Q5).
- The founder letter and refund wording are written or approved by the founder; legal lines are approved by the founder; this spec only reserves space.
- The provider's hosted management page is configured to allow cancellation and payment-method updates (setup task in `docs/roadmap/mvp.md`).
- The merchant entity is We Are It LLC (Q18); production Stripe account setup is outside this spec.
- The funding total counts all providers from It's own records; its exact definition (for example after refunds, before fees) is a plan detail, and the page states it next to the number.
