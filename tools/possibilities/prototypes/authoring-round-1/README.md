# Authoring round 1 (agents only)

**Question:** can independent authors encode a new situation (affordable childcare) so that the situation graph supports justified conclusions and avoids unjustified ones?

## Setup

- **Frozen rules:** the guide and prototype at tag `situation-graph-v3.1-frozen` (commit `3065947`). Problems found in this round are recorded here, not fixed mid-round.
- **Authors:** three isolated agents, each on a different model (A: Opus, B: Sonnet, C: Fable) to reduce shared assumptions. Each had only [`packet.md`](packet.md): the guide, the notes, the output format, and the rule to mark each line as stated, assumed, or needs checking. They didn't have the evaluation questions, any expected answers, prototype examples, review history, or each other's drafts.
- **Evaluator:** one fresh agent, which saw the drafts only as A, B, and C and answered from what each graph says, not from common sense. Its brief, including three changes the authors didn't know about, is [`evaluator-brief.md`](evaluator-brief.md). The full evaluation is [`evaluation.md`](evaluation.md). **Read it with [`corrections.md`](corrections.md):** a later check against the drafts found overstatements, withdrew its ranking of authors, and credits the gaps authors found separately.

## Caveats

- **Agents, not people.** Agreement between models is weak evidence, because similar models can share assumptions. A round with people should follow.
- **Two of the questions were faulty.** Question 2 ("Does Tuesday care cover the other three workdays?") assumes Tuesday is a workday, and question 9 assumes the other days "remain uncovered". The notes support neither. These are errors in the questions, not in the drafts, and both are marked not assessed in the corrections.

## Drafts

- [Author A](draft-A.md)
- [Author B](draft-B.md)
- [Author C](draft-C.md)
