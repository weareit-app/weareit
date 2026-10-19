# Spec Delta

## MODIFIED Requirements

### Requirement: Support page
The page SHALL be shown only to a signed-in person. Step 1 SHALL show the headline "It's free for you—and you're not the product.", the founder letter, one plain line saying support is optional and unlocks nothing, the public funding total, and a skip control. Copy is placeholder until the founder approves it.

#### Scenario: Signed-in person opens Support
- **WHEN** a signed-in person opens the Support page
- **THEN** step 1 shows the headline, the letter, the optional-and-unlocks-nothing line, the funding total and a skip control

#### Scenario: Signed-out person opens Support
- **WHEN** a signed-out person opens the Support page address
- **THEN** they are asked to sign in and no amount or payment controls are shown

#### Scenario: Amount out of range
- **WHEN** the person enters $0.50 or $2,000
- **THEN** the page says "Enter an amount between $1 and $1,000."

### Requirement: Web checkout requires an account
Starting a web support SHALL require a signed-in session and SHALL create a pending support record tied to that account before the payment form is shown. A signed-out call SHALL fail with UNAUTHORIZED.

#### Scenario: Signed out
- **WHEN** a signed-out person tries to start a web support
- **THEN** no support record is created and the call fails with UNAUTHORIZED

### Requirement: iOS App Store support
On iOS the page SHALL offer App Store support through RevenueCat only to a signed-in person, configuring the SDK with the It account's ID only when the person taps to purchase, and SHALL record verified purchases in the ledger against that account. A purchase that cannot be matched to an account SHALL NOT be recorded as a support.

#### Scenario: Purchase on iOS
- **WHEN** a signed-in person completes an App Store purchase
- **THEN** the page says Apple confirmed it and a support record linked to their account is stored

#### Scenario: Purchase without an account
- **WHEN** a verified store event arrives whose app user ID matches no It account
- **THEN** no support record is created and the event is logged for the founder

#### Scenario: SDK not started early
- **WHEN** a person opens the Support page on iOS and does not tap a purchase button
- **THEN** the purchase SDK is not configured

## REMOVED Requirements

### Requirement: Payment outcome after Checkout
**Reason**: Hosted Checkout and its return page (`/support-it?status=…&ref=…`) are replaced by the embedded form, which shows its outcome on the Support page itself.
**Migration**: See "Success only after It's records confirm", "Honest support states" and "Manage support link" in this change; the account-scoped status and portal requirement stays.

## ADDED Requirements

### Requirement: Two-step web page
On web the Support page SHALL have two steps: amount, then payment. The Stripe script SHALL load only on the Support screen and only after the person taps Next on step 1, never on any other page.

#### Scenario: Before Next
- **WHEN** the Support page is open on step 1
- **THEN** no request to the payment provider has been made

#### Scenario: Other pages
- **WHEN** a person uses any page other than Support step 2
- **THEN** no payment provider script is loaded

#### Scenario: Back to step 1
- **WHEN** the person taps Back on step 2
- **THEN** step 1 shows with their cadence and amount kept

### Requirement: Cadence choice
Step 1 SHALL offer a segmented control with Monthly, Every year and Once, with Monthly preselected.

#### Scenario: Defaults
- **WHEN** step 1 first appears
- **THEN** Monthly is selected

### Requirement: Preset amounts per cadence
Step 1 SHALL show six preset amounts for the selected cadence in two rows of three, then a custom amount field: Monthly $3, $5, $10, $20, $50, $100 ($5 preselected); Every year $30, $50, $100, $200, $500, $1,000; Once $10, $20, $50, $100, $250, $500.

#### Scenario: Monthly default amount
- **WHEN** step 1 first appears
- **THEN** $5 is selected among the Monthly presets

#### Scenario: Switching cadence
- **WHEN** the person selects Every year
- **THEN** the six Every year presets replace the Monthly ones

### Requirement: Amount limits
Amounts SHALL be in US dollars, at least $1 and at most $1,000 per payment (maximum pending founder confirmation), and the same limits SHALL be enforced on the device and on the server before any provider call.

#### Scenario: Custom amount out of range
- **WHEN** the person enters $0.50 or $2,000 in the custom field
- **THEN** Next is unavailable and the page explains the limits, and no provider call is made

#### Scenario: Server check
- **WHEN** a start-support call arrives with an amount outside the limits
- **THEN** it is rejected and no support record is created

### Requirement: Charge summary
Before Next and again before the confirm button, the page SHALL state in words the exact amount, currency and cadence, and for recurring support that it renews until cancelled and can be cancelled at any time.

#### Scenario: Annual summary
- **WHEN** the person chooses Every year and $100
- **THEN** the page states $100 USD every year until cancelled, cancellable at any time

### Requirement: Embedded payment form
On web, payment details SHALL be entered in a Stripe form embedded in the Support page, with no redirect to a hosted checkout page; issuer authentication steps are allowed. It SHALL offer cards, browser wallets and Stripe's saved-details option, and SHALL NOT offer bank debits or a "cover the fees" option.

#### Scenario: One-time payment in place
- **WHEN** the person confirms a valid card for a one-time support
- **THEN** the payment completes without leaving the Support page

