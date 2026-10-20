# Proposal

## Why

It should try to name every human pain it can, not only the ones on the personal and societal pages today. The current list is a one-time inventory (`docs/spec/pains/pain-inventory.yaml`, 125 pains). It has overlaps, such as Sleep and Tired, and wording the founder isn't happy with, and it has no way to grow, be checked against outside lists, or remember what the founder decided. Settling this before the possibility generator scales to more pains avoids regenerating cards later. Draft spec 004 (pilot repo, founder answers 2026-10-19) is the source, and the founder confirmed the decisions below on 2026-10-19 (see `confirm.md`).

## What Changes

People using It see no new screen. They see the result: the pains on the personal and societal pages (features.md §1 "See a short list of everyday pains", "Tap a pain to open it"). Those pages show only the pains the founder has published. The catalog can hold many more that aren't shown.

What the founder sees and does:

- **Discovery sweeps.** The founder asks for a sweep of one group, one page or everything. Agents check outside lists and surveys and return candidate pains the catalog doesn't cover. Each candidate comes with a source that was actually opened, a draft name and line, a proposed group and how common it is. Sources include the six mapped frameworks (OECD, WHOQOL, SDG, Max-Neef, Gallup wellbeing, Wikidata), Gallup's "Most Important Problem", Ipsos "What Worries the World", 211's public top-needs reports, WHO or IHME cause lists, and the founder's 774-pain pool as leads. Any other good source can be added. A sweep never asks again about something the founder rejected, unless new evidence turns up.
- **Coverage report.** For each outside list, the report shows how much the catalog covers, with each uncovered entry named and given a reason.
- **Refine pass.** Each pain's name and line are checked against the copy style guide. Where one fails, up to two alternatives that pass are offered. Graphic wording on sensitive pains is flagged for the founder to look at, never blocked and never hidden automatically. Refine proposes merge, split or keep for overlapping pains. It runs three blind card sorts and proposes a move where two of them agree on a different group. It flags headings that are much smaller or larger than the rest.
- **Review page.** This is a private page on the founder's own computer, like the calibration and audit pages. It shows one proposal at a time: the pain as it is now next to the proposed change, and why the change is proposed. The founder can accept it, pick an alternative, write their own wording, reject it, or mark it "later", and can add a note and undo. Choosing a decision never jumps to the next proposal. The founder can filter by group or by kind of change, and sees how many are left. Each review comes in two steps: first new pains and wording, then overlaps and group moves, which show the wording the founder just chose.
- **Into the content editor.** Accepted wording and group changes to pains already in the editor go into its draft. Accepting a new pain adds it to the catalog, waiting for ranking: review doesn't decide whether it's shown, and ranking (the `pain-tiers` change) proposes where it sits. A pain that becomes shown goes into the draft only once it has futures the founder approved. Until then it waits in the catalog. Nothing is published automatically. The founder publishes in the editor as today. The founder is warned when a heading would have fewer than 4 or more than 8 shown pains.
- **Merges.** A merged pain is retired with the surviving pain as its replacement (the pain-pages mechanism), so old links and saved picks keep working.
- **Generator stays in step.** When a pain's wording changes, or the pain is merged or split, its generated possibility runs are listed as stale. Asking for a run on a merged pain points to the surviving one.
- **First round.** A pilot on Money (personal) and Economy (societal), then a full sweep.

Out of scope:
- Counting themes from people's post-signup "Something else" input. That would change a privacy invariant and needs a decision record. This change leaves room for it: discovery sources are open-ended.
- Showing crisis resources first on sensitive pains. This is deferred, as in `own-contributions` and `help-build-it`. Sensitive pains are tagged so it can be added.
- New screens in the content editor. "More like this", which the founder dropped.
- Importing generated cards into the editor. That is still a `possibility-generator` divergence.

Must leave room for (features.md "soon" and later):
- Starting from a dream instead of a pain: the catalog doesn't require a dream to have a parent pain.
- Search over all pains: pains that aren't shown, aliases and relations are kept.
- The post-launch Thing / Type / Relation layer: outside references keep one consistent shape.
- Narrowing a pain down before showing futures: the catalog may hold narrower child pains under a broader one.

## Capabilities

### New Capabilities
- `pain-catalog`: the founder's catalog of every known pain, whether shown or not, and the pipeline that grows and sharpens it (discover, refine, review, ingest), with coverage, decision history and hand-off to the content editor draft.

### Modified Capabilities
- `possibility-generator`: runs take pain IDs and wording from the catalog instead of the pain inventory, record the wording they used, resolve merged IDs, and are marked stale when the wording changes.

## Impact

- New `tools/pains/` (Python stdlib helpers and tests, the same style as `tools/possibilities/`) and four user-invoked skills: `/pains-discover`, `/pains-refine`, `/pains-review`, `/pains-ingest`.
- New `docs/research/pains/`: `catalog.json` (seeded from `docs/spec/pains/pain-inventory.yaml`, which it replaces), source snapshots including the founder's two v2 CSVs, sweep runs, coverage reports, review sets and decisions.
- `tools/possibilities/cards.py` and its tests: read pains from the catalog, record wording in `run.json`, resolve merged IDs, report stale runs.
- Ingest uses the existing content editor operations (`cms.getDraft`, `cms.saveDraft` with the admin token). There are no API, database or app changes. Retiring with a replacement depends on the `pain-pages` change landing.
- `docs/spec/MIGRATION.md`: the spec 004 row points here.
- No new dependencies and no paid services.

## Open questions

All answered by the founder on 2026-10-19; see `confirm.md`.
