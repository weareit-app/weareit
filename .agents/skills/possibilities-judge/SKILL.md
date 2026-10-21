---
name: possibilities-judge
description: Judge possibility runs with three isolated judges, combine by consensus, and select finalists and audit samples, or rank a staged run's dreams with --staged.
disable-model-invocation: true
---

Shared rules, layout, and helper commands: `tools/possibilities/README.md`. Read it first.

Without `--staged`, judge card runs. With `--staged`, follow "Staged run" below instead.

## Card run

1. **Pick the runs.** Use the run paths given, or the newest run for each named pain. Done when each run passes `validate` and `lint`.
2. **Prepare the input.** For each run, save the output of `judge-input <run>` to a file outside the run folder. That file is the judges' whole input.
3. **Start three judges per run.** Each is a fresh, isolated agent that gets only this: "Read and follow `tools/possibilities/briefs/judge.md`. Input: `<judge-input file>`. Output: `<run>/judgments-<n>.json`. Run ID: `<runId>`." Here `n` is 1, 2, or 3. One judge's ranking moves a lot between near-identical runs, so three are required. Done when all three files exist for every run.
4. **Check the judgments.** Each judgment file scores exactly the run's top-level card IDs. A judge that scored individual fixes, or skipped cards, is rerun from scratch. Done when `validate <run>` passes with all three files.
5. **Combine and select.** Run `consensus <run>`, then `select <run>`. Done when `selection.json` has 3–5 finalists, at least 2 lenses, an It-led card and 2 audit samples.
6. **Optional audit.** If the founder asked for an audit, run `audit-build <runs…>` and publish the rating page as `/possibilities-calibrate` describes.
7. **Report.** For each pain, list the finalists inline: dream title and line, then each fix's title, kind, and status. Also list honesty exclusions and where the judges disagreed most. The founder reviews the content itself, so show it, don't just link to it.

## Staged run

A staged run is judged once its links are assembled. Each dream is judged with its linked fixes, and there are no finalists or audit samples: the ranking orders the founder's fix review.

1. **Pick the runs.** Use the run paths given, or the newest staged run for each named pain. Done when `status <run>` names `judge` and the run passes `validate` and `lint`.
2. **Prepare the input** as in the card run: save `judge-input <run>` to a file outside the run folder. Done when the file lists every accepted dream.
3. **Start three judges per run,** with the same words as the card run. Done when all three files exist for every run.
4. **Check, combine, and rank.** Each judgment file scores exactly the dream IDs in the input's `dreams`. A judge that scored a fix alone, or skipped a dream, is rerun from scratch. Then run `consensus <run>` and `select <run>`. Done when `ranking.json` exists and `status <run>` names `fix-review`.
5. **Stop for the fix review,** as `/possibilities-generate` "Staged run" step 4 describes. Before the founder's steps, show the ranking inline: each dream's title and line, then each linked fix's title, kind, and status, with honest-status failures last and their reasons.
