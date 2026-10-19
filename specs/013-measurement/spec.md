# Feature Specification: Measurement — stage funnel, page views and linking at signup

**Feature Branch**: `spec/013-measurement` (spec directory `specs/013-measurement`)

**Created**: 2026-10-18 · **Revised**: 2026-10-19 with founder answers (see `questions.md`)

**Status**: Draft. Number 013 confirmed by the founder (2026-10-18). Founder answered Q1–Q10 on 2026-10-19; one new item is open (Q11). Stops at founder review; no plan or tasks.

**Input**: User description: "It's measurement: the coarse aggregate counts and the per-visit stage funnel. The founder decided (2026-10-18) that a dedicated measurement spec owns the funnel stage list; specs 001, 008, 009, 010 and 012 reference it. No measurement code exists yet."

Binding sources: `AGENTS.md`, `docs/architecture/decisions.md` (Identity and privacy, including the 2026-10-19 measurement entry this spec relies on), `.specify/memory/constitution.md` (II, V), founder answers in `questions.md`. Stage requirements collected from other lanes (not on master yet): 001 FR-014 (master), 008 FR-028 and Q14, 009 FR-026 and Q16, 010 FR-002/FR-005/FR-012 and Q13/Q14/Q16, 012 FR-020/FR-021/FR-023 and Q14, the Help build It assessment (`assess/help-page`, decision.md "Still open" 10).

**Founder direction (2026-10-19)**: "This project needs to be treated like science." Account holders' activity is part of what lets It offer personalised fixes, so the visit in which a person signs up or signs in is linked to their account, page views are counted per page including each pain page, and records are kept indefinitely. This reverses parts of the 2026-10-16 invariant, 008 FR-028 ("never linked to the account") and 012 FR-020 (no per-pain counts); see `decisions.md`. What does **not** change: picks and selected fixes stay on the device until signup (001, 008); no identifier is stored on the device; nothing is linked across visits before signup.

Terminology: "selected fixes" (the marks 001 calls "I'd use this"); a "fix" is what 001 calls an "idea". "Support", never "donation".

## What People See and Do *(mandatory, write this first)*

Measurement has no screen of its own. People meet it in four places, all owned by other specs; this spec fixes what those places say. Matches `docs/spec/features.md` §1 (the page says what is sent) and §6 (admin).

- **Privacy note on every pre-signup page** (owned by 010, placed by 001, 002, 012) - Once measurement is live, the one-line note says that picks stay on this device, and that It counts which pages and steps a visit reaches, which is saved to your account if you sign up during this visit. - The person can open the privacy page.
- **"What we count" on the privacy page** (owned by 010) - Present only in a release that sends measurement. It lists every stage in the Stage List and every kind of page view in plain words; says that pain pages are counted by which pain; says a visit number lives in memory for one visit and is never saved on the device; says that if you sign up or sign in during a visit, that visit's pages and steps are linked to your account and kept, and that earlier visits are not; says that picks and selected fixes are not sent before signup. - The person can read it.
- **The gate's "what will be saved" list** (owned by 008) - Adds one line: the pages and steps of this visit. - The person can read it before continuing.
- **Funnel report in admin** (founder only; placed by 006 admin) - Weeks (or days) down the side and stages across the top: how many visits reached each stage, and the share of that period's visits. A second table: views per page, including each pain page. Filter by platform and date range. Real counts are shown, however small. - The founder can choose a range and read the totals.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The founder sees where visits stop (Priority: P1)

The founder opens admin after launch week and sees that most visits open a pain, fewer pick a dream, and about a third of those reach the gate. They also see which pain pages draw the most visits. They change the personal page copy and compare the next week.

**Why this priority**: This is why measurement exists. 001 SC-006, 008 SC-007 and the Help build It launch measures depend on it.

**Independent Test**: Make three test visits that stop at different stages and view two different pain pages; the report shows each stage and each page view rising by exactly the visits that reached it.

**Acceptance Scenarios**:

1. **Given** a visit that opens the personal page, opens a pain and picks a dream, then leaves, **When** the founder reads that period's report, **Then** "visit started", "personal page opened", "first pain opened (personal)" and "first dream picked (personal)" each include it, and no later stage does.
2. **Given** a visit that picks dreams in five pains, **When** the report is read, **Then** "first dream picked" counts that visit once.
3. **Given** a week with 3 sign-ups, **When** the report is read, **Then** the "signed up" cell shows 3.
4. **Given** visits to `/p/loneliness` and `/p/broke`, **When** the page-view table is read, **Then** each pain page has its own row.

