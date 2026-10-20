# /research: What are we investigating, and what survives scrutiny?

**Writer:** drafted from this outline, then founder rewrites (proposed; questions.md 11). **Target:** about 500 words: an index of six to eight threads, two full entries, sources beside claims. Evidence is in [research.md](research.md).

**Guardrail (atlas):** index work; don't present a finished theory. Never conflate compiling or a high rating with outside validation. Safety-sensitive detail stays private pending review; name the question and say detail is held.

## Opening (1 paragraph)

What this page is: the questions It is working on, how far each has got, and where someone else could pick one up. Every entry carries a status label and a date. Some threads will fail; that shows here too. **You:** one sentence on why you publish unfinished work.

## Index (`table` block)

Thread → kind → status → updated → where to pick this up.

| Thread | Suggested status |
| --- | --- |
| Can AI agents write possibilities worth showing, and can model judges rank them? | Working hypothesis; ranking an open question |
| Which pains do people recognize as theirs, and what evidence says so? | Working hypothesis |
| What kinds of action can a fix be, and what is its evidence about? | Open question |
| How can anything link to shared Things without mixing types and instances? | Planned engineering |
| Can change effort scale with the idea, not the system? (link to /technology) | Working hypothesis |
| **You:** any mathematical or Lean work, by title only | **You:** status, or "details held for review" |

## Entry 1: Writing and judging possibilities (`expandable`)

- **Takeaway:** isolated AI agents write a dream and its fixes from real, opened examples; three model judges rank them; the founder rates them blind. The founder rated all 24 new cards Love, against 3 of 16 from the earlier generator ([evaluation](../../research/possibilities/evaluations/generator-2026-10/evaluation.md)).
- **Exact claim (`evidence` card):** in the fresh-pain audit, lower-ranked cards were loved as often as finalists (14 of 16 against 37 of 40), so the judges don't yet separate stronger cards from weaker ones. Source: `metrics.json`, 2026-10-19. Main limitation: one rater, who also wrote the rubric.
- **Failed approach:** the Habit label. Of 20 audited "habits", almost none were; this produced the current fix kinds.
- **Builds on:** LLM-as-judge agreement and bias ([Zheng et al. 2023](https://arxiv.org/abs/2306.05685); [Wang et al. 2023](https://arxiv.org/abs/2305.17926)); inter-rater agreement ([Cohen 1960](https://doi.org/10.1177/001316446002000104)).
- **Status:** working hypothesis (writing); open question (ranking).
- **Where to pick this up:** rate the blind calibration set as a second rater, so agreement can be measured; test the judges for order bias.

## Entry 2: Things, Types and stacked levels (`expandable`)

- **Takeaway:** It will let any record link to shared Things (Basketball) of a Type (Sport). A Type can itself be described as a Thing, but only one level up, as universes are stacked in type theory ([HoTT book 2013](https://arxiv.org/abs/1308.0729)). Every link records who made it, its confidence and its review.
- **Exact claim (`evidence` card):** mixing levels is the documented failure of the largest open knowledge base: Wikidata's ontology often puts classes at several orders and confuses them with instances ([Patel-Schneider and Doğan 2024](https://arxiv.org/abs/2411.15550); [Zhao and Takeda 2025](https://arxiv.org/abs/2511.04926)). Limitation: It's layer isn't built, so nothing here shows the rule prevents this at It's scale.
- **Builds on:** ologs ([Spivak and Kent 2012](https://doi.org/10.1371/journal.pone.0024274)); Wikidata's design ([Vrandečić and Krötzsch 2014](https://doi.org/10.1145/2629489)).
- **Status:** planned engineering (after launch); how accurate AI-proposed links are is an open question.
- **Where to pick this up:** find a case the stacked-levels rule handles badly; suggest how to audit link precision from small samples.

## What remains open (1 paragraph)

No second rater, no formal artifacts in the repo, no test yet of whether visitors recognize the pains. **You:** the question you most want someone else to take.

## Where to go next

The contact address, or an issue on the public repo with the thread's name. Link the raw files at a fixed tag.

**Blocks:** `table` (index), `expandable` ×2 with one `evidence` card each, one `chart` (ratings by round, from `metrics.json`).

**Sources to find:** **You:** citations for any formal work; confirm the OECD and World Happiness pages if pain discovery becomes a full entry (unverified in research.md).
