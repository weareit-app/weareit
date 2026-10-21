# /research: What are we investigating, and what survives scrutiny?

**Writer:** drafted from this outline, then founder rewrites (proposed; questions.md 11). **Target:** about 500 words: an index, two full entries, sources beside claims. Threads, figures and sources live in [research.md](research.md); this outline refers to them by number.

**Guardrail (atlas):** index work; don't present a finished theory. Never conflate compiling or a high rating with outside validation. Safety-sensitive detail stays private pending review; name the question and say detail is held.

## Opening (1 paragraph)

What this page is: the questions It is working on, how far each has got, and where someone else could pick one up. Every entry carries a status label and a date, and threads that fail stay visible. **You:** one sentence on why you publish unfinished work.

## Index (`table` block)

Columns: thread, kind, status, last updated, where to pick this up. Rows: threads 1–5 from the research.md summary (thread 5 is one line linking to `/technology`), plus **You:** any mathematical or Lean work, by title, with "details held for review".

## Entry 1: Writing and judging possibilities (thread 1, `expandable`)

- **Takeaway:** isolated AI agents write a dream and its fixes from real, opened examples, three model judges rank them, and the founder rates them blind. The founder rated all 24 new cards Love, against 3 of 16 from the earlier generator ([evaluation](../../research/possibilities/evaluations/generator-2026-10/evaluation.md)).
- **Exact claim** (written as claim, source, date, status, limitation): in the fresh-pain audit the founder loved lower-ranked cards as often as finalists (14 of 16 against 37 of 40), so the judges don't yet separate stronger cards from weaker ones. Source: `evaluation.md`, Ratings table, 2026-10-19. Limitation: one rater, who also wrote the rubric.
- **Failed approach:** the Habit label. Of 20 audited "habits", almost none were, which produced the current fix kinds.
- **Builds on:** LLM-as-judge agreement and bias ([Zheng et al. 2023](https://arxiv.org/abs/2306.05685); [Wang et al. 2023](https://arxiv.org/abs/2305.17926)); agreement between raters ([Cohen 1960](https://doi.org/10.1177/001316446002000104)).
- **Status:** working hypothesis (writing); open question (ranking).
- **Where to pick this up:** rate the blind calibration set as a second rater; test the judges for order bias.

## Entry 2: Things, Types and stacked levels (thread 4, `expandable`)

- **Takeaway:** any record in It will be able to link to shared Things (Basketball) of a Type (Sport). A Type can be described as a Thing only one level up, as universes are stacked in type theory ([HoTT book 2013](https://arxiv.org/abs/1308.0729)). Every link records who made it, its confidence and its review.
- **Exact claim** (same five parts): mixing levels is the documented failure of the largest open knowledge base, where classes sit at several orders and get confused with instances ([Patel-Schneider and Doğan 2024](https://arxiv.org/abs/2411.15550); [Zhao and Takeda 2025](https://arxiv.org/abs/2511.04926)). Limitation: the layer isn't built, so nothing shows the rule prevents this in It.
- **Builds on:** ologs ([Spivak and Kent 2012](https://doi.org/10.1371/journal.pone.0024274)); Wikidata's design ([Vrandečić and Krötzsch 2014](https://doi.org/10.1145/2629489)).
- **Status:** planned engineering (after launch); the accuracy of AI-proposed links is an open question.
- **Where to pick this up:** find a case the rule handles badly; suggest how to audit link accuracy from small samples.

## What remains open (1 paragraph)

No second rater, no formal work in the repo, no test yet of whether visitors recognize the pains. **You:** the question you most want someone else to take.

## Where to go next

The contact address, or an issue on the public repo naming the thread. Raw files linked at a fixed tag.

**Blocks:** `table` (index), `expandable` ×2. The evidence and the ratings chart wait for a second version (design.md).

**Sources to find:** **You:** citations for any formal work.
