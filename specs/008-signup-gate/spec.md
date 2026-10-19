# Feature Specification: Signup gate — "Sign up to go further"

**Feature Branch**: `spec/008-signup-gate`

**Created**: 2026-10-17 · **Updated**: 2026-10-18 with founder answers from the 2026-10-17 review (`questions.md`)

**Status**: Draft (founder answers applied; three small items left open; no plan or tasks yet)

**Input**: User description: "features.md §3, signup gate. Signup is required after the personal and societal pages (CONFLICTS C4). Both email one-time code and email + password (C3). The person's picks are saved with their content version at signup. Email opt-in checkbox is unticked by default. Existing code is OTP-only and signup is optional; describe the spec as changes from what exists. Pre-signup answers stay on device until signup; what is transmitted at signup must be explicit."

Binding sources: `AGENTS.md`, `docs/architecture/decisions.md` (Identity and privacy, including the 2026-10-17 entry on passwords and passkeys), `docs/spec/CONFLICTS.md` rows C3, C4, C6, C9, `docs/spec/features.md` §3, and the founder answers recorded in `questions.md`. Everything else (assessments, drafts, `docs/roadmap/mvp.md`) is evidence only. Where `docs/roadmap/mvp.md` still says "email OTP only at the persistence gate", features.md and decisions.md win.

**Terminology**: a **selected fix** is an idea under a picked dream (labelled as something to do now, an existing resource, something It might build, or a societal change) that the person selected. Earlier drafts called these "I'd use this" marks; that wording is retired.

## What People See and Do *(mandatory, write this first)*

Covers features.md §3: "Email code (OTP) or email + password", "Your picks from pages 1–2 are saved to your account", "Opt-in checkbox (unticked by default) for emails from It".

- **Screen: The gate (email)** - Reached directly from the bottom of the societal page ("What could be better for us?") when the person chooses to go on. A short heading says why an account is needed to go further. A plain list says exactly what will be saved to the account (their picked futures with the pain each was picked under, their selected fixes, and which version of It's content they saw) and what is not sent (pains they opened or selected, anything else on the device). One email field and a "Continue" button. An unticked checkbox for update emails from It (wording is the founder's; see FR-021). A line "By signing up you agree to …" with links to the privacy page (spec 010) and any terms. A small "Use a password" link for people who already have an account with a password. - The person can enter an email and continue, tick or leave the opt-in, read what is sent, go back to either page to change picks, or leave. There is no "Not now" that continues into the rest of It.
- **Screen: Enter your code** - Says "We sent a code to [address]" whether or not the address already has an account, with a way to change the address. One code field. - The person can enter the code, ask for another, or change the address.
- **Screen: Sign in with a password** (only via the small link) - Email and password fields, and "Forgot your password? Sign in with a code instead". - The person can sign in, or go back to the code route.
- **Screen: Saving** - A short waiting state while picks are saved. If saving fails, it says the picks are still on this device and offers to try again. - The person can retry, or go back.
- **Screen: Your name** - Shown right after a new account is created and picks are saved. Asks for the person's name; required to continue. - The person enters a name and continues.
- **Screen: Make signing in easier** (optional) - Offers to create a password or register a passkey, or skip. [NEEDS CLARIFICATION: where this offer sits — straight after the name step, or later in an account area? Q21] - The person can add a password, add a passkey, or skip.
- **Then**: Support (spec 009), then Help build It (spec 011), both skippable.

Returning people who sign in at the gate skip the name step (they already have a name) and go on to Support.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Sign up with my email and keep my picks (Priority: P1)

A visitor has picked futures and selected fixes on the personal and societal pages (or on a single pain page reached from an entry link, spec 012). They choose to go on, see what will be saved, enter their email, get a code, enter it, give their name, and carry on to Support with their picks saved to their new account.

**Why this priority**: This is the gate the founder decided on (C4), and every signup goes through the email code, so it is the one path everyone uses.

**Independent Test**: With picks on the device, finish the societal page, sign up by code, then sign in on a second device and see the same picks.

**Acceptance Scenarios**:

