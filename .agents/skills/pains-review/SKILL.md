---
name: pains-review
description: Build the founder's pain review page from checked discovery and refine runs.
disable-model-invocation: true
---

Shared rules, layout and helper commands: `tools/pains/README.md`. Read it first.

1. **Pick the runs.** Use the sweep and refine run paths given. If none are given, list the newest runs under `docs/research/pains/sweeps/` and `docs/research/pains/refine/` and ask which. Each must report zero issues on `sweep-check` or `refine-check`. Done when every run is checked.
2. **Build the set.** Run `python3 tools/pains/catalog.py review-build <run…> --name <short-name>`. It adds any proposals the founder marked "later" last time. For a large set, build one per group so each takes about 20 minutes (50 proposals). Done when it prints the set path.
3. **Open it for the founder.** Start the `pain-review` preview (`.claude/launch.json`, serves `docs/research/pains/` on port 4174) and open `/reviews/<set>/review.html`. Show the founder the proposals by kind before they start, per the founder's preference for seeing content before reviewing.
4. **Hand off.** Tell the founder: decisions save in the browser as they go; deciding never moves on (Next does); "Download decisions" saves `decisions.json`, which goes to `/pains-ingest` with the set path.
