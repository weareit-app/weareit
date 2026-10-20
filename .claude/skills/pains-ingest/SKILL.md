---
name: pains-ingest
description: Apply the founder's pain review decisions to the catalog and the content editor's draft, never publishing.
disable-model-invocation: true
---

Shared rules, layout and helper commands: `tools/pains/README.md`. Read it first.

1. **Get the inputs.** The review set path (`docs/research/pains/reviews/<set>/`) and the founder's downloaded `decisions.json`. If either is missing, ask. Done when both exist and the decisions name the same set.
2. **Reach the editor.** The local API must be running (`api` in `.claude/launch.json`) with `CMS_ADMIN_TOKEN` set in your environment; set `PAIN_CMS_API_URL` if it isn't `http://localhost:3001`. Never print or write the token. Done when `python3 tools/pains/catalog.py drift` returns.
3. **Dry run.** Run `ingest <set> <decisions.json> --dry-run`. Show the founder, in plain words: catalog changes, editor changes, pains waiting for futures, conflicts (pains edited in the editor since, never overwritten), merges held until the editor can retire a pain, and heading warnings. Done when the founder says to go ahead.
4. **Ingest.** Run the same command without `--dry-run`. It saves the editor draft (refusing if the draft changed meanwhile; then rerun from step 3), then writes the catalog, `catalog.md`, `later.json` and `<set>/ingested.json`. Run `validate` and `python3 tools/possibilities/cards.py stale`.
5. **Report.** Tell the founder what changed, which possibility runs are now stale, and that publishing is theirs to do in `/cms`. Nothing is published from here. If this was a wording set, build its structure set next (`/pains-review` step 3).
