# Feature Specification: Safety floor and privacy page

**Feature Branch**: `spec/010-safety-privacy` (spec directory `specs/010-safety-privacy`)

**Created**: 2026-10-17

**Status**: Draft. Stops at founder review (constitution workflow). No plan, tasks or code.

**Input**: User description: "Safety floor + privacy page. Safety floor is a CANDIDATE scope the founder must confirm: static crisis resources with current numbers, a local on-device keyword trigger that surfaces resources, a 'not monitored' notice, and a report button. Privacy page must match the AGENTS.md privacy invariants exactly; audit the code and flag every mismatch."

**Source of this feature**: Neither item is in `docs/spec/features.md` yet. `docs/roadmap/mvp.md` lists "safety/reporting floor" under Next slices, and `specs/001-personal-page` (FR-013, User Story 4) requires a short explanation of what is counted, linked from the personal page's one-line privacy note. A proposed `features.md` entry is in [`proposed-features-entry.md`](./proposed-features-entry.md); `features.md` itself is not edited. All open questions are collected, with options and recommendations, in [`questions.md`](./questions.md).

> **CANDIDATE SCOPE**: Everything under "Safety floor" below (crisis resources, on-device keyword trigger, "not monitored" notice, report button) is a candidate the founder has not confirmed. [NEEDS CLARIFICATION: Confirm the candidate safety floor scope: all four parts, a subset, or defer (questions.md Q1).] The privacy page is required by existing decisions (AGENTS.md privacy invariants; 001 FR-013) and is not a candidate.

## What People See and Do *(mandatory, write this first)*

There are no matching items in `docs/spec/features.md` yet. The privacy page fulfils the "the page says so" part of features.md §1 ("Your picks stay on your device. Only coarse totals and a stage funnel (no picks) are sent, and the page says so.") and features.md §3 (what is saved at signup).

### Privacy

- **Screen: Privacy note (on every pre-signup page)** - One plain line near the top, e.g. "Your picks stay on this device. We count only how far visits get, never what you pick." with a link "What we count". - The person can open the privacy page from it. Exact placement on the personal page belongs to 001; this spec owns the wording and the page it links to.
- **Screen: Privacy page ("What stays with you, and what we count")** - Short sections in everyday words, in this order:
  1. *Before you sign up*: what stays on this device (pains, dreams, ideas marked "I'd use this", help interests, any text you type) and that none of it is sent.
  2. *What we count before you sign up*: coarse totals (e.g. how many visits) and which stages a visit reached (page opened, first pain opened, first dream picked, first idea seen, moved on), with a visit number that lives only in memory for that visit and is never saved on the device. Never which pains, dreams or ideas.
  3. *No tracking you across visits*: no lasting anonymous ID, no visit history, no third-party trackers or ad networks.
  4. *When you sign up*: what is sent and stored (email, sign-in details, your picks and help interests with the content version, whether you agreed to emails), who stores it, and that founder totals from signed-up people are counts, never individuals.
  5. *If you support It*: what the payment provider receives and what It keeps.
  6. *Nothing public by default*: your picks never appear in anything public unless you choose to share a separate copy (sharing is "soon").
  7. *Clearing and deleting*: clearing this device; deleting an account [NEEDS CLARIFICATION: account deletion and export in v0.1 (Q17)].
  8. *Who we use*: the outside services that handle data (database host, email sender, payment provider, app store) [NEEDS CLARIFICATION: name them or describe them (Q22, Q24)].
  9. *Contact and changes*: how to ask a question and the date the page last changed.
  - The person can read it, go back to where they were, and reach it without an account, without a network connection (it is part of the app, not fetched), and from every screen.
- **Screen: Clear this device (existing control)** - "Clear saved choices from this device" stays; the privacy page explains that clearing the device does not delete a saved account copy.

### Safety floor (CANDIDATE)

