# Feature Specification: Privacy page, contact and FAQ (safety floor deferred past v0.1)

**Feature Branch**: `spec/010-safety-privacy` (spec directory `specs/010-safety-privacy`; folder name kept although the safety floor is deferred)

**Created**: 2026-10-17 · **Updated**: 2026-10-18 with founder answers (recorded in [`questions.md`](./questions.md))

**Status**: Draft. Stops at founder review (constitution workflow). No plan, tasks or code.

**Input**: User description: "Safety floor + privacy page. Safety floor is a CANDIDATE scope the founder must confirm … Privacy page must match the AGENTS.md privacy invariants exactly; audit the code and flag every mismatch."

**Scope (2026-10-17, Q1)**: crisis resources and reporting are **planned for after v0.1**. This spec now covers the privacy page, the shared contact email, and (proposed, owner to confirm) a short static FAQ page. The safety-floor material is kept as a record in [Deferred: safety floor](#deferred-safety-floor-not-in-v01).

**Source of this feature**: Not yet in `docs/spec/features.md`; a proposed entry is in [`proposed-features-entry.md`](./proposed-features-entry.md) (features.md itself is not edited). The privacy page fulfils "the page says so" in features.md §1 and is the target of the one-line privacy note required by `specs/001-personal-page` (FR-013).

**Terminology**: There is no "I'd use this" language. A person *selects a fix* (an idea labelled as a possible feature). This spec says "selected fixes".

## What People See and Do *(mandatory, write this first)*

- **Privacy note (pre-signup pages)** - One plain line near the top of each pre-signup page (personal, societal, single pain pages `/p/<slug>`), e.g. "Your picks stay on this device until you sign up." It links to the privacy page. Once measurement is live, the line also says what is counted (Q14). Exact placement on each page belongs to that page's spec; this spec owns the wording and the page it links to. - The person can open the privacy page.
- **Shared footer / menu** - On large screens, a footer on every screen with "Privacy", "FAQ" and the contact email. On small screens, and on every screen once signed in, the same links sit in the menu/settings. The signup gate (008) and Support screen (009) also link to the privacy page directly. - The person can open privacy, FAQ, or write to the contact email from anywhere.
- **Privacy page ("What stays with you, and what we keep")** - Short sections in everyday words, in this order:
  1. *Who we are*: We Are It LLC is responsible for your data (the data controller); contact email [NEEDS CLARIFICATION: which address (Q33)].
  2. *Before you sign up*: your picks (pains, dreams, selected fixes) stay on this device. Nothing you pick is sent. No lasting ID, no visit history, no third-party trackers or ad networks. Links you arrive from have tracking tags removed and never stored; there is no per-pain or per-link counting.
  3. *What we count before you sign up*: present **only once measurement is live** (Q14). Then: coarse totals and which stages a visit reached, from the list in the measurement spec, with a visit number held in memory for that visit only and never saved on the device. Never which pains, dreams or fixes, and never linked to an account.
  4. *When you sign up*: what is sent and kept: your email (always confirmed with a code); your picked dreams with their pain and the content version; your selected fixes with the content version; whether you agreed to update emails and the wording you agreed to; your name (asked right after signup); a password hash or passkey if you add one; and, for each signed-in session, the IP address and device/browser description, deleted when that session ends. After your picks are saved, the copy on this device is cleared and signed-in pages read from your account. Further picks save to your account automatically.
  5. *Update emails*: an unticked opt-in for updates only; every update email has an unsubscribe link. Other emails (sign-in codes, receipts) are transactional.
  6. *If you help build It*: what you enter (background: jobs, education, volunteer and other experience chosen from lists, plus optional short notes; skills; the asks you offer to help with). Offering to help means you agree to be contacted about that offer. The founder sees individual offers (names, emails and what you offered) to follow up, and counts per ask. You can withdraw or change offers from your account.
  7. *If you support It*: support is optional and grants nothing. The payment form appears only on the Support screen, after you choose an amount and tap Next; only then does Stripe's script load. Stripe receives your payment details, email and device signals Stripe uses to prevent fraud; It never sees full card numbers. It keeps amount, frequency, status and Stripe/Apple reference numbers linked to your account. On iPhone, Apple handles payment and RevenueCat receives your It account ID and purchase records. It shows a public funding total, never individual supporters.
  8. *Nothing public by default*: your picks, fixes, background and offers never appear in anything public. Sharing a pain page shares the topic only, never your picks.
  9. *Who handles your data*: each outside service by name and what it receives: Neon (database, region [NEEDS CLARIFICATION: Q34]), Stripe, Apple and RevenueCat, the email provider [NEEDS CLARIFICATION: production email provider is an open decision (Q35)], and the web host (request logs; IPs and paths dropped or truncated where the host allows, otherwise kept briefly and never analysed [NEEDS CLARIFICATION: retention period if the host can't drop them (Q36)]).
  10. *Why we use it (lawful basis)* and *Your rights*: written to satisfy US and UK/EU (GDPR/UK GDPR) readers: the reason for each use, and your rights to access, correct, delete, export and object, plus how to complain to a regulator [NEEDS CLARIFICATION: confirm the lawful basis per use (Q37) and how access/export/correction requests are handled (Q38)].
  11. *Clearing and deleting*: before signup, "Clear everything on this device" removes your picks from this device (hidden once signed in). To delete your account, email us; we reply within [NEEDS CLARIFICATION: stated response time (Q39)]. Deleting your account cancels any recurring support; payment records are kept, unlinked from you, for accounting [NEEDS CLARIFICATION: retention period for payment records (Q40)].
  12. *Age*: It is for people 16 and over (stated, no age question).
  13. *Changes*: the date this page last changed.
  - The person can read it and go back. It works without an account and without a connection (bundled with the app).
- **FAQ page (PROPOSED for 010, confirm owner, Q41)** - A short static page of common questions ("Is my data sold?", "Why do you need my email?", "Why ask my background?", "How do I delete my account?"), each answered in a few lines with links to the privacy page. It complements, and does not replace, the inline "why we ask / what's stored" copy each spec owns. - The person can read and follow links.
- **Clear everything on this device (existing control, changed)** - Shown only before signup (shared-device privacy); hidden once signed in.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand what stays private before picking anything (Priority: P1)

A first-time visitor wonders whether It is collecting their answers about loneliness or debt. From the one-line note they open the privacy page and learn, in under a minute, that picks stay on the device.

**Why this priority**: Required by AGENTS.md ("Document it in UI copy before sending data") and 001 FR-013.

**Independent Test**: On a fresh install with the network blocked, open the privacy page from a pre-signup page; all sections are present, and nothing in "Before you sign up" contradicts what the app sends (network inspection over a full pre-signup journey).

**Acceptance Scenarios**:

1. **Given** a first visit on any pre-signup page, **When** the person taps the privacy note, **Then** the privacy page opens without an account, sign-in or network request.
2. **Given** a release with no measurement code, **When** the page is read, **Then** it has no "What we count" section and claims no counting.
3. **Given** a release with measurement, **When** the page is read, **Then** "What we count" lists exactly the stages the measurement spec defines, says the visit number lives in memory for one visit and is never saved on the device, and says no pain, dream or fix is sent.
4. **Given** a visitor arrives from a link carrying tracking tags, **When** the page loads, **Then** the tags are gone from the address and nothing records them, matching the page's claim.

---

### User Story 2 - Know what happens at signup, Help and Support (Priority: P1)

Before entering an email, offering help, or paying, the person can see exactly what is sent and kept, who receives it, and how to delete it.

**Why this priority**: Signup is required after the personal and societal pages; people should not have to trust blindly at the gate.

**Independent Test**: From the gate (008), Help build It (011) and Support (009), follow the privacy link; the matching sections list every field those flows send and store.

**Acceptance Scenarios**:

1. **Given** the gate, **When** the person opens the privacy page, **Then** "When you sign up" lists exactly: email, picked dreams with pain and content version, selected fixes with content version, opt-in choice and wording version, name, optional password hash or passkey, and per-session IP and device description deleted with the session.
2. **Given** Help build It, **When** the person reads "If you help build It", **Then** it says offering means agreeing to be contacted, that the founder sees individual offers, and how to withdraw.
3. **Given** Support, **When** the person reads "If you support It", **Then** it says Stripe's script loads only after Next on the amount step, names what Stripe and Apple/RevenueCat receive, and what It keeps.
4. **Given** a signed-in person, **When** they want their account deleted, **Then** the page tells them which email to write to and the response time, and that recurring support is cancelled and payment records kept unlinked.

---

### User Story 3 - Reach privacy, FAQ and contact from anywhere (Priority: P2)

On a phone or signed in, the person finds Privacy, FAQ and the contact email in the menu; on a large screen, in the footer.

**Why this priority**: The page only helps if people can find it.

**Independent Test**: On a small screen signed out, a large screen signed out, and signed in on each, reach Privacy, FAQ and contact in at most two taps from three different screens.

**Acceptance Scenarios**:

1. **Given** a large screen, **When** any screen is shown, **Then** the footer shows Privacy, FAQ and the contact email.
2. **Given** a small screen or a signed-in person, **When** the menu/settings is opened, **Then** the same three links are there.

---

### Edge Cases

- Device storage unavailable (private browsing): the privacy page still works; the pre-signup page says picks won't be remembered after closing (001).
- Offline, content API down, or loader (007) showing: privacy and FAQ pages are bundled and render immediately, never behind the content loader.
- Picks saved, then the person signs out on a shared device: the device copy was already cleared after the confirmed save, and the clear control is hidden while signed in.
- Save fails at signup: the device copy is not cleared until the save is confirmed (008).
- A support success link (`/support-it?status=success&ref=…`) is shared: with the fix branch merged, the reference alone opens nothing (M8).
- A deletion request comes from an email address that is not the account's: [NEEDS CLARIFICATION: how a deletion request is verified (Q38)].

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST include a privacy page reachable from every screen (footer on large screens; menu/settings on small screens and whenever signed in), from the one-line note on every pre-signup page, and directly from the gate and Support screens. It MUST work without an account and without a network connection.
- **FR-002**: Every pre-signup page MUST show a one-line privacy note linking to the page before any measurement data is sent.
- **FR-003**: The page MUST state that pre-signup picks (pains, dreams, selected fixes), any typed text and location stay on the device and are not sent.
- **FR-004**: The page MUST state that It creates no lasting anonymous identifier, keeps no visit history, uses no third-party trackers, ad networks or cross-site identifiers, strips tracking tags from arrival links without storing them, and does no per-pain or per-link counting.
- **FR-005**: The page MUST describe only measurement that is live. The "What we count" section MUST ship in the same release as the measurement code, and its stage list MUST come from (or be tested against) the stage list owned by the measurement spec, so the two cannot drift.
- **FR-006**: The page MUST list, field by field, what is sent and kept at signup (as in What People See and Do §4), and MUST NOT list anything signup no longer sends (opened/selected pains, help interests, last-changed time).
- **FR-007**: The page MUST state that session IP address and device/browser description are kept for each signed-in session and deleted when the session ends.
- **FR-008**: The page MUST state that the device copy of picks is cleared after the save is confirmed, and that "Clear everything on this device" is available only before signup.
- **FR-009**: The page MUST describe Help build It data (background, optional notes, skills, offers), that offering implies consent to be contacted about the offer, that the founder sees individual offers, and how offers are withdrawn.
- **FR-010**: The page MUST describe Support data: Stripe's script loads only on the Support screen after Next on the amount step; what Stripe and Apple/RevenueCat receive; what It keeps; that every support is tied to the account; and that only an aggregate funding total is public.
- **FR-011**: The page MUST name each outside service (Neon with region, Stripe, Apple/RevenueCat, the email provider, the web host) and what each receives. App code stays provider-neutral.
- **FR-012**: The page MUST state the hosting rule: IPs and paths dropped or truncated in host logs where the host allows; otherwise short retention, never analysed.
- **FR-013**: The page MUST name We Are It LLC as data controller, give the contact email, give the lawful basis for each use, and describe rights (access, correction, deletion, export, objection, complaint to a regulator) for US and UK/EU readers.
- **FR-014**: The page MUST state that accounts are deleted on email request within a stated response time; that deletion cancels recurring support; and that payment records are kept unlinked from the person for accounting. Self-serve deletion is later.
- **FR-015**: The page MUST state a minimum age of 16; there is no age question at the gate.
- **FR-016**: The page MUST state that personal selections, background, offers and their sensitive derivatives never appear in public artifacts by default, that founder totals are counts, and that sharing a pain page shares the topic only.
- **FR-017**: The page MUST show a "last changed" date. The founder writes or approves the final copy.
- **FR-018**: The page MUST use "support", never "donation", and MUST NOT describe It as a charity.
- **FR-019**: Any change to what the app sends or stores MUST ship with a matching change to this page in the same release (release check).
- **FR-020**: The shared footer (large screens) and menu (small screens, signed in) MUST carry Privacy, FAQ and the contact email. 010 owns the contact email.
- **FR-021** (PROPOSED, confirm owner Q41): A short static FAQ page, bundled, reachable from the footer/menu, answering common privacy and "why we ask" questions with links to the privacy page.
- **FR-022**: v0.1 is a plain-language page only; no separate legal privacy policy.

### Code vs invariant mismatches

Audit of `master` at ac87344 (2026-10-17), updated 2026-10-18 for founder answers and the fix branch `claude/vigorous-hawking-2ad1c8` (commits 25ce58e, 7889724, **not merged**). No analytics, telemetry or third-party tracker code exists anywhere in `apps/` or `packages/`. Device storage: onboarding draft (web `localStorage`, native SQLite key-value) and, on iOS after sign-in, the auth session in SecureStore.

Severity: **V** = violates an invariant or a founder answer the page will state; **D** = must be disclosed / verified; **G** = gap; **X** = another lane's, noted for the page's accuracy; **P** = parked.

| # | Sev | Where | What the code does | Conflicts with | Owner / status |
|---|---|---|---|---|---|
| M1 | G | Repo-wide | No coarse counts or stage funnel exist. | Nothing to describe yet; per Q14 the "What we count" section ships with the measurement code. | Measurement spec (not yet written) |
| M2 | G | `apps/app/app/index.tsx:35-36`; `apps/app/app/onboarding/personal.tsx:62`; `apps/app/app/onboarding/world.tsx:61`; `apps/app/app/ways-to-help.tsx:67-68` | Existing privacy copy: "stay on this device until you decide to save them", "kept on this device". No privacy page, no footer/menu links, no contact email. `ways-to-help` is being retired (011). | FR-001, FR-002, FR-020. | 010 |
| M3 | X | `apps/app/app/save-progress.tsx:105`, `:171-179` | Signup presented as optional ("only if you'd like", "Not now"). | Signup is required after the societal page. | 008 |
| M4 | V | `apps/app/app/save-progress.tsx:12-21`, `:66-69`; `packages/api/src/contract.ts:63-71`; `packages/domain/src/onboarding.ts:20-29` | At signup sends personal/world **pain IDs**, dream IDs, **help interests** and **`draftUpdatedAt`**; does not send selected fixes (not implemented) with pain links or opt-in. | Founder (008 Q19): send picked dreams (with pain + content version), selected fixes (with content version), opt-in + wording version; not pains, help interests or `draftUpdatedAt`. | 008 |
| M5 | D | `packages/database/src/migrations/002_user_persistence.ts:32-33`; `apps/api-server/src/auth.ts:41-80` | Session table stores `ipAddress` and `userAgent`. | Allowed (Q15: keep, disclose, delete with session). Verify expired sessions are actually deleted, not just left past `expiresAt`. | 008 (verify) |
| M6 | V | `apps/app/src/payments/store-purchases.native.ts:7-13` | RevenueCat configured with no `appUserID`, so it creates a lasting anonymous ID on the device. | "No stable anonymous identity"; 009 FR-025 requires RevenueCat purchases tied to the signed-in account. **Not fixed** on the fix branch. | 009 |
| M7 | V | `packages/api/src/router.ts:91-97`; `apps/api-server/src/stripe-support.ts:58-72`; `packages/database/src/migrations/003_support_payments.ts:7-9` | Web checkout works without an account. | C6 / 009 FR-013. **Fixed on branch `claude/vigorous-hawking-2ad1c8` (7889724), not merged.** The `user_id` column is still nullable. | 009 |
| M8 | V | `apps/api-server/src/stripe-support.ts:110-111`; `packages/api/src/router.ts:110-147`; `packages/api/src/contract.ts:96-118`; `apps/app/app/support-it.tsx:18-32`, `:113-119` | Contribution reference in the return URL was the sole credential for status and billing portal. | **Fixed on branch `claude/vigorous-hawking-2ad1c8` (25ce58e), not merged**: both calls need the signed-in owner. The reference still appears in the URL but opens nothing alone. | 009 |
| M9 | X | `apps/api-server/src/stripe-support.ts:75-115`; `apps/app/app/support-it.tsx:67-71`; `packages/api/src/contract.ts:87` | Hosted Checkout, once/monthly only. | Embedded form, once/monthly/annual; Stripe script only on Support after Next (Q21). | 009 |
| M10 | G | Repo-wide | No deletion process or export. Deleting a user cascades drafts/sessions (`002_user_persistence.ts:34-35`, `:94-95`); support rows keep `user_id` set to null (`003_support_payments.ts:7-9`). Nothing cancels recurring support on deletion. | Q17/Q18: deletion by email request with stated response time; cancel recurring support; keep payment records unlinked. Needs an operator procedure. | 010 (procedure), 009 (cancellation) |
| M11 | G | `002_user_persistence.ts:4-19`; `save-progress.tsx` | No opt-in field, no wording version stored. | features.md §3; 008 Q19. | 008 |
| M12 | X | `apps/api-server/src/auth.ts:78`; `002_user_persistence.ts:58` | Password sign-in disabled; no passkeys. | Optional password or passkey after signup (008; decision record pending). Page lists password hash / passkey once live. | 008 |
| M13 | D | `apps/api-server/src/auth.ts:55-74` (dev log `:61-63`) | SMTP provider not chosen; development logs email and code. | Page must name the provider (Q35). Dev-only log must never run in production (currently enforced). | Open decision |
| M14 | D | `apps/api-server/src/index.ts:30-35`, `:184`; hosting undecided | Host access logs will record IP and path; errors logged whole. | Q16 hosting rule (FR-012). Unhandled-error logs must not include request bodies (picks). | Hosting decision |
| M15 | V | `apps/app/app/save-progress.tsx:66-70`; `apps/app/src/components/clear-draft-control.tsx:5-24` | Device copy kept after a confirmed save; clear control has no sign-in check. | Q26: clear device copy after confirmed save. Q27: clear control pre-signup only. | 008 (clear after save), 010 (control visibility) |
| M16 | P | `docs/spec/pieces.yaml:149-173` (`visitor-session`) | "anonymous session id". | Conflicts with the invariant. **Parked by the founder**: leave untouched; AGENTS.md wins. | Parked |
| M17 | P | `docs/spec/pieces.yaml:320-345` (`telemetry`) | Events name pains/dreams/ideas; "donated". | Same. **Parked**. | Parked |
| M18 | D | `packages/api/src/client.ts:31-35` | Web requests send credentials on every call, including pre-signup content fetches. | No cookie exists before signup, so nothing identifying is sent today; keep as a release check that no cookie is set pre-signup. | 010 release check |
| M19 | X | `apps/app/app/save-progress.tsx:56-60` | Account created with placeholder name "It explorer". | 008: name asked right after signup, required; page lists name. | 008 |

Not a mismatch: the draft key `it-onboarding-draft-v1` (`apps/app/src/state/onboarding-store.ts:73`) holds picks and a timestamp, no identifier; CMS token is memory-only (`packages/api/src/client.ts:6-11`); personal answers stay out of the CMS (`docs/architecture/cms.md`). The 007 loader branch adds no network or storage calls. Pain pages `/p/<slug>` (012) have no code yet; FR-004's tag-stripping claim depends on 012 implementing it.

### Changes from what exists

- **Privacy copy today**: four short "stays on this device" lines (M2), a signup line that answers are sent only after the code is verified (`save-progress.tsx:171-173`), and a clear-device control shown regardless of sign-in. No privacy page, footer, menu links, contact email, FAQ, or any mention of measurement, outside services, signup fields, Help, Support or deletion.
- **This spec adds**: privacy page, one-line note wording, shared footer/menu links, contact email, proposed FAQ page, clear-control visibility rule, deletion-by-email procedure, and the list of code changes other lanes must make (M3–M15, M19) before the page can be honest.
- **Moved to after v0.1**: the whole safety floor (crisis resources, keyword trigger, "not monitored" notice, report button).

### Key Entities

- **Privacy statement**: versioned page content with a last-changed date; its "What we count" section is tied to the measurement spec's stage list.
- **FAQ entry** (proposed): question, short answer, link to the relevant privacy section.
- **Deletion request**: requesting email, account matched, received date, completed date (operator record) [NEEDS CLARIFICATION: where this record is kept and for how long (Q38)].

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: From any screen, on small and large screens, signed in or out, Privacy, FAQ and contact are reachable in at most two taps; the privacy page is one tap from every pre-signup note.
- **SC-002**: In a release review with network inspection across a full pre-signup journey, 100% of data sent is named on the privacy page and nothing named as "stays on this device" is sent.
- **SC-003**: In a five-person read test, at least four can say in their own words what stays on the device before signup and what signup keeps.
- **SC-004**: The fields listed under "When you sign up", "If you help build It" and "If you support It" match what the release stores, checked field by field at each release.
- **SC-005**: Deletion requests are answered within the stated response time in 100% of cases.
- **SC-006**: M4, M6, M7, M8 and M15 are resolved before signup and support launch; the "What we count" section ships with measurement (M1).

## It Checks *(mandatory)*

### Privacy

- **Before signup, stays on device**: pains, dreams, selected fixes, any typed text.
- **Before signup, sent** (coarse totals / stage funnel only, disclosed in UI): coarse totals and the stage funnel defined by the measurement spec, with an in-memory visit ID, once built (M1). Viewing the privacy or FAQ page sends nothing extra. No per-pain or per-link counts; tracking tags stripped and never stored.
- **After signup, stored on server**: email, name, optional password hash/passkey, per-session IP and device description (deleted with the session), picked dreams with pain and content version, selected fixes with content version, opt-in choice and wording version, Help build It background/skills/offers, support records.
- **Never public by default**: picks, fixes, background, offers, individual supporters; only aggregate counts and an aggregate funding total.

### Honest Status

The page describes only what is live (measurement, deletion method). Self-serve deletion and finer email permissions are labelled "later", not promised.

### Must Not Block

- Sharing a future or path (soon): "Nothing public by default" can later describe explicit sharing of a separate copy.
- Invitations (optional): page has room to say who invited whom is recorded without exposing the inviter's picks.
- Native iOS app (optional): Apple/RevenueCat section already present.
- Self-serve deletion (later): deletion section is written so the method can change without restructuring.
- Safety floor (deferred): footer/menu has room for a later "Need help now?" link.

### Accessibility

- Keyboard: footer, menu, privacy and FAQ pages fully keyboard reachable; headings in order.
- Screen reader: sections are real headings; the contact email is a labelled link.
- Reduced motion: no animation on these pages.
- Meaning never by colour alone: links are underlined or otherwise marked in addition to colour.

### Research Questions

- Which lawful bases fit each use for a small US LLC serving UK/EU visitors (contract, consent, legitimate interests, legal obligation)?
- What retention periods for payment records do US and UK/EU accounting rules require?
- Does the age floor of 16 hold across launch regions?
- Which hosts can drop or truncate IPs and paths in access logs (ties to the hosting decision)?

## Dependencies and conflicts with other lanes

- **008 signup gate**: owns what signup sends and the opt-in; must fix M3, M4, M11, M12, M19 and clear the device copy after a confirmed save (M15). The page quotes 008's opt-in wording and version.
- **009 support page**: M7/M8 fixed on `claude/vigorous-hawking-2ad1c8` (not merged); M6 (RevenueCat ID) still open under 009 FR-025; M9 embedded form with the Next-step script rule. Account deletion must cancel recurring support (M10).
- **011 Help build It**: post-signup only; the page discloses background, skills, offers, consent-to-contact and founder access to individual offers. Contact email and (proposed) FAQ page are owned by 010. No crisis prompt on Help free text.
- **012 entry links**: `/p/<slug>` pain pages carry the one-line note; tracking tags stripped and never stored; no per-pain/per-link counts; share shares the topic only; previews show pain title and image. The page's claims depend on 012 implementing these.
- **Measurement spec (new, not yet written)**: owns the funnel stage list (including gate, signup and support stages); the privacy page reads from it.
- **007 loader**: no network or storage; privacy and FAQ pages must never wait behind it.
- **001 personal page**: owns note placement; references to "I'd use this" marks there should become "selected fixes".

## Deferred: safety floor (not in v0.1)

Planned for after v0.1 (2026-10-17, Q1). Kept as a record only; **nothing here is a v0.1 requirement**. The candidate scope was: static crisis resources, an on-device keyword trigger, a "not monitored" notice, and a report button. If revived, it needs its own spec and fresh verification of the numbers below.

Crisis resources verified 2026-10-17 from each organisation's own website (not in v0.1):

| Region | Resource | How to reach | Source (accessed 2026-10-17) |
|---|---|---|---|
| United States | 988 Suicide & Crisis Lifeline | Call or text 988; chat at chat.988lifeline.org; free, confidential, 24/7. Spanish text/chat. Site states LGBTQ+ youth specialised service "has been restored". | https://988lifeline.org/ |
| United States | Crisis Text Line | Text HOME to 741741 (HOLA for Spanish); 24/7 | https://www.crisistextline.org/ |
| Canada | 9-8-8 Suicide Crisis Helpline | Call or text 9-8-8; 24/7/365 | https://988.ca/ |
| Canada / UK / Ireland | Crisis Text Line affiliates | Text 686868 (CA), 85258 (UK), 50808 (IE), as listed by Crisis Text Line | https://www.crisistextline.org/ |
| UK and Ireland | Samaritans | Call 116 123, free, 24 hours; Welsh 0808 164 0123; Relay UK 18001 44 116 123. Ireland coverage not stated explicitly on the page. | https://www.samaritans.org/how-we-can-help/contact-samaritan/ |
| All other countries | Find A Helpline (ThroughLine) | Verified helplines in 175+ countries | https://findahelpline.com/ |

Former safety questions Q2–Q10, Q30, Q31 are recorded as deferred notes in `questions.md`.

## Assumptions

- The privacy and FAQ pages are bundled with the app and work offline.
- The founder writes or approves all final copy.
- No decision record is needed for this spec: it adds no data collection and changes no privacy invariant. (Passkeys and password settings get their own record via 008.)
- Minimum age 16 and the lawful-basis wording are set by the founder.
