# Feature Specification: Measurement — coarse totals and the per-visit stage funnel

**Feature Branch**: `spec/013-measurement` (spec directory `specs/013-measurement`)

**Created**: 2026-10-18

**Status**: Draft. Number 013 confirmed by the founder (2026-10-18). Stops at founder review; no plan or tasks. Open items are in `questions.md`.

**Input**: User description: "It's measurement: the coarse aggregate counts and the per-visit stage funnel. The founder decided (2026-10-18) that a dedicated measurement spec owns the funnel stage list; specs 001, 008, 009, 010 and 012 reference it. No measurement code exists yet."

Binding sources: `AGENTS.md` (privacy invariants), `docs/architecture/decisions.md` (Identity and privacy, 2026-10-16 change log), `.specify/memory/constitution.md` (II, V). Stage requirements collected from other lanes (not on master yet): 001 FR-014 (master), 008 FR-028 and Q14, 009 FR-026 and Q16, 010 FR-002/FR-005/FR-012 and Q13/Q14/Q16, 012 FR-020/FR-021/FR-023 and Q14, the Help build It assessment (`assess/help-page`, decision.md "Still open" 10).

Terminology: "selected fixes" (the marks 001 calls "I'd use this"); a "fix" is what 001 calls an "idea". "Support", never "donation".

## What People See and Do *(mandatory, write this first)*

Measurement has no screen of its own. People meet it in three places, all owned by other specs; this spec fixes what those places say about counting. Matches `docs/spec/features.md` §1 ("Only coarse totals and a stage funnel (no picks) are sent, and the page says so") and §6 (admin).

- **Privacy note on every pre-signup page** (owned by 010, placed by 001, 002, 012) - Once measurement is live, the one-line note also says that It counts which steps a visit reaches, never what was picked. - The person can open the privacy page.
- **"What we count before you sign up" on the privacy page** (owned by 010) - Present only in a release that sends measurement. It lists, in plain words, every stage in the Stage List below, says the visit number lives in memory for one visit and is never saved on the device, says nothing is linked to an account, and says no pain, dream or fix is sent. It also says how to turn counting off (FR-016). - The person can read it and turn counting off.
- **Funnel report in admin** (founder only; placed by 006 admin) - A table of weeks down the side and stages across the top: how many visits reached each stage that week, and what share of that week's visits that is. Small numbers are shown as "fewer than 5". There is nothing to click into: no list of visits, no single visit, no person. - The founder can choose a range of weeks and read the totals.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The founder sees where visits stop (Priority: P1)

The founder opens admin after launch week and sees that most visits open a pain, fewer pick a dream, and about a third of those reach the gate. They change the personal page copy and compare the next week.

**Why this priority**: This is the only reason measurement exists. 001 SC-006, 008 SC-007 and the Help build It launch measures all depend on it.

**Independent Test**: Make three test visits that stop at different stages; the report for that week shows each stage's count rising by exactly the visits that reached it.

**Acceptance Scenarios**:

1. **Given** a visit that opens the personal page, opens a pain and picks a dream, then leaves, **When** the founder reads that week's report, **Then** "visit started", "personal page opened", "first pain opened (personal)" and "first dream picked (personal)" each include it, and no later stage does.
2. **Given** a visit that picks dreams in five pains, **When** the report is read, **Then** "first dream picked" counts that visit once, not five times.
3. **Given** a week with 3 sign-ups, **When** the report is read, **Then** the "signed up" cell shows "fewer than 5", not 3.
4. **Given** the report, **When** the founder looks for any way to see a single visit, pain, dream, fix, slug, referrer, location or account, **Then** there is none.

---

### User Story 2 - A visitor trusts that only steps are counted (Priority: P1)

A visitor reads the privacy note, opens the privacy page, and finds a short list of the steps It counts. Anyone inspecting what the app sends finds exactly those step names and nothing about what the visitor picked.

**Why this priority**: AGENTS.md requires the counting to be described before data is sent and to contain no pick content. Shipping measurement without this breaks a privacy invariant.

**Independent Test**: Record everything the app sends during a full visit (personal and societal pages with picks, gate, signup, Support, Help build It) and compare it with the privacy page.

**Acceptance Scenarios**:

1. **Given** a recorded full visit, **When** every measurement message is inspected, **Then** each one holds only a visit number, a stage name from the Stage List, and the platform, and nothing else.
2. **Given** the privacy page in that release, **When** its stage list is compared with the Stage List in this spec, **Then** they match exactly.
3. **Given** a release with no measurement code, **When** the privacy page and notes are read, **Then** they claim no counting (010 FR-005).
4. **Given** a visit that arrived from a link to a single pain page, **When** its measurement messages are inspected, **Then** nothing says which pain, slug, link or referring site (012 FR-020).

