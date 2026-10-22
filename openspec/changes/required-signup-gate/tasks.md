# Tasks

Tasks marked *(after launch)* wait until after the Nov 2 web launch (moved from Oct 26) (see proposal.md, "Launch scope").

## 1. Data model

- [ ] 1.1 Write migration `006_signup_gate`: `user_dream_picks` and `user_fix_selections` with unique identity keys and `content_version`; opt-in columns on `user`; nullable `user.name`; passkey table from the passkey plugin schema *(after launch)*
- [ ] 1.2 Update `packages/database/src/types.ts` for the new tables and columns
- [ ] 1.3 Add repository functions: combine picks (validate each against its content version, drop and log unmatched), get picks, pick/unpick dream, select/unselect fix, record opt-in; with tests for union, duplicates and unmatched picks

## 2. Shared contracts and domain

- [ ] 2.1 Drop `helpInterests` from the draft schema in `packages/domain/src/onboarding.ts`, keeping old stored drafts loadable (strip the field); add the signup payload schema (picks with pain, selected fixes, opt-in with wording version)
- [ ] 2.2 Add `account.savePicks`, `account.getPicks`, `pickDream`, `unpickDream`, `selectFix`, `unselectFix` and `setName` to `packages/api/src/contract.ts` with Zod inputs, and implement them in `router.ts` behind `requireUserId`
- [ ] 2.3 Router tests: signed-out calls fail with UNAUTHORIZED; payload never accepts pains, help interests or timestamps

## 3. Auth

- [ ] 3.1 Move email sending behind one `sendEmail` boundary in the API server (nodemailer as the SMTP/dev implementation)
- [ ] 3.2 *(after launch)* Enable email + password sign-in with a 12-character minimum and password sign-up turned off; add the `haveIBeenPwned` plugin
- [ ] 3.3 *(after launch)* Add `@better-auth/passkey` pinned to the Better Auth version (web only) and its client plugin on web
- [ ] 3.4 Configure rate limits: 5 code requests per email per hour plus a per-IP window; map limit errors to "Try again in a few minutes."
- [ ] 3.5 Stop sending a placeholder name at sign-up
- [ ] 3.6 Auth tests: code-only account creation and rate limit hit at launch; *(after launch)* password sign-in after setting one, short and breached passwords refused
- [ ] 3.7 *(after launch)* Record the password hash algorithm and parameters in `docs/architecture/decisions.md`; pin new packages in `docs/architecture/dependency-policy.md`

## 4. Signup screens

- [ ] 4.1 Build `/signup`: email field with passkey autofill on web, the "what will be saved" list, unticked opt-in (placeholder label), terms line linking to `/privacy`, no "Not now"
- [ ] 4.2 Build the code step (neutral wording, eight-digit code; the "Use a password" variant is *after launch*) and error states, including the rate-limit message
- [ ] 4.3 Build `/welcome/name` (required); the "Want a faster way back? Add a passkey or password" line linking to `/account` is *after launch*; route any signed-in user without a name here
- [ ] 4.4 Build `/all-set`; wire Support so skip, success and cancel lead to `/all-set`
- [ ] 4.5 Redirect `/save-progress` → `/signup`, `/ways-to-help` → `/`, `/onboarding/futures` → `/onboarding/world`; delete the old screens
- [ ] 4.6 Societal page "Continue"/"Skip" go to `/signup` (or past it when signed in)

## 5. Account, menu and privacy

- [ ] 5.1 Add shared page chrome: "Sign in" link when signed out, a menu when signed in (email and "Sign out" only at launch)
- [ ] 5.2 *(after launch)* Build `/account`: name (editable), email, set/change password, add passkey (web only), sign out
- [ ] 5.3 Build `/privacy` placeholder: on-device data, exactly what signup sends and stores, session IP/browser data until the session ends, HaveIBeenPwned, 16+, placeholder notice

## 6. Picks after signup

- [ ] 6.1 After `savePicks` confirms, clear the device draft; on failure keep it, retry, and show the "still safe on this device" message
- [ ] 6.2 Pain explorer reads picks from `account.getPicks` when signed in and writes through the per-item operations with optimistic updates
- [ ] 6.3 Hide the clear-choices control and the "kept on this device" count when signed in
- [ ] 6.4 Signing out clears the query cache and any cached account data; pages start empty
- [ ] 6.5 Add the `gate-reached` / `signed-up` emitter with no subscribers

## 7. Verification

- [ ] 7.1 Unit and router tests pass; typecheck and lint pass
- [ ] 7.2 Playwright: signed-out person goes personal → societal → gate (no way around it) → code (from dev log) → name → Support → skip → all set; picks visible after signing in on a fresh browser
- [ ] 7.3 Playwright: returning account on a new browser with different picks ends with the union
- [ ] 7.4 Keyboard and screen-reader pass on gate, code, name and (after launch) account screens; reduced motion respected
- [ ] 7.5 Compare `/privacy` and the gate's list against the actual `savePicks` payload

## Workflow follow-up

- Founder approves final copy for gate, opt-in label, name step, all-set screen and privacy placeholder
- Choose the production email provider before going live
- Archive with `/opsx:archive` once shipped, then fill the `specs/008-signup-gate/` row in `docs/spec/MIGRATION.md`
