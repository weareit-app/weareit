---
name: possibilities-judge
description: Judge possibility runs with three isolated judges, combine by consensus, and select finalists and audit samples.
disable-model-invocation: true
---

Shared rules, layout and helper commands: `tools/possibilities/README.md`. Read it first.

1. **Pick the runs.** Use the run paths given, or the newest run for each named pain. Done when each run passes `validate` and `lint`.
2. **Prepare the input.** For each run, save the output of `judge-input <run>` to a file outside the run folder. That file is the judges' whole input.
3. **Start three judges per run.** Each is a fresh, isolated agent that gets only this: "Read and follow `tools/possibilities/briefs/judge.md`. Input: `<judge-input file>`. Output: `<run>/judgments-<n>.json`. Run ID: `<runId>`." Here `n` is 1, 2 or 3. One judge's ranking moves a lot between near-identical runs, so three are required. Done when all three files exist for every run.
4. **Check the judgments.** Each judgment file scores exactly the run's top-level card IDs. A judge that scored individual fixes, or skipped cards, is rerun from scratch. Done when `validate <run>` passes with all three files.
5. **Combine and select.** Run `consensus <run>`, then `select <run>`. Done when `selection.json` has 3–5 finalists, at least 2 lenses, an It-led card and 2 audit samples.
6. **Optional audit.** If the founder asked for an audit, run `audit-build <runs…>` and publish the rating page as `/possibilities-calibrate` describes.
7. **Report.** For each pain, list the finalists inline: dream title and line, then each fix's title, kind and status. Also list honesty exclusions and where the judges disagreed most. The founder reviews the content itself, so show it, don't just link to it.