---

### User Story 3 - Counting never gets in the way (Priority: P2)

A visitor on a bad connection, or with a blocker that drops the measurement requests, uses It exactly as everyone else does.

**Why this priority**: Measurement serves the founder, not the visitor. It must never cost the visitor anything (constitution V; AGENTS.md "must not block").

**Independent Test**: Block every measurement request and complete a full visit; nothing visible changes and no error is shown.

**Acceptance Scenarios**:

1. **Given** measurement requests fail or are blocked, **When** the person uses any page, **Then** nothing waits on them, nothing is retried later from storage, and no error is shown.
2. **Given** the person turned counting off, or the browser sends a Global Privacy Control signal, **When** they use It, **Then** no measurement message is sent for that visit.

---

### User Story 4 - Signing up does not attach the visit to the account (Priority: P2)

A visitor picks dreams, signs up, supports It and offers help in one sitting. The stages after signup are counted like the rest, and none of them can be tied to the new account.

**Why this priority**: 008 FR-028 and the AGENTS.md rule against stable anonymous identity. The gate, Support and Help stages happen while signed in, which is where a link would most easily slip in.

**Independent Test**: Sign up during a test visit; compare the stored measurement for that week with the new account's records and confirm no field, time or order lets one be matched to the other.

**Acceptance Scenarios**:

1. **Given** a signed-in visit, **When** a stage is sent, **Then** the message carries no account ID, email, session token or cookie, and is accepted only without them.
2. **Given** an account created on a given day, **When** stored measurement is read, **Then** no stored time is finer than the week (FR-010), so the "signed up" stage cannot be matched to the account's creation time.
3. **Given** a person who completes a support of any amount and cadence, **When** the "supported" stage is sent, **Then** it carries no amount, cadence or payment reference (009 FR-026).

### Edge Cases

- **Reload or new tab**: the visit number lives in memory only, so a reload starts a new visit. A reload in the middle of a visit splits it in two. This is accepted, and it is why stages are counted as "reached", not as a strict sequence.
- **Stage reached out of order**: e.g. a returning signed-in person opens Support directly. Each stage is counted for the visit that reached it; nothing assumes earlier stages happened.
- **Same stage many times**: sent at most once per visit.
- **iPhone app**: a visit starts when the app process starts and ends when it is closed by the system or the person. Returning from the background keeps the same visit.
- **Pain pages (`/p/<slug>`)**: arriving is only "visit started". Opening and picking count as the stages of the page the pain belongs to (personal or societal), with nothing about which pain.
- **Link-preview fetchers and crawlers**: they do not run the app, so they send no stages and are not visits (012 FR-023).
- **Offline**: messages are dropped, never queued on the device.
- **Device clock wrong**: times come from the receiving server, not the device.
- **A stage name the server does not know** (old or tampered app): rejected and not stored.
- **Very small totals**: a week with 1–4 visits at a stage shows "fewer than 5" in admin.
- **A stage removed or renamed after launch**: old totals keep their old name; the privacy page lists only the stages the current release sends.

## Requirements *(mandatory)*

### Functional Requirements

**What is counted**

- **FR-001**: Measurement MUST consist only of (a) the per-visit stage funnel, made of the stages in the Stage List below, and (b) coarse totals derived from it. No other counter, event, analytics script or third-party measurement tool may be added without amending this spec.
- **FR-002**: This spec MUST be the single owner of the Stage List. Other specs may require a stage to exist; adding, renaming or removing a stage MUST be done here.
- **FR-003**: Each stage MUST be sent at most once per visit, when the visit first reaches it.
- **FR-004**: Each measurement message MUST contain only: the visit number, one stage name from the Stage List, and the platform (web or iOS app). It MUST NOT contain any pain, dream, fix, selected fix, slug, page address, referring site, tracking tag, free text, amount, cadence, email, name, account, device or browser description, screen size, language or location.
- **FR-005**: Coarse totals MUST be derived only from stored stages: visits per week (from "visit started"), visits reaching each stage per week, and those split by platform. No total per pain, dream, fix, link or slug is computed before signup.

**The visit number**

- **FR-006**: The visit number MUST be random, created when the app starts on the device, held only in memory, and never written to device storage, cookies or the URL. It MUST end when the page is reloaded or closed, or when the app process ends.
- **FR-007**: The visit number MUST NOT be linked to an account, before or after signup: measurement messages MUST be sent without credentials (no cookie, session or account header), and the receiving side MUST refuse messages that carry them.