- **Screen: Need help now? (crisis resources)** - A short calm page with a heading such as "If you're not safe or need to talk to someone now", the emergency number, and a small list of free 24/7 crisis lines for the person's region (see Crisis resources below), each with call/text actions and a one-line description, plus "Not in this list? Find a helpline" linking to an international directory. A line saying when the numbers were last checked. - The person can tap to call or text (opens the phone's dialer or messages; It sends nothing), switch region, or go back. Reachable from every screen and from the privacy page [NEEDS CLARIFICATION: where the entry point lives: footer on every screen, Help page (011), or both (Q10)].
- **Screen: Gentle prompt (on-device keyword trigger)** - When something the person types on this device matches a short list of crisis phrases, a calm, dismissible panel appears next to the field: "It sounds like things might be hard right now. It doesn't watch what you write, but if you want to talk to someone, these lines are free and open now," with the region's top resource and a link to the full resources page. - The person can open resources, dismiss the panel, or keep going. Nothing about the match is sent or saved. [NEEDS CLARIFICATION: there is no pre-signup free text in the app today; what does the trigger watch (Q4)?]
- **Screen: "Not monitored" notice** - One plain line wherever a person can type or pick sensitive things, and on the resources page: "No one at It is watching what you write or pick, and It can't respond in an emergency." - Read only. [NEEDS CLARIFICATION: exact honest wording after signup, when picks are stored on It's server (Q31).]
- **Screen: Report** - A small "Report" link on [NEEDS CLARIFICATION: what is reportable (Q7)] that opens a short form: a category (choose one), an optional note, and a plain statement of exactly what will be sent and where. - The person can send or cancel. Nothing is sent until they press Send. [NEEDS CLARIFICATION: where reports go and who reads them (Q8); response promise (Q9).]

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand what stays private before picking anything (Priority: P1)

A first-time visitor wonders whether It is collecting their answers about loneliness or debt. From the one-line note they open the privacy page and learn, in under a minute, that picks stay on the device and only stage counts are sent.

**Why this priority**: Required by existing decisions (AGENTS.md: "Document it in UI copy before sending data"; 001 FR-013). Measurement cannot ship until this page exists.

**Independent Test**: On a fresh install with the network blocked, open the privacy page from the personal page; every section is present, and the list of what is counted matches the stages 001 FR-014 sends, word for word.

**Acceptance Scenarios**:

1. **Given** a first visit, **When** the person taps "What we count", **Then** the privacy page opens without an account, sign-in or network request.
2. **Given** the privacy page, **When** the person reads "What we count before you sign up", **Then** it names coarse totals and each funnel stage, says the visit number is held in memory only for that visit and never saved on the device, and says no pain, dream, idea, mark, help interest or typed text is sent.
3. **Given** measurement is not yet sending anything in a release, **When** the page is read, **Then** it does not claim counting that isn't happening, or labels it honestly [NEEDS CLARIFICATION: describe planned counting before it ships, or only after (Q14)].
4. **Given** any release, **When** a reviewer compares the page to what the app actually sends (network inspection over a full pre-signup journey), **Then** nothing is sent that the page doesn't name.

---

### User Story 2 - Know what happens at signup and support (Priority: P1)

Before entering an email, the person can see exactly what will be sent and stored, which outside services receive what, and what supporting It shares with the payment provider.

**Why this priority**: Signup is required after the personal and societal pages (AGENTS.md); people should not have to trust blindly at the gate.

**Independent Test**: From the signup screen (008) and the support screen (009), follow the privacy link; the "When you sign up" and "If you support It" sections list every field the code sends at those moments (see Code vs invariant mismatches for the current list).

**Acceptance Scenarios**:

1. **Given** the signup screen, **When** the person opens the privacy page, **Then** it lists: email, sign-in method data (one-time code is never stored in readable form; password stored only as a hash if passwords are enabled), picks and help interests with the content version, the time the picks were last changed, the email opt-in choice, and [NEEDS CLARIFICATION: IP address and device/browser description recorded with each sign-in session (Q15)].
2. **Given** the support screen, **When** the person opens the privacy page, **Then** it says the payment provider receives the payment details and email directly, It never sees full card numbers, and It keeps amount, frequency, status and provider reference numbers linked to the account.
3. **Given** the person signed up, **When** they read "Nothing public by default", **Then** it states their picks appear in nothing public, and founder totals are counts across people, never individual records.

---

### User Story 3 - Find crisis help fast (Priority: P1, CANDIDATE)

Someone exploring "Feeling down" or "Unsafe at home" realises they need to talk to someone now. From any screen they reach a short list of free crisis lines for their region and tap to call or text.

**Why this priority**: The pain list includes sensitive personal pains (`docs/spec/pains/pain-inventory.yaml`: `anxiety`, `feeling-down`, `grief`, `drinking-too-much`, `unsafe-at-home`, `homeless`). A static list is cheap, works offline and leaks nothing.

**Independent Test**: With the network off, from three different screens, reach the resources page in at most two taps; each listed line's number matches the source table below; tapping opens the dialer/messages with the number filled in.

**Acceptance Scenarios**:

1. **Given** any screen, **When** the person taps the help entry point, **Then** the resources page opens within two taps, with no network request.
2. **Given** the resources page, **When** the person's region is [NEEDS CLARIFICATION: how region is chosen (Q3)], **Then** that region's lines show first and an international directory link is always present.
3. **Given** a listed line, **When** the person taps Call or Text, **Then** the device dialer or messages app opens with the number, and It records nothing.
4. **Given** the page, **When** it is read, **Then** it shows the date the numbers were last checked and says It is not a crisis service.

---

### User Story 4 - A gentle prompt when typed words suggest crisis (Priority: P2, CANDIDATE)

A person types something like "I don't want to be here anymore" into a field. A calm panel offers crisis lines. The words never leave the device.

**Why this priority**: Useful only where people type free text; v0.1 currently has none before signup (see Q4).

**Independent Test**: Type a listed phrase into a field covered by the trigger with network inspection running; the panel appears, no request is made, nothing is written to device storage about the match.

**Acceptance Scenarios**:

1. **Given** a covered field, **When** the text matches a phrase on the list, **Then** the panel appears within a moment and does not block typing.
2. **Given** the panel, **When** the person dismisses it, **Then** it does not reappear for that field during this visit [NEEDS CLARIFICATION: re-show rules (Q6)].
3. **Given** any match or dismissal, **When** network and device storage are inspected, **Then** no request was made and nothing about the match was stored, counted or added to the funnel.

---

### User Story 5 - Report something wrong (Priority: P3, CANDIDATE)

A person sees an idea that is wrong or harmful, or notices a privacy problem, and reports it in a few taps, knowing exactly what will be sent.

**Why this priority**: v0.1 has no user-generated content shown to others, so reports are about It's own content and the product; less urgent than resources.

**Independent Test**: Open Report on an item, see the exact fields that will be sent, cancel (nothing sent), then send (only those fields sent).

**Acceptance Scenarios**:

1. **Given** a reportable item, **When** the person opens Report, **Then** the form states what will be sent (category, optional note, the item's public ID, and nothing else) and where it goes.
2. **Given** the form, **When** the person cancels, **Then** nothing is sent or stored.
3. **Given** a report sent before signup, **When** it arrives, **Then** it carries no picks, no visit number, no device identifier and no account link.

---

### Edge Cases

- Device storage unavailable (private browsing): privacy page and resources still work; the page says picks won't be remembered after closing (matches 001).
- Offline or content API down (and while the loader from 007 is showing): privacy page and crisis resources are bundled in the app and must not wait on remote content or the loader.
- Region unknown or not covered: show the emergency-number guidance and the international directory link, never an empty list.
- A crisis number changes: the page shows the "last checked" date; a stale-check process is needed [NEEDS CLARIFICATION: who re-verifies and how often (Q30)].
- Keyword false positives (e.g. "this traffic is killing me"): the panel is gentle and dismissible; false negatives are expected and the page never implies It is watching.
- The person signed up, then clears this device: the privacy page explains the account copy remains until deleted.
- A support success link (`/support-it?status=success&ref=…`) is shared or left in browser history: see mismatch M7; the privacy page must not promise anything the code doesn't do.
- A minor uses It: [NEEDS CLARIFICATION: minimum age and any under-age handling (Q25)].

## Requirements *(mandatory)*

### Functional Requirements: privacy page

- **FR-001**: The app MUST include a privacy page reachable from every screen, before signup, without an account and without a network connection.
- **FR-002**: Every pre-signup screen MUST show a one-line privacy note linking to the page before any measurement data is sent (AGENTS.md; 001 FR-013).
- **FR-003**: The page MUST state that pre-signup personal answers, ratings ("I'd use this"), narrative, free text, help interests and location stay on the device and are not sent.
- **FR-004**: The page MUST state that It creates no lasting anonymous identifier and keeps no visit history, and uses no third-party trackers, ad networks or cross-site identifiers.
- **FR-005**: The page MUST describe pre-signup measurement exactly as: coarse aggregate counts plus a per-visit stage funnel; stages only (the list from 001 FR-014), never which pains, dreams or ideas; a visit ID held in memory for one visit and never stored on the device. The stage list shown MUST be generated from, or tested against, the same definition the app sends, so the two cannot drift.
- **FR-006**: The page MUST NOT claim measurement is happening when a release sends none, and MUST NOT omit anything a release does send. [NEEDS CLARIFICATION: Q14]
- **FR-007**: The page MUST list what is sent and stored at signup (008) and at support (009), field by field, including any session metadata kept. [NEEDS CLARIFICATION: Q15, Q16]
- **FR-008**: The page MUST state that personal selections and their sensitive derivatives never appear in public artifacts by default, and that founder totals are counts, never individuals.
- **FR-009**: The page MUST explain clearing this device (existing control) and its limits, and MUST describe account deletion and data export only as far as they actually exist. [NEEDS CLARIFICATION: Q17, Q18]
- **FR-010**: The page MUST name or describe each outside service that receives personal data and what it receives. [NEEDS CLARIFICATION: Q22, Q24]
- **FR-011**: The page MUST show a "last changed" date and a contact route. [NEEDS CLARIFICATION: contact route and data-controller identity, tied to the open corporate-form decision (Q12)]
- **FR-012**: The page MUST use "support", never "donation", and MUST NOT describe It as a charity.
- **FR-013**: Any change to what the app sends MUST be accompanied by a matching change to this page in the same release (release check).
- **FR-014**: Whether a separate legal privacy policy is needed alongside this plain-language page, and which laws it targets, is [NEEDS CLARIFICATION: Q12, Q32].

### Functional Requirements: safety floor (CANDIDATE, pending Q1)

- **FR-020**: The app MUST include a crisis resources page, bundled with the app (no network needed), reachable from every screen in at most two taps. [NEEDS CLARIFICATION: entry point placement (Q10)]
- **FR-021**: The resources page MUST list, for each covered region, the emergency number and free 24/7 crisis lines with call/text actions, plus an international helpline directory link for everyone. Region coverage: [NEEDS CLARIFICATION: Q2]. Region selection: [NEEDS CLARIFICATION: Q3]; any automatic choice MUST be made on the device (no IP lookup or location request).
- **FR-022**: The resources page MUST show the date the numbers were last verified and the sources, and MUST say It is not a crisis or emergency service.
- **FR-023**: Tapping a resource MUST hand off to the device dialer, messages app or browser; It MUST NOT record, count or send that tap.
- **FR-024**: The on-device keyword trigger MUST run entirely on the device, MUST NOT send, store, count or add to the funnel anything about a match or dismissal, and MUST be dismissible without blocking the person. Fields covered: [NEEDS CLARIFICATION: Q4]. Phrase list authorship, languages and review: [NEEDS CLARIFICATION: Q5]. Re-show behaviour: [NEEDS CLARIFICATION: Q6].
- **FR-025**: A "not monitored" notice MUST appear on the resources page, on the keyword prompt, and wherever a person types or picks sensitive things, stating that no one at It watches or responds to what people write. Its wording after signup MUST stay true given that picks are stored on It's server. [NEEDS CLARIFICATION: Q31]
- **FR-026**: A report action MUST show exactly what will be sent and where before sending, MUST send nothing until confirmed, and MUST NOT attach picks, visit IDs or device identifiers. Reportable things: [NEEDS CLARIFICATION: Q7]. Destination and reader: [NEEDS CLARIFICATION: Q8]. Response promise: [NEEDS CLARIFICATION: Q9].
- **FR-027**: If a report is sent before signup, the privacy page MUST describe it as an exception to "nothing personal is sent before signup" (it is sent only by explicit act), and the report form MUST say so too.
- **FR-028**: Crisis resources, the notice and the trigger MUST work without an account and MUST NOT require signup to reach.

### Crisis resources (candidate content, verified 2026-10-17)

Accessed 2026-10-17 from each organisation's own website. These are candidates for review, not final copy. Region coverage is open (Q2).

| Region | Resource | How to reach | Source (accessed 2026-10-17) |
|---|---|---|---|
| United States | 988 Suicide & Crisis Lifeline | Call or text 988; chat at chat.988lifeline.org; free, confidential, 24/7. Spanish text/chat available. Site states LGBTQ+ youth specialised service "has been restored". | https://988lifeline.org/ |
| United States | Crisis Text Line | Text HOME to 741741 (HOLA for Spanish); 24/7, free; WhatsApp option listed | https://www.crisistextline.org/ |
| Canada | 9-8-8 Suicide Crisis Helpline | Call or text 9-8-8; 24/7/365. Site says call 9-1-1 if safety is at immediate risk. Languages not stated on the page (site in English and French). | https://988.ca/ |
| Canada / UK / Ireland | Crisis Text Line affiliates | Canada text 686868; UK text 85258; Ireland text 50808 (as listed by Crisis Text Line) | https://www.crisistextline.org/ |
| UK and Ireland | Samaritans | Call 116 123, free, 24 hours. Welsh 0808 164 0123. Relay UK 18001 44 116 123. Page notes branches in UK and Ireland; it does not state explicitly that 116 123 works from Ireland, so verify before listing for Ireland. | https://www.samaritans.org/how-we-can-help/contact-samaritan/ |
| All other countries | Find A Helpline (run by ThroughLine) | Directory of verified helplines in 175+ countries | https://findahelpline.com/ |
| Emergency | Emergency numbers | 911 (US, Canada), 999 or 112 (UK), 112 or 999 (Ireland). Not re-verified from an official source in this pass. | [NEEDS CLARIFICATION: verify against official sources if listed (Q2)] |

Not yet checked: Australia, New Zealand, EU countries and any non-English-speaking region. Linking to Find A Helpline is an outside service: the privacy page should note that following the link leaves It.

### Code vs invariant mismatches

Audit of `master` at 016a221 (2026-10-17). Searched `apps/` and `packages/` for analytics, telemetry, tracking SDKs, `fetch`, device storage, cookies, logging, auth, Stripe, RevenueCat and SMTP. **No analytics, telemetry or third-party tracker code exists anywhere.** The only device storage is the onboarding draft (web `localStorage`, native SQLite key-value store) and, on iOS, the auth session in SecureStore. Network calls go to It's API (`/rpc`, `/auth`), Stripe (server-side, then browser redirect to hosted Checkout/portal), RevenueCat (iOS SDK), and SMTP (server-side).

Severity: **V** = violates or would violate an AGENTS.md invariant or what the page must claim; **D** = page must disclose it / decision needed; **G** = gap (something the page or invariants require that doesn't exist); **X** = belongs to another lane's spec, noted for the page's accuracy.

| # | Sev | Where | What the code does | Invariant / page claim it conflicts with | Owner |
|---|---|---|---|---|---|
| M1 | G | Repo-wide (no matches for analytics/telemetry/funnel/visit) | No coarse counts or stage funnel are implemented. | Page must describe measurement exactly; cannot claim counting that doesn't exist (FR-006). 001 FR-014 expects it. | 001 / measurement; Q14 |
| M2 | G | `apps/app/app/index.tsx:35-36`; `apps/app/app/onboarding/personal.tsx:62`; `apps/app/app/onboarding/world.tsx:61`; `apps/app/app/ways-to-help.tsx:67-68` | Existing privacy copy: "Your choices stay on this device until you decide to save them", "kept on this device". No link to any privacy page, no mention of counting, no privacy page exists. | Accurate today, but incomplete once the funnel ships; AGENTS.md requires documenting measurement in UI before sending. | 010 (this spec), 001 |
| M3 | X/D | `apps/app/app/save-progress.tsx:105`, `:171-179` | Signup copy says "Enter your email only if you'd like…" and offers "Not now" to continue without an account. | Decision: signup is required after the personal and societal pages. Privacy copy must not promise "you can keep exploring without an account" past that gate. | 008 |
| M4 | D | `apps/app/app/save-progress.tsx:12-21`, `:66-69`; `packages/api/src/contract.ts:63-71`; `packages/domain/src/onboarding.ts:20-29` | At signup sends personal/world pain IDs, dream IDs, help interests **and `draftUpdatedAt`** (timestamp of the last change) with the content version; stored as JSON in `user_onboarding_drafts` (`packages/database/src/migrations/002_user_persistence.ts:91-108`). Sent only after the code is verified. | Allowed post-signup, but the page must list every field, including the last-changed timestamp (a small activity-history derivative). | 008; Q26 |
| M5 | D | `packages/database/src/migrations/002_user_persistence.ts:32-33`; `apps/api-server/src/auth.ts:41-80` | Better Auth session table has `ipAddress` and `userAgent` columns, which Better Auth fills on each sign-in. | Post-signup, so not an invariant breach, but the page must disclose it or the columns must stay empty. | 008; Q15 |
| M6 | V | `apps/app/src/payments/store-purchases.native.ts:7-13` | `Purchases.configure({ apiKey })` with no `appUserID`, so RevenueCat generates and persists an anonymous app-user ID on the device and sends it to RevenueCat with purchases. | "Do not create stable anonymous identity." It is a lasting anonymous ID held by a third party, and `/support-it` has no sign-in gate (M7), so it can be created before signup. | 009; Q20 |
| M7 | V | `apps/app/app/support-it.tsx` (no auth gate anywhere in file); `packages/api/src/router.ts:91-97`; `apps/api-server/src/stripe-support.ts:58-72`; `packages/database/src/migrations/003_support_payments.ts:7-9` | Support checkout works without an account (`userId` may be null; `user_id` column nullable). | Decision (CONFLICTS C6): supporters are signed in. The page's "If you support It" section assumes an account link. | 009 |
| M8 | V | `apps/api-server/src/stripe-support.ts:110-111`; `packages/api/src/router.ts:110-147`; `packages/api/src/contract.ts:96-118`; `apps/app/app/support-it.tsx:18-32`, `:113-119` | The contribution reference is put in the success/cancel URL query string (`?status=success&ref=<uuid>`) and is the **only** credential for `support.getStatus` and `support.createPortal`, which require no sign-in. Anyone holding the URL (browser history, a shared screenshot, a forwarded link) can open the Stripe customer portal for a monthly supporter, exposing their email, billing details and card summary, and can cancel their support. | Privacy rule: no personal or sensitive data in URLs; page cannot claim payment details are only visible to the supporter. | 009 (fix: require the signed-in owner); Q19 |
| M9 | X/D | `apps/api-server/src/stripe-support.ts:75-115`; `apps/app/app/support-it.tsx:67-71`; `packages/api/src/contract.ts:87` | Uses Stripe hosted Checkout (browser leaves It) and offers only once/monthly. | Decision: embedded Stripe form on web; once/monthly/annual. An embedded form loads Stripe's script on It's page, which sends device and fraud signals to Stripe; the page must disclose that and say where it loads. | 009; Q21 |
| M10 | G | Repo-wide (no account deletion or export path in `apps/` or `packages/`) | Users cannot delete their account or export data. Deleting a user row would cascade drafts and sessions (`002_user_persistence.ts:34-35`, `:94-95`) but keep support records with `user_id` set to null (`003_support_payments.ts:7-9`). | Page cannot promise deletion or export until they exist. | 008 / 010; Q17, Q18 |
| M11 | G | `packages/database/src/migrations/002_user_persistence.ts:4-19`; `apps/app/app/save-progress.tsx` | No email opt-in field or consent record exists. | features.md §3: unticked opt-in checkbox. Page must state what the opt-in covers. | 008; Q23 |
| M12 | X | `apps/api-server/src/auth.ts:78` | Password sign-in disabled (`emailAndPassword: { enabled: false }`); `account.password` column exists (`002_user_persistence.ts:58`). | Decision: email OTP and email + password. Page must describe password storage (hash only) once enabled. | 008 |
| M13 | D | `apps/api-server/src/auth.ts:55-74` | Production sends codes over configurable SMTP; provider not chosen. Development logs the email address and code to the console (`:61-63`); production refuses to start sign-in without SMTP. | Page must name or describe the email sender (open decision "Production SMTP provider"). Dev-only log is fine but must never be enabled in production. | Q22 |
| M14 | D | `apps/api-server/src/index.ts:30-35`, `:184`; hosting undecided (`docs/architecture/decisions.md`) | API sees each request's IP address (any host keeps access logs); unhandled errors are logged whole with `console.error(error)`. | Pre-signup content fetches carry no identifier, but host access logs record IP and user agent per request. Visit-level logs with IPs can rebuild a visit history; page must address this. | Q16 |
| M15 | D | `apps/app/app/save-progress.tsx:66-70`; `apps/app/src/components/clear-draft-control.tsx:39-41` | After signup the local draft stays on the device; "Clear choices" clears only the device copy. | Page must explain both copies and how each is removed. | Q26, Q27 |
| M16 | V (doc) | `docs/spec/pieces.yaml:149-173` (`visitor-session`) | Research-pipeline contract specifies state "anonymous session id" and "opaque session owner ref". | "No stable anonymous identity or session history"; visit ID must be memory-only. Not code, but feeds the research pipeline. Do not rename ids; amend wording in a separate change. | Founder / pieces owner |
| M17 | V (doc) | `docs/spec/pieces.yaml:320-345` (`telemetry`) | Events include "pain opened, dream selected, idea seen, saved, donated, offered"; guarantee only forbids pain/dream ids "tied to an account". | Funnel is stages only, never which pains/dreams/ideas (tied or not); "donated" wording. | Founder / pieces owner |
| M18 | D | `packages/api/src/client.ts:31-35` | Web requests use `credentials: "include"` for every call, including pre-signup content fetches. | No cookie exists before signup, so nothing identifying is sent today; any future cookie set on the API domain before signup would break the invariant. Keep as a release check. | 010 release check |

Not a mismatch, recorded for the page: the onboarding draft key `it-onboarding-draft-v1` (`apps/app/src/state/onboarding-store.ts:73`) holds only picks, help interests and a timestamp, no identifier; storage is `localStorage` on web (`apps/app/src/storage.ts:3-7`) and SQLite key-value on native (`apps/app/src/storage.native.ts:1-8`). The native auth session is in SecureStore (`apps/app/src/auth/auth-client.native.ts:14-18`) only after sign-in. CMS token is held in memory only (`packages/api/src/client.ts:6-11`). Personal answers are kept out of the CMS (`docs/architecture/cms.md`, Rights and privacy). The 007 loader branch (`explore/living-loader`) adds no network or storage calls (checked by diff against master).

### Changes from what exists

- **Privacy copy today**: four short lines (M2) saying choices stay on this device; signup copy saying answers are sent only after the code is verified (`save-progress.tsx:171-173`); and a clear-device control. There is no privacy page, no link, no mention of measurement, outside services, signup data, support data or deletion.
- **Safety today**: none. The only safety-related item is the optional `safetyNote` field on first actions (`packages/content/src/first-actions.ts:13`, `packages/content/src/graph-schema.ts:42`, shown in `apps/app/src/components/first-action-card.tsx:27-29`), which is per-idea content, not a floor. No crisis resources, notice, trigger or report action exist.
- **This spec adds**: the privacy page and note wording; the candidate safety floor; and a list of code changes other lanes must make (M3-M13) before the page can be honest.

### Key Entities

- **Privacy statement**: the versioned page content with a last-changed date; its "what we count" list is tied to the funnel stage definition.
- **Crisis resource**: region, name, contact methods (call/text/chat/link), hours, languages, source URL, last-verified date. Static, bundled, reviewed.
- **Crisis phrase list** (candidate): language, phrases, reviewer, review date. Bundled; never sent.
- **Report** (candidate): category, optional note, public item ID, time received. No account link before signup [NEEDS CLARIFICATION: link to account after signup? (Q8)].

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor reaches the privacy page from the personal page in one tap and the crisis resources page from any screen in at most two taps.
- **SC-002**: In a release review with network inspection across a full pre-signup journey, 100% of data sent is named on the privacy page and nothing named as "stays on device" is sent.
- **SC-003**: In a five-person read test, at least four can say in their own words what is counted before signup and that their picks are not sent.
- **SC-004**: Every listed crisis number matches its source on the page's "last checked" date, and the date is no older than the agreed review interval (Q30).
- **SC-005**: Keyword-trigger tests show zero network requests and zero storage writes caused by a match.
- **SC-006**: Mismatches M6, M7 and M8 are resolved (or explicitly accepted by the founder) before the support flow launches; M1/M2 are resolved before any measurement data is sent.

## It Checks *(mandatory)*

### Privacy

- **Before signup, stays on device**: pains, dreams, "I'd use this" marks, help interests, any typed text, keyword matches and dismissals, region choice for crisis resources, taps on crisis lines.
- **Before signup, sent** (coarse totals / stage funnel only, disclosed in UI): coarse totals and the 001 stage funnel with an in-memory visit ID (not yet built, M1). Viewing the privacy or resources pages sends nothing beyond those. A report, if the founder includes one, is sent only on explicit Send and is disclosed as such (FR-027).
- **After signup, stored on server**: email, sign-in records (see M5), picks and help interests with content version and last-changed time (M4), email opt-in (M11), support records (009).
- **Never public by default**: picks, marks, help interests, reports, any derivative such as "people who picked X also…" at small counts.

### Honest Status

The resources page says It is not a crisis service. The privacy page labels anything not yet built (deletion, measurement) honestly rather than promising it. Third-party resources are labelled as outside services.

### Must Not Block

- Sharing a future or path (soon): the privacy page has a "Nothing public by default" section that can later describe explicit sharing of a separate copy.
- Invitations (optional): page has room to say who invited whom is recorded without exposing the inviter's picks.
- Native iOS app (optional): resources and trigger work on native (dialer/messages hand-off); RevenueCat disclosure fixed per M6.
- Personal story (soon): free text in a future story field is covered by the keyword trigger and "stays on device" rules if written before signup.

### Accessibility

- Keyboard: privacy page, resources page, keyword panel and report form are fully keyboard reachable; the keyword panel never steals focus from the field being typed in.
- Screen reader: the keyword panel is announced politely (not as an alert that interrupts); call/text buttons are labelled with the service name and action ("Call 988 Suicide & Crisis Lifeline").
- Reduced motion: no animation on resources or prompt.
- Meaning never by colour alone: crisis and notice text use words, not just colour.

### Research Questions

- Which regions do It's launch visitors come from (from coarse totals only), to set resource coverage?
- What is current guidance for safe messaging and for keyword-triggered crisis prompts in non-clinical apps (false positive harm, wording)? Candidate sources: 988 Lifeline partner guidance, Samaritans media/online safety guidelines.
- Which laws apply to a pre-signup, on-device-only product with a US/UK audience (GDPR/UK GDPR, CCPA/CPRA, COPPA) and is a separate legal policy required?
- What aggregation threshold suppresses small counts in founder totals (links to `pieces.yaml` `interest` research question)?

## Dependencies and conflicts with other lanes

- **008 signup gate**: owns what is sent at signup and the email opt-in. This page must list those fields exactly (M3, M4, M5, M11, M12). Conflict today: signup copy says optional (M3). 008 should also decide session IP/user-agent retention (Q15) and account deletion (Q17).
- **009 support page**: owns Stripe and RevenueCat flows. Must fix M6 (RevenueCat anonymous ID), M7 (sign-in required), M8 (reference in URL as sole credential), and move to the embedded form (M9). This page must describe what Stripe receives with the embedded form, including Stripe's own device signals (Q21).
- **011 help page**: may host the crisis resources and/or the report action (Q10, Q7). If Help asks for background as free text before or after signup, the keyword trigger and "stays on device" rules apply to it. Help answers stored as ESCO references (decisions.md) must appear in the page's "When you sign up" section.
- **007 loader (branch `explore/living-loader`)**: adds no network or storage. Requirement for 007: the privacy and resources pages are bundled and must render immediately, never behind the content loader.
- **001 personal page**: owns the one-line note placement and the funnel stage definition (FR-014); this spec owns the page the note links to and must stay word-for-word consistent with FR-014.

## Assumptions

- The privacy page is plain-language product copy written for people; whether a separate legal policy is also needed is open (Q12).
- Crisis resources are static and bundled; no live lookup.
- Region detection, if any, uses only device settings (locale or time zone), never IP or location permission, to honour the invariant that location stays on device.
- v0.1 has no user-generated content visible to other people, so reports are about It's own content and product behaviour.
- No decision record is needed for this spec as written: it adds no new data collection and changes no privacy invariant. If the founder chooses to trigger resources from picked pains, or to send reports before signup, a decision record may be needed (Q4, Q8).
