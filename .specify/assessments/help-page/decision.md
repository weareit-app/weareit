# Decision: Help page (features.md §5)

- **Slug**: help-page
- **Decided**: PENDING — prepared 2026-10-17 for the founder; no verdict has been made
- **Verdict**: _founder to choose: go | needs-clarification | kill_ (assessor recommendation: **needs-clarification**, leading to go on Option B once the blocking questions are answered)
- **Artifacts reviewed**: intake.md | research.md | problem.md | concept.md | questions.md

This file stops at the gate. It does not hand off to `/speckit-specify`. If the verdict is go, spec number **011** is reserved for this feature. No `specs/011-*` directory has been created.

## Scorecard

| Criterion | Rating | Justification |
|-----------|--------|---------------|
| Problem validity | adequate | The gap is real in the repo: the current interests screen collects vague categories with no asks, no consent and no follow-up. The binding thing-type-relation rule and the "soon" matching guardrail need structured Help answers. But the page serves a secondary goal (Support is primary). |
| Evidence strength | weak | No user signal on wanting to offer help (n=1 informal tester on pickers). Prior art (DemocracyLab, Code for Canada) mostly warns about follow-up cost. The founder's Homefront experience is the main support, and it wasn't inspected here. |
| Value vs. inaction | adequate | Inaction leaves Support intact but loses launch recruiting, roadmap communication and structured skill data. Option B captures most of that value for a few days. |
| Feasibility / appetite | adequate | Option B is small (2–4 days, including writing asks). Option A is medium and over budget. Depends on the founder writing asks (Q4). |
| Strategic fit | strong | Product intent says onboarding "communicates the roadmap It is building". decisions.md lists "ways to help It". Option B follows the privacy invariants (post-signup, nothing public, consented contact) and honest status. |
| Risk posture | weak | The main risk, offers that nobody follows up, is named but not yet mitigated: it depends on founder answers to Q7/Q8. The naming clash with crisis help (Q18) is unresolved with lane 010. |

## Options at the gate

### Go — Option B (asks first, structured background, no matcher)
Hand off to `/speckit-specify` as spec 011. Requires answers to Q1–Q4, Q7 and Q8 first. Under the assess rules, evidence strength is weak, so a strict reading forbids go. The founder can override with the reason "founder judgment; validated after launch by the stage funnel and offer counts", as was done for it-mvp.

### Needs-clarification (assessor recommendation)
Answer the blocking questions in `questions.md`, then re-run `/speckit-assess-shape` only if the answers change the option. Otherwise update this file to go.
- **Blocking questions**:
  - [NEEDS CLARIFICATION: Q1 — which meaning of Help]
  - [NEEDS CLARIFICATION: Q2 — what the page must achieve]
  - [NEEDS CLARIFICATION: Q3 — which shape (A–E)]
  - [NEEDS CLARIFICATION: Q4 — who writes the asks, and how many]
  - [NEEDS CLARIFICATION: Q7 — contact consent]
  - [NEEDS CLARIFICATION: Q8 — follow-up promise and copy]
- **Revisit stage**: shape (only if Q1 = "get help" or Q3 ≠ B); otherwise straight to go.

### Kill — Option E (drop §5 from v0.1)
Decisive reason, if chosen: v0.1's primary goal is Support, the evidence for Help demand is weak, and the founder can't commit to writing asks or to follow-up within the launch week. An offer form without follow-up does more harm than none. Keep at most one "Want to help build It? Write to …" line. Retire or leave `ways-to-help.tsx`. Reassess after launch with funnel data. This reverses the founder's 2026-10-16 position that Help stays in v0.1, so it needs the founder's explicit call.

## Verdict & Rationale

_Not decided._ Assessor's reasoning for recommending needs-clarification: the problem is real and Option B fits a small appetite and the strategy. But evidence is weak, and the main risk (follow-up) can only be mitigated by founder commitments (Q4, Q7, Q8) that this assessment must not guess. Once those are answered, Option B is a credible go.

## If go — Handoff draft for `/speckit-specify` (spec 011; not yet triggered)

- **Problem**: Signed-up people have no concrete way to offer their skills and time toward It's real roadmap needs, and It has no structured, consented record of who could help with what.
- **Chosen approach**: Option B. Curated, honestly labelled roadmap asks (5–15, CMS content with stable IDs) that people tick. An optional structured "what do you bring" (ESCO occupations, plus capped essential skills, stored as ESCO references). A separate unticked contact consent. An honest "what happens next" note. Skip. Admin offer list with followed-up marks and per-ask counts.
- **In scope / out of scope**: In: the asks list, the ESCO picker subset with attribution, consent, offer storage on the account, admin follow-up, retiring or migrating `ways-to-help.tsx` and `helpInterests`. Out: matching, free text, FAQ, crisis/report/privacy pages (010), support management (009), public helper data, volunteer operations.
- **Success metrics**: offer rate at the Help stage; consent rate; follow-up rate within the agreed window; asks with at least one offer.
- **Carried-forward open questions**: Q5, Q6, Q9–Q18 in `questions.md`.
- **It checks for the spec template**: privacy (post-signup only, nothing public, consented contact); honest status (asks labelled; offers never shown as matched); must-not-block (ESCO references for "soon" matching; stable IDs for thing-type-relation); accessibility (picker with search and keyboard support); research questions (ESCO subset size, ask wording).

## Overlaps with other in-flight lanes

- **008 signup gate**: Help is post-signup, so offers attach to the account. The signup email opt-in is a different consent from Help contact consent (Q7). The pre-signup `helpInterests` draft field is currently saved at the gate (`save-progress.tsx`), so 008 and 011 must agree on whether that field survives (Q10).
- **009 support page**: shares the flow position (Support → Help, both skippable; Q9). Option D would put asks inside 009. "Manage or cancel support" assistance belongs to 009 via the Stripe portal (`support-it.tsx:118`), not to Help. The founder's letter may mention both ways to help.
- **010 safety floor + privacy page**: crisis resources, the "not monitored for emergencies" notice, the report button and privacy explanations are all "get help" needs that belong to 010, not §5. A naming clash ("Help") needs agreement (Q18). A general contact address is proposed to sit with 010 in a shared footer (Q12). If §5 ever adds free text, 010's keyword-triggered resource prompt applies, which is another reason to keep §5 structured.
- **Also touches**: 006 admin (help offers, followed-up marks, ask counts) and the thing-type-relation Phase 1 rules (stable IDs for roadmap items; Help answers as ESCO references).