#### Scenario: Methods offered
- **WHEN** step 2 loads
- **THEN** cards, supported wallets and saved details are offered, and no bank debit or fee-cover option appears

### Requirement: Receipt to the account email
Stripe SHALL send a receipt for each successful web payment to the account's verified email, which step 2 SHALL show prefilled and not editable.

#### Scenario: Locked email
- **WHEN** step 2 loads
- **THEN** the receipt email shown is the account's verified email and cannot be changed

### Requirement: Card data stays with the provider
Card numbers and billing details SHALL be handled only by the payment provider; It SHALL NOT receive, log or store them, and step 2 SHALL say so in one line.

#### Scenario: Server request contents
- **WHEN** a web support is started and confirmed
- **THEN** no request to It's server contains card numbers or billing address

### Requirement: Not tax-deductible line
Step 2 SHALL show one plain line near the confirm button saying support is not tax-deductible, in wording approved by the founder.

#### Scenario: Line present
- **WHEN** step 2 is shown
- **THEN** the not-tax-deductible line appears next to the confirm button

### Requirement: Support wording
Every Support screen, message and receipt text It controls SHALL say "support" and SHALL NOT use "donate", "donation", "donor", "contribution", "charity" or "charitable", or imply tax deductibility.

#### Scenario: Copy review
- **WHEN** every Support screen and state message is reviewed
- **THEN** none of the forbidden words appear

### Requirement: Founder letter from the CMS
The founder letter SHALL be loaded from the CMS as published content. Until the founder publishes text, a clearly marked placeholder SHALL show; no drafted letter text ships. Short legal lines SHALL be fixed in the app.

#### Scenario: No letter published
- **WHEN** the CMS has no published letter
- **THEN** the page shows the marked placeholder and works otherwise

### Requirement: Public funding total
The page SHALL show an aggregate funding total computed from It's own support records across all providers, with a plain statement of what it counts and its as-of date, and SHALL never name or count out any individual supporter.

#### Scenario: Total shown
- **WHEN** step 1 loads
- **THEN** the total, what it counts and its as-of date are shown

#### Scenario: Public read
- **WHEN** the funding total is requested
- **THEN** the response contains only the total, currency, definition and as-of time

### Requirement: Skip always works
A skip control SHALL be visible and usable at every moment on the Support page, including while the form loads, after it fails and mid-entry. Skipping SHALL NOT create a support record, contact the payment provider, or cause later support prompts during onboarding.

#### Scenario: Skip mid-entry
- **WHEN** the person skips while typing card details
- **THEN** they move on, nothing is charged and no support record is created

#### Scenario: No nag
- **WHEN** a person who skipped continues through onboarding
- **THEN** no reminder or prompt about support appears

### Requirement: Provider unavailable
When the payment provider is not configured or fails to load, the page SHALL keep the letter, funding total and skip working and SHALL say that support is temporarily unavailable.

#### Scenario: Stripe down
- **WHEN** the payment form fails to load
- **THEN** the page says support is temporarily unavailable and skip still works

### Requirement: One payment customer per account
Each account SHALL have at most one Stripe customer, created on its first web support and reused for every later web support.

#### Scenario: Second support
- **WHEN** an account that supported once starts another web support
- **THEN** the existing Stripe customer is used

### Requirement: One active recurring support
An account SHALL have at most one active recurring support across all providers; past-due counts as active, while support scheduled to end does not block a new one (pending founder confirmation). One-time support SHALL stay available.

#### Scenario: Second recurring refused
- **WHEN** an account with active monthly support tries to start annual support
- **THEN** the server refuses it and the page offers "Manage support" and Once

### Requirement: No duplicate charges
Repeated taps, retries or resubmissions for one intended support SHALL result in at most one charge.

#### Scenario: Double tap
- **WHEN** the person taps confirm twice
- **THEN** only one payment is taken and one support record exists

### Requirement: Success only after It's records confirm
The page SHALL show success only after It's records hold a confirmation from a verified provider notification; until then it SHALL say the payment is being confirmed. A browser-side result alone never confirms.

#### Scenario: Confirmed later
- **WHEN** the form reports success before Stripe's notification is recorded
- **THEN** the page says "being confirmed" and switches to thank-you once the record confirms

#### Scenario: Return after closing the tab
- **WHEN** the person closes the tab mid-payment and reopens Support
- **THEN** the page shows the state from It's records, never a stale success

### Requirement: Honest support states
The page SHALL show each support's true state in plain words: being confirmed, succeeded, active, ending on a date, ended, needs attention, not taken, or refunded. A failed payment SHALL say whether money was taken and offer try again, change method and skip.

#### Scenario: Declined card
- **WHEN** the card is declined
- **THEN** the page says no payment was taken, gives the reason in plain words, and offers retry, another method and skip

#### Scenario: Refunded
- **WHEN** a support is refunded
- **THEN** the page says it was refunded

### Requirement: Returning supporter view
A signed-in person with active recurring support SHALL see its cadence, amount and next payment date when known, with "Manage support" in place of new recurring options; a failed renewal SHALL be shown as needing attention.

