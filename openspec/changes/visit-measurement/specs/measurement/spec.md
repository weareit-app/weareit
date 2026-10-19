# Spec Delta

## Purpose

Counts, per visit, which steps a visit reaches, which pages it shows and which pains it opens, so the founder can see where visits stop and, for account holders, what their signup visit explored, without sending picks before signup or keeping any identifier on the device.

## ADDED Requirements

### Requirement: Only listed measurement
Measurement SHALL consist only of the stages in the stage list, the page views in the page-view list, pain opens, and totals derived from them. No other counter, event, analytics script or third-party measurement tool SHALL run. Adding, renaming or removing a stage or page SHALL be done by changing this capability.

#### Scenario: Inspecting a full visit
- **WHEN** everything the app sends during a full visit is recorded
- **THEN** every measurement message is a listed stage, a listed page view or a pain open, and no request goes to a third-party measurement service

### Requirement: One source for the lists
The stage list and page-view list SHALL each exist once, shared by the app, the receiving server and the privacy page's description of what is counted, and SHALL be free of app, UI and provider code.

#### Scenario: Lists match
- **WHEN** an automated check compares the lists the app sends from, the server accepts and the privacy page describes
- **THEN** they are identical

### Requirement: Visit and personal page stages
The stage list SHALL include `visit-started` (the app first shows any page in the visit), `personal-opened`, `personal-first-pain-opened`, `personal-first-dream-picked`, `personal-first-fix-seen` (fixes first shown under a picked dream) and `personal-moved-on` (going on from the personal page to the societal page).

#### Scenario: Visit that picks a dream and leaves
- **WHEN** a visit opens the personal page, opens a pain, picks a dream and leaves
- **THEN** `visit-started`, `personal-opened`, `personal-first-pain-opened` and `personal-first-dream-picked` are recorded for it and no later stage is

#### Scenario: Opening a personal pain on its pain page
- **WHEN** a visit first opens a personal pain on that pain's own page
- **THEN** `personal-first-pain-opened` is recorded

### Requirement: Societal page stages
The stage list SHALL include `societal-opened`, `societal-first-pain-opened`, `societal-first-dream-picked` and `societal-first-fix-seen`, defined as the personal stages are, for the societal page and societal pains.

#### Scenario: Societal pain opened
- **WHEN** a visit first opens a societal pain
- **THEN** `societal-first-pain-opened` is recorded and `personal-first-pain-opened` is not

### Requirement: Gate and account stages
The stage list SHALL include `gate-reached` (the signup gate is shown), `signed-up` (a new account is created and picks are saved) and `signed-in` (an existing account signs in on the gate).

#### Scenario: Week with three signups
- **WHEN** three visits in a week create accounts
- **THEN** that week's `signed-up` count is 3

#### Scenario: Returning account at the gate
- **WHEN** an existing account signs in on the gate
- **THEN** `signed-in` is recorded and `signed-up` is not

### Requirement: Support stages
The stage list SHALL include `support-reached` (the Support page is shown), `support-completed` (a support of any amount or cadence succeeds) and `support-skipped` (the person chooses to skip Support).

#### Scenario: Skipping Support
- **WHEN** a person skips the Support page
- **THEN** `support-skipped` is recorded and `support-completed` is not

### Requirement: Help build It stages
The stage list SHALL include `help-reached`, `help-background-given` (a background or skills are saved), `help-offered` (at least one offer is submitted) and `help-skipped`. They SHALL be revisited when the Help build It page is specified.

#### Scenario: Offer submitted
- **WHEN** a person on the Help build It page submits an offer
- **THEN** `help-offered` is recorded

### Requirement: Stage sent once per visit
Each stage SHALL be sent at most once per visit, when the visit first reaches it, whatever order stages are reached in.

#### Scenario: Dreams picked in five pains
- **WHEN** a visit picks dreams under five personal pains
- **THEN** `personal-first-dream-picked` is recorded once for that visit

