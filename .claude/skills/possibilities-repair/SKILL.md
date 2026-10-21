---
name: possibilities-repair
description: Repair possibility runs from lint issues, judge exclusions, or founder notes in a fresh repair run, or redo a staged run from a stage with --staged.
disable-model-invocation: true
---

Shared rules, layout, and helper commands: `tools/possibilities/README.md`. Read it first.

Without `--staged`, repair card runs. With `--staged`, follow "Staged run" below instead.

## Card run

1. **Stage a repair run per pain.** Run `new-run <pain>`, then copy the source run's `exemplars.json` and `cards.json` into it. Each card keeps its ID. Done when the new run passes `validate`.
2. **Write `repair-todo.md`** in each new run. List every item to fix, grouped by kind as `tools/possibilities/briefs/repair.md` names them: unsourced detail, honesty exclusions, learn about others, dreams that aren't outcomes, join-or-start splits, founder feature ideas (with the target card), and the feature-pattern pass. Quote the founder's words where they gave them. Done when every lint issue, judge exclusion, and founder note for that pain is on the list.
3. **Start one repair agent per run.** Each is a fresh, isolated agent that gets only this: "Read and follow `tools/possibilities/briefs/repair.md`. Your run: `<run>`." Done when every agent has replied.
4. **Check each run yourself.** Run `validate` and `lint` on every run. A run with issues goes back to its agent. Done when every run reports zero issues and keeps all of its card IDs.
5. **Report** the counts for each kind of to-do item, any dropped fixes, and two before-and-after examples per pain, shown inline. Offer `/possibilities-judge` if the repairs changed which cards might be finalists.

## Staged run

A staged repair is a new staged run that copies the source run up to the earliest stage to redo, then runs the rest of the staged flow, both founder stops included. Everything copied keeps its IDs. The stages and their files are in the README's "Staged flow".

1. **Pick the stage to redo** for each run, the earliest one an item needs:
   - an example's sourcing: `examples`;
   - a dream's wording, or a dream that is a means or fits other pains too: `dreams`;
   - a dream screen verdict the founder disputes: `dream-screen`;
   - a kind's ceilings: `plan`;
   - shared fixes: `shared-fixes`;
   - one kind's fixes (lint issues, screen failures, honest-status failures, or founder notes): `kind-pools`, for those kinds only.

   Done when every lint issue, screen failure, honest-status failure, and founder note for the run is assigned a stage.
2. **Stage the repair run.** Run `new-run <pain> --staged`, with `--pilot` if the source run is a pilot run. Copy the source run's files for every stage before the one to redo, with `dream-screen.json`, `reviews/dreams-decisions.json`, and `reviews/proposals.json` when the dream review comes before it. To redo some kinds, copy `fixes.json` without those kinds' pools and the fixes whose `origin` is `kind:<kind>`. Done when the new run passes `validate` and `status` names the stage to redo.
3. **Write `repair-todo.md`** in the new run: every item from step 1, grouped by stage and kind, quoting the founder's words where they gave them. Done when every item is on the list.
4. **Run the stages** with `/possibilities-generate --staged <new run>`. The agent for the stage to redo also gets: "Do every item in `<run>/repair-todo.md`. The source run is `<source run>`: rewrite what the list names, keeping its IDs, and carry over the rest of that stage's work unchanged." Done when the run reaches a founder stop.
5. **Report** the stage redone, the items fixed for each stage, and two before-and-after examples per pain, shown inline.
