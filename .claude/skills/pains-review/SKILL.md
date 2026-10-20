---
name: pains-review
description: Build the founder's pain review page from checked discovery and refine runs.
disable-model-invocation: true
---

Shared rules, layout and helper commands: `tools/pains/README.md`. Read it first.

1. **Pick the runs.** Use the sweep and refine run paths given. If none are given, list the newest runs under `docs/research/pains/sweeps/` and `docs/research/pains/refine/` and ask which. Each must report zero issues on `sweep-check` or `refine-check`. Done when every run is checked.
2. **Build the wording set.** A review comes in two steps, so the founder judges overlaps and moves against the wording they chose. Run `python3 tools/pains/catalog.py review-build <run…> --stage wording --name <short-name>`: new pains, rewordings and drift. It adds any wording proposals the founder marked "later" last time. For a large set, build one per page or a few groups, about 50 proposals each. Done when it prints the set path.
3. **Build the structure set after the wording set is ingested.** Once `/pains-ingest` has applied the wording set, run `review-build <same runs…> --stage structure --name <short-name>`: keep both, merge, split, links across pages and group moves, each showing the pain's wording as the catalog now holds it. It refuses, naming the wording set, while any rewording from these runs is still undecided. Moves still come from the card sorts made on the old wording, so tell the founder to reject one a reword has made wrong. Done when it prints the set path.
4. **Open it for the founder.** Start the `pain-review` preview (`.claude/launch.json`, serves `docs/research/pains/` on port 4174) and open `/reviews/<set>/review.html`. Show the founder the proposals by kind before they start, per the founder's preference for seeing content before reviewing. A new pain is only accepted, reworded or rejected: ranking decides later whether and where it is shown.
5. **Hand off.** Tell the founder: decisions save in the browser as they go; deciding never moves on (Next does); "Download decisions" saves `decisions.json`, which goes to `/pains-ingest` with the set path.
