---
name: pains-refine
description: Propose sharper pain wording, overlap actions and group moves for a scope, with isolated refine and card-sort agents.
disable-model-invocation: true
---

Shared rules, layout and helper commands: `tools/pains/README.md`. Read it first.

1. **Start the run.** Use the scope given: one group ID, `personal`, `societal` or `all`. If none is given, ask. Run `python3 tools/pains/catalog.py refine-new <scope>`, then `refine-lint <run>`. Done when `lint.json` and `balance.json` exist.
2. **Start three blind sorters and one refiner, in parallel.** Each is a fresh, isolated agent: an Agent tool subagent in Claude Code, a new thread in Codex.
   - Sorter `n` (1, 2, 3): run `sort-input <run> --seed <n>` yourself and give it only this: "Read and follow `tools/pains/briefs/sort.md`. Your file: `<run>/sorts/<n>.json`." plus that output. A sorter never sees the current groups, the other sorts or the catalog.
   - Refiner: "Read and follow `tools/pains/briefs/refine.md`. Your run: `<run>`."

   Done when all four have replied.
3. **Check the run yourself.** Run `refine-check <run>`. An issue goes back to the agent that owns the file. Done when it reports zero issues.
4. **Report.** Give the founder: lint failures and notes by rule, overlap actions by kind, proposed group moves (two of three sorts agreeing), and the headings flagged small or large. These are proposals only, so offer `/pains-review` next.