#### Scenario: Out of order
- **WHEN** a signed-in person's visit opens the Support page directly
- **THEN** `support-reached` is recorded for that visit without any earlier stage

### Requirement: Page-view list
The page-view list SHALL be: `personal`, `societal`, `pain` with the pain's stable ID (never its slug), `gate` (the signup gate and its steps), `name` (the name step), `support`, `all-set` (the "You're all set" screen), `account` (the account screen), `help`, `privacy` and `faq`. Any other page SHALL NOT be counted until it is added to this list.

#### Scenario: Two pain pages
- **WHEN** visits view `/p/loneliness` and `/p/broke`
- **THEN** each is recorded as a `pain` page view with that pain's stable ID, and the report shows a row for each

#### Scenario: Unlisted page
- **WHEN** a visit shows a page not in the list
- **THEN** no page view is sent for it

### Requirement: Page view each time shown
A page view SHALL be sent each time a listed page is shown in a visit.

#### Scenario: Returning to the personal page
- **WHEN** a visit shows the personal page, goes to the societal page and comes back
- **THEN** two `personal` page views are recorded

### Requirement: Pain opens
Each pain a visit opens, on the personal page, the societal page or a pain page, SHALL be sent once per pain per visit, by the pain's stable ID only, never with its dreams or fixes.

#### Scenario: Same pain opened twice
- **WHEN** a visit opens a pain on its pain page and later opens it again on the personal page
- **THEN** one pain open is recorded for that pain

### Requirement: No picks before signup
Before signup, measurement SHALL NOT send which dreams were picked or which fixes were selected; picking and selecting SHALL appear only as the "first ..." stages.

#### Scenario: Picking several dreams
- **WHEN** a signed-out visit picks three dreams and selects two fixes
- **THEN** no message names a dream or a fix

### Requirement: Message contents
Each measurement message SHALL contain only the visit number, the platform (web or iOS app) and one of: a stage name, a page view (with the pain's stable ID for a pain page), or a pain open (the pain's stable ID). It SHALL NOT contain picks, free text, referrer, tracking tags, amounts, cadence, email, name, device or browser description, screen size, language or location.

#### Scenario: Support completed
- **WHEN** `support-completed` is sent
- **THEN** the message holds no amount or cadence

#### Scenario: Arriving by a link with tracking tags
- **WHEN** a visit arrives from a social post with tracking tags in the address
- **THEN** no measurement message holds the referrer or the tags

### Requirement: Unbuilt pages are not counted
A stage or page view whose page does not exist in a release SHALL NOT be sent in that release.

#### Scenario: Help build It not yet built
- **WHEN** a release has no Help build It page
- **THEN** no `help-*` stage and no `help` page view is ever sent

### Requirement: Visit number in memory only
The visit number SHALL be random, created when the app starts, held only in memory, and never written to device storage, cookies or the URL.

#### Scenario: Inspecting the device
- **WHEN** device storage, cookies and the address bar are inspected during a visit
- **THEN** the visit number appears in none of them

### Requirement: When a visit ends
On web, a visit SHALL end when the page is reloaded or closed; a new tab SHALL start a new visit. In the iOS app, a visit SHALL last from process start to process end, and returning from the background SHALL keep the same visit.

#### Scenario: Reload
- **WHEN** the person reloads the page
- **THEN** a new visit number is created and `visit-started` is sent again

#### Scenario: iOS background
- **WHEN** the iOS app returns from the background without having been closed
- **THEN** the same visit continues

### Requirement: No link between visits before signup
No identifier other than the visit number SHALL connect measurement messages, and none SHALL persist on the device. Visits before the signup or sign-in visit SHALL NOT be linked to each other or to an account.

#### Scenario: Earlier visit on the same device
- **WHEN** a person visits, reloads, and signs up in the second visit
- **THEN** the first visit stays unlinked

