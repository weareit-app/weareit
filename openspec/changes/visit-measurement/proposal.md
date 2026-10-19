# Proposal

## Why

It cannot tell where visits stop, which pain pages draw people, or what an account holder explored before signing up, so the founder cannot improve the pages or later personalise fixes ("This project needs to be treated like science", 2026-10-19). Spec 013 (all questions answered 2026-10-19) and the changed measurement invariant in AGENTS.md and `docs/architecture/decisions.md` define exactly what may be counted; today nothing is (baseline `on-device-choices` even forbids it).

## What Changes

Measurement has no screen of its own. What people see and do (features.md §1 "the page says what is sent", §3 sign up, §6 admin):

- **Personal and societal pages, pain pages**: look and work exactly as before. Behind the scenes the app counts which steps this visit reaches (the stage list below), each page shown (each pain page by which pain), and each pain opened (once per pain per visit, by which pain). Picks and selected fixes are never sent before signup. Nothing is stored on the device for this; a reload or a new tab is a new visit. If counting fails or is blocked, nothing changes for the person.
- **Before anything is sent**: the page has already told the person what is counted. The wording (the one-line note on pre-signup pages and "What we count" on the privacy page) belongs to the privacy change; this change does not switch sending on in a release that lacks it.
- **Signup gate**: its "what will be saved" list gains one line: the pages, pains opened and steps of this visit. Signing up or signing in links this visit (and only this visit) to the account. A visit that starts already signed in is linked from the start.
- **Account deletion** (when it exists): the account's visits are unlinked and kept as visits with no account.
- **Founder (admin)**: a funnel report (visits reaching each stage per day or week, and as a share of that period's visits), views per page including each pain page, and opens per pain, filterable by platform and date range, with real counts and one line saying reloads split visits and blocked requests are missed. Where it lives is open question 2.

The stage list (20 stages, owned here; spec 013's table): visit started; personal page opened, first pain opened, first dream picked, first fix seen, moved on; the same four for the societal page plus societal page opened; gate reached; signed up; signed in; Support reached, completed, skipped; Help build It reached, background given, offered, skipped. Help stages and the pain-page, Help and FAQ page views are listed but only sent once those pages exist.

Out of scope: the privacy page and note wording (privacy change, spec 010); pain pages themselves (spec 012); the Help build It page (011); account deletion itself; any counter beyond the lists here; recording how a visit arrived (link, referrer, tracking tags), which stays unrecorded.

Must leave room for (features.md Stages): personalised fixes (linked records stored per account), native iOS app (same lists, no platform analytics or advertising identifiers), starting from a dream (a new stage or page added here), invitations (an "arrived by invitation" stage would carry no inviter), sharing a future (a shared page counts as a page view of its kind only).

Conflict noted, not decided here: features.md §1 and §2b still say "coarse totals" and "arriving by link counts ... nothing more"; they predate the 2026-10-19 decision, which wins (per AGENTS.md).

## Capabilities

### New Capabilities
- `measurement`: what It counts per visit (stage list, page views, pain opens), the in-memory visit number, what each message may contain, how the server validates and keeps records, linking the signup or sign-in visit to an account, unlinking on account deletion, disclosure before sending, never blocking the person, and the founder's report.

### Modified Capabilities
- `on-device-choices`: "Nothing sent before signup" changes: choices still never leave the device before signup, but the disclosed measurement (stages, page views, pain opens) may be sent.
- `account-signup`: signup and sign-in link the current visit to the account, and the gate lists that visit's pages, pains opened and steps among what is saved.

## Impact

- App (`apps/app`): an in-memory visit module and a measurement sender (no device storage), hooks in `PainExplorer` (pain opened, first dream picked, first fix seen, moved on), page-view hooks in the root layout or each listed route, gate/sign-in hooks attached to required-signup-gate's `gate-reached` / `signed-up` emitter, a disclosure switch.
- Shared: the stage list and page-view list in `packages/domain` (no Expo or UI imports), so the app, the server and the privacy page use one source; `measurement.record` (unauthenticated, no cookies) and `measurement.linkVisit` (authenticated) in `packages/api/src/contract.ts` with Zod inputs.
- API server and database: new migration (after required-signup-gate's `006_signup_gate`) for visits, stage records, page views, pain opens and visit–account links; no network address or browser description stored; founder-only report query.
- Depends on required-signup-gate (gate, sign-in link, Support skip, emitter) being applied first.
- Docs: none required; the invariant was already recorded in `docs/architecture/decisions.md` (2026-10-19).

## Open questions

Numbered to match `confirm.md`, where each has options and a recommendation.

1. When may sending be switched on in production?
2. Does this change build a minimal founder-only report (behind the existing CMS admin token), or wait for the admin change (006)?
3. Does signing in from the page-top "Sign in" link (added by required-signup-gate) count as `signed-in`, and does it count as `gate-reached`?
4. The stage list: use spec 013's 20 stages (including `signed-in` and `help-background-given`), although one brief called it an 18-stage list?
5. required-signup-gate's "What will be saved" ("nothing else on the device is sent") and "Signup privacy" ("Opened ... pains SHALL NOT be sent") contradict this change: amend that change before it archives?
6. Pain IDs can still be renamed in the content editor, which would split a pain's history: block renames here, or leave it to the change that freezes IDs?
7. Which signed-in pages count: only the listed ones (`gate` = gate, code and password steps; name step, "You're all set" and account screen not counted)?
