---
name: possibilities-repair
description: Repair possibility runs from lint issues, judge exclusions or founder notes in a fresh repair run.
disable-model-invocation: true
---

Shared rules, layout and helper commands: `tools/possibilities/README.md`. Read it first.

1. **Stage a repair run per pain.** Run `new-run <pain>`, then copy the source run's `exemplars.json` and `cards.json` into it. Each card keeps its ID. Done when the new run passes `validate`.
2. **Write `repair-todo.md`** in each new run. List every item to fix, grouped by kind as `tools/possibilities/briefs/repair.md` names them: unsourced detail, honesty exclusions, learn about others, dreams that aren't outcomes, join-or-start splits, founder feature ideas (with the target card) and the feature-pattern pass. Quote the founder's words where they gave them. Done when every lint issue, judge exclusion and founder note for that pain is on the list.
3. **Start one repair agent per run.** Each is a fresh, isolated agent that gets only this: "Read and follow `tools/possibilities/briefs/repair.md`. Your run: `<run>`." Done when every agent has replied.
4. **Check each run yourself.** Run `validate` and `lint` on every run. A run with issues goes back to its agent. Done when every run reports zero issues and keeps all of its card IDs.
5. **Report** the counts for each kind of to-do item, any dropped fixes, and two before-and-after examples per pain, shown inline. Offer `/possibilities-judge` if the repairs changed which cards might be finalists.