### Requirement: Signup or sign-in visit linked
When a person signs up or signs in during a visit, the server SHALL link that visit's stages, page views and pain opens, those already recorded and those recorded later in the visit, to that account.

#### Scenario: Signup
- **WHEN** a person views a pain page, picks a dream and signs up in one visit
- **THEN** that visit's page views, pain opens and stages are linked to the new account

#### Scenario: Sign-in
- **WHEN** an existing account signs in during a visit
- **THEN** that visit's records are linked to that account

### Requirement: Visit starting signed in
A visit that starts while the person is already signed in SHALL be linked to that account from its first record.

#### Scenario: Returning signed-in person
- **WHEN** a signed-in person opens It in a new tab
- **THEN** the new visit's records are linked to their account

### Requirement: One account per visit
A visit SHALL be linked to at most one account. After sign-out it SHALL stay linked to that account; if a different account signs in later in the app's run, the app SHALL start a new visit for it.

#### Scenario: Sign out then another account signs in
- **WHEN** account A signs out and account B signs in without a reload
- **THEN** the earlier records stay linked to A and later records belong to a new visit linked to B

### Requirement: Messages carry no account data
Measurement messages SHALL carry no account identifier, session or cookie. Linking SHALL happen only on the server, from the visit number the app sends with an authenticated link request at signup, sign-in or visit start.

#### Scenario: Signed-in visit
- **WHEN** a measurement message is sent during a signed-in visit
- **THEN** it carries no session cookie, token or account identifier

### Requirement: Who can read linked measurement
Linked measurement SHALL be readable only by the founder and by It's own features that personalise fixes for that account, and SHALL NOT appear in any public artifact.

#### Scenario: Public pages
- **WHEN** any public page or shared link is inspected
- **THEN** it reveals no measurement record, linked or not

### Requirement: Server validates messages
The receiving server SHALL accept only messages whose stage, page and pain ID are in the current lists and published pain IDs and whose fields are the allowed ones, and SHALL reject anything else without storing it.

#### Scenario: Unknown stage
- **WHEN** a message names a stage that is not in the stage list
- **THEN** it is rejected and nothing is stored

#### Scenario: Extra field
- **WHEN** a message includes a field such as a referrer
- **THEN** it is rejected and nothing is stored

### Requirement: No network address stored
The receiving server SHALL NOT store the sender's network address or device or browser description with measurement records.

#### Scenario: Stored record
- **WHEN** a stored measurement record is read
- **THEN** it holds no network address and no browser or device description

### Requirement: Times as received
Each stored record SHALL carry the time the server received it, at full precision; times from the device SHALL NOT be used.

#### Scenario: Wrong device clock
- **WHEN** a device's clock is a day out
- **THEN** its records carry the server's receive time

### Requirement: Kept indefinitely
Measurement records SHALL be kept indefinitely, except as account deletion requires. A stage or page removed or renamed later SHALL keep its old name in old records.

#### Scenario: A year later
- **WHEN** the founder reads the report for a week a year ago
- **THEN** that week's records are still there

### Requirement: Unlink on account deletion
When an account is deleted, its linked visits SHALL be unlinked and kept as visits with no account.

#### Scenario: Deleting a test account
- **WHEN** a test account with linked visits is deleted
- **THEN** none of its visits is linked to it any more and the weekly totals are unchanged

### Requirement: Export and unlink by account
The stored records SHALL allow all of an account's linked visits to be found, exported and unlinked, so access and deletion requests can be met.

#### Scenario: Access request
- **WHEN** the founder exports an account's measurement
- **THEN** every stage, page view and pain open linked to it is included

### Requirement: Disclosed before sending
On a pre-signup page, no measurement message SHALL be sent before that page's privacy note has been shown. On signed-in pages, the privacy page link in the shared page chrome SHALL be the disclosure.

#### Scenario: First page of a visit
- **WHEN** a visit's first page renders
- **THEN** no message is sent until the privacy note on that page is on screen

