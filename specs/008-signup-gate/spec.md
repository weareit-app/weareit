# Feature Specification: Signup gate — "Sign up to go further"

**Feature Branch**: `spec/008-signup-gate`

**Created**: 2026-10-17

**Status**: Draft (stops at founder review; no plan or tasks yet)

**Input**: User description: "features.md §3, signup gate. Signup is required after the personal and societal pages (CONFLICTS C4). Both email one-time code and email + password (C3). The person's picks are saved with their content version at signup. Email opt-in checkbox is unticked by default. Existing code is OTP-only and signup is optional; describe the spec as changes from what exists. Pre-signup answers stay on device until signup; what is transmitted at signup must be explicit."

Binding sources: `AGENTS.md`, `docs/architecture/decisions.md` (Identity and privacy), `docs/spec/CONFLICTS.md` rows C3, C4, C6, C9, and `docs/spec/features.md` §3. Everything else (assessments, drafts, `docs/roadmap/mvp.md`) is evidence only. Where `docs/roadmap/mvp.md` still says "email OTP only at the persistence gate", features.md and decisions.md win.

## What People See and Do *(mandatory, write this first)*

Covers features.md §3: "Email code (OTP) or email + password", "Your picks from pages 1–2 are saved to your account", "Opt-in checkbox (unticked by default) for emails from It".

- **Screen: The gate** - Reached from the bottom of the societal page ("What could be better for us?") when the person chooses to go on. A short heading says why an account is needed to go further, and a plain list says exactly what will be saved to the account if they sign up (their picked futures, their "I'd use this" marks, and which version of It's content they saw), and what is not sent (for example, pains they only opened). One email field. Two ways in: "Email me a code" and "Use a password instead" [NEEDS CLARIFICATION: which method is shown first / as the main button? See Q4]. An unticked checkbox: "Send me occasional emails from It" (final wording is the founder's). A link to the privacy page (spec 010). - The person can enter an email and choose a method, tick or leave the opt-in, read what is sent, go back to either page to change picks, or leave. There is no "Not now" that continues into the rest of It.
- **Screen: Enter your code** - Says a code was sent to the address shown, with a way to change the address. One code field. - The person can enter the code, ask for another, or switch to the password method.
- **Screen: Choose a password** - Shown when the person picks the password method for a new account. One password field with the rules shown up front, and a show/hide control. [NEEDS CLARIFICATION: must a password signup also confirm the email with a code before the account is used? See Q2] - The person can create the account, or switch to the code method.
- **Screen: Already have an account** - If the email already has an account, the gate offers "sign in" instead of "sign up", by code or password. [NEEDS CLARIFICATION: what happens to the picks on this device when the account already has saved picks? See Q1] - The person can sign in, or use a different email.
- **Screen: Saving** - A short waiting state while picks are saved. If saving fails, it says the picks are still on this device and offers to try again. - The person can retry, or go back.
- **Screen: Saved** - Confirms the account and that their picks are saved, names the email, and leads on to Support (spec 009). - The person continues.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Sign up with an email code and keep my picks (Priority: P1)

A visitor has picked futures on the personal and societal pages. They choose to go on, see what will be saved, enter their email, get a code, enter it, and arrive at a confirmation that their picks are saved to their new account.

**Why this priority**: This is the gate the founder decided on (C4), and the email code path already exists in the repo, so it is the shortest route to a working required signup. Without it nobody reaches Support or Help.

**Independent Test**: With picks on the device, finish the societal page, sign up by code, then sign in on a second device and see the same picks.

**Acceptance Scenarios**:

1. **Given** picks on this device, **When** the person reaches the gate, **Then** they see a plain list of exactly what will be sent if they sign up, before they type anything.
2. **Given** a valid email, **When** the person asks for a code, **Then** a code is emailed and the screen says where it went and how long it lasts.
3. **Given** a correct code, **When** the person enters it, **Then** an account is created and their picks and "I'd use this" marks are saved with the content version each was made under.
4. **Given** a saved account, **When** the person signs in on another device, **Then** the same picks and marks are there.
5. **Given** the person never ticked the opt-in, **When** the account is created, **Then** the account records no consent to emails from It.