---

### User Story 2 - Measurement supports research on account holders (Priority: P1)

A researcher working with the founder asks: "Of people who signed up after viewing the debt pain page, which fixes did they select?" The founder can answer from It's own records, because the signup visit's page views and stages are linked to the account that now holds those picks.

**Why this priority**: The founder's reason for linking (2026-10-19): personalised fixes and treating It like science.

**Independent Test**: In a test visit, view a pain page, pick a dream, sign up. The account's records show that visit's page views and stages; a second, earlier visit on the same device shows no link.

**Acceptance Scenarios**:

1. **Given** a visit in which the person signs up, **When** signup completes, **Then** every stage and page view already recorded for that visit, and every one recorded later in it, is linked to the new account.
2. **Given** a visit in which an existing account signs in, **When** sign-in completes, **Then** the same happens for that account.
3. **Given** a visit before a reload, on the same device, **When** the person signs up after the reload, **Then** the earlier visit stays unlinked.
4. **Given** a visit in which the person never signs up, **When** its records are read, **Then** they hold no account, email, network address or device identifier.

---

### User Story 3 - A visitor knows what is counted (Priority: P1)

A visitor reads the privacy note, opens the privacy page, and finds a short list of the pages and steps It counts, and that signing up links this visit to the account. Anyone inspecting what the app sends finds exactly that.

**Why this priority**: AGENTS.md: document it in UI copy before sending data. The new linking makes the disclosure more important, not less.

**Independent Test**: Record everything the app sends during a full visit and compare it with the privacy page and the gate's list.

**Acceptance Scenarios**:

1. **Given** a recorded full visit, **When** every measurement message is inspected, **Then** each holds only the allowed fields (FR-004) and no pick, selected fix, free text, referring site or tracking tag.
2. **Given** the privacy page in that release, **When** its lists are compared with the Stage List and page-view list here, **Then** they match exactly.
3. **Given** a release with no measurement code, **When** the privacy page and notes are read, **Then** they claim no counting (010 FR-005).

---

### User Story 4 - Counting never gets in the way (Priority: P2)

A visitor on a bad connection, or with a blocker that drops the measurement requests, uses It exactly as everyone else does.

**Why this priority**: Measurement serves the founder, not the visitor (constitution V).

**Independent Test**: Block every measurement request and complete a full visit, including signup; nothing visible changes, no error is shown, and signup still saves picks.

**Acceptance Scenarios**:

1. **Given** measurement requests fail or are blocked, **When** the person uses any page, **Then** nothing waits on them, nothing is retried later from storage, and no error is shown.
2. **Given** measurement failed for a visit, **When** the person signs up, **Then** signup succeeds; there is simply nothing to link.

### Edge Cases

- **Reload or new tab**: a reload starts a new visit. A reload in the middle of a visit splits it; only the part in which signup happens is linked. Accepted.
- **Stage reached out of order**: e.g. a returning signed-in person opens Support directly. Each stage is counted for the visit that reached it.
- **Already signed in when the visit starts**: the visit is linked to the account from its first message (FR-008).
- **Sign out during a visit**: stages after sign-out stay linked to the visit, which stays linked to the account it was linked to; a different account signing in later in the same visit starts a new visit.
- **Same stage many times**: sent at most once per visit. Page views are sent each time a page is shown.
- **iPhone app**: a visit starts when the app process starts and ends when it is closed. Returning from the background keeps the same visit.
- **Pain pages (`/p/<slug>`)**: a page view naming the pain (by its stable ID) plus "visit started". Opening and picking count as the stages of the page the pain belongs to (personal or societal).
- **Link-preview fetchers and crawlers**: they do not run the app, so they send nothing and are not visits (012 FR-023).
- **Offline**: messages are dropped, never queued on the device.
- **Device clock wrong**: times come from the receiving server.
- **A stage or page the server does not know**: rejected and not stored.
- **Account deleted**: its linked visits are unlinked or deleted with it [see Q12 in `questions.md`; until answered, deleted with the account].
- **A stage removed or renamed after launch**: old records keep their old name; the privacy page lists only what the current release sends.

## Requirements *(mandatory)*

