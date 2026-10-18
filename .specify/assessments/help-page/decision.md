# Decision: Help build It (features.md §5)

- **Slug**: help-page
- **Decided**: PENDING. Prepared 2026-10-17; updated 2026-10-18 with the founder's answers. **Not signed off.**
- **Verdict**: _founder to sign off: go | needs-clarification | kill_. **Recommendation: go on Option A, awaiting founder sign-off.**
- **Artifacts reviewed**: intake.md | research.md | problem.md | concept.md | questions.md (all 18 answered 2026-10-18)

This file stops at the gate. It does not hand off to `/speckit-specify`. Spec number **011** is reserved for this feature. No `specs/011-*` directory has been created.

## What the founder's answers select

The founder's answers (2026-10-18) select **concept Option A, the full flow**: background → suggested ESCO skills → matched asks. The founder accepts that this is over the one-week budget. This replaces the assessor's earlier recommendation (needs-clarification, then Option B). The full scope is in `concept.md` → "Founder selection" and in the handoff draft below.

## Scorecard (updated for Option A and the answers)

| Criterion | Rating | Justification |
|-----------|--------|---------------|
| Problem validity | adequate | The gap is real: the current interests screen collects vague categories with no asks or follow-up. Structured Help answers are needed by the thing-type-relation rule and the "soon" matching guardrail. The founder has now named four goals, including testing the matching. Support is still the primary v0.1 goal. |
| Evidence strength | weak | Unchanged. There is no user signal on wanting to offer help, and outside prior art warns about follow-up cost. Going ahead rests on founder judgment and Homefront experience. Launch measures (offer rate, asks with offers, follow-up rate) are how it gets tested. Under the strict assess rule, weak evidence blocks go. The founder can override this, as was done for it-mvp. |
| Value vs. inaction | adequate | Option A gives the most structured data for "soon" matching and a direct test of matching. Inaction would leave Support intact but lose recruiting, structured data and the test. |
| Feasibility / appetite | weak | Option A is medium (1–2 weeks) on top of the other core screens, and the founder has accepted that. The uncapped skill suggestions, a second (education) list, edited ESCO labels, per-ask skill mapping and an account view for offers all add scope. |
| Strategic fit | strong | It follows the founder's answers, the privacy invariants (post-signup only, nothing public, contact limited to the offer made), honest status (asks labelled; offers never shown as matched by a human until they are) and the decisions.md rule to store Help answers as ESCO references. |
| Risk posture | adequate | Up from weak. The main risk (offers nobody answers) is now handled by honest no-promise copy and admin "followed up" marks. The naming clash is settled ("Help build It"), and consent is settled (offering implies consent, said plainly). Remaining risks: an uncapped skills list that overwhelms people; empty matches; the ESCO licence for edited labels; schedule slip from the medium appetite. |

## Options at the gate

### Go on Option A (recommended, awaiting founder sign-off)
Hand off to `/speckit-specify` as spec 011 using the draft below. The "Still open" items below are spec-level questions for `/speckit-clarify`, not gate blockers. Signing off means accepting weak evidence on founder judgment, with launch measures as the check.

### Needs-clarification
Only if the founder wants something below settled before specifying. The likeliest candidates are the education list and the licence check. Revisit stage: shape.

### Kill (Option E: drop §5 from v0.1)
This would contradict the founder's answers (Q2, Q3), so it is listed only for completeness.

## Verdict & Rationale

_Not decided; awaiting founder sign-off._ The assessor recommends go on Option A. Every gate question has a founder answer. The main risk has a mitigation the founder chose. The remaining unknowns can be settled in specification. Evidence strength stays weak, and the go rests on an explicit founder override recorded at sign-off.

## Still open (carry into specify or clarify; none answered here)