---

### User Story 2 - Sign up with email and password (Priority: P1)

A visitor who prefers passwords chooses "Use a password instead", sets one, and gets the same result as Story 1.

**Why this priority**: Founder decision C3 makes both methods core. Equal to Story 1, but listed second because it does not exist in the repo yet.

**Independent Test**: Sign up by password, sign out, sign in again with the same password, and see the same picks.

**Acceptance Scenarios**:

1. **Given** the password method, **When** the person enters a password that meets the shown rules, **Then** an account is created and picks are saved exactly as in Story 1 [NEEDS CLARIFICATION: after email confirmation, or immediately? Q2].
2. **Given** a password that does not meet the rules, **When** the person submits, **Then** the screen says which rule failed, without clearing the field.
3. **Given** an account created by password, **When** the person later chooses "Email me a code" with the same email, **Then** they sign in to the same account.
4. **Given** a forgotten password, **When** the person asks for help, **Then** they can get back in [NEEDS CLARIFICATION: by a reset flow, or only by signing in with a code? Q3].

---

### User Story 3 - Know what leaves my device (Priority: P1)

Before signing up, the person can see exactly which of their answers will be sent and which stay behind, and nothing is sent until the account is confirmed.

**Why this priority**: Privacy invariant (AGENTS.md, constitution II). The gate is the one moment personal picks leave the device, so it must be explicit.

**Independent Test**: Watch everything the app sends from opening the gate to confirming the account; no pick, mark or pain content is sent before the confirming step, and what is sent then matches the list on screen.

**Acceptance Scenarios**:

1. **Given** the gate is open, **When** the person types an email and asks for a code, **Then** only the email (and the method chosen) is sent, never picks or marks.
2. **Given** the account is confirmed, **When** saving runs, **Then** what is sent matches the on-screen list item for item.
3. **Given** the person leaves the gate without signing up, **Then** nothing personal was sent and their picks stay on the device.

---

### User Story 4 - Choose whether It may email me (Priority: P2)

The person sees an unticked checkbox for emails from It and can tick it or leave it.

**Why this priority**: Core in features.md, but it does not block saving picks.

**Independent Test**: Sign up twice, once ticked and once not; only the ticked account is recorded as agreeing, with when and to what wording.

**Acceptance Scenarios**:

1. **Given** the gate, **Then** the checkbox is unticked by default and its label says what kind of emails these are.
2. **Given** the person ticks it, **When** the account is created, **Then** the account records the agreement, the time, and which wording they saw.
3. **Given** the box is not ticked, **Then** It sends that person only the emails needed to sign in (codes, and any password emails), never updates or appeals.

---

### User Story 5 - Come back already signed up (Priority: P2)

A person who already has an account reaches the gate on a new device or after clearing their device, signs in, and carries on.

**Why this priority**: Required signup means returning people hit the gate too; they must not be forced into a second account.

**Independent Test**: Create an account, clear the device, make new picks, reach the gate with the same email, sign in, and see the agreed merge behaviour (Q1).

**Acceptance Scenarios**:

1. **Given** an email that already has an account, **When** the person enters it, **Then** the gate signs them in rather than creating a duplicate.
2. **Given** the account has saved picks and this device has different picks, **When** they sign in, **Then** [NEEDS CLARIFICATION: keep saved, replace with device, combine, or ask? Q1].

### Edge Cases

