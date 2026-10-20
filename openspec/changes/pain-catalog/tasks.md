# Tasks

## 1. Catalog and seed

- [x] 1.1 Create `tools/pains/catalog.py` with the record shape and `validate` (required fields, statuses, roles, relation targets exist, IDs never reused, evidence has URL, date and passage), and verify the `tools/pains/tests` cases for each failure pass
- [x] 1.2 Add `seed` from `docs/spec/pains/pain-inventory.yaml`: `current` pains become accepted (shown if in the latest published version, read from a saved snapshot), cut pains become rejected, the rest stay candidates. Verify with a test that all 125 IDs survive unchanged and `validate` passes on the result
- [x] 1.3 Write `docs/research/pains/catalog.json` and the generated `catalog.md`, move the inventory to `docs/research/pains/sources/` with a pointer left in `docs/spec/pains/`, and verify `catalog.py validate` passes on the committed file
- [x] 1.4 Check the founder's two v2 CSVs for anything personal, copy them into `sources/` with a README marking them as AI-generated leads, and verify the README names both files and their row counts
- [x] 1.5 Write `tools/pains/README.md` (rules every pain writer follows, folder layout, commands) and verify each documented command runs

## 2. Generator hand-off

- [x] 2.1 Switch `cards.py pains()` to read `catalog.json` with merged-ID resolution, and verify the existing `tools/possibilities/tests` pass along with new tests for an unknown ID and a merged ID
- [x] 2.2 Record `painName` and `painLine` in new `run.json` files, and verify with a test and an update to `tools/possibilities/data-model.md`
- [x] 2.3 Add `cards.py stale` (wording changes, merges, splits, history fallback for old runs), and verify tests for each reason and that it runs cleanly on the current runs

## 3. Discover

- [x] 3.1 Add `catalog.py` sweep helpers: start a sweep run, validate candidates (opened source and passage, or draft), dedupe against pains, aliases and rejected source entries with a "new evidence" exception, and verify tests for each scenario in the spec
- [x] 3.2 Add coverage counting per list, producing `coverage.json` and `coverage.md` with a reason for every uncovered entry, and verify with a fixture list
- [x] 3.3 Write the `/pains-discover` skill and its agent brief (source list, open-ended sources allowed, leads-only rule, no post-signup input), and verify the skill loads and names the helper commands that exist

## 4. Refine

- [x] 4.1 Add pain-wording lint that reuses the copy guide and banned phrases from `tools/possibilities/config`, with graphic wording on sensitive pains as a note rather than a failure. Verify with tests, including the `drinking-too-much` mismatch and a sensitive pain that still passes
- [x] 4.2 Add sort agreement (two of three) and group balance, and verify tests with fixture sorts and the Safety / People sizes
- [x] 4.3 Write the `/pains-refine` skill with briefs for alternatives (at most two, both re-linted), overlap actions and blind card sorts (one agent per sort, no current groups shown), and verify the skill loads

## 5. Review

- [x] 5.1 Add `catalog.py review` to build `proposals.json` and `review.html` from a template, and verify by opening the page that the keyboard covers decide, note, undo, filter and next, and that deciding never advances
- [x] 5.2 Check the review page's accessibility: kind and current vs proposed announced, filter result count announced, text labels for status, no required animation. Verify with the browser accessibility tree
- [x] 5.3 Write the `/pains-review` skill and verify it builds a set for one group

## 6. Ingest

- [x] 6.1 Add `ingest` to apply decisions to the catalog (accepted only, history entries, rejected remembered, "later" returns, merges with aliases, splits), and verify tests for each scenario
- [x] 6.2 Add the draft patch and the CMS client (`getDraft`, then `saveDraft` with `expectedRevision`), with a URL and token from the environment, `--dry-run`, heading warnings, waiting-for-futures and refusing published merges until `retired` exists. Verify with tests against a fake API, including a revision conflict
- [x] 6.3 Add `drift`, and verify with a test where the editor's wording differs from the catalog
- [x] 6.4 Write the `/pains-ingest` skill and verify a dry run against the local API prints a patch and no save happens

## 7. Pilot

- [x] 7.1 Run discover and refine on Money and Economy, build the review set, and verify the founder can work through it (target 50 proposals in 20 minutes)
- [x] 7.2 Ingest the founder's decisions, show the draft patch, and verify nothing is published and `catalog.py validate` and `cards.py stale` run cleanly

## Workflow follow-up

- Update the `docs/spec/MIGRATION.md` row for `specs/004-pain-catalog/` once this change is confirmed, then plan the full sweep.
- Archive with `/opsx:archive` after the pilot, then sync `pain-catalog` and `possibility-generator` specs.