### Functional Requirements

**What is counted**

- **FR-001**: Measurement MUST consist only of (a) the per-visit stage funnel (Stage List), (b) per-visit page views (Page-View List), and (c) totals derived from them. No other counter, event, analytics script or third-party measurement tool may be added without amending this spec.
- **FR-002**: This spec MUST be the single owner of the Stage List and the Page-View List. Other specs may require an entry; adding, renaming or removing one MUST be done here.
- **FR-003**: Each stage MUST be sent at most once per visit, when the visit first reaches it. A page view MUST be sent each time a listed page is shown.
- **FR-004**: Each measurement message MUST contain only: the visit number, one stage name from the Stage List or one page from the Page-View List (for a pain page, the pain's stable ID), and the platform (web or iOS app). It MUST NOT contain picks, selected fixes, which pain was opened in place, free text, referring site, tracking tags, amounts, cadence, email, name, device or browser description, screen size, language or location.
- **FR-005**: Before signup, opening a pain in place, picking a dream and selecting a fix MUST NOT be sent beyond the "first …" stages; picks and selected fixes stay on the device until signup (001, 008). [NEEDS CLARIFICATION: should in-place pain opens and picks also be sent as events? See Q11.]

**The visit number**

- **FR-006**: The visit number MUST be random, created when the app starts on the device, held only in memory, and never written to device storage, cookies or the URL. It MUST end when the page is reloaded or closed, or when the app process ends.
- **FR-007**: No identifier other than the visit number MAY be used to connect messages, and none MAY persist on the device. Visits before the signup or sign-in visit MUST NOT be linked to each other or to the account.

**Linking to an account**

- **FR-008**: When a person signs up or signs in during a visit, or a visit starts while already signed in, the receiving side MUST link that visit's stages and page views, past and future, to that account. Linking happens on the server using the visit number the app sends with signup or sign-in; measurement messages themselves stay free of account data.
- **FR-009**: Linked measurement MUST be readable only by the founder and by It's own features that personalise fixes for that account, and MUST NOT appear in any public artifact (AGENTS.md).
- **FR-010**: Support and Help stages carry no amount, cadence or offer content; where research needs them, they are joined from 009 and 011 records through the account (Q10).

**Receiving and keeping**

- **FR-011**: The receiving side MUST validate each message against the Stage List, the Page-View List and the allowed fields, and MUST reject anything else without storing it.
- **FR-012**: The receiving side MUST NOT store the sender's network address or device/browser description with measurement. Host request logs follow the hosting rule shared with 010 FR-012 and 012 FR-021.
- **FR-013**: Stored measurement MUST record the time each message was received, as received (Q2: matching to an account is accepted).
- **FR-014**: Measurement records MUST be kept indefinitely (Q3), except as FR-015 and account deletion require.
- **FR-015**: The data model MUST let a single visit's records, and an account's linked visits, be deleted or exported, so that account deletion (010) and access requests can be met.

**Disclosure**

- **FR-016**: On a pre-signup page, no measurement message MAY be sent before the privacy note on that page has been shown (010 FR-002). On signed-in pages, the privacy page link in the shared footer or menu (010) is the disclosure.
- **FR-017**: The privacy page's "What we count" section and the gate's "what will be saved" line MUST ship in the same release as the measurement code, and the privacy page's lists MUST be generated from or tested against the same lists the app and receiving side use (010 FR-005).
- **FR-018**: There is no counting-off control and Global Privacy Control is not treated as an opt-out (Q6). [Account linking stays off at launch.]

**Never in the way**

- **FR-019**: Sending MUST NOT delay, block or change anything the person sees. Failures MUST be dropped silently, with no retry from storage. Signup and sign-in MUST NOT depend on measurement having succeeded.
- **FR-020**: Measurement MUST work the same on web and in the iOS app; the iOS app MUST NOT use a platform analytics or advertising identifier.

**Reading the totals**

- **FR-021**: The founder MUST be able to read, in admin, visits reaching each stage per day or week and as a share of that period's visits, and views per page (including each pain page), filterable by platform and date range. Real counts are shown, with no small-number suppression (Q7).
- **FR-022**: The only split is platform (Q8).

### Stage List

Stable names; the plain wording on the privacy page is in the last column. "Owner" is the spec that requires the stage. *(gated)* = exists only once that page ships.

| # | Stage | Fires when | Owner | Privacy page wording |
|---|---|---|---|---|
| 1 | `visit-started` | The app first shows any page in this visit. | 013 | "You opened It" |
| 2 | `personal-opened` | The personal page is shown. | 001 | "You saw 'What could be better for you?'" |
| 3 | `personal-first-pain-opened` | A personal pain is first opened (on the page or on a pain page). | 001 | "You opened a pain" |
| 4 | `personal-first-dream-picked` | A dream is first picked under a personal pain. | 001 | "You picked a better future" |
| 5 | `personal-first-fix-seen` | Fixes are first shown under a picked dream (001's "first idea seen"). | 001 | "You saw fixes" |
| 6 | `personal-moved-on` | The person goes on from the personal page to the societal page. | 001 | "You went on to the next page" |
| 7 | `societal-opened` | The societal page is shown. | 002 *(gated)* | "You saw 'What could be better for us?'" |
| 8 | `societal-first-pain-opened` | As 3, for a societal pain. | 002 *(gated)* | "You opened a pain" |
| 9 | `societal-first-dream-picked` | As 4, for a societal pain. | 002 *(gated)* | "You picked a better future" |
| 10 | `societal-first-fix-seen` | As 5, under a societal dream. | 002 *(gated)* | "You saw fixes" |
| 11 | `gate-reached` | The signup gate is shown. | 008 FR-028 | "You reached sign-up" |
| 12 | `signed-up` | A new account is created and picks are saved. | 008 FR-028 | "You signed up" |
| 13 | `signed-in` | An existing account signs in on the gate (Q4). | 013 | "You signed in" |
| 14 | `support-reached` | The Support page is shown. | 009 FR-026 | "You saw the Support page" |
| 15 | `support-completed` | A support of any amount or cadence succeeds. | 009 FR-026 | "You supported It" |
| 16 | `support-skipped` | The person chooses to skip Support. | 009 FR-026 | "You skipped Support" |
| 17 | `help-reached` | The Help build It page is shown. | 011 *(gated)* | "You saw 'Help build It'" |
| 18 | `help-background-given` | The person saves a background or skills. | 011 *(gated)* | "You told us your background" |
| 19 | `help-offered` | The person submits at least one offer. | 011 *(gated)* | "You offered to help" |
| 20 | `help-skipped` | The person skips Help build It. | 011 *(gated)* | "You skipped Help build It" |

Help stages 17–20 follow the founder's answer (Q5) and are revisited when 011 is specified. Not stages: selecting a fix before signup (001 FR-018); the name step (008 FR-013); clearing the device.

### Page-View List

| Page | Recorded as |
|---|---|
| Personal page | `personal` |
| Societal page | `societal` *(gated, 002)* |
| Single pain page `/p/<slug>` | `pain` + the pain's stable ID (not the slug, so renamed slugs keep one row) |
| Signup gate and its steps | `gate` |
| Support | `support` |
| Help build It | `help` *(gated, 011)* |
| Privacy page, FAQ | `privacy`, `faq` |
| Any other page | added here before it is counted |

How a visit arrived (link, referring site, tracking tags) is still not recorded (012 FR-020, unchanged in that part).

### Key Entities

- **Visit**: one run of the app on one device, from start to reload/close. On the device, only an in-memory random number. On the server, that number on its records, optionally linked to one account.
- **Stage record**: (visit, stage, platform, time received).
- **Page view**: (visit, page, pain ID if a pain page, platform, time received).
- **Visit–account link**: (visit, account, how linked: signed up / signed in / already signed in, time). Created only by FR-008.
- **Stage List / Page-View List**: one source used by the app, the receiving side and the privacy page.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An independent review of every measurement message in a recorded full visit finds only the allowed fields, and no picks, selected fixes, referrer, tracking tag, account data or stored device identifier.
- **SC-002**: The privacy page's lists match the Stage List and Page-View List in 100% of releases that send measurement (automated check).
- **SC-003**: With all measurement requests blocked, a full visit including signup completes with no visible difference and no added wait.
- **SC-004**: The founder can read any week's funnel and page views in admin within a minute, without help.
- **SC-005**: In tests, 100% of signup and sign-in visits are linked to the right account, and 0% of earlier visits on the same device are.
- **SC-006**: Deleting a test account removes or unlinks all of its linked visits (FR-015, Q12).

## It Checks *(mandatory)*

### Privacy

- **Before signup, stays on device**: every pick, selected fix, which pain was opened in place, content versions, and how the visit arrived.
- **Before signup, sent** (disclosed in UI): stages from the Stage List and page views from the Page-View List (pain pages by pain ID), each with the in-memory visit number and platform.
- **At signup or sign-in**: the visit number, so the server links this visit to the account (FR-008). Listed on the gate.
- **After signup, stored on server**: this visit's and later visits' stages and page views, linked to the account, kept indefinitely; the account's saved picks (008).
- **Never public by default**: all measurement, linked or not.
- **Changed invariant**: see `docs/architecture/decisions.md` 2026-10-19.

### Honest Status

N/A for fix labels. Honesty here means the privacy page and gate say plainly that signing up links this visit to the account, and claim only what is live (010 FR-005). The admin report says in one line that reloads split visits and blocked requests are missed.

### Must Not Block

- **Personalised fixes (founder direction)**: linked visits and page views are stored per account so later features can use them.
- **Native iOS app (optional)**: same lists and message shape; no platform identifiers.
- **Starting from a dream instead of a pain (soon)**: needs only a new stage or page here.
- **Invitations (optional)**: an "arrived by invitation" stage, if wanted, carries no inviter in the message; the account link already records who signed up.
- **Sharing a future (soon)**: a shared page is a page view of its kind, with no detail of the share.
- **Admin (006)**: places the report.

### Accessibility

- Keyboard: admin report filters are reachable and usable by keyboard.
- Screen reader (incl. expanded/collapsed state): admin tables have row and column headers; any collapsible "What we count" section announces its state.
- Reduced motion: no motion involved.
- Meaning never by colour alone: the report uses no colour-only cues.

### Research Questions

- Under UK/EU GDPR and ePrivacy, does linking a pre-signup visit's page views (including pain pages, some of which touch health) to an account need explicit consent, and does sending without an opt-out hold up? (feeds 010 Q37 lawful basis; pain pages on health topics may be special-category data)
- Which hosts drop or truncate network addresses and paths in request logs, and can the measurement endpoint be excluded from logs? (shared with 010, 012)
- How much does reload-splits-visit distort the funnel, and how much linkable history is lost by linking only the signup visit?
- What share of visits blocks the measurement request?

## Changes From What Exists

| Area | Today | Change |
|---|---|---|
| Measurement code | None anywhere in the repo. | Build per this spec. |
| 001 FR-014 | Owns a five-stage list; "never with an identifier that outlives the visit". | List moves here (stages 2–6). The visit number still ends with the visit, but the signup visit is now linked to the account. |
| 008 FR-028 | Gate stages "never linked to the account". | Reversed: the signup or sign-in visit is linked (FR-008). Gate lists it. |
| 012 FR-020 | No per-pain or per-link counts. | Per-pain page views are counted; how the visit arrived is still not. |
| 010 "What we count" | "Never linked to an account"; legitimate interests "(no personal data, no identifier)". | Rewritten per this spec; lawful basis needs review. |

## Dependencies

- **001 personal page** (master): replace FR-014's list with a reference to 013 and update its privacy wording. Not edited here.
- **002 societal page** (not written): stages 7–10 and the `societal` page view.
- **008 signup gate**: stages 11–13; reverse FR-028's "never linked"; add the gate line; send the visit number with signup and sign-in.
- **009 Support**: stages 14–16; its "assumed unlinked" is answered: linked through the visit (Q10).
- **010 privacy page**: rewrite "What we count" and the note; revisit Q37 (lawful basis) and account deletion (Q12).
- **011 Help build It** (not written): stages 17–20.
- **012 entry links**: reverse the per-pain part of FR-020; keep "how the visit arrived" unrecorded.
- **006 admin**: places the report.
- **Hosting decision** (open in decisions.md): FR-012.
- **Decision record**: `docs/architecture/decisions.md` 2026-10-19; AGENTS.md privacy invariants and constitution II updated to match.

## Assumptions

- "Personalised fixes" uses linked measurement in a later spec; this spec only keeps it available (FR-009).
- Exact received times are acceptable because matching to an account is accepted (Q2).
- Platform is the only split (Q8).
- Launch volume makes a reload-splits-visit design acceptable.
- Until Q12 is answered, account deletion deletes the account's linked visits.