1. **Given** picks on this device, **When** the person reaches the gate, **Then** they see a plain list of exactly what will be sent if they sign up, before they type anything.
2. **Given** an email, **When** the person continues, **Then** a code is emailed and the screen says "We sent a code to [address]", the same wording whether or not an account exists.
3. **Given** a correct code for a new address, **When** the person enters it, **Then** an account is created with a verified email, and their picked dreams and selected fixes are saved, each with the content version it was made under.
4. **Given** a new account just created, **When** saving succeeds, **Then** the person is asked for their name and cannot continue without one.
5. **Given** a saved account, **When** the person signs in on another device, **Then** the same picks and selected fixes are there.
6. **Given** the person never ticked the opt-in, **When** the account is created, **Then** the account records no consent to update emails.
7. **Given** no picks at all, **When** the person signs up, **Then** signup works and the gate says there is nothing to save yet.

---

### User Story 2 - Know what leaves my device (Priority: P1)

Before signing up, the person can see exactly which of their answers will be sent and which stay behind, and nothing is sent until the email is verified.

**Why this priority**: Privacy invariant (AGENTS.md, constitution II). The gate is the one moment personal picks leave the device, so it must be explicit.

**Independent Test**: Watch everything the app sends from opening the gate to confirming the account; no pick, fix or pain content is sent before the code is accepted, and what is sent then matches the list on screen.

**Acceptance Scenarios**:

1. **Given** the gate is open, **When** the person enters an email and continues, **Then** only the email is sent, never picks or selected fixes.
2. **Given** the code is accepted, **When** saving runs, **Then** what is sent matches the on-screen list item for item, and nothing else from the device is sent.
3. **Given** the person leaves the gate without signing up, **Then** nothing personal was sent and their picks stay on the device.
4. **Given** a confirmed save, **Then** the picks are cleared from the device and the signed-in pages show them from the account.

---

### User Story 3 - Come back already signed up (Priority: P1)

A person who already has an account reaches the gate on a new device or after clearing their device, makes some picks, signs in with a code (or a password, if they set one), and carries on with everything combined.

**Why this priority**: Required signup means returning people hit the gate too; they must not be forced into a second account or lose either set of picks.

**Independent Test**: Create an account with picks A, clear the device, make picks B, reach the gate with the same email, sign in, and see A and B together.

**Acceptance Scenarios**:

1. **Given** an email that already has an account, **When** the person enters it and the code, **Then** they are signed in to that account; no duplicate is created.
2. **Given** the account has saved picks and this device has different picks, **When** they sign in, **Then** the account keeps every saved pick and gains every device pick (union), without asking.
3. **Given** the person uses "Use a password" with a correct password, **Then** the result is the same as signing in with a code.
4. **Given** the person forgot their password, **When** they choose "Sign in with a code instead", **Then** they get in by code; there is no separate reset flow.
5. **Given** a returning account, **Then** the name step is skipped.

---

### User Story 4 - Choose whether It may send me updates (Priority: P2)

The person sees an unticked checkbox for update emails from It and can tick it or leave it.

**Why this priority**: Core in features.md, but it does not block saving picks.

**Independent Test**: Sign up twice, once ticked and once not; only the ticked account is recorded as agreeing, with when and to which wording, and only it receives update emails.

**Acceptance Scenarios**:

1. **Given** the gate, **Then** the checkbox is unticked by default and its label says the emails are updates about It.
2. **Given** the person ticks it, **When** the account is created, **Then** the account records the agreement, the time, and which wording they saw.
3. **Given** the box is not ticked, **Then** It sends that person only transactional emails (sign-in codes and other emails needed for something they did), never updates.
4. **Given** an update email, **Then** it contains a working unsubscribe link that records the withdrawal.

---

### User Story 5 - Make signing in easier (Priority: P3)

After signup, the person may add a password or register a passkey so they don't need a code every time.

**Why this priority**: Optional convenience; the code alone is enough to use It.

**Independent Test**: Sign up by code, add a password, sign out, sign in by password; repeat with a passkey on a device that supports one.

**Acceptance Scenarios**:

1. **Given** a signed-in account, **When** the person adds a password that meets the shown rules, **Then** they can later sign in with email and password.
2. **Given** a password that is too short or known to be breached, **When** they submit, **Then** the screen says which rule failed, without clearing the field.
3. **Given** a device that supports passkeys, **When** the person registers one, **Then** they can later sign in with it.
4. **Given** the person skips, **Then** nothing changes and the code still works.

### Edge Cases