**Receiving and keeping**

- **FR-008**: The receiving side MUST validate each message against the Stage List and the allowed fields, and MUST reject anything else without storing it.
- **FR-009**: The receiving side MUST NOT store the sender's network address or device/browser description with measurement. Host request logs follow the hosting rule shared with 010 FR-012 and 012 FR-021 (drop or truncate addresses and paths where the host allows; otherwise short retention, never analysed).
- **FR-010**: Stored measurement MUST record time only to the week (week starting Monday, UTC), so that a stage cannot be matched to an account's creation time or a support's time. [NEEDS CLARIFICATION: week, or day with "signed up"/"supported" coarsened to the week? See Q2.]
- **FR-011**: Per-visit records MUST be turned into weekly totals and deleted after 90 days at most; weekly totals MAY be kept. (Q3)

**Disclosure**

- **FR-012**: On a pre-signup page, no measurement message MAY be sent before the privacy note on that page has been shown (010 FR-002). On signed-in pages, the privacy page link in the shared footer or menu (010) is the disclosure.
- **FR-013**: The privacy page's "What we count" section MUST ship in the same release as the measurement code, and its stage list MUST be generated from or tested against the same Stage List the app and receiving side use, so the three cannot drift (010 FR-005).

**Never in the way**

- **FR-014**: Sending MUST NOT delay, block or change anything the person sees. Failures MUST be dropped silently, with no retry from storage.
- **FR-015**: Measurement MUST work the same on web and in the iOS app; the iOS app MUST NOT use a platform analytics or advertising identifier.
- **FR-016**: The person MUST be able to turn counting off from the privacy page; the choice MUST be kept on the device and MUST NOT itself be sent. When the browser sends a Global Privacy Control signal, nothing is sent. (Q6)

**Reading the totals**