- **No picks at all**: the person reaches the gate having picked nothing. [NEEDS CLARIFICATION: allowed to sign up with nothing saved? Q13] Recommended: yes; the gate says there is nothing to save yet.
- **Picks made under different content versions** (some days ago, some today after a new publish): each pick and mark keeps the version it was made under; none is dropped silently.
- **A picked dream or idea no longer exists in the current content**: it is still saved with its old version (that version stays available), never silently discarded. If it cannot be saved, the person is told which item and that it stays on the device.
- **Code expired, wrong code, too many attempts**: plain message, a way to get a new code; picks stay on the device.
- **Email never arrives**: a "send another code" control after a short wait, plus a suggestion to check the address and spam folder, and the option to switch to a password.
- **Typo in the email**: the code screen shows the address and a way to change it.
- **Saving fails after the account is created** (network, server): the account exists, the picks stay on the device, and the next visit or a retry saves them. The person is never told "saved" until it is.
- **Device storage unavailable** (private browsing): picks lived only in memory for the visit; signing up in the same visit still saves them.
- **Person goes back from the gate**: they return to either page with picks intact and can come back to the gate.
- **Shared device**: after saving, someone else on the device should not see the previous person's picks. [NEEDS CLARIFICATION: is the device copy cleared after a confirmed save? Q10]
- **Person already signed in** reaching the end of the societal page: no gate; changes are saved to their account [NEEDS CLARIFICATION: Q11].
- **Content unavailable at save time**: the existing behaviour (tell the person their choices are still on the device) is kept.

## Requirements *(mandatory)*

### Functional Requirements

**The gate**

- **FR-001**: Going further than the societal page MUST require an account. The personal and societal pages MUST stay usable without one (decisions.md, C4).
- **FR-002**: The gate MUST NOT offer a way to continue into the rest of It without an account. It MUST offer a way back to both pages and a way to leave.
- **FR-003**: The gate MUST show, before any input, a plain list of what will be sent at signup and what stays on the device (see It Checks → Privacy).
- **FR-004**: The gate MUST link to the privacy page (spec 010) [NEEDS CLARIFICATION: is a separate terms/privacy acceptance step required, or is a link enough? Q17].

**Methods**

- **FR-005**: People MUST be able to create an account and sign in with a one-time code sent to their email.
- **FR-006**: People MUST be able to create an account and sign in with email and password.
- **FR-007**: One email MUST map to one account, whichever method was used to create it; either method MUST sign in to that account once it exists [NEEDS CLARIFICATION: may a code-created account sign in by password before the person sets one? Q3].
- **FR-008**: Password rules MUST be shown before the person types, and failures MUST name the rule that failed [NEEDS CLARIFICATION: the rules themselves — minimum length, breached-password check? Q5].
- **FR-009**: Password signups MUST [NEEDS CLARIFICATION: confirm the email by code before picks are saved, or not? Q2].
- **FR-010**: A person who forgets their password MUST be able to get back in [NEEDS CLARIFICATION: reset flow in v0.1 or code sign-in only? Q3].
- **FR-011**: Codes MUST expire, MUST be limited in attempts, and requests MUST be rate-limited. The existing limits (8-digit code, 10 minutes, 5 attempts) are kept unless the founder changes them.
- **FR-012**: Error messages MUST NOT reveal whether a given email already has an account to someone who has not proved control of it [NEEDS CLARIFICATION: or is a friendlier "you already have an account, sign in" acceptable? Q6].
- **FR-013**: The gate MUST NOT ask for a name or anything beyond email (and password, if chosen) [NEEDS CLARIFICATION: Q12].

**Saving picks**

- **FR-014**: Nothing from the person's pre-signup answers MUST be sent before they have proved control of the email (code entered, or password account created and [Q2]).
- **FR-015**: At signup the system MUST save to the account exactly the items listed on the gate, and nothing else from the device.
- **FR-016**: Each saved pick and "I'd use this" mark MUST keep the content version it was made under (features.md "soon": personal story; decisions.md: "keep content versions on picks").
- **FR-017**: Each saved pick MUST keep which pain it was picked under, so "dream for a pain" survives (spec 001 Key Entities).
- **FR-018**: The person MUST NOT be told their picks are saved until the save has succeeded. On failure, picks MUST remain on the device and the person MUST be able to retry.
- **FR-019**: "I'd use this" marks MUST be counted in admin totals only from saved accounts, at the moment they are saved (spec 001 FR-018).
- **FR-020**: When the account already holds saved picks, the system MUST [NEEDS CLARIFICATION: merge rule, Q1].
- **FR-021**: After a confirmed save, the device copy MUST [NEEDS CLARIFICATION: be cleared, or be kept as the signed-in working copy? Q10].
- **FR-022**: After signup, changes the person makes on pages 1–2 MUST [NEEDS CLARIFICATION: save to the account automatically, on an explicit save, or not at all in v0.1? Q11].

