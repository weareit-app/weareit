# Proposal

## Why

Signup is optional today, so most of what people pick never reaches It, and the save sends more of their on-device draft than the founder wants. The founder decided (C3/C4, confirmed in the 2026-10-19 grilling) that going further after the personal and societal pages requires an account, made with an emailed code first, and that only picks, selected fixes and the opt-in are saved (features.md §3).

## What Changes

What people see and do, in order:

- **Personal and societal pages**: unchanged for browsing. When signed out, a small "Sign in" link sits at the top. "Continue" on the societal page now goes to the signup gate instead of the futures screen.
- **Signup gate** (new, replaces the optional save screen): one email field and "Continue". It lists exactly what will be saved (picked dreams with their pain, selected fixes, the opt-in choice), shows an unticked opt-in "Send me occasional updates about what It is building." (placeholder copy), and the line "By signing up you agree to…" linking to the privacy page. There is no "Not now". On web, the browser may offer a saved passkey on the email field.
- **Code screen**: says a code was sent (same wording whether or not an account exists), takes the eight-digit code, and has a small "Use a password" link for people who set one. Too many requests show "Try again in a few minutes".
- **Name step** (new, required): asks for a name; skipped by returning accounts that already have one. One line offers "Want a faster way back? Add a passkey or password", linking to the account screen.
- **Support**: reached next, as today's Support page. Then a simple "You're all set" screen. (Help build It will slot in here in a later change.)
- **Account screen** (new, from a menu when signed in): name, email, add or change a password, add a passkey (web), sign out.
- **Privacy page** (new, placeholder): what stays on the device, exactly what signup sends and stores, the services involved (including HaveIBeenPwned for password checks), and that It is for people 16 and over.
- **Picks after signup**: an existing account's saved picks are combined with this device's picks; the device copy is cleared once the save is confirmed; signed-in pages read picks from the account and save edits automatically; "clear choices" shows only before signup; signing out removes cached account data.
- **BREAKING (flow)**: the futures screen and the pre-signup ways-to-help screen are retired; help interests are no longer collected. The optional save screen and its "Not now" are removed.

Out of scope: Help build It (own change), measurement and linking visits to accounts (spec 013; this change only leaves room by emitting "reached the gate" and "signed up" moments), the full privacy page (spec 010), choosing the production email provider, passkeys on iOS, the embedded Stripe form (spec 009).

Must leave room for (features.md Stages): personal story of chosen futures (picks keep their content version), sharing a future or path (picks stay private; nothing here creates a shareable copy), invitations (accounts can later record who invited whom), explicit paths (fixes stay stored per pain → dream with stable IDs), native iOS (code and password work on iOS; passkeys follow).

## Capabilities

### New Capabilities
- `account-settings`: the signed-in account screen: name, email, password and passkey management, signing out.
- `privacy-page`: the public page describing what It keeps on the device, what it sends and stores, and who else is involved.

### Modified Capabilities
- `account-signup`: signup becomes required and email-first with code, optional password and web passkey sign-in, a required name step, an opt-in, a terms line, rate limits, and a reduced, combined save.
- `on-device-choices`: the device copy is cleared after a confirmed save, the clear control shows only before signup, and signing out clears cached account data; help interests leave the draft.
- `pain-explorer`: a "Sign in" link when signed out; the societal page continues to the gate; signed-in pages read and auto-save picks from the account.
- `futures-and-ways-to-help`: both screens are removed from the flow.
- `support`: reached after the name step, followed by a "You're all set" screen; no longer linked from pre-signup screens.

## Impact

- App: `apps/app/app/save-progress.tsx` (replaced by gate, code and name screens), new account and privacy routes, `onboarding/world.tsx` (next route), `onboarding/futures.tsx` and `ways-to-help.tsx` (removed), `support-it.tsx` (entry and exit), `pain-explorer.tsx` and `clear-draft-control.tsx`, `state/onboarding-store.ts`, `auth/auth-client*.ts`.
- API server: `apps/api-server/src/auth.ts` (enable email + password, passkey plugin, HaveIBeenPwned check, rate limits, name), an email-sending boundary.
- Shared: `packages/domain/src/onboarding.ts` (draft and save payload), `packages/api/src/contract.ts` and `router.ts` (`saveOnboarding` payload and combine semantics), `packages/database` (opt-in record, passkey table, combine instead of overwrite).
- Dependencies: Better Auth passkey and HaveIBeenPwned plugins (versions to pin); HaveIBeenPwned range API as a new third party.
- Docs: `docs/architecture/decisions.md` (record password hash settings per the 2026-10-17 entry).

## Open questions

- Final copy for the gate, opt-in label, name step and "You're all set" screen (founder writes or approves).
- Production email provider (leaning Postmark); must be chosen before signup goes live.
- Final wording of the 16+ age line and the terms line.