- **FR-017**: The founder MUST be able to read, in admin, visits reaching each stage per week and as a share of that week's visits, filterable by platform and range of weeks.
- **FR-018**: Any cell below 5 MUST show as "fewer than 5". The report MUST offer no view of a single visit and no export of per-visit records.
- **FR-019**: Totals MUST never appear in a public artifact (AGENTS.md); any public number (e.g. 009's funding total) is owned by its own spec and is not drawn from measurement.

### Stage List

Stable names; the plain wording on the privacy page is in the last column. "Owner" is the spec that requires the stage. A stage marked *(gated)* exists only once that page ships.

| # | Stage | Fires when | Owner | Privacy page wording |
|---|---|---|---|---|
| 1 | `visit-started` | The app first shows any page in this visit (personal, societal, pain page, gate, Support, or any other). Link arrival is only this (012 FR-020). | 013 | "You opened It" |
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
| 13 | `support-reached` | The Support page is shown. | 009 FR-026 | "You saw the Support page" |
| 14 | `support-completed` | A support of any amount or cadence succeeds. | 009 FR-026 | "You supported It" |
| 15 | `support-skipped` | The person chooses to skip Support. | 009 FR-026 | "You skipped Support" |
| 16 | `help-reached` | The Help build It page is shown. | 011 *(gated)* | "You saw 'Help build It'" |
| 17 | `help-offered` | The person submits at least one offer. | 011 *(gated)* | "You offered to help" |
| 18 | `help-skipped` | The person skips Help build It. | 011 *(gated)* | "You skipped Help build It" |

Not stages, by decision: selecting a fix before signup (001 FR-018: pre-signup selected fixes are not counted anywhere); which pain, dream, fix, slug or link; signing in to an existing account [NEEDS CLARIFICATION: count returning sign-ins on the gate as their own stage? See Q4]; the name step (008 FR-013); clearing the device.

Help stages 16–18 are provisional: [NEEDS CLARIFICATION: 011 is not written; confirm the three Help stages and whether "offered" is one stage or per ask. See Q5.]

### Key Entities

- **Visit**: one run of the app on one device, from start to reload/close. Exists on the device only as an in-memory random number; on the server only as that number on its stage records, until FR-011 deletes them.
- **Stage record**: (visit number, stage, platform, week received). Nothing else.
- **Weekly total**: (week, stage, platform, count of visits). Kept after per-visit records are deleted.
- **Stage List**: the named, ordered list above; one source used by the app, the receiving side and the privacy page.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An independent review of every measurement message in a recorded full visit (all stages) finds only the three allowed fields, and 0 instances of pick content, page address, referrer, account or lasting identifier.
- **SC-002**: The privacy page's stage list matches the Stage List in 100% of releases that send measurement (automated check).
- **SC-003**: With all measurement requests blocked, a full visit completes with no visible difference and no added wait.
- **SC-004**: The founder can read any week's funnel in admin within a minute of opening it, without help.
- **SC-005**: Nothing stored lets a reviewer match any visit to any account, using the account's creation time, support time or any other field (tested by attempting the match on test data).
- **SC-006**: No per-visit record older than the FR-011 limit exists in any store or backup a month after launch.

## It Checks *(mandatory)*

### Privacy

- **Before signup, stays on device**: every pick, selected fix, opened pain, content version, the counting-off choice, and anything about how the visit arrived.
- **Before signup, sent** (coarse totals / stage funnel only, disclosed in UI): the stages in the Stage List the visit reaches, each with the in-memory visit number and the platform. Nothing else.
- **After signup, sent**: the same kind of stage messages (gate, signup, Support, Help), sent without credentials and never linked to the account.
- **After signup, stored on server**: measurement adds nothing to the account.
- **Never public by default**: all measurement totals; admin is founder-only and small cells are suppressed.

### Honest Status

N/A for idea labels. Honesty here means the privacy page claims only what is live (010 FR-005), and the admin report never presents the funnel as more precise than it is (reloads split visits; blocked requests are missed). The report says so in one line.

### Must Not Block

- **Native iOS app (optional)**: same Stage List and message shape; no platform identifiers.
- **Starting from a dream instead of a pain (soon)**: a later "first dream picked" without a pain needs only a new stage here, not a new mechanism.
- **Invitations (optional)**: an "arrived by invitation" stage, if ever wanted, must be a plain stage with no inviter, like link arrival.
- **Sharing a future (soon)**: opening a shared page counts as `visit-started` only, with nothing about the share.
- **Admin (006)**: the report is a read of weekly totals; 006 places it.

### Accessibility

- Keyboard: the counting-off control on the privacy page and the admin report filters are reachable and usable by keyboard.
- Screen reader (incl. expanded/collapsed state): the counting-off control announces whether counting is on or off; the admin table has row and column headers.
- Reduced motion: no motion involved.
- Meaning never by colour alone: "fewer than 5" is text; the report uses no colour-only cues.

### Research Questions

- Which hosts drop or truncate network addresses and paths in request logs, and can the measurement endpoint be excluded from logs entirely? (shared with 010, 012)
- How much does a reload-splits-visit design distort the funnel on web and iOS, and is it acceptable at launch volumes?
- Does Global Privacy Control, or a counting-off control, have legal weight for counting that holds no personal data, in the US and UK/EU? (feeds 010 Q37 lawful basis)
- What share of visits blocks the measurement request (content blockers), and should the report state an estimate?

## Changes From What Exists

| Area | Today | Change |
|---|---|---|
| Measurement code | None anywhere in the repo. | Build per this spec. |
| 001 FR-014 | Owns a five-stage list. | List moves here (stages 2–6); 001 should reference 013. "First idea seen" becomes `personal-first-fix-seen`. |
| 001 FR-013, 010 privacy note | No counting is described. | Note and "What we count" ship with the measurement release, from the Stage List. |

## Dependencies

- **001 personal page** (master): follow-up to replace FR-014's list with a reference to this spec and use "fix" / "selected fixes" wording. Not edited here.
- **002 societal page** (not written): stages 7–10 are reserved for it.
- **008 signup gate**: stages 11–12; FR-007 satisfies its "never linked to the account".
- **009 Support**: stages 13–15; this spec confirms its assumption that Support stages are unlinked from the account (FR-007) and carry no amount or cadence (FR-004).
- **010 privacy page**: renders "What we count" and the counting-off control from this spec; shares the hosting log rule and its open retention value (010 Q36).
- **011 Help build It** (not written): stages 16–18, provisional.
- **012 entry links**: link arrival is `visit-started` only (FR-004, Stage List row 1).
- **006 admin**: places the report (FR-017, FR-018).
- **Hosting decision** (open in decisions.md): FR-009 depends on it.
- **Decision record**: none needed; this spec applies the 2026-10-16 invariant. If the founder adopts post-signup stages as part of the "pre-signup measurement" invariant, decisions.md should note that the same rules cover them (Q1).

## Assumptions

- "Coarse aggregate counts" (AGENTS.md) means totals derived from the funnel; no separate counters are needed (Q1).
- The stages sent after signup (gate onwards) follow the same rules as pre-signup stages, as 008 and 009 assume.
- Weekly granularity is enough for a founder reading launch trends (Q2).
- The threshold for small cells is 5 (Q7).
- Platform (web / iOS app) is the only split; no browser, device, country or language split (Q8).
- Launch volume is small enough that a reload-splits-visit design is acceptable.
