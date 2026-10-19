# Tasks

Prerequisite: required-signup-gate is applied (gate, sign-in link, Support skip, `gate-reached` / `signed-up` emitter, migration `006_signup_gate`). Resolve confirm.md items 2, 3 and 7 before groups 5–6.

## 1. Shared lists and schemas

- [ ] 1.1 Add `packages/domain/src/measurement.ts` with the 20-stage list (name, scope, owner, page it needs), the page-view list and a strict Zod message schema; verify with unit tests that unknown fields, stages and page kinds are rejected and that the module imports no Expo, React Native, UI or provider code
- [ ] 1.2 Add `measurement.record`, `measurement.linkVisit` and `measurement.report` to `packages/api/src/contract.ts` with Zod inputs; verify the contract type-checks and `record` accepts no session-dependent fields

## 2. Storage

- [ ] 2.1 Write migration `007_measurement`: stage, page-view and pain-open tables (with per-visit uniqueness for stages and pain opens), `visit_account_links` with one account per visit and cascade on the link row only, no IP or user-agent columns; verify by running migrations up and down locally
- [ ] 2.2 Update `packages/database/src/types.ts` and add repository functions (record stage/page view/pain open with server receive time, link visit, unlink by account, export by account, report aggregates); verify with database tests for duplicate stages, duplicate pain opens, second-account link refused, deletion leaving records unlinked and totals unchanged, and export completeness

## 3. Receiving server

- [ ] 3.1 Implement `measurement.record` in `router.ts`: validate against the lists and the set of pain IDs in any published version, ignore any session, store with receive time, reject and drop everything else; verify with router tests (unknown stage, extra field, unknown pain ID, no session read)
- [ ] 3.2 Implement `measurement.linkVisit` behind `requireUserId`; verify signed-out calls fail with UNAUTHORIZED and records already stored and later records both read as linked
- [ ] 3.3 Implement `measurement.report` behind the CMS admin token (day/week, date range, platform, real counts, page views per pain ID with current name, opens per pain); verify with tests that three test visits stopping at different stages and two pain pages produce exact counts
- [ ] 3.4 Exclude `measurement.*` request bodies and client addresses from API server logging; verify with a test that a recorded request leaves no address or body in the log output

## 4. App: visit and sending

- [ ] 4.1 Add `apps/app/src/measurement/visit.ts` (random in-memory visit number, sent-stage and opened-pain sets, `startNewVisit`); verify with unit tests that nothing is written to storage, cookies or the URL and that stages and pain opens are sent once per visit
- [ ] 4.2 Add a sender using a separate oRPC link with `credentials: "omit"`, no auth header and `keepalive` on web, swallowing errors with no retry or queue; verify with tests that a failing or blocked request causes no thrown error, no storage write and no added wait
- [ ] 4.3 Add the disclosure switch (`EXPO_PUBLIC_MEASUREMENT_ENABLED`, default off) and the "privacy note shown" gate before the first send; verify that with the switch off no measurement request is made in a full Playwright run

## 5. App: hooks

- [ ] 5.1 Add `useMeasuredPage` to the personal, societal, gate, Support and privacy routes (pain, Help and FAQ routes when they exist); verify with component tests that each listed page sends one page view per showing and unlisted pages send none
- [ ] 5.2 Add stage and pain-open hooks in `PainExplorer` (first pain opened by scope, first dream picked, first fix seen, personal moved on, pain open by ID); verify with component tests, including that no message names a dream or fix
- [ ] 5.3 Subscribe to required-signup-gate's emitter for `gate-reached` and `signed-up`, add a `signed-in` moment, and add Support stages (reached, completed, skipped); verify with tests per stage
- [ ] 5.4 Call `linkVisit` after signup, after sign-in and at app start with a session, and start a new visit when a different account signs in; verify with tests that signup succeeds when `linkVisit` fails and that an earlier visit stays unlinked
- [ ] 5.5 Render the gate's "this visit" line only when the switch is on (placeholder copy marked for founder approval); verify with a component test for both switch states

## 6. Founder report screen

- [ ] 6.1 Per confirm.md item 2, build the founder-only report page (funnel table by period and stage with shares, page-view and pain-open tables, platform and date filters, the one-line caveat about reloads and blocked requests); verify keyboard use of the filters and row/column headers with an accessibility test

## 7. Integration checks

- [ ] 7.1 Playwright run with the switch on: record every request in a full visit (personal → societal → gate → signup → Support skip) and verify each measurement message holds only the allowed fields, carries no cookie, and the account's linked records match the visit
- [ ] 7.2 Playwright run with all measurement requests blocked: verify the same full visit completes with no visible difference and picks are saved
- [ ] 7.3 Verify on the iOS simulator that the same stages and page views are sent with platform "iOS app", the visit survives backgrounding, and no advertising identifier is read

## Workflow follow-up

- Do not turn the switch on in production until the privacy change ships the wording (and confirm.md item 1 is satisfied).
- Archive after required-signup-gate, once its overlapping requirements are reconciled (confirm.md item 5); then update `docs/spec/MIGRATION.md` for `specs/013-measurement/`.
