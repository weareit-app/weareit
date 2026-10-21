---
name: possibilities-calibrate
description: Build, publish and ingest the founder's blind calibration and audit rating rounds, then report the gate.
disable-model-invocation: true
---

Shared rules, layout and helper commands: `tools/possibilities/README.md`. Read it first. The founder rates; agents never rate on the founder's behalf.

## Build and publish a round

1. **Build the set.**
   - For calibration, check that `docs/research/possibilities/calibration/baseline.json` holds the old cards and every known pain has a selected card run (`selection.json`) or a ranked staged run (`ranking.json`). Then run `calibrate-build`.
   - For an audit, run `audit-build <runs…>`.

   Done when the set and the key exist.
2. **Publish the rating page.** Fill `tools/possibilities/config/calibration-page.template.html` by replacing `/*ITEMS*/` with the set's JSON. Publish it as a **private** Artifact with the database capability (owner-only writes), and include only the set's items. The key stays local and is never published. Done when the page loads, shows the first card, and saves and clears a test rating.
3. **Tell the founder** where the page is, what to rate (Love, Keep or Kill, with an optional reason) and roughly how long it takes, at about a minute per card.

## Ingest and report

4. **Export the ratings** with ArtifactData to a local JSON file shaped like `{ratings: {<id>: {rating, reason?, rewriteAs?, ratedAt}}}`. Done when every rated item is in the file.
5. **Ingest.**
   - For calibration, run `calibrate-ingest <file>`, then rewrite `tools/possibilities/config/style-guide.md`. Say what the founder loved and killed, and why, quoting their reasons word for word with item titles. Where they gave no reason, describe only what's visible in the item and label it as your reading.
   - For an audit, save the export as the evaluation's `audit-ratings.json`.
6. **Report.** Run `report --audit <file>` and write `evaluation.md` in the evaluation folder, starting with the gate result (`scale-up` or `iterate`) and the checks that failed. Then cover:
   - blind old-versus-new rates;
   - fresh-pain finalist rates;
   - judge agreement;
   - review minutes;
   - cost per pain, times the number of pains.

   Report a failing gate as failing. Include the founder's structural notes, the ones ratings can't measure, as their own section.

## Pilot comparison

Before the old flow is retired, compare it with the staged flow on the founder's pilot pains (Sleep, High rent, and Loneliness: `poor-sleep`, `rent-eats-everything`, and `loneliness`).

1. **Build the set.** Each pilot pain needs a selected card run and a ranked staged run whose dream and fix reviews are ingested. Run `compare-build <pain…>`. If it refuses a stale run, rerun that flow on the current wording first. Done when `compare-set.json` and `compare-key.json` exist.
2. **Publish and rate** as in steps 2–4 above, with `compare-set.json` as the items. The key stays local.
3. **Report.** Run `compare-report <export>` and write `evaluation.md` in `evaluations/pilot-2026-10/`, starting with the result (`scale-up` or `iterate`) and the checks that failed. Then cover the mean rating per flow, kinds per pain, review minutes, fill rate, and tokens per stage.
