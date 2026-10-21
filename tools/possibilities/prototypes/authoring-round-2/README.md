# Authoring round 2 (agents only)

**Question:** with the revised guide, can independent authors encode the childcare situation so that the graph supports justified conclusions and avoids unjustified ones?

## Setup

- **Frozen materials:** [`packet.md`](packet.md) and [`evaluator-brief.md`](evaluator-brief.md), at tag `situation-graph-round2-frozen` (commit `12179cd`). The engine is still `situation-graph-v3.1-frozen`.
- **Engine check:** before the guide was written, each of its conventions was checked against the frozen engine; see [`representability.md`](representability.md).
- **Authors:** three fresh isolated agents (A: Opus, B: Sonnet, C: Fable). Each read only the packet. The founder chose not to author this round.
- **Evaluator:** one fresh agent, working from the frozen brief. It had to quote a passage for every finding and classify it, rank no one, and score gap discovery separately. Its evaluation is [`evaluation.md`](evaluation.md).
- **Drafts:** [A](draft-A.md), [B](draft-B.md), [C](draft-C.md). Each was extracted directly from its agent's output, not retyped.

## Check of the evaluation

The coordinating session checked the evaluation before reporting it.

**Every quotation.** Of 144 quotations, 123 appear in the drafts or the notes word for word. The other 21 are:
- the evaluator's own proposed guide wording;
- paraphrases of table rows whose content is in the drafts (A's F30 and F14, B's nanny-share completion);
- the question's own phrase ("I'll think about it");
- one characterization written in quote marks ("Tuesday is an uncovered workday").

No quotation was invented.

**Key judgments, checked by hand.** Most hold. Two are disputed:
- **C, "The cheaper place is cheaper than the daycare with space — yes (said)".** The evaluator calls it an unsupported inference. The notes set the daycare with space at "more than half of what I earn" and then mention "a cheaper place", which implies that comparison. *Ambiguous* fits better.
- **B, "Has joined the swap group | no | inferred (she'd have to find out about it)".** The evaluator says the gloss "misquotes" the notes. The gloss is the author's own reasoning, not a quotation. The real issue is whether silence supports "no", which the evaluator also raises.

## Caveats

- **Agents, not people.** Agreement between models is weak evidence.
- **The evaluator's eight proposed guide changes are proposals, not accepted findings.** Each should be weighed against the disagreement it's meant to prevent, as was done for round 1.