**Email opt-in**

- **FR-023**: The gate MUST show an opt-in checkbox for emails from It, unticked by default, whose label says what the emails are [NEEDS CLARIFICATION: wording and kinds of email, Q7].
- **FR-024**: The account MUST record whether the person opted in, when, and which version of the wording they saw. Not ticking MUST record no consent.
- **FR-025**: Sign-in emails (codes and any password emails) MUST NOT depend on the opt-in and MUST contain nothing else (no appeals, no Support asks).
- **FR-026**: People MUST be able to change their opt-in later [NEEDS CLARIFICATION: in v0.1, and where — an account screen, an unsubscribe link in each email, or both? Q8].

**Hand-offs and measurement**

- **FR-027**: After a successful signup the person MUST be taken on to Support (spec 009), which itself can be skipped.
- **FR-028**: The per-visit stage funnel MUST include "reached the gate" and "signed up" as stages, with no email, account ID or pick content attached, so the founder's review line (about 50% drop-off at the gate) can be measured [NEEDS CLARIFICATION: confirm these two stages, Q14].

**Account lifecycle**

- **FR-029**: People MUST be able to sign out. [NEEDS CLARIFICATION: account and data deletion in v0.1 — self-serve, by email request, or later? Q15]
- **FR-030**: [NEEDS CLARIFICATION: minimum age, and whether the gate asks for it. Q16]

### Key Entities *(include if feature involves data)*

- **Account**: one per email. Holds the verified email, how the person can sign in (code, password, or both), whether and when they opted in to emails and to which wording, and when it was created. No name unless Q12 says otherwise.
- **Saved pick**: a dream picked under a pain, with the content version it was made under and when it was saved. Belongs to one account. Private.
- **Saved "I'd use this" mark**: an idea the person marked, with its content version. Belongs to one account. Private; contributes to admin totals only as a count.
- **Email consent record**: yes/no, time, wording version. Changes over time are kept so it is clear what the person agreed to and when.
- **Content version**: the published set of pains, dreams and ideas a pick or mark was made under (shared with spec 001).

## Changes From What Exists Today

The repo already has an optional, email-code-only "save your exploration" flow. This spec changes it as follows (paths relative to the repo root):