- **No picks at all**: signup is allowed; the gate says there is nothing to save yet.
- **Picks made under different content versions** (some days ago, some today after a new publish): each pick and selected fix keeps the version it was made under; none is dropped silently.
- **A picked dream or fix no longer exists in the current content**: it is saved with its old version (that version stays available), never silently discarded. If it cannot be saved, the person is told which item and that it stays on the device.
- **Union with duplicates**: the same dream picked under the same pain on device and in the account is stored once.
- **Picks from a single pain page** (spec 012, `/p/<slug>`): they are the same device picks and are saved at signup like any other.
- **Code expired, wrong code, too many attempts**: plain message, a way to get a new code; picks stay on the device.
- **Email never arrives**: a "send another code" control after a short wait, and a suggestion to check the address and spam folder.
- **Typo in the email**: the code screen shows the address and a way to change it.
- **Wrong password, or no password on that account**: one neutral message ("That email and password don't match") with the option to sign in with a code; it never reveals whether the account exists.
- **Saving fails after the account is created** (network, server): the account exists, picks stay on the device, and a retry or the next sign-in saves them. The person is never told "saved" until it is, and the device copy is not cleared until then.
- **Person closes the app at the name step**: the account and picks are saved; the name step is shown on next sign-in until a name is given.
- **Device storage unavailable** (private browsing): picks lived only in memory for the visit; signing up in the same visit still saves them.
- **Person goes back from the gate**: they return to either page with picks intact and can come back.
- **Shared device**: after a confirmed save the device copy is cleared; the "clear everything on this device" control is shown only before signup.
- **Person already signed in** at the end of the societal page: no gate; edits have already auto-saved to their account.
- **Content unavailable at save time**: the person is told their choices are still on the device (existing behaviour kept).

## Requirements *(mandatory)*

### Functional Requirements

**The gate**

- **FR-001**: Going further than the societal page MUST require an account. The personal and societal pages (and single pain pages, spec 012) MUST stay usable without one (decisions.md, C4).
- **FR-002**: The gate MUST sit directly after the societal page. It MUST NOT offer a way to continue into the rest of It without an account, and MUST offer a way back to both pages and a way to leave.
- **FR-003**: The gate MUST show, before any input, a plain list of what will be sent at signup and what stays on the device (see It Checks → Privacy).
- **FR-004**: The gate MUST show a "By signing up you agree to …" line with links to the privacy page (spec 010) and any terms. There MUST NOT be a separate acceptance checkbox.
- **FR-005**: The gate MUST ask for nothing but an email (plus the opt-in). No age question; the minimum age (16) is stated on the privacy page (spec 010).

**Signing up and in**