#### Scenario: Active monthly supporter
- **WHEN** a person with active $5 monthly support opens Support
- **THEN** they see "$5 every month", the next payment date if known, "Manage support" and the Once option

#### Scenario: Renewal failed
- **WHEN** the latest renewal did not go through
- **THEN** the page says so and offers "Manage support" to update the payment method

### Requirement: Manage support link
A person with recurring web support SHALL reach Stripe's hosted management page from "Manage support" to update payment details or cancel, authorised by the signed-in owning account. For App Store recurring support, the page SHALL say it is managed in iPhone settings.

#### Scenario: Open portal
- **WHEN** the owner taps "Manage support"
- **THEN** Stripe's hosted page opens for their customer

#### Scenario: Not the owner
- **WHEN** any other account requests that support's management page
- **THEN** It refuses with NOT_FOUND

### Requirement: Provider changes reflected
Cancellations, payment-method updates and renewals made with the provider SHALL be reflected in It's records and on the Support page after the provider notifies It.

#### Scenario: Cancelled in the portal
- **WHEN** the person cancels at period end on Stripe's page
- **THEN** the Support page shows "ends on <date>" and, after that date, "ended"

### Requirement: Annual cadence in the ledger
The ledger SHALL record once, monthly and annual cadence for every provider.

#### Scenario: Annual web support
- **WHEN** an annual web support is confirmed
- **THEN** its record has cadence annual with the same fields as monthly

### Requirement: Provider-reference records
Each support record SHALL hold only provider-neutral facts (account, amount, currency, cadence, state, timestamps); provider identifiers (customer, subscription, payment, store transaction, app user) SHALL be stored in separate provider-reference records linked to it.

#### Scenario: Web and App Store in one ledger
- **WHEN** a web support and an App Store support exist for one account
- **THEN** both are support records with the same fields, each linked to its own provider references

### Requirement: Refunds recorded
Refunds SHALL be made on request by the founder through the provider and SHALL be recorded from the provider's notification, marking the payment refunded and reducing the funding total.

#### Scenario: Founder refunds
- **WHEN** the founder refunds a payment in Stripe
- **THEN** It's record shows refunded and the funding total no longer counts it

### Requirement: Account deletion and support
When an account is deleted, its active web recurring support SHALL be cancelled with the provider, and its support records SHALL be kept with the account link removed. App Store recurring support SHALL be pointed to iPhone settings, since It cannot cancel it.

#### Scenario: Delete with monthly support
- **WHEN** an account with active monthly web support is deleted
- **THEN** the subscription is cancelled and the support records remain with no account link

### Requirement: Support link after signup
After signup, a persistent "Support It" link SHALL be available: in the footer on large screens, and in the menu or settings on small screens and whenever signed in.

#### Scenario: Signed in on a phone
- **WHEN** a signed-in person opens the menu on a small screen
- **THEN** a "Support It" link is there

### Requirement: Support moments for measurement
The app SHALL emit three Support moments for the measurement change to send: Support shown, support completed (when It's records confirm it) and Support skipped. They SHALL carry no amount, cadence or provider data.

#### Scenario: Skip moment
- **WHEN** the person skips Support
- **THEN** a Support-skipped moment is emitted with no amount or cadence

### Requirement: Merchant identity
Payments SHALL be taken by We Are It LLC as merchant of record, with a card-statement descriptor the founder approves.

#### Scenario: Statement
- **WHEN** a web payment succeeds
- **THEN** the provider account charging it belongs to We Are It LLC and uses the approved descriptor

### Requirement: Support privacy
Nothing about Support SHALL be sent or stored before signup. After signup It SHALL store only account link, amount, currency, cadence, state, timestamps, provider references and event IDs with body hashes; Support moments follow the AGENTS.md measurement invariant. Whether, how much or how often anyone supported SHALL never be public.

#### Scenario: Stored fields
- **WHEN** a web support is confirmed
- **THEN** It's records hold no card data, billing address or full provider payload

#### Scenario: Never public
- **WHEN** any public page or response is examined
- **THEN** no individual's support, amount or cadence appears, only the aggregate total

### Requirement: Support honest status
The page SHALL NOT imply charity, tax deductibility, product benefits from supporting, or success before confirmation, and SHALL NOT show invented totals or social proof. Deferred features (managing support inside It, the comparison sidebar) SHALL NOT appear.

#### Scenario: No deferred features
- **WHEN** the Support page is reviewed
- **THEN** no in-It management controls or comparison sidebar appear and no copy implies they exist

### Requirement: Support accessibility
Cadence and preset amounts SHALL be radio groups operable by keyboard with announced selection; the charge summary SHALL be read before Next and confirm; moving to step 2 SHALL move focus to its heading; state changes SHALL be announced; motion SHALL respect reduced motion; selection and errors SHALL never rely on colour alone.

#### Scenario: Keyboard only
- **WHEN** a keyboard user arrows through cadence and amounts and presses Next
- **THEN** the selection changes and is announced, and focus lands on the step 2 heading

#### Scenario: Status announced
- **WHEN** the state changes from being confirmed to succeeded
- **THEN** a screen reader announces the new state