| Area | What exists | Change this spec asks for |
|---|---|---|
| Where the gate sits | `apps/app/app/save-progress.tsx` is reached only from `apps/app/app/ways-to-help.tsx` ("Save my exploration"), after `apps/app/app/onboarding/futures.tsx`. Flow: `onboarding/personal.tsx` → `onboarding/world.tsx` → `onboarding/futures.tsx` → `ways-to-help.tsx` / `support-it.tsx`. | Gate sits right after the societal page and before Support and Help (FR-001). `futures.tsx` and `ways-to-help.tsx` sit past the gate or are replaced by specs 001/002/011 [NEEDS CLARIFICATION: fate of the separate futures screen, Q9]. |
| Optional vs required | `save-progress.tsx` has a "Not now" link, and copy says "Enter your email only if you'd like to create an account" and "You can keep exploring without an account". `ways-to-help.tsx` says "These choices stay on this device until you choose to save them". | Remove "Not now" into the app and the optional wording (FR-002); keep "back" and the on-device reassurance. |
| Methods | `apps/api-server/src/auth.ts`: Better Auth with `emailOTP` (8 digits, 10 min, 5 attempts, hashed), `emailAndPassword: { enabled: false }`. Clients `apps/app/src/auth/auth-client.ts` and `auth-client.native.ts` load only `emailOTPClient`. | Enable email + password alongside the code (FR-006). Decisions.md already names Better Auth for passwords; the `account.password` column exists in `packages/database/src/migrations/002_user_persistence.ts`. A draft (`docs/spec/drafts/it-spec-decisions.md` D9) suggests a decision record for the password-hash algorithm; whether that is needed is Q18. |
| Sign-in email | `auth.ts` sends "Your It sign-in code is …" only. | Add any password emails (verification/reset per Q2, Q3); keep them free of other content (FR-025). |
| Name | `save-progress.tsx` sends `name: "It explorer"` for every account (the `user.name` column is required). | Keep not asking for a name (FR-013) unless Q12 decides otherwise. |
| Opt-in | None. `user` table has no consent fields. | Add the unticked checkbox and a consent record (FR-023–FR-024). |
| What is sent | `save-progress.tsx` sends the whole on-device draft via `account.saveOnboarding` (`packages/api/src/contract.ts`): `personalPainIds`, `worldPainIds`, `personalDreamIds`, `worldDreamIds`, `helpInterests`, `draftUpdatedAt`, plus one `contentVersion`. Shape defined in `packages/domain/src/onboarding.ts`; stored as one JSON blob per user in `user_onboarding_drafts` (`packages/database/src/content-repository.ts` `saveUserOnboardingDraft`, upsert that overwrites). | Send only the listed items (FR-015): dream picks with their pain and per-item content version (FR-016, FR-017), and "I'd use this" marks (not yet in the draft at all; spec 001 adds them). Drop `helpInterests` from the signup payload, since Help now comes after signup (spec 011). Whether bare pain selections (`personalPainIds`/`worldPainIds`) are sent is Q19. The single `contentVersion` per draft becomes one per item. The overwrite-on-save behaviour becomes the Q1 merge rule. |
| Validation | `saveUserOnboardingDraft` rejects the whole save if any ID is missing from the one version given. | Validate each item against its own version; never drop items silently (Edge Cases). |
| Device copy after save | Store `apps/app/src/state/onboarding-store.ts` (`it-onboarding-draft-v1`) is left as-is after saving; `apps/app/src/components/clear-draft-control.tsx` clears on request. | Per Q10. |
| Server session | `apps/api-server/src/index.ts` reads the Better Auth session into `userId`; `packages/api/src/router.ts` `requireUserId` says "Sign in with an email code before saving your exploration." | Message must cover both methods. |
| Support sign-in | `support.createCheckout` in `packages/api/src/router.ts` / `apps/api-server/src/stripe-support.ts` accepts `userId: null` (guest support). | C6: supporters are signed in because signup comes first. Owned by spec 009; noted here because the gate makes it true. |
| Roadmap text | `docs/roadmap/mvp.md` says "Add email OTP only at the persistence gate … Implemented". | Out of date after C3/C4; update when this spec is planned. |

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A person with picks can go from the gate to "saved" by email code in under 2 minutes, excluding time waiting for the email.
- **SC-002**: A person can sign up by password in under 1 minute [plus email confirmation if Q2 requires it].
- **SC-003**: In testing, 100% of picks and marks on the device before signup are present in the account afterwards, each with the content version it was made under.
- **SC-004**: An independent review of everything sent from opening the gate to confirmation finds no pick, mark or pain content before confirmation, and finds that what is sent at confirmation matches the on-screen list exactly.
- **SC-005**: 100% of accounts created without ticking the box have no email consent recorded.
- **SC-006**: The founder can read the share of visits that reach the gate and sign up from the stage funnel, without any per-person data.
- **SC-007**: No account is duplicated for the same email across the two methods.

## It Checks *(mandatory)*

### Privacy

- **Before signup, stays on device**: every pick, every "I'd use this" mark, which pains were opened, the content versions, and the email opt-in choice until the account is confirmed.
- **Before signup, sent** (coarse totals / stage funnel only, disclosed in UI): the stage funnel stages "reached the gate" and "signed up" (Q14), with the in-memory visit ID only. When the person asks for a code or creates a password account, their email (and password, if chosen) is sent for that purpose only.
- **Sent at signup, once confirmed** (listed on the gate): picked dreams with the pain each was picked under and the content version; "I'd use this" marks with the content version; the opt-in choice and wording version. Not sent unless the founder decides otherwise: pains opened but not picked from, help interests, timestamps of individual picks beyond what the content version implies (Q19).
- **After signup, stored on server**: the account (email, sign-in methods, consent record) and the saved picks and marks.
- **Never public by default**: the email, the consent record, and every saved pick and mark. Admin sees totals only, never individuals (features.md §6).
- **No stable anonymous identity**: the gate MUST NOT link the pre-signup visit ID to the account.

