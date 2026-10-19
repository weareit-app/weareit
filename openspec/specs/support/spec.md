# support Specification

## Purpose
The Support It page (`/support-it`) lets people give optional money to It: one-time or monthly through Stripe-hosted Checkout on web, and one-time App Store purchases through RevenueCat on iOS. Payments are recorded in a support ledger updated by provider webhooks.

## Requirements

### Requirement: Support page
The page SHALL be headed "Optional support" / "Help keep the work moving." and say that supporting It "is optional and does not unlock a better version of the product". On web it SHALL offer One time or Monthly and preset amounts plus "Another amount", accepting $1 to $1,000 (USD), with "Continue to secure checkout".

#### Scenario: Amount out of range
- **WHEN** the person enters $0.50 or $2,000
- **THEN** the page says "Enter an amount between $1 and $1,000."

### Requirement: Web checkout requires an account
Starting a web checkout SHALL require a signed-in session and SHALL create a pending support record tied to that account, then redirect to Stripe-hosted Checkout. A signed-out call SHALL fail with UNAUTHORIZED.

#### Scenario: Signed out
- **WHEN** a signed-out person tries to start checkout
- **THEN** no support record is created and the call fails with UNAUTHORIZED

### Requirement: Payment outcome after Checkout
After returning from Checkout (`/support-it?status=…&ref=<reference>`), the page SHALL poll the payment status while it is pending and show the outcome (confirmed, refunded, payment failed, ended, not completed). Monthly supporters SHALL be able to open the Stripe billing portal.

#### Scenario: Pending payment
- **WHEN** the person returns while Stripe has not confirmed yet
- **THEN** the page says it is waiting for Stripe and checks again

### Requirement: Status and portal scoped to the account
Status and portal calls SHALL require a signed-in session and SHALL only find records owned by the caller; records owned by another account or by no account SHALL be reported as not found. A signed-out return SHALL ask the person to sign in with the account they used.

#### Scenario: Someone else's link
- **WHEN** a different signed-in account opens a supporter's return link
- **THEN** status and portal calls return NOT_FOUND

### Requirement: Webhook ledger
The API server SHALL verify Stripe webhook signatures, process each event once, and order events so an older event cannot overwrite a newer state.

#### Scenario: Duplicate webhook
- **WHEN** Stripe delivers the same event twice
- **THEN** the support record changes only once

### Requirement: iOS App Store support
On iOS the page SHALL offer fixed one-time App Store amounts (`it_support_5`, `it_support_15`, `it_support_30`) through RevenueCat, configuring the SDK only when the person taps to purchase, and SHALL record verified purchases in the ledger.

#### Scenario: Purchase on iOS
- **WHEN** the person completes an App Store purchase
- **THEN** the page says Apple confirmed it and a support record is stored

## Known divergence from founder decisions (2026-10-19)
- Web uses hosted Checkout with once/monthly; the founder decided on an embedded Stripe form with once/monthly/annual, monthly $5 preselected, six presets per cadence, a two-step page, a public funding total, and Support only after signup (spec 009).
- Copy says "contribution"; It says "support".
- The ledger has inline `stripe_*`, `store_*` and RevenueCat columns; the founder decided to move provider IDs into separate provider-reference records.
- iOS purchases are saved without an account and RevenueCat creates an anonymous app-user ID; the founder decided every purchase must be tied to the account.
- Pre-signup screens link to this page.