### Requirement: Disclosure ships with sending
Measurement SHALL be sent only in a release that includes the privacy note, the privacy page's description of every listed stage and page view, and the gate's line about this visit. A release without them SHALL send nothing and claim no counting.

#### Scenario: Release without the wording
- **WHEN** a release lacks the privacy page's description of what is counted
- **THEN** the app sends no measurement message

### Requirement: No opt-out control
There SHALL be no control to turn counting off, and Global Privacy Control SHALL NOT be treated as an opt-out.

#### Scenario: Global Privacy Control on
- **WHEN** a browser sends the Global Privacy Control signal
- **THEN** measurement is sent as for any other visit

### Requirement: Never in the way
Sending measurement SHALL NOT delay, block or change anything the person sees, and no error SHALL be shown when it fails.

#### Scenario: Requests blocked
- **WHEN** every measurement request is blocked and the person completes a full visit including signup
- **THEN** nothing visible changes and nothing waits

### Requirement: Failures dropped
A message that fails to send SHALL be dropped. Messages SHALL NOT be queued in device storage or retried in a later visit.

#### Scenario: Offline
- **WHEN** the device is offline while a page is shown
- **THEN** that page view is dropped and nothing is stored to send later

### Requirement: Signup does not depend on measurement
Signup and sign-in SHALL succeed whether or not any measurement for the visit succeeded; with nothing recorded, there is nothing to link.

#### Scenario: Measurement failed all visit
- **WHEN** all measurement for a visit failed and the person signs up
- **THEN** signup succeeds and saves their picks

### Requirement: Same on web and iOS
Measurement SHALL use the same lists and message shape on web and in the iOS app, and the iOS app SHALL NOT use a platform analytics or advertising identifier.

#### Scenario: iOS message
- **WHEN** the iOS app sends a page view
- **THEN** it has the same fields as on web, with platform "iOS app", and no advertising identifier is read

### Requirement: Link previews not counted
Link-preview fetchers and crawlers that do not run the app SHALL NOT produce visits or records.

#### Scenario: Shared pain link previewed
- **WHEN** a chat app fetches a pain page to build a preview
- **THEN** no visit, page view or stage is recorded

### Requirement: Founder report
The founder SHALL be able to read visits reaching each stage per day or week and as a share of that period's visits, views per page (each pain page on its own row) and opens per pain, for a chosen date range.

#### Scenario: Three test visits
- **WHEN** three test visits stop at different stages and view two pain pages
- **THEN** each stage and each page view count rises by exactly the visits that reached it

### Requirement: Report filters and counts
The only split SHALL be platform. The report SHALL show real counts, however small, with no small-number suppression, and SHALL be readable only by the founder.

#### Scenario: Small count
- **WHEN** one visit reached `help-offered` in a week
- **THEN** the report shows 1

### Requirement: Honest status
The report SHALL say in one line that reloads split visits and blocked requests are missed. No page SHALL claim counting that the release does not do, or omit counting it does.

#### Scenario: Report caveat
- **WHEN** the founder opens the report
- **THEN** it states that reloads split visits and blocked requests are not counted

### Requirement: Measurement privacy
Before signup, picks, selected fixes, own contributions and how the visit arrived SHALL stay on the device; only listed stages, page views and pain opens, with the in-memory visit number and platform, SHALL be sent. After signup or sign-in, that visit's and later visits' records SHALL be stored linked to the account. No measurement SHALL be public by default.

#### Scenario: Never-signed-up visit
- **WHEN** the records of a visit that never signed up are read
- **THEN** they hold no account, email, network address or device identifier

### Requirement: Report accessibility
The report's filters SHALL be usable by keyboard, its tables SHALL have row and column headers for screen readers, it SHALL use no motion, and meaning SHALL NOT rely on colour alone.

#### Scenario: Screen reader on a cell
- **WHEN** a screen-reader user moves to a count in the funnel table
- **THEN** its period and stage are announced
