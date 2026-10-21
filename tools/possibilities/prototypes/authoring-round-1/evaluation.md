# Evaluation: authoring round 1 (situation graph, childcare)

Written by an isolated evaluator agent that saw the drafts only as A, B, and C. In the tables, **J** means the answer is justified by the notes and **U** means it is not.

## Part 1: Questions about the situation as written

**Q1. Does the manager's "I'll think about it" establish a changed schedule?** All three say no (J).
- A and C record it as a pending outcome.
- B's conclusion is right but weaker: it has no outcome for "still thinking", and it marks every outcome "pending".

**Q2. Does Tuesday care with Mom cover the other three workdays?** None of the graphs records that Tuesday is a workday, and neither do the notes, so the question's framing isn't supported.
- A and C say no, narrowly (J).
- B's graph doesn't support an answer either way, because it has no coverage relationships.

**Q3. If Mom stops helping, what goes away, and what stays?**
- **A:** the fix outcome is withdrawn, but the fact "Mom looks after him on Tuesdays: yes" stays, so the graph contradicts itself.
- **B:** not supported. B has no fix and no withdrawal, and says so honestly in its Questions.
- **C:** the only graph that withdraws the fact. But it doesn't say what stays, it leaves the earlier "covered until then" outcome in place, and the withdrawal only works through the "ask Mom" conversation fix.

**Q4. Does being eligible for a subsidy establish funding or a place?** All three say no to both (J).
- C's adjacent outcomes overclaim: "Approved" establishes that the subsidy pays, merging approval with payment, and "Refused" establishes "not eligible", merging refusal with ineligibility.

**Q5. Does joining the babysitting swap establish that its hours fit early shifts?** All three say no (J).

**Q6. Does finding another family establish a nanny share?** All three say the rules are still needed (J).
- B files the family and the rules as start needs, which would mean she couldn't even begin looking.
- C's start need contradicts its own steps.

**Q7. Does any completed step say "stop worrying" is reached?** All three say no (J).

**Q8 (positive). Does the graph identify a justified next thing to find out or try?** All three do, but only through their "needs checking" marks. No graph has a "next step" relationship. C is the most explicit, because it makes "ask Mom how long" a fix.

**Q9 (positive). Does the graph keep Tuesday care as real help while showing that other days are uncovered?** All three only partly. None has a fact about which days are covered.

## Part 2: Changes the authors didn't know about

**Change A: Mom stops helping.**
- **A:** incomplete. The outcome is withdrawn, but the fact goes stale.
- **B:** can't represent it.
- **C:** incomplete. The fact is withdrawn through the "ask Mom" fix, but what stays isn't stated, and there's no outcome that fits if Mom stops without that conversation.

**Change B: The manager approves a later start on only one day.** None of the three graphs can represent it. All three leave the cheaper place blocked, when in reality it's partly possible, because none can express a partial outcome or a need counted in days.

**Change C: Eligibility is confirmed, but funding is unknown.**
- **A and B:** handled correctly but incompletely, since funding isn't a separate node.
- **C:** partly wrong. Because C merges approval with payment, a later refusal for lack of funding would establish "not eligible" while the fact says eligible, so the graph would contradict itself.

## Part 3: Authoring quality

**Author A** has the most internally consistent graph and the most accurate honesty marks.
- **Mistakes:** some withdrawals leave matching facts stale, and the waiting list is both a start need and a step.
- **Choice:** no dream about affordability, which was deliberate and defensible.
- **Burden:** 15–20 minutes; A estimates 45–60 for a person.

**Author B** has gaps.
- **Missing:** no Mom fix and no waiting list.
- **Rule breaks:** several facts each hold two things, against the guide's explicit rule, and "pending" is used as a modifier on other outcomes rather than as its own kind.
- **Misplaced needs:** the result itself is listed as a need to succeed, and the nanny share's needs to start are wrong.
- **Burden:** about 20 minutes.

**Author C** has the most misused relationships and overclaims.
- **Needs to start:** several are themselves steps, and some contradict the fix's own steps.
- **Checklist:** its waiting-list "checklist" doesn't complete the intended result.
- **Overclaims:** approval establishes payment, and refusal establishes ineligibility.
- **Honesty marks:** almost everything is marked "assumed", which C itself says makes the marks meaningless.
- **Credit:** C is the only author that noticed the two-days-versus-four-days gap, though only in its Questions.
- **Burden:** 30–40 minutes.

