# Open questions: 013 measurement

For founder review. Q0 was answered on 2026-10-18 and Q1–Q10 on 2026-10-19. The answers are written into `spec.md`, and the original options are kept here as the record. **Still open: Q11, Q12.**

## Founder direction (2026-10-19)

Asked why visits should "not be linked" to accounts, the founder answered: "We already know account information; part of the point of knowing this data is to be able to actually provide personalized fixes for people, so it doesn't make sense to not have this information for people who have accounts. This project needs to be treated like science."

This changes the 2026-10-16 privacy invariant. It is recorded in `docs/architecture/decisions.md` (2026-10-19), and AGENTS.md and constitution II were updated to match.

## Answered

### Q0. Spec number — ANSWERED

Options were: A 013 · B another. **Founder answer**: A, 013.

### Q1. What counts, and stages after signup — ANSWERED

Options were: funnel-derived totals only, or separate page-view counters as well; post-signup stages under the same "unlinked" rules. Recommended funnel only, same rules.

**Founder answer**: Add page-view counters, **per page, including each pain page** (this reverses the per-pain part of 012 FR-020). Post-signup stages are linked to the account (see the founder direction above). → FR-001, FR-008, Page-View List.

### Q2. Precision of stored times — ANSWERED

Options were: A week · B day · C day with "signed up"/"support completed" coarsened. Recommended A, to prevent matching a visit to an account's creation time.

**Founder answer**: Matching to an account's creation time "is perfectly fine". Times are stored as received. → FR-013.

### Q3. How long per-visit records are kept — ANSWERED

Options were: A 30 days · B 90 days · C indefinitely. Recommended B.

**Founder answer**: C, indefinitely. → FR-014.

### Q4. Returning sign-ins on the gate — ANSWERED

Options were: A no stage · B separate `signed-in` stage · C count as `signed-up`. Recommended B.

**Founder answer**: B. → Stage List row 13.

### Q5. Help build It stages — ANSWERED

Options were: A reached / offered / skipped · B A plus background given · C reached only. Recommended A.

**Founder answer**: B. → Stage List rows 17–20, to revisit when 011 is specified.

### Q6. Turning counting off — ANSWERED

Options were: A a control on the privacy page plus Global Privacy Control · B Global Privacy Control only · C neither. Recommended A.

**Founder answer**: C, neither. → FR-018.

### Q7. Small-number suppression — ANSWERED

Options were: no suppression, or hide counts below 5. Recommended no suppression (revised after linking was accepted).

**Founder answer**: No suppression. → FR-021.

### Q8. Report splits — ANSWERED

Options were: platform only · plus browser · plus country. Recommended platform only.

**Founder answer**: Platform only. → FR-022.

### Q9. Separate personal and societal stages — ANSWERED

**Founder answer**: Separate. → Stage List rows 2–10.

### Q10. Support stages: linked, with an amount? — ANSWERED (follows from the founder direction)

009 FR-026 had assumed Support stages were unlinked. They are now linked through the visit. The stages themselves carry no amount or cadence, and research joins those from 009's records through the account. → FR-010.

### Linking scope (asked 2026-10-19) — ANSWERED

Options were: A link only the visit in which signup or sign-in happens · B store a visit ID on the device so all earlier visits link. Recommended A.

**Founder answer**: A. No identifier is stored on the device. → FR-006–FR-008.

## Open

### Q11. Should in-place pain opens and picks be sent as events? *(spec FR-005)*

The founder's reason for linking is personalised fixes. Today, only "first pain opened" and "first dream picked" are sent. Which pains a person opened on the personal page (without picking anything) stays on the device; 008 lists it as "not sent". Picks reach the account at signup anyway.

- A. No change: picks arrive at signup; pain opens stay on the device.
- B. Also send each in-place pain open (by pain ID) as an event, linked at signup like page views.
- C. Send every open, pick and fix selection as it happens.
- **Recommendation**: A. Picks already reach the account. B adds "looked at but didn't pick" data, which is useful for research but sensitive for health-related pains. C breaks "picks stay on the device until signup" (features.md §1).

### Q12. What happens to linked visits when an account is deleted?

- A. Delete them with the account.
- B. Unlink them and keep them as anonymous visits (stages and page views stay in the totals).
- **Recommendation**: B, for continuity of the research totals. Until this is answered, the spec assumes A, which is the safer default.

## Follow-ups outside this spec (not done here)

- **001**: FR-014, Privacy and SC-006 should point to 013's lists. "first idea seen" becomes `personal-first-fix-seen`, and "I'd use this" becomes "selected fixes". The wording "identifier that outlives the visit" needs revisiting now that linking exists.
- **008**: reverse FR-028's "never linked to the account". Add "the pages and steps of this visit" to the gate's list, and send the visit number with signup and sign-in.
- **009**: in FR-026, replace "assumed unlinked (confirm in review)" with "linked through the visit; no amount on the stage".
- **010**: rewrite "What we count", the privacy note, Q37 (lawful basis: linked page views are personal data, and some pain pages may be health data), and account deletion (Q12).
- **012**: reverse the per-pain part of FR-020. How a visit arrived stays unrecorded.
- **assess/help-page**: in decision.md "Still open" 10, point to 013 rows 17–20.
- **006 admin**: place the funnel and page-view report.
- Account linking stays off at launch.
