# /research: design

**Status:** preparation for founder review (2026-10-20). Nothing here is decided. It assumes the `public-pages` change as proposed (`openspec/changes/public-pages/design.md`): an essay file with front matter, named blocks as data files beside it, drawn in the browser, readable with scripts off.

Atlas source: §8 "/research — What are we investigating—and what survives scrutiny?" and §9 (contribution requests). Threads and their evidence are in [research.md](research.md).

## The five dimensions, for this page

| Dimension | Atlas sketch | Concrete for It today |
| --- | --- | --- |
| **Interactive** | Index filterable by Question / Result / Experiment / Open problem; open a thread to see claim → assumptions → evidence → counterarguments → next test. | Each thread is an `expandable` with the same five parts in the same order. No filters at first: with six to eight threads, a table sorted by status is enough. Filters are a later step and need a script beyond the block set. |
| **Beautiful** | A modest connected map of studies and questions, always paired with a readable outline. | One `diagram` (Mermaid) showing how threads feed each other: pain discovery → possibility generator → fix kinds and evidence → content graph. Each arrow is a real dependency named in the repo (for example, the generator takes pain IDs from the pain inventory). The written outline is the fallback, as the spec requires. |
| **Meaningful** | At least one exact technical claim and one failed approach; disagree without accepting the founder's reading; say what is preliminary or safety-held. | The exact claim: on the October 2026 audit, the founder loved lower-ranked cards as often as finalists (14 of 16 against 37 of 40), so the model judges don't yet separate better cards from weaker ones. The failed approach: the earlier generator's packet (9 of 16 cards killed) and the Habit label (most of 20 were not habits). Raw ratings are linked so a reader can draw their own conclusion. Safety-held items are named with "details held for review". |
| **Participatory** | "Try to reproduce", "Find a counterexample", "Help test this", with the skills needed; route to /help with the thread attached. | Each thread ends with one concrete request: rate the blind calibration set as a second rater (no skills needed; fixes the single-rater weakness), check the stacked-levels rule against a known type-theory treatment (type theory, category theory), add a missing source to a pain's evidence (bibliographic work). Route: the contact address or a GitHub issue until `help-build-it` ships `/help`. |
| **Dataful** | Real citations, code versions, Lean toolchain and proof-audit outcomes, dataset provenance, measurements, untested predictions. Never conflate compiling with outside validation. | One `chart` from `docs/research/possibilities/evaluations/generator-2026-10/metrics.json`: Love / Keep / Kill share by round (calibration old packet, calibration new cards, audit finalists, audit lower-ranked), with n per bar, rater "founder, one person", date 2026-10-19. Each entry lists the commit or tag its numbers come from (for example `possibilities-pilot-final`). No Lean or proof data unless the founder supplies it (see questions). |

## Named blocks

| Block | Use on /research | First version? |
| --- | --- | --- |
| `table` | The research index: thread, kind (question / result / experiment / open problem), status label, last updated, where to pick it up. | Yes |
| `expandable` | One per thread, holding claim → assumptions → evidence → counterarguments → next test. | Yes, for the two full entries; the rest are index rows only |
| `evidence` | The one or two claims per full entry that carry the weight (claim, source, date, status, main limitation). | Yes, one per full entry |
| `chart` | Calibration and audit ratings by round (Vega-Lite bar chart; fallback table). Must carry `source`, `unit` (share of cards), `timeframe` (2026-10-19), `updated`. | Yes, one |
| `diagram` | How threads depend on each other; or the stacked-levels picture (Type at level n described only as a Thing at level n+1). | Later |
| `math` | The stacked-levels rule as one line of notation, for example $T_n : \mathcal{U}_{n+1}$. Only if the founder wants a formal statement on the page. | Later |
| `timeline` | "What changed": dated revisions and corrections to each thread. The essay's change list covers this at first. | Later |
| `status-board` | Threads grouped by status. Duplicates the index table at this size. | Not needed |

## Start small (needs nothing beyond `public-pages`)

1. `packages/content/essays/research/essay.md`, about 500 words, following [outline.md](outline.md).
2. One `table` block: the index, six to eight rows.
3. Two `expandable` blocks, each with one `evidence` card: the possibility generator's calibration, and the Thing / Type / Relation layer (or whichever two the founder picks).
4. One `chart` block from `metrics.json`, with a table fallback.
5. One next action per entry: the contact address `hello@weareit.app` (already in the footer spec) or a GitHub issue link on the public repo.
6. A page view `research` added to the shared page-view list, sent after the privacy note, as for the other essays.

What this needs that `public-pages` doesn't yet list: a `/research` route and front matter (the change names only the five essays and `/licensing`), and a footer entry under "Research & building". Both are additions to existing lists, not new machinery.

## Not in the first version

- Filters, a connected map you can click, or live data.
- Any formal or Lean artifact, unless the founder supplies one and it passes safety review.
- Showing what other people chose or rated (privacy invariants).
- Collecting ratings from readers on the page. A second rater works offline from the published calibration page and sends results by email or issue.
