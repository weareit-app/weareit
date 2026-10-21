---
name: possibilities-generate
description: Write sourced possibility cards for one or more pains with isolated writer agents, or run the staged flow with --staged.
disable-model-invocation: true
---

Shared rules, layout, and helper commands: `tools/possibilities/README.md`. Read it first.

Without `--staged`, write a card run. With `--staged`, follow "Staged run" below instead.

## Card run

1. **Pick the pains.** Use the pain IDs given. If none are given, ask which ones. Each must exist in the pain catalog, `docs/research/pains/catalog.json`; a merged ID runs under the pain it was merged into. Done when every pain is a known ID.
2. **Start one writer per pain.** Each is a fresh, isolated agent: an Agent tool subagent in Claude Code, a new thread in Codex. Give it only this: "Read and follow `tools/possibilities/briefs/writer.md`. Your pain: `<pain-id>`." Run writers in parallel. Done when every writer has replied with its run path.
3. **Check each run yourself.** Run `validate` and `lint` on every run path. A run with issues goes back to its writer with the issue list. Done when every run reports zero issues.
4. **Report.** Give the founder one line per pain: the run path, the exemplars (verified out of total), the number of cards, and the lint result. These are unjudged candidates, so offer `/possibilities-judge` next. Don't present them as finalists.

## Staged run

The stages, their briefs, and their files are in the README's "Staged flow". Each pain's stages run in order; different pains may run side by side.

1. **Pick the runs.** Pain IDs are checked as in the card run. For each pain, run `new-run <pain-id> --staged`, adding `--pilot` when the founder asked for a pilot run. A run path given instead of a pain picks that run up where it stopped. Done when every pain has a staged run.
2. **Run the next stage.** Run `status <run>` and act on its `next`:
   - `examples`, `dreams`, `plan`, `shared-fixes`, `screen`, or `assemble`: run `start <run> <stage>`, then start one fresh, isolated agent (an Agent tool subagent in Claude Code, a new thread in Codex) and give it only this: "Read and follow `<brief>`. Your run: `<run>`. Your stage: `<stage>`." Here `<brief>` is the `brief` that `start` printed.
   - `kind-pools`: run `start <run> kind-pools`. Its `kinds` are the kinds with a ceiling above zero and no pool yet. For each one, one at a time, start a fresh agent with only this: "Read and follow `tools/possibilities/briefs/kinds/_shared.md`, then `<kind brief>`. Your run: `<run>`. Your kind: `<kind>`."
   - `dream-review`: stop for the founder, as step 4 says.
   - `judge`: run the staged judging in `/possibilities-judge`: its "Staged run", steps 2 to 4.
   - `fix-review`: stop for the founder, as step 4 says.
   - `done`: go to step 5.

   Done when the agent has replied.
3. **Check the stage yourself.** Run `validate <run>`, and after `dreams`, `lint <run>` too. A stage with issues goes back to its agent with the issue list. Done when it reports zero issues and `status` names a later stage (for a kind pool, when `start <run> kind-pools` no longer lists that kind). Then go back to step 2.
4. **Founder stops.** At `dream-review`, if `reviews/dreams-decisions.json` is in the run, run `dreams-ingest <run> <run>/reviews/dreams-decisions.json` and go back to step 2. At `fix-review`, do the same with `reviews/fixes-decisions.json` and `fixes-ingest`. If ingest refuses, show the founder its error and stop. Otherwise build the page (`dreams-review-build <run>` or `fixes-review-build <run>`), start the `dream-review` or `fix-review` launch config (in Codex, give the founder its command from `.claude/launch.json`), and end your turn with what the founder does, written out:
   - open the page URL, which is `http://127.0.0.1:<port>/<page>` for the `page` the build printed (4175 for dreams, 4176 for fixes);
   - accept, edit, or reject every dream (or every fix, and change its linked dreams), from the keyboard;
   - download the decisions and save them as `<run>/reviews/dreams-decisions.json` (or `fixes-decisions.json`);
   - run this skill again with `--staged <run>`, which ingests the decisions and goes on.

   Show the founder the count of dreams and overlap flags, or of fixes and their dreams, from the build's output.
5. **Report.** Give the founder one line per pain: the run path, whether it's a pilot run, the accepted dreams and linked fixes, the fixes left unlinked, and the lint result. Show the top three dreams of `ranking.json` inline with their final fixes: dream title and line, then each fix's title, kind, and status.
