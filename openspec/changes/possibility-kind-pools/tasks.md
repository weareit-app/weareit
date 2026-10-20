# Tasks

Start only after the pain-catalog change (PR #27) and the full pain sweep are merged into master. Run the generator tests with `python3 -m unittest discover -s tools/possibilities/tests`.

## 1. Run shape and stages

- [ ] 1.1 Add v2 file shapes (`dreams.json`, `fixes.json`, `plan.json`, `links.json`, `screen.json`, review decisions) to `tools/possibilities/data-model.md`, and add `validate` support for them, with v1 runs still valid. Verify with new validation tests for each file, plus the existing v1 tests unchanged.
- [ ] 1.2 Add the kind list (adding `ask` and `resource`, keeping `path` reserved, and allowing the trial kinds `leave` and `switch` only when `run.json` has `"pilot": true`) and the method fields required for each kind to `validate`. Verify with tests: an Ask without a decision-maker fails, a trial kind outside a pilot run fails, and a Use a resource fix marked `proposed_it_feature` fails.
- [ ] 1.3 Add `status <run>`, which reports the next stage from the files present, and make each stage subcommand refuse when the stage before it is incomplete. Verify with a test: starting a kind pool before dream review is ingested exits with code 2.
- [ ] 1.4 Make a repair run keep dream and fix IDs and their links. Verify with a repair test on a v2 fixture.

## 2. Dreams and founder dream review

- [ ] 2.1 Write `briefs/dreams.md` (dreams from the opened examples, with lens, ambition and overlap flags with reasons). Verify that a dry run on a fixture pain produces a `dreams.json` that passes `validate` and `lint`.
- [x] 2.2 Add `dreams-review-build` (writing `reviews/proposals.json` and `review.html` from a template adapted from `tools/pains/config/review-page.template.html`) and a local launch config to serve it. Verify that the page loads, shows each dream once with its overlap flags as text, and exports decisions from the keyboard alone.
- [x] 2.3 Add `dreams-ingest <run> <decisions.json>`, which records accept, edit and reject and keeps the original text beside each edit. Verify with tests: an edited line reaches the plan input, and rejected dreams don't.

## 3. Plan, shared fixes and kind briefs

- [x] 3.1 Write `briefs/planner.md` (one planner per pain, a ceiling per kind for each dream, zero allowed, with a reason) and add `plan.json` validation. Verify with a test: a plan with no reason for a ceiling of zero fails.
- [x] 3.2 Write `briefs/shared-fixes.md` (fixes that serve several dreams, with proposed links). Verify on a fixture that a shared fix is stored once with several proposed dream IDs.
- [ ] 3.3 Write `briefs/kinds/_shared.md` and one brief for each kind in `briefs/kinds/`, from the research note: method fields, boundary tests, and a good and a bad example in It's voice. Fold `feature-pitch.md` into `kinds/feature.md`. Verify that every kind in the validator has a brief, with a test listing the files against the enum.
- [x] 3.4 Make kind briefs run only for kinds with a ceiling above zero, and accept fewer fixes with a `shortfallReason`. Verify with tests: a pool under its ceiling with a reason passes, and a pool over its ceiling fails.

## 4. Lint

- [x] 4.1 Add `template-copy` lint for method templates in titles and text ("When I…, I want…", "After I…, I will…", "If…, then I will…"). Verify with tests using the spec's job-story example.
- [x] 4.2 Add `near-duplicate-fix` lint, comparing title tokens across a pain's pool. Verify with a test: two fixes that differ only in word order are flagged.
- [x] 4.3 Move coverage from cards to accepted dreams and their linked fixes: at least 4 lenses, all three ambitions, at least 3 basics tonight, and at least one dream with a Feature linked, with no kind minimum. Verify with the spec's "One Feature is enough" and "No Feature" scenarios as tests.

## 5. Screen, assembly and judging

- [x] 5.1 Write `briefs/screen.md` (actionable, right kind, honest status) and add `screen.json` handling, so fixes that fail are kept but can't be linked. Verify with a test: linking a screened-out fix fails validation.
- [x] 5.2 Write `briefs/assembler.md` (links, order, how each fix helps, 2–5 fixes per dream, path candidates) and add `links.json` validation. Verify with tests: six links on one dream fail, and an unlinked fix stays in `fixes.json`.
- [x] 5.3 Change `judge-input` to list each accepted dream with its linked fixes, repeating shared fixes and leaving out method fields, writer notes and provenance. Change `consensus` to key by dream ID, and make `select` write `ranking.json` without finalists. Update `briefs/judge.md` and `config/rubric.md` to match. Verify with tests: a shared fix appears under three dreams, and fix-ID score keys fail validation.

## 6. Founder fix review

- [ ] 6.1 Add `fixes-review-build`: one list ordered by `ranking.json`, each fix once, with kind and status as text labels, the cited example, linked dreams as removable chips, a way to add a dream link, unlinked fixes last, and method fields in a collapsed note. Verify that the page works from the keyboard alone, that a screen reader announces kind, status, linked dreams and the note's expanded or collapsed state, and that the page uses no motion.
- [ ] 6.2 Let founder links take a dream past 5 fixes, marking them as founder links, while assembler links stay capped at 5. Verify with tests: a sixth founder link passes `validate`, and a sixth assembler link fails.
- [ ] 6.3 Add `fixes-ingest <run> <decisions.json>`, which records one decision per fix and the final links. Verify with tests: one decision is kept for a shared fix with all its links, and an edit keeps the original text beside it.

## 7. Calibration pages and skills

- [ ] 7.1 Change `calibrate-build` and `audit-build` so an item is a dream with its linked fixes. Verify with existing calibration tests updated to v2 fixtures, plus a v1 fixture that still builds.
- [ ] 7.2 Add staged steps to `possibilities-generate`, `possibilities-judge` and `possibilities-repair` (Claude and Codex copies), with explicit stops for the two founder reviews, behind a `--staged` option so the old flow still runs. Verify by running a dry staged generate on a fixture up to the dream review stop.
- [ ] 7.3 Add Ask (`message-circle-question`), Use a resource (`life-buoy`), and the trial kinds Leave (`door-open`) and Switch (`arrow-left-right`) to the "Kinds of fixes" table in `docs/style/copy-style-guide.md`. Update `tools/possibilities/README.md` for the staged flow, the run files, and the coverage rules. Verify that the README's subcommand table matches `cards.py --help`.

## 8. Pilot comparison

- [ ] 8.1 Add `compare-build <pain…>` (pairs each pilot pain's newest v1 and v2 runs, builds a blind set with a separate key, and refuses if the v1 run is stale) and `compare-report <export>` (mean rating per flow, distinct kinds among linked fixes, founder review time, fill rate against ceilings, and tokens per stage, with a `scale-up` or `iterate` result). Verify with tests: the set has no origin information, and a slower review gives `iterate` and names that check.
- [ ] 8.2 Run the pilot on the founder's chosen pains: rerun the old flow if its run is stale, run the staged flow with both founder reviews, build the comparison set, and ingest the founder's ratings. Verify that `compare-report` prints a result and that the run folders pass `validate` and `lint`.

## 9. Switch over (only if the pilot says `scale-up`)

- [ ] 9.1 Make the staged flow the default in the skills, and remove `writer.md`, `classify-kinds.md` and `feature-pitch.md`, along with the old-flow paths in the skills. Verify that the full test suite passes and that `rg "classify-kinds|feature-pitch|writer.md" tools .claude .agents` returns only history.
- [ ] 9.2 Regenerate the 17 pains with runs using the staged flow, keeping the old runs. Verify that each pain has a v2 run that passes `validate` and `lint`, with both founder reviews ingested.

## Workflow follow-up

- If the pilot says `iterate`, adjust briefs or plan rules and repeat 8.2 before group 9.
- Propose the separate change that adds the settled kinds to the app (`packages/content` `fixKinds`, editor, icons, pain-explorer).
- Archive this change after `pain-catalog` is archived, since this change's "Runs per pain" delta builds on it.