### Honest Status

The gate shows no ideas. Its copy MUST be honest about why an account is needed and MUST NOT imply that signing up costs money, that support is expected, or that It is a charity. The saved screen leads to Support (009), which must remain skippable.

### Must Not Block

- **Personal story (soon)**: picks keep the content version and the pain they were picked under.
- **Sharing a future or path (soon)**: saved picks are private; sharing will be an explicit act on a separate copy, so nothing here makes picks shareable.
- **Invitations (optional)**: the account can later record who invited whom without exposing the inviter's picks; this spec adds nothing that prevents an "invited by" link.
- **Native iOS app (optional)**: both methods must work in the iOS app (the existing native client stores the session in secure storage); no web-only sign-in method.
- **Starting from a dream (soon)**: saved picks MUST allow a dream without a parent pain later; the pain link is recorded when present, not required by design.
- **Matching people with help (soon)**: nothing; Help answers are owned by spec 011.

### Accessibility

- Keyboard: every field, both method choices, the checkbox, "send another code" and "back" are reachable and usable by keyboard with a visible focus outline; Enter submits the current step.
- Screen reader (incl. expanded/collapsed state): the "what will be sent" list is real text, not an image; the checkbox announces checked/unchecked; errors are announced as alerts and tied to their field; the code field supports one-time-code autofill and the password field supports password managers.
- Reduced motion: the saving state uses no motion that cannot be turned off (relevant if the watercolor loader, spec 007, is used here).
- Meaning never by colour alone: errors and the selected method are marked with text, not only colour.

### Research Questions

- How much does required signup after two pages cost compared with optional signup, for a small, mission-led product? (founder's review line: about 50% drop-off)
- Do people given a choice pick the email code or a password, and does offering both raise completion?
- What opt-in wording gets an honest, informed choice without dark patterns, and what share opt in when the box is unticked?
- What should a "what we send" summary at a signup gate say so that people read and trust it?

## Dependencies and Conflicts With Other Specs

- **001 personal page** (on master): references signup as "spec 003". The founder's later split numbers it 008; 001's references need updating (Q20). 001 FR-018 depends on this spec counting marks only at save. 001 defines a pick as "a dream for a pain", which the current draft shape does not store (FR-017).
- **002 societal page** (not yet written in this round): owns the "go on" control that leads to the gate.
- **009 support page**: Support follows signup, so supporters are always signed in (C6). The saved screen hands off to 009. If 009 keeps guest support, it conflicts with C6.
- **010 safety floor + privacy page**: the gate links to the privacy page and its "what we send" list must match it. Account deletion (Q15), age (Q16) and terms acceptance (Q17) may belong to 010; the founder should decide which spec owns them.
- **011 help page**: Help comes after signup, so pre-signup help interests leave the signup payload. The existing `ways-to-help.tsx` interests list is replaced by 011.
- **007 watercolor loader** (other branch): may be used for the "saving" state; if so it must respect reduced motion.

## Assumptions

- One account per email; both methods lead to the same account.
- The existing code limits (8 digits, 10 minutes, 5 attempts, codes stored hashed, rate limiting on) are acceptable for v0.1.
- Sessions follow the auth provider's defaults (stay signed in on the device until sign-out or expiry).
- Production email sending (SMTP provider and sender) is an open implementation decision in decisions.md; this spec needs it but does not choose it.
- Web is the v0.1 platform (assessment Option B); iOS must not be blocked.
- No social or third-party sign-in in v0.1, so platform rules that require offering one do not apply.
- Earlier picks stay on the device until a save succeeds, so a failed save loses nothing.
