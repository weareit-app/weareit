# Where pain → dream → fix breaks on real pains

- **Ticket**: [#159](https://github.com/weareit-app/weareit/issues/159), under the map [#156](https://github.com/weareit-app/weareit/issues/156). It feeds the grammar grilling ticket [#161](https://github.com/weareit-app/weareit/issues/161).
- **Date**: 2026-10-21
- **Status**: research only, on a branch that is never merged. Nothing here is a decision. Each "would address" below says the smallest kind of change that fits the evidence, for the founder to weigh.
- **Question**: where does pain → dream → fix break on the pilot's real pains, which step of the inquiry loop is missing in each break, and would a content rule, a small schema field, or only a grammar change address it?

## Short answer

The failures the pilot and its judges recorded fall into eight classes. Six of them can be addressed with a content rule or a small schema field, and several of those rules or fields are already written or proposed. Two need more than that:

- **The frame step.** Writers keep putting "which version of this is mine?" and "the problem isn't me, it's the job" into the dream slot or into fixes, because the grammar has no place for a frame. Its strongest form, "Ask whether the problem is the work itself or how it is managed", is a question It should ask the person, not a fix. A Feature fix can hold it for now, but only a frame step (or a facet layer before dreams) holds it properly.
- **The revise step.** Nothing in the pilot is tried, so no failure there was recorded. The grammar has no place for results or a changed dream, and the measure-shaped "dreams" (class 2c) show the demand. Deferring it costs nothing at launch.

The pain line itself carries the frame today, so every reframe is a reword, and every reword makes runs stale. That is the class that touches the most launch-candidate pains.

## Method

**The loop.** The structures-of-inquiry note (#139, `docs/research/inquiry-agency-structures/research.md` on `claude/inquiry-agency-structures-869ddb`, section 7.1) proposes a loop: **situation**, **trouble or pull**, **frame**, **possibilities** (ends-in-view and working models), **moves** (pragmatic, epistemic, generative, holding), **results** (back-talk), and **revise** (path, means, end, frame, measure, or agent). The note labels the loop a hypothesis. It's used here only as a coding scheme: for each failure, which step would have given the misplaced content a proper home?

**Launch candidates.** The 120 pains marked "shown" in `docs/research/pains/catalog.json` (62 personal, 58 societal). All 17 pilot pains are among them. Which pains ship is the launch map's call (#2), so "reach" below is an upper bound over the 120, not a count of shipped pains.

**Evidence read.**

- Pilot runs for 17 pains, `docs/research/possibilities/runs/` on `claude/possibilities-pilot-79a436`: `cards.json`, `lint.json`, the three judges' `judgments*.json`, `selection.json`, `repair-todo.md`, and, for poor-sleep, rent-eats-everything, and loneliness, the redrafted `dreams.json`, `dream-screen.json`, and `reviews/proposals.json`.
- The founder's ratings and notes: `evaluations/generator-2026-10/audit-ratings.json` (56 audited cards) and `calibration/ratings.json`, with `evaluation.md` and `finalists.md`.
- The pain catalog's history and relations, `docs/research/pains/catalog.json` and `catalog.md` on master.
- The dream-layer note (#134), `docs/research/dream-layer/research.md` on `claude/research-dream-layer-2b6c2e`.
- The problem statement, `docs/research/model-overlap/problem-statement.md` on `claude/inquiry-problem-statement`, and the MVP scope note, `docs/research/model-overlap/mvp-scope.md` on `claude/research-mvp-scope`.
- The situation-graph verdict, `tools/possibilities/prototypes/VERDICT.md` on `prototype/situation-graph`.
- `packages/content/src/graph-schema.ts` on master, for what the app can store today.

Counts were made by script over those files. Where a count rests on a keyword match, that's said.

**Two limits up front.** First, 14 of the 17 pilot pains have only first-round cards, written before the founder's end-state dream rule of 2026-10-20, so their dreams were written to an older definition. Second, there is no evidence at all about people picking pains, dreams, or fixes: no one outside the founder has used the content, and the measurement invariant rules out recording picks before signup. "Hard to pick" below is evidence from authoring and review, not from use.

## The classes at a glance

| # | Class | Missing loop step | Would address it | Pilot pains touched (of 17) | Launch-candidate reach (of 120) |
| --- | --- | --- | --- | --- | --- |
| 1 | Means in the dream slot | Possibilities and moves kept apart from the end | Content rule (already in place) | 17 before the rule; 3 of 3 redrafted still have one each | All 120 are exposed; the screen catches about one per pain |
| 2 | Frames, checks, and measures in the dream slot | Frame (2a), situation (2b), results (2c) | 2b: content rule. 2c: small field. 2a: grammar, or a Feature fix as a stopgap | 16 | Not countable without runs; about 11 pains where "knowing" is the real end |
| 3 | Shared end states (swap-test failures) | Situation | Content rule and a glossary change; no schema change | 2 of 3 redrafted | Up to 106 (pains with an overlap relation) |
| 4 | Dreams that read like the pain switched off | Trouble or pull (no pull) | Content rule | 3 of 3 redrafted, plus 6 calibration dreams on 4 pains | 63 pains whose line is a negation |
| 5 | Pains hard to scope, and rewording churn | Frame | Small field (a scope note), plus a content rule | 7 | All 120 need a scope note; 38 are the least stable |
| 6 | Fixes that overclaim | Results | Small schema fields, plus content rules | 4 after repair (the 39 exclusions before repair aren't broken down by pain) | All 120; sharpest on the 58 societal pains |
| 7 | Fixes that blur | Moves (kinds of move) | Content rules, plus small fields | 10 | All 120 |
| 8 | No place for results or revision | Results and revise | Grammar (later), with design-for values now | 0 recorded (nothing was tried) | All 120, but not a launch content issue |

## 1. Means in the dream slot

**What it looks like.** A "dream" that is a way to get there. The copy guide's own earlier examples were this ("No planes over my house at night", "Sleeping in separate rooms so we both rest"), and so were most first-round card titles ("Charging my phone outside the bedroom", "A four-day work week at the same pay"). A sharper form is the action written as the dream: the `dream-not-outcome` lint fired on "Telling my representatives which programs…" (broke), "Telling my state lawmakers what I want…" (climate), "Asking my representatives who is already…" (dont-know-whats-happening), and "Asking my representative a question in person" (they-dont-listen), and the founder flagged "Telling my legislators I want limits on addictive app design" (doomscrolling, audit a04).

**Evidence.** The poor-sleep redraft's `run.json` records that the first dreams draft was voided by the end-state rule. After the redraft, the dream screen's why test still failed one dream on each of the three pains: "Breathing easily all night while I sleep", "Paying a fair rent for the place I get", and "Friends who get in touch with me first" (`dream-screen.json`).

**Missing step.** The loop separates ends-in-view (possibilities) from moves. The grammar does too, but only by definition, so writers slide down a level whenever the end feels out of reach. All five action-as-dream cases are policy cards, where the person's own move (telling a lawmaker) is far from the end (a law passing). With no step between "my move" and "the result", the move gets promoted to the dream.

**Would address it.** A content rule, which already exists: the end-state definition in `GLOSSARY.md`, the why test, the `dream-not-outcome` lint, and the dream screen. The redraft shows the rule mostly works.

**Reach.** Every pain the generator writes is exposed. The 14 pilot pains with only first-round cards need redrafting before their dreams fit the current definition.

## 2. Frames, checks, and measures in the dream slot

**What it looks like.** Dreams that start with "Knowing", "Seeing", "Understanding", or "Finding out". In the latest card run for each pilot pain, 44 of 236 dream titles start this way, on 16 of 17 pains (keyword match on the first word; loneliness has none). They are three different things:

- **2a. A frame: which version of the trouble is mine, or a reframe of it.** "Understanding which kind of putting off I'm doing", "Finding out whether ADHD is part of the picture" (procrastination); "Knowing what's actually wrong with my sleep" (poor-sleep); "Knowing my burnout comes from the job, not from me" (burnout); "Knowing many people feel their work is pointless" (meaningless-work). The founder read the strongest case this way: "Ask whether the problem is the work itself or how it is managed" is a follow-up question It could ask later (audit a24).
- **2b. A check against the world: a fact about the person's situation.** "Knowing every benefit my household qualifies for" (broke), "Knowing the legal limit on my rent increase" and "Knowing who really owns my building" (rent-eats-everything), "Knowing exactly who represents me" (they-dont-listen).
- **2c. A measure: a way to notice whether things are getting better.** "Seeing whether I'm wearing down or recovering" (burnout), "Seeing plainly where my nights go" (doomscrolling), "Knowing how much of my pay goes to rent", and "Knowing where my hours of housework actually go" (chores).

**Missing step.** 2a is the **frame** step, 2b the **situation** step, and 2c the **results** step's measure. The grammar has none of them, so the generator put each where it could.

**Would address it.**

- **2b: a content rule.** Write the check as its own first fix, titled as the check, with what each answer means for the next fix. The MVP scope note drafts this rule and two optional generator fields for it, `reveals` and `decides`, in section 4.2.
- **2c: a small field.** A short "how you'd notice" line on a dream (hypothesis H5 in the #139 note), or a Feature fix that tracks it. The field is cheaper for people to read; the fix is cheaper to ship, since it needs no schema change.
- **2a: only a grammar change holds it properly.** A frame step (H1: "Is this about falling asleep, waking up, or the hours you have to keep?") or a facet layer before dreams (dream-layer option C). The copy guide's stopgap is a Feature fix ("Questions It should ask"), which keeps the question but files it under a dream it was meant to choose between. The redrafted poor-sleep dreams already map almost one to one to facets (dream-layer note), so for some pains the dream list is quietly doing the frame's job.

**An exception to keep.** For about 11 launch-candidate pains, knowing is the end state, because the trouble is a missing frame or missing possibilities: dont-know-who-to-vote-for, dont-know-whats-true, nobody-covers-here, giving-feels-blind, alone-in-caring, dont-know-whats-happening, want-to-help, learning, no-path, wrong-career, and money-skills (picked by reading the lines; a judgement call). A rule that bans "Knowing" dreams would break these.

**Reach.** Observed on 16 of 17 pilot pains. Reach across the other 103 can't be counted without runs.

## 3. Shared end states (swap-test failures)

**What it looks like.** A dream that is a real end state for this pain, but also for a neighboring one. All four swap failures in the redraft name a neighboring catalog pain:

- "Staying in my home as long as I want" (rent-eats-everything) also fits Eviction and Gentrification.
- "Housing payments that build something for me" (rent-eats-everything) also fits Buying a home.
- "Rents in my town that ordinary paychecks can cover" (rent-eats-everything) also fits Gentrification.
- "Someone who'd notice if I went quiet" (loneliness) also fits No support and Growing old alone.

That's 4 of 29 redrafted dreams, on 2 of 3 pains.

**Missing step.** The **situation**. The catalog cuts pains by trouble, but these end states belong to a situation that several troubles share (being a renter whose rent can rise; living with nobody checking in). The dream-layer note finds no backing for the swap test as a definition: goal systems theory treats ends shared by several routes as normal structure. It suggests a value-level test instead ("does it still name this pain's domain?"), which keeps shared end states and still rejects "I'm happy".

**Would address it.** A content rule (replace or soften the swap test) and a glossary change (the Dream entry says a dream "would not fit a different pain unchanged"). No schema change: `painDreamLinks` in `packages/content/src/graph-schema.ts` is a link table, so one dream can already link to several pains. No grammar change either.

**Reach.** 106 of the 120 shown pains have at least one `overlaps` relation in the catalog (159 relations in all), so that's the upper bound on pains whose dreams could hit this.

## 4. Dreams that read like the pain switched off

**What it looks like.** A dream that is the pain line with the negation removed or added. In the redraft, 4 of 29 titles and 15 of 29 lines rely on "not", "no", "without", or "instead of" (dream-layer note). An older form is the value-level label: the founder killed or marked down "Free", "Comfortable" (broke), "Rested", "Room for rest" (poor-sleep), "Choose what to do" (procrastination), and "We can pull it off" (coordination) as vague (`calibration/ratings.json`).

**Missing step.** The **pull** half of "trouble or pull". The dream is written from the trouble, so it describes the trouble's absence instead of what's there. The solution-focused manual's move is "What will be there instead?", and avoidance-framed goals carry a measured cost in well-being (Elliot, Sheldon, and Church 1997, both via the dream-layer note).

**Would address it.** A content rule: a presence test in the dream brief and screen ("say what's there, not what's gone"), plus the value-level test from class 3 for the vague labels. A facet layer (dream-layer option C) would give the pain wording a home, but the note judges the gain to be mostly wording, so a rule is enough.

**Reach.** 63 of the 120 shown pain lines are phrased as a negation ("can't", "don't", "no", "not", "without"; keyword match), which makes the line-negated dream the easiest one to write.

## 5. Pains hard to scope, and rewording churn

**What it looks like.** Two linked symptoms.

- **Drift.** The founder killed "Stopping an argument before it turns into a fight" under Polarization: "I don't think this is about polarization at all" (audit a39). A climate card was "mixing up different things" (calibration c09). `evaluation.md` asks for "a short scope note per pain saying what it means and what it doesn't".
- **Churn.** Of the 8 pains in the founder's audit, 5 had their line changed after their cards were written, and the changes are reframes, not polish:
  - loneliness: "I feel alone." became "Most days I don't talk to anyone who really knows me." (a feeling became a situation);
  - meaningless-work: "I don't think my work matters." became "I spend my days on work that doesn't help anyone." (a belief became a fact);
  - burnout: "I've got nothing left." became "Work has worn me down so much that I dread every morning." (a cause was added);
  - nobody-covers-here and nobody-knows-anybody were narrowed or widened.

Across the catalog, 94 of 120 shown lines were reworded at least once and 38 at least twice, and 107 carry a founder decision to keep two overlapping pains apart. The map notes 17 possibility runs are stale from rewording.

**Missing step.** The **frame**. The pain line is the only place the frame lives (feeling or situation, symptom or cause), so every reframe is a reword, and every reword makes the runs under it stale.

**Would address it.** A small field: a per-pain scope note ("means" and "doesn't mean") that writers and judges read, plus a content rule that writers stay inside it. That's what the founder asked for. Whether one pain should carry several frames (H1), so a reframe adds a frame instead of rewording the pain, is a grammar question, and the same one as class 2a. Neither the catalog nor the runs can tell whether people find pains hard to pick; that needs use, after signup and only by choice.

**Reach.** Every shown pain needs a scope note. The 38 lines reworded twice or more are the least stable: not-built-for-me, overwhelmed, feeling-down, hard-on-myself, cant-focus, drinking-too-much, broke, no-cushion, bad-job, meaningless-work, home-is-hard, getting-around, life-admin, nobody-to-do-things-with, they-dont-listen, far-away-decisions, taxes-dont-buy-much, immigration-broken, cost-of-living, childcare-costs, cant-afford-kids, it-all-goes-up, ai-and-jobs, no-floor, one-illness-away, older-people-alone, nobody-knows-anybody, cant-pool, treated-differently, people-treated-badly, justice-unfair, where-youre-born, dirty-air, nature-disappearing, crime-and-violence, nothing-ever-changes, groups-go-nowhere, and alone-in-caring.

## 6. Fixes that overclaim

**What it looks like.** Before repair, the finalist set excluded 39 cards on honesty; after a repair pass that made every number and name trace to an opened source, 5 remained (`finalists.md`). The judges' `honestStatus` failures on those 5 are invented or stretched specifics: a quote the source doesn't contain (we-cant-talk), claims attributed to a researcher beyond the source (doomscrolling), a statistic attributed to an organization but not in the record (meaningless-work), and a study of conversation partners stretched into a claim about newcomers that "settles that question" (nobody-knows-anybody, two cards). The situation-graph authors made the same kind of error in a structured form: "likely eligible" became eligible, "share agreed" became care is happening, and outcomes went past the intended result when someone else decides (`VERDICT.md`).

**Missing step.** **Results.** What an example actually showed (measured, only adopted, reported by its own organization, or only proposed) lives in prose, so a writer can turn "the city adopted it" into "it worked". When someone else decides (a manager, an office), the move's result is a decision, which can be no, and the grammar has no place for that.

**Would address it.** Small schema fields, plus content rules. All are drafted in the MVP scope note:

- the four-value status label on every fix in the app (`graph-schema.ts` stores a kind and, for features, a roadmap status, and has no field for **Real now**, **Existing resource**, or **A change we'd make together**);
- `evidenceKind` on generator examples, with a `result-without-measure` lint;
- a list of `sourceIds` per evidence claim;
- `ifNo` on Ask fixes;
- a precaution rule.

The three situation-graph authoring rules (a "likely" outcome can't set a fact to yes; silence isn't yes; when someone else decides, the result is "decision received") are content rules too. None needs a grammar change.

**Reach.** Every pain whose fixes cite examples, so all 120. The missing status label matters most on the 58 societal pains, where a contested change would otherwise look like an everyday task.

## 7. Fixes that blur

**What it looks like.** One word, "fix", covers moves of different kinds, and the kinds don't fit:

- **Wrong kind.** Of the 20 audited fixes labelled Habit, almost none are habits: 7 are settings changed once, 6 recurring schedules, 4 practices, and 3 choices (`evaluation.md`).
- **Information that isn't an action.** "Learn how one country shortened the work week", "Read both sides of the evidence…". The `not-an-action` lint fired 7 times on 3 pains in the first round (ai-and-jobs, it-all-goes-up, they-dont-listen), the burnout repair list has 2 more, and the founder wrote "Great, I learned how someone else did it. Now how do I do it!?" (audit a48, rent-eats-everything).
- **Two ideas in one fix**, and **conversation moves with no home**: "Ask about their experience, then share yours isn't a habit, nor a task… We need to figure this out" (audit a32, we-cant-talk; also a27).
- **Features under-generated.** The founder added 11 feature ideas on audited cards.

**Missing step.** **Moves**, typed by what they do. The loop separates pragmatic moves (change the world), epistemic moves (find something out), generative moves (build a tool, group, or skill), and holding moves (wait, refuse). "Learn how one city did it" is an epistemic move with no pragmatic move after it; a conversation practice is a generative move on the person.

**Would address it.** Mostly content rules, and most already exist: the copy guide's 13 kinds in use, plus Path for later (including Practice, Schedule, Learn as a usable skill, and the trial Leave and Switch), one idea per fix, the `not-an-action` lint, and the feature-pattern pass. A small field covers the rest: `reveals` and `decides` for checks and probes (H2). The app's schema knows only four kinds (`once`, `habit`, `group`, `feature`), so the app side is a schema change, not a grammar change. The one case that needs grammar is the frame question, which is class 2a.

**Reach.** All 120. Observed on 10 pilot pains: doomscrolling, loneliness, nobody-knows-anybody, we-cant-talk, ai-and-jobs, it-all-goes-up, they-dont-listen, burnout, rent-eats-everything, and meaningless-work.

## 8. No place for results or revision

**What it looks like.** No failure was recorded, because nothing in the pilot was tried. The problem statement's lens prototype found that Pain → Dream → Fix "has nowhere to record a disagreement or a refusal", and the #139 note's H3 (dreams are revisable ends-in-view) and H8 (outcomes have two axes: did it help, did I learn something) have no slot in the grammar. The measure-shaped dreams in class 2c are the generator reaching for this step.

**Missing step.** **Results** and **revise**.

**Would address it.** Only a grammar change: an "I tried this" step and a way to revise a dream. The MVP scope note recommends deferring it, with two cheap design-for choices now: add no progress measures, scores, or streaks to v0.1; and when outcomes are built, use values that don't record "wrong measure" or "changed my mind" as failure. Any such record stays on the device before signup and is sent only by explicit choice after.

**Reach.** All 120 eventually. None at launch.

## What this means for the grammar ticket (#161)

This section sorts the evidence for #161 and decides nothing.

- **Rules and small fields cover six of eight classes** (1, 3, 4, 5, 6, and 7). Of these, the status label (class 6) is the only one the MVP scope note rates as needed before launch, and it's already a founder decision.
- **The frame step is the one gap that shows up as live breakage now** (classes 2a and 5). Without it, frames leak into dreams, into fixes as "Ask whether…", and into pain rewording, which is the most expensive symptom because it makes runs stale. The cheapest partial fix is the per-pain scope note plus Feature fixes for It's own questions. The full fix is a frame or facet step, which the dream-layer note and H1 describe and neither has tested.
- **The revise step is a gap with no breakage yet** (class 8), because nothing is tried before launch.
- **The situation step** shows up in classes 2b and 3, but a rule (write checks as fixes) and a glossary change (allow shared end states) cover both without a new step.

## Gaps and open questions

- **No evidence from use.** Every failure here comes from the generator, its judges, and the founder's review. Whether people find pains hard to pick, or recognize themselves in a frame, can only be learned after signup and by choice.
- **Old dreams in most runs.** 14 of 17 pilot pains have only first-round dreams, so classes 1, 2, and 4 are measured partly on drafts the current rules would reject. A redraft of a few more pains would show which classes the end-state rule already fixed.
- **Keyword counts.** The "Knowing" count (class 2) and the negation counts (class 4) are keyword matches. They show scale, not exact numbers.
- **Unreviewed sources.** The problem statement, the MVP scope note, and the #139 note are drafts not yet reviewed by the founder, and the inquiry loop is labelled a hypothesis in its own note.