- **FR-006**: Every new account MUST be created through a one-time code sent to the email, so the email is verified before any picks are saved.
- **FR-007**: The code route MUST be neutral: the same screen and wording whether or not the email already has an account. Entering a correct code for an existing account MUST sign the person in to it.
- **FR-008**: The gate MUST offer a small "Use a password" link for people who already have a password. Its failure message MUST NOT reveal whether the account exists or has a password, and MUST offer the code route.
- **FR-009**: A person who forgets their password MUST be able to sign in with a code. v0.1 has no separate password reset flow.
- **FR-010**: One email MUST map to one account; code, password and passkey all sign in to that same account.
- **FR-011**: Codes MUST expire, MUST be limited in attempts, and requests MUST be rate-limited. The existing limits (8-digit code, 10 minutes, 5 attempts) are kept unless the founder changes them.
- **FR-012**: [NEEDS CLARIFICATION: does the gate also offer signing in with an existing passkey (for example through the browser's own passkey prompt), or only the code and the password link? Q22]

**After signup**

- **FR-013**: Right after a new account is created and picks are saved, the person MUST be asked for their name. The name is required to continue. Returning accounts that already have a name skip this step. No placeholder name is stored.
- **FR-014**: Signed-in people MAY add a password or register a passkey; neither is required [placement: Q21].
- **FR-015**: Passwords MUST have a minimum length of 10–12 characters [NEEDS CLARIFICATION: exact number, left to plan], MUST be checked against known-breached passwords, and MUST NOT have composition rules (no required symbols, digits or cases). Rules MUST be shown before the person types, and failures MUST name the rule that failed.
- **FR-016**: After the name step the person MUST go on to Support (spec 009), then Help build It (spec 011); both skippable.

**Saving picks**

- **FR-017**: Nothing from the person's pre-signup answers MUST be sent before the code is accepted (or, for a returning person, before they sign in).
- **FR-018**: At signup the system MUST save to the account exactly these items and nothing else from the device: each picked dream with the pain it was picked under and its content version; each selected fix with its content version; the opt-in choice and the wording version shown. It MUST NOT send opened or selected pains, help interests, or the draft's last-changed time.
- **FR-019**: When the account already holds saved picks, the system MUST combine them silently with the device picks (union), never dropping either side.
- **FR-020**: The person MUST NOT be told their picks are saved until the save has succeeded. On failure, picks MUST remain on the device and the person MUST be able to retry. After a confirmed save, the device copy MUST be cleared, and signed-in pages (personal, societal, single pain pages) MUST read picks from the account.
- **FR-021**: After signup, changes the person makes to picks MUST save to the account automatically.
- **FR-022**: Selected fixes MUST be counted in admin totals only from saved accounts (spec 001 FR-018, under its new wording).
- **FR-023**: The "clear everything on this device" control MUST be shown only before signup.

**Email opt-in**

- **FR-024**: The gate MUST show an opt-in checkbox for update emails from It, unticked by default. It covers updates only; everything else It sends at this point is transactional. Finer-grained email permissions come later, elsewhere. [NEEDS CLARIFICATION: final label wording — founder writes or approves. Q7]
- **FR-025**: The account MUST record whether the person opted in, when, and which wording version they saw. Not ticking MUST record no consent.
- **FR-026**: Transactional emails (codes and any other email needed for something the person did) MUST NOT depend on the opt-in and MUST contain nothing else (no appeals, no Support asks).
- **FR-027**: Every update email MUST include an unsubscribe link that records the withdrawal. An account setting for this comes later.

**Measurement and account lifecycle**

- **FR-028**: The per-visit stage funnel MUST include "reached the gate" and "signed up" as stages, never linked to the account and with no email or pick content attached. The full stage list is owned by the measurement spec (new, not yet written); this spec only requires these two stages to exist.
- **FR-029**: People MUST be able to sign out.
- **FR-030**: Account and data deletion in v0.1 is by email request with a stated response time, described on the privacy page; owned by spec 010. This spec adds no self-serve deletion.

### Key Entities *(include if feature involves data)*

- **Account**: one per email. Holds the verified email, the person's name (required, asked after signup), how they can sign in (code always; password and passkey optional), the email consent record, and when it was created.
- **Saved pick**: a dream picked under a pain, with the content version it was made under and when it was saved. Belongs to one account. Private. The pain link is recorded when present; the design allows a dream without a parent pain later.
- **Selected fix**: a fix (an idea under a dream) the person selected, with its content version. Belongs to one account. Private; contributes to admin totals only as a count.
- **Email consent record**: yes/no, time, wording version. Changes (including unsubscribes) are kept so it is clear what the person agreed to and when.
- **Content version**: the published set of pains, dreams and fixes a pick was made under (shared with spec 001).

## Changes From What Exists Today

The repo already has an optional, email-code-only "save your exploration" flow. This spec changes it as follows (paths relative to the repo root):

| Area | What exists | Change this spec asks for |
|---|---|---|
| Where the gate sits | `apps/app/app/save-progress.tsx` is reached only from `apps/app/app/ways-to-help.tsx` ("Save my exploration"), after `apps/app/app/onboarding/futures.tsx`. Flow: `onboarding/personal.tsx` → `onboarding/world.tsx` → `onboarding/futures.tsx` → `ways-to-help.tsx` / `support-it.tsx`. | Gate directly after the societal page (`world.tsx`) (FR-002). Retire `futures.tsx`; dreams are inline on both pages (specs 001/002). `ways-to-help.tsx` is retired by spec 011. After signup: name step → Support (009) → Help build It (011). |
| Optional vs required | `save-progress.tsx` has a "Not now" link, and copy says "Enter your email only if you'd like to create an account" and "You can keep exploring without an account". `ways-to-help.tsx` says "These choices stay on this device until you choose to save them". | Remove "Not now" and the optional wording (FR-002); keep "back" and the on-device reassurance. |
| Methods | `apps/api-server/src/auth.ts`: Better Auth with `emailOTP` (8 digits, 10 min, 5 attempts, hashed), `emailAndPassword: { enabled: false }`. Clients `apps/app/src/auth/auth-client.ts` and `auth-client.native.ts` load only `emailOTPClient`. | Keep the code as the only way to create an account (FR-006). Enable password sign-in for accounts that add one (FR-008, FR-014, FR-015) and add passkeys (FR-014). Passkeys are new relative to C3; recorded in `docs/architecture/decisions.md` (2026-10-17 entry), which also records password-hash settings. The `account.password` column exists in `packages/database/src/migrations/002_user_persistence.ts`; passkeys need new storage. |
| Sign-in email | `auth.ts` sends "Your It sign-in code is …" only. | Unchanged in purpose; must stay free of other content (FR-026). No password reset email in v0.1 (FR-009). |
| Code-path neutrality | `save-progress.tsx` requests a code with `type: "sign-in"`, which already creates or signs in. | Keep the neutral wording; make sure no message differs for existing accounts (FR-007). |
| Name | `save-progress.tsx` sends `name: "It explorer"` for every account (the `user.name` column is required). | Drop the placeholder; ask for a required name right after signup (FR-013). |
| Opt-in | None. `user` table has no consent fields. | Add the unticked checkbox, a consent record and unsubscribe handling (FR-024–FR-027). |
| What is sent | `save-progress.tsx` sends the whole on-device draft via `account.saveOnboarding` (`packages/api/src/contract.ts`): `personalPainIds`, `worldPainIds`, `personalDreamIds`, `worldDreamIds`, `helpInterests`, `draftUpdatedAt`, plus one `contentVersion`. Shape defined in `packages/domain/src/onboarding.ts`; stored as one JSON blob per user in `user_onboarding_drafts` (`packages/database/src/content-repository.ts` `saveUserOnboardingDraft`, an upsert that overwrites). | Send only FR-018's list: dream picks with their pain and per-item content version, and selected fixes (not yet in the draft; spec 001 adds them). Drop `personalPainIds`, `worldPainIds`, `helpInterests` and `draftUpdatedAt` from what is sent. One content version per item instead of per draft. Overwrite becomes union (FR-019). |
| Validation | `saveUserOnboardingDraft` rejects the whole save if any ID is missing from the one version given. | Validate each item against its own version; never drop items silently (Edge Cases). |
| Device copy after save | Store `apps/app/src/state/onboarding-store.ts` (`it-onboarding-draft-v1`) is left as-is after saving; `apps/app/src/components/clear-draft-control.tsx` clears on request at any time. | Clear the device copy after a confirmed save; signed-in pages read from the account and auto-save edits (FR-020, FR-021). Clear control shown only before signup (FR-023). |
| Server session | `apps/api-server/src/index.ts` reads the Better Auth session into `userId`; `packages/api/src/router.ts` `requireUserId` says "Sign in with an email code before saving your exploration." | Message must not assume a method. |
| Support sign-in | `support.createCheckout` in `packages/api/src/router.ts` / `apps/api-server/src/stripe-support.ts` accepts `userId: null` (guest support). | Spec 009 now forbids guest support on any platform; the gate makes every supporter signed in (C6). Owned by 009. |
| Roadmap text | `docs/roadmap/mvp.md` says "Add email OTP only at the persistence gate … Implemented". | Out of date after C3/C4 and this spec; update when this spec is planned. |

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A person with picks can go from the gate to the name step in under 2 minutes, excluding time waiting for the email.
- **SC-002**: A returning person with a password can sign in from the gate in under 30 seconds.
- **SC-003**: In testing, 100% of picks and selected fixes on the device before signup are present in the account afterwards, each with the content version it was made under; for returning accounts, 100% of both the saved and the device picks are present.
- **SC-004**: An independent review of everything sent from opening the gate to confirmation finds no pick, fix or pain content before the code is accepted, and finds that what is sent at confirmation matches the on-screen list exactly.
- **SC-005**: An independent review finds no screen or message on the code or password routes that differs depending on whether an account exists.
- **SC-006**: 100% of accounts created without ticking the box have no email consent recorded and receive no update emails.
- **SC-007**: The founder can read the share of visits that reach the gate and sign up from the stage funnel, without any per-person data.
- **SC-008**: No account is duplicated for the same email.

## It Checks *(mandatory)*

### Privacy

- **Before signup, stays on device**: every pick, every selected fix, which pains were opened or selected, the content versions, and the opt-in choice until the account is confirmed.
- **Before signup, sent** (coarse totals / stage funnel only, disclosed in UI): the stages "reached the gate" and "signed up" (stage list owned by the measurement spec), with the in-memory visit ID only. When the person continues on the gate, their email is sent to send the code; when they use the password link, email and password are sent to sign in.
- **Sent at signup, once the code is accepted** (listed on the gate): picked dreams with the pain each was picked under and the content version; selected fixes with the content version; the opt-in choice and wording version. Not sent: opened or selected pains, help interests, the draft's last-changed time.
- **After signup, stored on server**: the account (email, name, sign-in methods, consent record) and the saved picks and selected fixes. Edits auto-save there.
- **On the device after signup**: no copy of the picks; the signed-in session only.
- **Never public by default**: the email, name, consent record, and every saved pick and selected fix. Admin sees totals only, never individuals (features.md §6).
- **No stable anonymous identity**: the pre-signup visit ID MUST NOT be linked to the account.

### Honest Status

The gate shows no fixes. Its copy MUST be honest about why an account is needed and MUST NOT imply that signing up costs money, that support is expected, or that It is a charity. Support (009) follows and must remain skippable.

### Must Not Block

- **Personal story (soon)**: picks keep the content version and the pain they were picked under.
- **Sharing a future or path (soon)**: saved picks are private; sharing will be an explicit act on a separate copy.
- **Invitations (optional)**: the account can later record who invited whom without exposing the inviter's picks.
- **Native iOS app (optional)**: code, password and passkey sign-in must all be possible in the iOS app (the existing native client stores the session in secure storage); no web-only sign-in method.
- **Starting from a dream (soon)**: a saved pick allows a dream without a parent pain later; the pain link is recorded when present.
- **Finer-grained email permissions (later)**: the consent record is per kind of email (only "updates" now), so more kinds can be added.
- **Self-serve deletion and an opt-in setting (later)**: nothing here prevents adding them to an account area.

### Accessibility

- Keyboard: every field, the checkbox, "send another code", the password link, "back" and the passkey option are reachable and usable by keyboard with a visible focus outline; Enter submits the current step.
- Screen reader (incl. expanded/collapsed state): the "what will be sent" list is real text; the checkbox announces checked/unchecked; errors are announced as alerts and tied to their field; the code field supports one-time-code autofill and password fields support password managers.
- Reduced motion: the saving state uses no motion that cannot be turned off (relevant if the watercolor loader, spec 007, is used here).
- Meaning never by colour alone: errors are marked with text, not only colour.

### Research Questions

- How much does required signup after two pages cost compared with optional signup, for a small, mission-led product? (founder's review line: about 50% drop-off)
- How many people add a password or passkey after signup when offered, and does it change how often they come back?
- What share opt in to update emails when the box is unticked, and does a plain label change that?
- What should a "what we send" summary at a signup gate say so that people read and trust it?

## Dependencies and Conflicts With Other Specs

- **001 personal page** (on master): refers to signup as "spec 003" and uses "I'd use this" wording. Follow-up (not done here, 001 is on master): update its references to 008 and rename to "selected fixes". Its FR-014 stage list moves to the measurement spec. 001 defines a pick as a dream for a pain, which the current draft shape does not store (FR-018).
- **002 societal page** (not yet written): owns the "go on" control that leads to the gate.
- **Measurement spec** (new, not yet written or numbered): owns the stage list, including this spec's two stages.
- **009 support page**: follows the name step; forbids guest support on any platform (C6). Its thank-you or skip leads to 011.
- **010 privacy page**: the gate links to it, and its "what we send" list must match FR-018. Owns deletion by email request with a response time, the minimum age (16), and the shared footer/menu links.
- **011 Help build It**: post-signup only; retires `ways-to-help.tsx` and the pre-signup help interests.
- **012 entry links**: `/p/<slug>` single pain pages make the same device picks, saved at signup; signed-in visitors see saved picks there and edits auto-save.
- **007 watercolor loader** (other branch): may be used for the saving state; must respect reduced motion.

## Assumptions

- The existing code limits (8 digits, 10 minutes, 5 attempts, codes stored hashed, rate limiting on) are acceptable for v0.1.
- Sessions follow the auth provider's defaults (stay signed in on the device until sign-out or expiry).
- Production email sending (SMTP provider and sender) is an open implementation decision in decisions.md; this spec needs it but does not choose it.
- Web is the v0.1 platform; iOS must not be blocked.
- No social or third-party sign-in in v0.1.
- Picks stay on the device until a save succeeds, so a failed save loses nothing.