1. **Education list**: which one (ESCO has none; ISCED levels or fields are candidates), and its licence.
2. **Licence check**: ESCO terms for edited labels and merged skills, including the O*NET-derived parts, and the exact "modified from ESCO" notice wording.
3. **Skill-to-ask mapping**: who authors which skills each ask needs. Does AI draft it with the ask, for founder approval?
4. **Empty or weak matches**: what a person sees when no ask matches. Proposed: show the other asks.
5. **Uncapped skill suggestions**: ordering, grouping and bulk confirm/remove when several background entries each bring dozens of skills.
6. **How many asks at launch**, and when the founder approves them.
7. **Account view for offers** (Q16): which spec owns the account area (it is shared with 009's persistent "Support It" link and 010's menu).
8. **Free-text box**: length limit, and whether admin sees it alongside the structured answers. (Privacy rules apply: never public.)
9. **FAQ page owner**: proposed 010, not yet assigned.
10. **Funnel stage name** for Help: owned by the new, not-yet-numbered measurement spec.
11. **Follow-ups outside this lane**: update spec 001's "005 help" reference to 011 and record the 008–012 mapping in features.md; rename "I'd use this" to "selected fixes" in 001 and other specs.

## If go — Handoff draft for `/speckit-specify` (spec 011; not yet triggered)

- **Problem**: Signed-up people have no concrete way to offer their background, skills and time toward what It needs. It has no structured record of who could help with what, and no test of whether background → skills → asks matching works.
- **Chosen approach**: Option A, "Help build It".
  - **Flow**: signup → required name step (008) → Support (009) → Help build It. Support and Help are both skippable, and Support's thank-you or skip leads here. Post-signup only.
  - **Background**: jobs, education, volunteer experience and other experiences. Structured lists where possible (ESCO occupations, a chosen education list), plus an optional short free-text box. No crisis prompt.
  - **Skills**: ESCO essential skills suggested from the background, no cap. The person confirms or removes them. Stored as ESCO references with original URIs, even where labels were edited or skills merged.
  - **Asks**: AI-drafted, founder-approved CMS content with stable IDs and honest labels. Not limited to the prioritised roadmap. Seeded with the retired `ways-to-help.tsx` items. Matched to confirmed skills.
  - **Offer**: the person ticks the asks they'd help with and submits. The page says plainly that submitting means It may contact them about it, and shows "We'll reach out if one of these needs you now. We can't reply to everyone."
  - **Account**: a view listing the person's offers, where they can change or withdraw them.
  - **Admin (with 006)**: counts per ask, individual offers, "followed up" marks.
  - **Copy**: inline "why we ask / what's stored", and a "modified from ESCO" attribution notice.
  - **Terminology**: "selected fixes", never "I'd use this".
- **In scope**: background pickers and free text, ESCO and education lists with attribution, skill suggestions, matching asks to skills, ask content type in the CMS, offer storage on the account, offer change and withdraw, admin follow-up, retiring `ways-to-help.tsx` and `helpInterests`.
- **Out of scope**: matching people to people ("soon"); volunteer operations; public helper data; asks before signup; crisis resources and the report button (deferred past v0.1); the privacy page, FAQ page and contact email (010); support management (009).
- **Success metrics**: offer rate at the Help stage; share of suggested skills people keep (a matching test); share of offers on matched asks vs other asks (a matching test); asks with at least one offer; follow-up rate.
- **Carried-forward open questions**: the "Still open" list above.
- **It checks for the spec template**: privacy (post-signup; nothing public; contact only about the offer made; free text never public); honest status (asks labelled; an offer is never shown as matched until a human matched it); must-not-block (ESCO URIs for "soon" matching; stable ask IDs for thing-type-relation); accessibility (searchable pickers, keyboard support, long skill lists usable with a screen reader); research questions (education list, ESCO licence, skill-list UX).

## Overlaps with other in-flight lanes

- **008 signup**: Help follows the required name step. 008 does not send help interests at signup, which matches retiring `helpInterests`. The signup updates opt-in is separate from Help's implied contact consent.
- **009 support**: Support's thank-you or skip leads to Help. "Manage support" stays in 009 (Stripe portal). The account area that holds 009's persistent "Support It" link may also hold the Help offers view (Still open 7).
- **010 privacy page**: now privacy only; the safety floor is deferred past v0.1. It owns the footer contact email, and the FAQ page is proposed for it. Its privacy copy should describe what Help stores (background, free text, skills, offers) and that offering means It may contact you. Use "selected fixes" terminology.
- **Also**: 006 admin (offers, counts, follow-up marks); the new measurement spec (Help funnel stage); thing-type-relation rules (stable IDs; ESCO references).
