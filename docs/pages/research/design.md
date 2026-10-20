# /research: design

**Status:** preparation for founder review (2026-10-20). Nothing here is decided. This file assumes the `public-pages` change as proposed (`openspec/changes/public-pages/design.md`): an essay file with front matter, named blocks as data files beside it, drawn in the browser, readable with scripts off.

Atlas source: §8 "/research — What are we investigating—and what survives scrutiny?" and §9 (contribution requests). Threads, figures and sources are in [research.md](research.md), referred to here by thread number.

## The five dimensions, for this page

| Dimension | Atlas sketch | Concrete for It today |
| --- | --- | --- |
| **Interactive** | Index filterable by Question / Result / Experiment / Open problem; open a thread to see claim → assumptions → evidence → counterarguments → next test. | Each thread is an `expandable` with the same five parts in the same order. No filters at first: with six to eight threads, a table sorted by status is enough. Filters are a later step and need a script beyond the block set. |
| **Beautiful** | A modest connected map of studies and questions, always paired with a readable outline. | One `diagram` (Mermaid) showing how threads feed each other: pain discovery → possibility generator → fix kinds and evidence → content graph. Each arrow is a real dependency named in the repo (for example, the generator takes pain IDs from the pain inventory). The written outline is the fallback, as the spec requires. |
| **Meaningful** | At least one exact technical claim and one failed approach; disagree without accepting the founder's reading; say what is preliminary or safety-held. | The exact claim: thread 1's finding that the model judges don't yet separate stronger cards from weaker ones. The failed approach: thread 1's Habit label. Raw ratings are linked so a reader can draw their own conclusion. Safety-held items are named with "details held for review". |
| **Participatory** | "Try to reproduce", "Find a counterexample", "Help test this", with the skills needed; route to /help with the thread attached. | Each thread ends with one concrete request: rate the blind calibration set as a second rater (no skills needed; fixes the single-rater weakness), check the stacked-levels rule against a known type-theory treatment (type theory, category theory), add a missing source to a pain's evidence (bibliographic work). Route: the contact address or a GitHub issue until `help-build-it` ships `/help`. |
| **Dataful** | Real citations, code versions, Lean toolchain and proof-audit outcomes, dataset provenance, measurements, untested predictions. Never conflate compiling with outside validation. | In a second version, one `chart`: Love / Keep / Kill by round (calibration old packet, calibration new cards, audit finalists, audit lower-ranked), with n per bar. Its data file is built from the Ratings table in `docs/research/possibilities/evaluations/generator-2026-10/evaluation.md` (or `audit-ratings.json` joined with `audit-key.json`, which says which cards were samples), not `metrics.json`, which has no lower-ranked round and stores shares; rater "founder, one person", date 2026-10-19. Each entry lists the commit or tag its numbers come from (for example `possibilities-pilot-final`). No Lean or proof data unless the founder supplies it (see questions). |

## Named blocks

| Block | Use on /research | First version? |
| --- | --- | --- |
| `table` | The research index: thread, kind (question / result / experiment / open problem), status label, last updated, where to pick it up. | Yes |
| `expandable` | One per thread, holding claim → assumptions → evidence → counterarguments → next test. The key claim is written in it as plain Markdown with the five evidence parts (claim, source, date, status, limitation). | Yes, for the two full entries; the rest are index rows only |
| `evidence` | The key claim as its own card. `public-pages` defines `expandable` as "title plus nested Markdown" and doesn't say a block can sit inside one, so cards go beside the expandable, or wait until nesting is confirmed. | Second version |
| `chart` | Ratings by round (Vega-Lite bar chart; fallback table), data from `evaluation.md` as above. Must carry `source`, `unit` (cards), `timeframe` (2026-10-19), `updated`. | Second version |
| `diagram` | How threads depend on each other; or the stacked-levels picture (Type at level n described only as a Thing at level n+1). | Later |
| `math` | The stacked-levels rule as one line of notation, for example $T_n : \mathcal{U}_{n+1}$. Only if the founder wants a formal statement on the page. | Later |
| `timeline` | "What changed": dated revisions and corrections to each thread. The essay's change list covers this at first. | Later |
| `status-board` | Threads grouped by status. Duplicates the index table at this size. | Not needed |

## Start small

Two block types, as the outlines README advises ("at most one or two to start"):

1. `packages/content/essays/research/essay.md`, about 500 words, following [outline.md](outline.md).
2. One `table` block: the index, threads 1–5 plus the founder's formal-work row if any.
3. Two `expandable` blocks: threads 1 and 4 (or whichever two the founder picks), each with its key claim written out in the five evidence parts.
4. One next action per entry: the contact address `hello@weareit.app` (already in the footer spec) or a GitHub issue link on the public repo.

No new machinery, but three additions of the kind `public-pages` already makes for each of its essays:

- a thin route file, `app/research.tsx`, like `app/why.tsx` (app code; `public-pages` design §4);
- a link-list entry under "Research & building" (§5);
- a `research` page view in `visit-measurement`'s shared list, which `public-pages` fixes at six new page views (§9), shown after the privacy note.

Second version: the `chart` and `evidence` blocks above.

## Not in the first version

- Filters, a connected map you can click, or live data.
- Any formal or Lean artifact, unless the founder supplies one and it passes safety review.
- Showing what other people chose or rated (privacy invariants).
- Collecting ratings from readers on the page. A second rater works offline from the published calibration page and sends results by email or issue.
