# /learning: research note

- **Created:** 2026-10-20. **Evidence confidence:** high on the outside sources (checked 2026-10-20) and on It's one evaluation's numbers (checked against the rating files); low on what the evaluation generalizes to (one round, one rater).

## What It's work touches

- **The atlas's subject:** how humans and machines learn; feedback, error correction, individual and collective learning, and conditions that help or frustrate inquiry (§4). Broad; It has evidence for one small piece of it.
- **The content loop is a learning loop.** Possible dreams and fixes are drafted with AI (`tools/possibilities/`), ranked by AI judges, then rated and corrected by the founder, and the rules change in response.
- **One dated finding (October 2026)**, in `docs/research/possibilities/evaluations/generator-2026-10/evaluation.md`: every numeric gate passed, but lower-ranked samples were loved about as often as finalists (14 of 16 against 37 of 40, confirmed against `audit-ratings.json` and `audit-key.json`), so the judges weren't separating good from weaker cards. The founder's notes found structural problems the ratings didn't measure (fix kinds, "Learn how…" fixes, dreams written as actions, topic drift). The proposed response is to change what's measured, not to tune the ratings. (Status: observed once, not replicated.)
- **Not in scope yet:** learning from people's own use of It. Pre-signup choices stay on the device and measurement before signup is limited to the stage funnel and page views (`AGENTS.md`), so It can't learn from what people pick before they sign up.

## Key primary sources

- Kluger, A. N. & DeNisi, A. (1996). "The Effects of Feedback Interventions on Performance." *Psychological Bulletin* 119(2): 254–284. https://doi.org/10.1037/0033-2909.119.2.254 (DOI to confirm at doi.org) — Across 607 effect sizes feedback helped on average, but more than a third of interventions made performance worse.
- Hattie, J. & Timperley, H. (2007). "The Power of Feedback." *Review of Educational Research* 77(1): 81–112. https://doi.org/10.3102/003465430298487 — Feedback's effect varies a lot by type; a model of three questions and four levels.
- Argyris, C. & Schön, D. A. (1978). *Organizational Learning: A Theory of Action Perspective.* Addison-Wesley. — Single-loop learning (fixing errors within the rules) versus double-loop learning (changing the rules).
- Mellers, B., Ungar, L., et al. (2014). "Psychological Strategies for Winning a Geopolitical Forecasting Tournament." *Psychological Science* 25(5): 1106–1115. https://doi.org/10.1177/0956797614524255 — Training, teaming and tracking improved forecast accuracy. A 2025 reanalysis in the same journal questions part of this account; cite both if used. Popular account: Tetlock, P. E. & Gardner, D. (2015). *Superforecasting.* Crown.

## Open questions

- Will the structural checks (kind accuracy, outcome framing, on-topic rate) separate good from weaker cards where ratings didn't? Untested.
- Can anyone other than the founder rate content, given that contributions go to a review queue and nothing contributed is shown before approval?
- Can the founder's audit quotes be public? (`questions.md` Q2)

## Sources

- Repo: atlas §4; `docs/research/possibilities/evaluations/generator-2026-10/` (`evaluation.md`, `metrics.json`, `audit-ratings.json`, `audit-key.json`); `tools/possibilities/README.md`; `AGENTS.md`.
- Outside sources as listed above, checked 2026-10-20.
