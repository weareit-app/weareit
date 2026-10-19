# Spec Delta

## Purpose

A public page, reachable without an account, that tells people plainly what It keeps on their device, what it sends and stores, which other services are involved, the legal basis and how long things are kept, and how to use their rights.

## ADDED Requirements

### Requirement: Page structure
The privacy page SHALL start with a short plain summary, then have one section per stage (before signup, at signup, after signup, supporting, helping), then rights and contact. It SHALL replace the placeholder page.

#### Scenario: Reading the summary
- **WHEN** someone opens the privacy page
- **THEN** a short summary comes first, followed by the stage sections, rights and contact

### Requirement: Only what is live
Each section SHALL describe only what the release actually does. When a feature that collects data ships, its section SHALL ship in the same release; until then the page SHALL not describe it.

#### Scenario: Measurement switched off
- **WHEN** a release does not send measurement
- **THEN** the page does not describe measurement as happening

#### Scenario: Measurement switched on
- **WHEN** measurement is switched on in a release
- **THEN** that release's privacy page describes the stages, page views, pains opened and the linking of visits to accounts

### Requirement: What each stage collects
The page SHALL describe, for each live feature, what is collected and why: device storage before signup; measurement; the account (email, name, password hash or passkey, language, opt-in and its wording version); saved picks and selected fixes; own contributions; Help background, skills, note and offers; support records; sessions; host logs.

#### Scenario: Matches the gate
- **WHEN** someone compares the page with the signup gate's "what will be saved" list
- **THEN** both say the same thing

### Requirement: Services and data location
The page SHALL name every outside service and what it receives (including Neon, Stripe, Apple and RevenueCat, HaveIBeenPwned, the email provider and the web host), and SHALL say data is stored in the US (Neon, AWS us-east), including for UK and EU visitors, with the legal basis for that transfer.

#### Scenario: UK reader
- **WHEN** a UK visitor reads where data is stored
- **THEN** the page says it is stored in the US and names the transfer basis

### Requirement: Legal bases
The page SHALL state the legal basis for each use: contract for the account, saved picks and Help offers; consent for update emails and for contact about an offer; legitimate interests for sessions, host logs and measurement before signup; legal obligation for payment records kept after deletion. The basis for linking visits to an account SHALL be stated only once linking is switched on.

#### Scenario: Linking not yet confirmed
- **WHEN** account linking has not been switched on
- **THEN** measurement stays off and the page does not claim a basis for linking

### Requirement: Retention
The page SHALL state how long each kind of data is kept: device choices until cleared or saved; account data until deletion; measurement indefinitely, unlinked on deletion; session data until the session ends; host logs at most 14 days where IP addresses and paths cannot be dropped; payment records 7 years after deletion with the person removed.

#### Scenario: Payment records
- **WHEN** someone reads what happens to payments after deletion
- **THEN** the page says they are kept 7 years with the person removed

### Requirement: Rights requests
The page SHALL explain how to ask for access, export, correction or deletion: by email from the account's address, or after signing in to confirm identity. It SHALL commit to replying within 30 days. Every request SHALL be logged with its date and outcome.

#### Scenario: Deletion request
- **WHEN** a person emails a deletion request from their account address
- **THEN** It replies within 30 days and the request is logged

### Requirement: Contact address
`hello@weareit.app` SHALL be the contact address, with `privacy@weareit.app` as an alias for privacy requests, shown on the privacy page and in the footer (menu on small screens and when signed in).

#### Scenario: Footer
- **WHEN** someone looks at the footer on a large screen
- **THEN** the contact address and links to the privacy page and FAQ are there

### Requirement: Device storage without a banner
The page SHALL list what is stored on the device (choices before signup, the sign-in cookie, the language choice) and that nothing tracks people across sites. The app SHALL show no cookie banner, since this storage is needed for what the person asked for.

#### Scenario: No banner
- **WHEN** someone first opens It
- **THEN** no cookie banner appears and the privacy page lists the storage used

### Requirement: Who and for whom
The page SHALL name We Are It LLC as the operator and data controller and SHALL state that It is for people 16 and over.

#### Scenario: Operator
- **WHEN** someone reads who runs It
- **THEN** the page names We Are It LLC

### Requirement: Changes to the page
The page SHALL show a "last updated" date and a dated list of changes. Account holders SHALL be emailed about material changes; this email SHALL be sent regardless of the update opt-in.

#### Scenario: Material change
- **WHEN** the page changes what It collects
- **THEN** the change list gains a dated entry and account holders are emailed

### Requirement: Privacy page accessibility
The page SHALL use real headings for each section, be readable at 200% text size without horizontal scrolling, and be usable by keyboard and screen reader.

#### Scenario: Headings
- **WHEN** a screen-reader user lists the page's headings
- **THEN** each stage section and the rights and contact sections appear
