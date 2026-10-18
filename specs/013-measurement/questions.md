# Open questions: 013 measurement

For founder review. Each question has options and a recommendation. The spec is written to the recommendation where it says "(Qn)"; the three `[NEEDS CLARIFICATION]` markers in `spec.md` are Q2, Q4 and Q5.

## Q0. Spec number — ANSWERED: 013 (founder, 2026-10-18)

Numbers are assigned by hand. 011 (Help build It) is reserved for the assessment on `assess/help-page`; 008–010 and 012 are taken.

- A. 013 (this branch: `spec/013-measurement`, directory `specs/013-measurement`).
- B. Another number.
- **Recommendation**: A.

## Q1. What "coarse aggregate counts" means, and the stages after signup

AGENTS.md allows "coarse aggregate counts plus a per-visit stage funnel" before signup. Two things to settle:

1. Are the counts only totals derived from the funnel (visits per week, visits per stage), or are there other counters (e.g. page views)?
   - A. Derived from the funnel only (FR-005).
   - B. Separate page-view counters as well.
2. Gate, signup, Support and Help stages happen after signup starts. 008 and 009 already assume the same rules apply.
   - A. Same rules (in-memory visit number, no credentials, never linked to the account); add one line to decisions.md saying so.
   - B. Same rules, no decisions.md entry.
- **Recommendation**: 1A, 2A. Fewer kinds of data, one rule to explain.

## Q2. How precise are stored times? *(spec FR-010)*

A precise time on "signed up" or "supported" could be matched to the account's creation time or the support record, which would link the visit to a person.

- A. Week only, for every stage.
- B. Day for every stage.
- C. Day, except "signed up" and "support completed" coarsened to the week.
- **Recommendation**: A. Simplest to explain and to check; launch volumes make daily numbers noisy anyway.

## Q3. How long are per-visit records kept?

Per-visit records are what make "of visits that picked a dream, how many reached the gate" possible. Weekly totals per stage are kept after they are deleted.

- A. 30 days.
- B. 90 days.
- C. Kept indefinitely.
- **Recommendation**: B (FR-011). Enough to compare before and after a change; C conflicts with "no session history".

## Q4. Returning sign-ins on the gate *(spec Stage List)*

People with an account sign in through the same gate. Without their own stage, they look like visits that reached the gate and left.

- A. No stage; accept the distortion.
- B. A separate `signed-in` stage, with the same rules as `signed-up`.
- C. Count them as `signed-up`.
- **Recommendation**: B.

## Q5. Help build It stages *(spec Stage List rows 16–18)*

011 is not written. The assessment leaves the stage name to this spec (decision.md "Still open" 10). Counts per ask come from saved offers in 011 admin, not from measurement.

- A. `help-reached`, `help-offered` (at least one offer), `help-skipped`.
- B. A, plus `help-background-given` (person filled in background or skills).
- C. `help-reached` only.
- **Recommendation**: A now; revisit when 011 is specified.

## Q6. Can people turn counting off?

- A. A counting-off control on the privacy page, kept on the device and not sent, and respect Global Privacy Control (FR-016).
- B. Respect Global Privacy Control only.
- C. Neither; nothing personal is sent.
- **Recommendation**: A. Cheap, and it matches "tell people, then let them choose". Note: the off choice is stored on the device, but it holds nothing about the person's picks.

## Q7. Small-number suppression in admin

- A. Cells below 5 show "fewer than 5" (FR-018).
- B. Below 10.
- C. No suppression; admin is founder-only.
- **Recommendation**: A. Keeps a single sign-up in a quiet week from being identifiable if a screenshot is shared.

## Q8. Splits in the report

- A. Platform only (web / iOS app).
- B. Platform plus browser family.
- C. No splits.
- **Recommendation**: A. Anything finer adds fields that edge toward fingerprinting.

## Q9. Personal and societal stages: separate or shared?

001's list was written for one page. The societal page (002) repeats the same steps.

- A. Separate stages per page (rows 2–10, as written).
- B. Shared stages ("first pain opened" on either page).
- **Recommendation**: A. It shows whether the societal page loses people, at the cost of four extra rows.

## Q10. Confirm: Support stages are unlinked and carry no amount (009 Q16)

009 FR-026 assumed this "like the other stages (confirm in review)".

- A. Confirm: unlinked from the account, no amount, cadence or payment reference (FR-004, FR-007).
- B. Allow cadence (once / monthly / annual) on `support-completed`.
- **Recommendation**: A. Support totals by cadence already exist in 009's own records for signed-in supporters.

## Follow-ups outside this spec (not done here)

- 001 FR-014, Privacy section and SC-006: point to 013's Stage List; "first idea seen" → `personal-first-fix-seen`; "I'd use this" → "selected fixes".
- 008 FR-028 and Dependencies, 009 FR-026 and Dependencies, 010 FR-005 and Dependencies, 012 FR-020 and Dependencies, and the `assess/help-page` decision.md: replace "measurement spec (new, not yet written)" with 013 once the number is confirmed.
- 010: add the counting-off control (Q6) to the privacy page.
- 006 admin: place the funnel report.