## Part 4: Across authors

**Where they agreed in conclusions:**
- "Think about it" isn't agreement.
- Eligibility establishes neither funding nor a place.
- Joining the swap doesn't establish fitting hours.
- A family alone isn't a nanny share.
- No dream is ever reached.
- "Get approved", not "apply", is the subsidy's result.
- "Cheaper" isn't the same as "affordable".
- The cheaper place depends on the manager.
- The letter and proof don't establish approval.

**Where they disagreed:**

| Disagreement | Classification |
|---|---|
| Mom's Tuesdays as a fix to keep it going (A), a fact only (B), or a fix to ask her (C) | Ambiguous semantics: ongoing arrangements, and what a withdrawal's source can be |
| The cheaper place depending on the manager to start (C) or to succeed (A, B) | Ambiguous semantics ("begin"); C's version is also an authoring error |
| Letter and proof needed to succeed (A, B) or to start (C) | Ambiguous semantics ("begin" versus "submit"); C's version is also an authoring error |
| Nanny family and rules as success needs (A) or start needs (B, C) | Ambiguous semantics; B's rules-as-start is an authoring error |
| An affordability dream: none (A), merged with reliability (B), separate (C) | Unresolved |
| Approval establishing payment (C) or only approval (A, B) | Authoring error (C) |
| The result listed as its own success need (B, C) or not (A) | Ambiguous semantics |
| "Pending" as a modifier (B) or as its own kind of outcome (A, C) | Ambiguous semantics |
| Withdrawing only outcomes (A) or facts too (C) | Ambiguous semantics |
| Waiting list: a start need (A), omitted (B), or its own fix with a checklist (C) | Missing knowledge; B's omission and C's checklist are authoring errors |
| Unspent swap hours: needs checking (A) or withdrawn (B) | Missing knowledge |
| "Stop worrying" kept as a feeling (A, B) or reframed as reliability (C) | A legitimate alternative |
| Facts holding two things (B) or one (A, C) | Authoring error (B) |
| The two-days-versus-four gap, noticed only by C | Unresolved |

## Guide fixes the evaluator proposed

1. **Define "start".** A start need is something required before the first listed step. If it's one of the steps, it isn't a start need.
2. **Let needs point at another fix's outcome, and allow partial outcomes.** A need is a fact or "Fix N: Outcome". If a result has a quantity, such as days or hours, list partial outcomes and what each one makes true.
3. **Settle ongoing arrangements.** An arrangement already in place is a fact plus a "keep it going" fix. Its ending is an outcome that withdraws both. A withdrawal that crosses fixes is written on the dependent fix, naming the source outcome.
4. **Keep the result out of its own needs.** Under needs to succeed, write "none besides the result" rather than the result itself. A need must be necessary for the intended result as written; anything outside it, such as his happiness, links to a dream instead.
5. **Make outcome kinds exclusive.** Each outcome is exactly one of hoped, not hoped, or pending. Add one sentence on checklists: a checklist must complete the intended result itself.
6. **Record coverage per day.** When the pain has a schedule, record one fact per day or shift: covered by someone, or not covered.
7. **Simplify the honesty marks.** Relationships default to assumed; mark only "stated" and "needs checking".
8. **Rule on affordability.** A cost limit from the pain is a need to succeed ("a fee she can carry"), not a dream, unless the person names it as a want.

## Summary

- **Overall correctness:** the "doesn't establish" conclusions hold in all three graphs. A is the most consistent, B has gaps, and C overclaims most.
- **Biggest risk:** no graph can show partial or per-day coverage, or keep facts in sync with withdrawals.
- **Biggest guide fix:** define "start", allow needs that point at another fix's outcomes (including partial ones), and let withdrawals name facts.
- **Authoring burden:** 15–40 minutes for an agent, dominated by choosing intended results and by honesty marks that collapse into "assumed".
- **Second round:** worthwhile after the guide fixes. Reuse this situation and these changes, and add a check of coverage per day.
