# Corrections to the round 1 evaluation

[`evaluation.md`](evaluation.md) is kept unchanged as the original record. This file corrects it.

- **Why:** a later review, checked against the drafts, found that the evaluation sometimes overstated problems, missed counterevidence, or treated a modelling preference as a requirement. The coordinating session also relayed some of those overstatements without checking every claim against its passage.
- **How:** every correction below cites the passage it rests on.
- **Rankings:** the evaluation's ranking of authors ("A most consistent", and so on) is withdrawn until each judgment has been checked.

## Kinds of finding

| Kind | Meaning |
|---|---|
| **Absent** | The author didn't encode it, though the language could have. |
| **Contradictory** | Two parts of the same draft conflict. |
| **Not expressible** | The frozen engine demonstrably can't represent it. This is only used after a check against the engine, never because an author didn't encode something. |
| **Unsupported inference** | An outcome or need claims more than the notes justify. |
| **Ambiguous** | The guide allows more than one reading. |
| **Not assessed** | The question or criterion was faulty, so no judgment is made. |

## Corrections

### 1. "The cheaper daycare stays blocked after a partial approval" (Part 2, Change B, and the summary)

- **Overstated for A and B.** Both let the approach start before the schedule is agreed.
  - A, Fix 3: "Needs to start: nothing. She can ask about a place before her start time is settled."
  - B, Fix 3: "Needs to start: nothing known. She could ask about space first."
  - In both drafts the later start is a need to *succeed*. A one-day approval leaves success incomplete; it doesn't block starting.
- **What is missing in A and B:** a partial outcome. Each defines "Agreed" as both days. That's **absent**, not **not expressible**: the frozen engine can represent approval for one day as one condition per day (see the representability check in round 2's guide notes).
- **For C, the claim holds as written:** C makes the later start a need to *start* ("a later start on the days he'd go (Fix 2, Agreed)"), so its approach is blocked as written.

### 2. "None has a fact about which days are covered" (Q9, and the Part 1 finding)

- **Wrong.** All three record Mom's Tuesdays:
  - A, Facts: "Mom looks after him on Tuesdays: yes"; and A's Fix 7 establishes "Tuesdays covered by mom".
  - B, Facts: "Her mom looks after him on Tuesdays | yes".
  - C, Facts: "My mom takes him on Tuesdays | yes".
- **What's missing:** a complete schedule, and a consistent way to update it. That's **absent**.

### 3. "Next actions only through the needs-checking marks" (Q8)

- **Wrong.** The drafts list concrete steps as steps. For example:
  - A, Fix 3: "ask about space; visit; enrol";
  - B, Fix 1: "Check the rules, ask the employer for a letter, gather proof of hours, submit";
  - C has a dedicated fix: Fix 7, "Ask mom how long Tuesdays can continue".
- No special "next step" relationship is needed for these to be useful.

### 4. "All three chose 'get approved' as the subsidy's result" (Part 4, agreement)

- **Wrong for C.** C, Fix 1: "Intended result: a subsidy is approved and pays part of my childcare cost."
- C chose a different result, which is legitimate. Its actual error is narrower: the "Approved" outcome establishes "a subsidy pays part of my cost". Approval doesn't establish payment, so that's an **unsupported inference**.

### 5. "B's missing waiting-list fix is an authoring error" (Part 4)

- **Not assessed.** The packet never asked authors to cover every possible approach. Without a completeness criterion, an omission is an observation, not an error.

### 6. Faulty questions

- **Q2** ("…cover the other three workdays?") assumes Tuesday is a workday. **Q9** ("…recognizing that other days remain uncovered?") assumes the other days are uncovered. The notes support neither.
- **Not assessed** for all authors. Unknown coverage should stay unknown.

### 7. Author A isn't a reference answer

The evaluation's description of A as most consistent may be right, but A has errors the evaluation missed:

- A, Fix 4: the intended result is "a place is offered", but affordability is listed as a need to succeed. A place can be offered even if it's unaffordable. **Unsupported inference.**
- A, Fix 5: "the group accepting her" is a need to *start*, while the fix's own steps are "contact the group; join". **Contradictory.**
- A, Fix 3: the intended result includes attending, but the hoped outcome "Place offered and taken" establishes only "enrolled". The boundaries don't line up. **Contradictory.**
- A, Fix 7 against A's Facts: "mom stops" withdraws "Tuesdays covered by mom", but the fact "Mom looks after him on Tuesdays: yes" stays. **Contradictory.**

### 8. Findings that stand

| Finding | Passage | Kind |
|---|---|---|
| C's waiting-list "checklist" completes being listed, while the intended result is an offer | C, Fix 6: "Made of (checklist): ask to be added; confirm I'm on it" against "Intended result: a place is offered" | Contradictory |
| C's refusal establishes ineligibility | C, Fix 1: "Refused (unhoped): establishes 'not eligible as things stand'" | Unsupported inference |
| C's approval establishes payment | C, Fix 1: "Approved (hoped): establishes 'a subsidy pays part of my cost'" | Unsupported inference |
| B merges several things into one fact | B, Facts: "The swap group would accept her / has members near her"; "A nanny is available at a price two families can afford" | Contradictory (with the guide's explicit rule) |
| B uses "pending" alongside hoped and unhoped | B, Fix 1: "Approved (hoped, pending)", "Denied (unhoped, pending)" | Ambiguous |
| B's nanny-share start needs conflict with its search steps | B, Fix 5: "Needs to start: a family nearby… the two families agree on the rules" against "Made of: find a family, agree rules…" | Contradictory |

## Gaps the authors found (credited separately)

These are findings about the account and the modelling language. They aren't counted against the authors.

- **C, the four-day week:** a later start on two days doesn't establish coverage for a four-day week, and it doesn't establish a shortfall either. C correctly identified that the connection is unresolved ("Two days or four?").
- **C, cheaper versus affordable:** "Does 'cheaper' count toward affordability?"
- **C, combinations:** the guide has no way to say "these two together may help".
- **B, an existing arrangement that may end:** "The guide has no obvious place for 'an arrangement that exists and may end.'"
- **A, a withdrawal that crosses fixes:** "fix 2's 'arrangement withdrawn' should knock out fix 3's attendance". A also asked what happens to unspent swap hours. A check against the frozen engine confirms that a withdrawal doesn't update a dependent fix's recorded outcome, so A found a real limit of the engine.

## What happens to the evaluator's eight proposed guide fixes

| Proposed fix | Status |
|---|---|
| 1. Define "start" | **Reframed:** align each fix's boundaries (beginning, completion, and downstream benefit) instead of one rule for everyone |
| 2. Needs can point at another fix's outcome; partial outcomes | **Adopted as wording.** The frozen engine already supports both, through conditions and one outcome per part |
| 3. A "keep it going" fix for existing arrangements | **Rejected.** It invents an action. Existing arrangements are facts. |
| 4. Keep the result out of its own needs | **Adopted** |
| 5. Exclusive outcome kinds; a checklist must complete the intended result | **Adopted** |
| 6. Coverage per day | **Adopted,** with "not checked" kept distinct from "no" |
| 7. Default relationships to "assumed" | **Rejected.** It would hide where a claim comes from. Source and status are separated instead. |
| 8. Affordability as a need, not a dream | **Not adopted.** Whether something is a dream is the founder's call; if the person wants it, it can be a dream. |
