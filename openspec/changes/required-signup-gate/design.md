# Design

## Context

See proposal.md for why. Current state (from `openspec/specs/account-signup`):

- `apps/api-server/src/auth.ts` runs Better Auth 1.7.8 with the `expo` and `emailOTP` plugins (8 digits, 10 minutes, 5 attempts, hashed), `emailAndPassword: { enabled: false }`, and Better Auth's default rate limiting. Codes go out through nodemailer when `SMTP_HOST` is set, and are logged in development.
- `apps/app/app/save-progress.tsx` signs in by code, creates the user with name "It explorer", then calls `account.saveOnboarding` with the whole draft and one content version.
- `saveUserOnboardingDraft` (`packages/database/src/content-repository.ts`) validates every ID against that one version, rejects the whole save on any mismatch, and upserts one JSON draft per user into `user_onboarding_drafts` (overwrite).
- The on-device draft (`packages/domain/src/onboarding.ts`, `apps/app/src/state/onboarding-store.ts`) has pains, dreams, per-pain paths `{painId, dreamIds, fixIds}`, `helpInterests` and `draftUpdatedAt`, stored under `it-onboarding-draft-v1`.
- There is no account screen, no menu, and no privacy page.

## Goals / Non-Goals

**Goals:**
- Picks stored per item with the content version they were made under, so saves from different devices and versions combine without loss.
- One semantic API for picks, used both at signup and for auto-saving after signup.
- Better Auth stays the only auth system; no custom crypto.

**Non-Goals:**
- Measurement transport or visit linking (spec 013's change).
- Choosing the production email provider.
- Native iOS passkeys (needs associated domains and an App Store build).

## Decisions

1. **Store picks as rows, not one JSON draft.** New tables: `user_dream_picks (user_id, scope, pain_id, dream_id, content_version, picked_at)` and `user_fix_selections (user_id, scope, pain_id, dream_id, fix_id, content_version, selected_at)`, each with a unique key on the identity columns so combining is an upsert that ignores duplicates. Fixes keep their pain → dream path, which leaves room for explicit paths and the personal story (features.md Stages). *Alternative:* merge JSON drafts in place; rejected because per-version validation and per-item auto-save get awkward. The existing `user_onboarding_drafts` rows are left untouched (no production data) and the table is dropped in a later cleanup.

2. **Semantic operations.** Replace `account.saveOnboarding` with `account.savePicks({ contentVersion, picks: [{scope, painId, dreamId, fixIds[]}], optIn: {chosen, wordingVersion} })` (combine) for signup, and `account.pickDream`, `account.unpickDream`, `account.selectFix`, `account.unselectFix` plus `account.getPicks` for signed-in pages. Inputs validated with Zod in `packages/api`. Each pick is validated against the content version it claims; unmatched items are dropped and logged, the rest stored (founder, 2026-10-19).

3. **Auth configuration.** Enable `emailAndPassword` with a 12-character minimum and no other rules, with password sign-up turned off so new accounts can only be created through the email code (confirm the 1.7.8 option name; if none exists, block the sign-up-with-password endpoint). Passwords are added later from the account screen through Better Auth's set-password endpoint. Add the `haveIBeenPwned` plugin (ships in `better-auth/plugins` 1.7.8) and `@better-auth/passkey` pinned to 1.7.8, web only. Use Better Auth's built-in rate limiting with a custom rule for the code-request endpoint: 5 per email per hour plus a per-IP window. Record the password hash algorithm and parameters (Better Auth's default) in `docs/architecture/decisions.md`, as the 2026-10-17 entry requires.

4. **Opt-in and name.** Add `user.updates_opt_in boolean`, `user.updates_opt_in_wording text`, `user.updates_opt_in_at timestamptz` via migration `006_signup_gate`. Make `user.name` nullable at creation (stop sending "It explorer"); the name step sets it, and the app routes any signed-in user without a name to the name step.

5. **Email boundary.** Move sending behind one `sendEmail({ to, subject, text })` function in the API server; nodemailer stays the development and SMTP implementation, so a provider (leaning Postmark) can be plugged in without touching auth.

6. **Routing.** New routes: `/signup` (gate + code + password variant), `/welcome/name`, `/account`, `/privacy`, `/all-set`. `/save-progress` and `/ways-to-help` redirect (`/save-progress` → `/signup`, `/ways-to-help` → `/`), `/onboarding/futures` → `/onboarding/world`. A signed-in user hitting `/signup` is taken past it. A small header with "Sign in" (signed out) or a menu (signed in) is added to the shared page chrome.

7. **Device draft lifecycle.** The store gains a `syncToAccount` step: after `savePicks` confirms, clear the draft. While signed in, the pain explorer reads picks from `account.getPicks` via TanStack Query and writes through the per-item operations, with optimistic updates. Signing out clears the query cache and any account data held in memory or storage. The draft schema drops `helpInterests` (old drafts load with it stripped).

8. **Gate moments.** Expose two typed events (`gate-reached`, `signed-up`) from a tiny app-side emitter with no subscribers yet; the measurement change attaches to it.

## Risks / Trade-offs

- [Combining forever means picks can only grow on sign-in] → Signed-in pages let people unpick; combine only runs when a device draft is saved.
- [HaveIBeenPwned outage blocks setting a password] → Fail closed with a clear "try again later" message; code sign-in keeps working.
- [Passkey conditional UI support varies by browser] → It is an extra; code and password always work.
- [Auto-save on a flaky connection] → Optimistic update with rollback and a quiet error; TanStack Query retries.
- [Required name could feel like friction] → One field, shown once, with the faster-sign-in line.

## Migration Plan

- Migration `006_signup_gate`: pick tables, opt-in columns, passkey table (from the plugin's schema), nullable name. No production data exists, so no backfill.
- Deploy API first (new operations alongside the old one), then the app; remove `account.saveOnboarding` once the app no longer calls it.
- Rollback: revert the app; the API keeps the old operation until removal.

## Open Questions

- Exact wording of every new screen (founder writes or approves); placeholders are marked in code.
- Which provider replaces SMTP in production (leaning Postmark).
