# Design

## Context

- The pain list today is `docs/spec/pains/pain-inventory.yaml`, 125 pains, edited by hand. `tools/possibilities/cards.py` reads it with a regex scan (`pains()`), because the tools are stdlib-only Python with no YAML parser.
- Published content is a database-backed graph edited in `/cms` (`openspec/specs/content-catalog`). A pain there has `id`, `title`, `description` and `dreams`, inside a domain. The CMS operations are `cms.getDraft` and `cms.saveDraft({ expectedRevision, changeNote, content })` in `packages/api/src/contract.ts`, guarded by `CMS_ADMIN_TOKEN`.
- The `pain-pages` change adds `retired` and `replacementPainId` to the pain record. The `locked-content-ids` change locks published IDs. Ingest relies on both and must not reinvent them.
- Generator runs (`run.json`) record `painId` but not the wording they used.
- The founder's pool is two CSVs, relations v2 (808 rows of `subject_id, relation, object_id, provenance`, SKOS `broader` links) and audit v2 (8 rows).
- Founder decisions are in `confirm.md`.

## Goals / Non-Goals

**Goals:**
- One catalog file that every pain tool reads, with history kept inside it.
- Every step can be rerun. While its review is open it leaves a dated run folder behind, like the generator does; once ingested, the batch folds into one archive file.
- Ingest is the only step that touches the CMS, and it only ever writes the draft.

**Non-Goals:**
- No CMS screens, API operations or migrations.
- No card import into the CMS (still a generator divergence).
- No automatic schedule. Sweeps run when the founder asks.

## Decisions

1. **Catalog file format: JSON, with a generated Markdown view.** The catalog is `docs/research/pains/catalog.json`, which `tools/pains` validates. `catalog.md` is regenerated from it for reading on GitHub. *Why:* the tools stay stdlib-only, and the generator's run data is already JSON. Hand-scanning nested YAML (relations, history, maps) is fragile. *Alternative:* YAML as confirmed in Q1. Kept only as the seed input. Same place, same role, different format. The inventory YAML is then moved to `docs/research/pains/sources/` as a snapshot.
2. **Record shape.** Each record has `id, name, line, page, group, secondaryGroups[], status, role, sensitive, evidence[{url, accessed, passage}], maps{oecd, whoqol, sdg, maxneef, gallup, wikidata, …}, aliases[], relations[{kind, id}], founderPool, history[{date, kind, from, to, prompt, note}]`. Outside references keep one `maps` shape for the later Thing layer. `rejected` is a status, so its source entries are remembered for dedupe.
3. **Folder layout.**
   - `docs/research/pains/catalog.json`
   - `sources/`: the inventory snapshot, the founder's CSVs and opened-source snapshots.
   - `sweeps/<scope>/<runId>/` with `candidates.json`, `coverage.json` and `coverage.md`.
   - `refine/<scope>/<runId>/` with `lint.json`, `alternatives.json`, `overlaps.json`, `labels.json`, `sorts/{1,2,3}.json` and `balance.json`.
   - `reviews/<setId>/` with `proposals.json`, `review.html` and `decisions.json`.
   - `archive/<batch>.jsonl`: a closed batch's run and review inputs (decision 12). Derived files are git-ignored.

   *Why:* the same shape as `docs/research/possibilities/runs`. Runs are never overwritten.
4. **Pipeline split between agents and helper.** Skills drive agents for the judgement work: searching, wording alternatives, overlap calls and blind sorts, each sort a separate agent that sees only the names and lines plus the page's group names. `tools/pains/catalog.py` does everything mechanical: validate, seed, dedupe (normalized name, line and aliases, plus rejected source entries), coverage counts, lint, sort agreement, balance, building the review page, ingest and the drift check. Lint reuses the copy-guide rules and the banned phrases from `tools/possibilities/config`, imported, not copied.
5. **Review page.** Built from a template like `calibration-page.template.html`, written as a standalone file. Decisions are kept in `localStorage` while reviewing, as a convenience only, and saved with an explicit "Download decisions" (`decisions.json`). Each decision key saves and stays put. `n` / `p` move between proposals. *Why:* this already worked for the audits, and it needs no server.
6. **Ingest to the CMS.** `catalog.py ingest` runs in two steps.
   - First it applies the decisions to the catalog.
   - Then it builds a draft patch:
     - title, description and domain for accepted pains already in the draft;
     - `retired` with `replacementPainId` for merged pains that are published;
     - new shown pains only when they have founder-approved dreams in the draft.

   It calls `cms.getDraft`, checks the patched content with the read-only `cms.previewDraft` (the editor's own schema), then `cms.saveDraft` with the same `expectedRevision`, so a concurrent edit makes the save fail instead of overwriting. Only pains this review touched are patched, and one the editor changed since is reported as a conflict, never overwritten. "Approved futures" means the pain's `futures` lists dream IDs already in the draft; card import (a separate change) will fill it. Merges of pains the editor still shows are held as "later" until the `retired` field exists. The API URL and token come from the environment and are never written to disk. A `--dry-run` prints the patch and the heading warnings. *Alternative:* the founder copies changes by hand. Rejected, because it's error-prone and leaves no record.
7. **Drift check.** It compares the catalog with `cms.getDraft` and the latest published version, and lists differences. Bringing an editor change back is a normal review proposal of kind `reword`, prompted by `drift`.
8. **Generator hand-off.** `cards.py pains()` reads `catalog.json`, resolving `merged-into`. New runs write `painName` and `painLine` into `run.json`. `cards.py stale` compares each latest run with the catalog. For old runs without wording, it uses the catalog history at `startedAt`, falling back to the seed wording.
9. **Founder's pool.** Before copying, the CSVs are checked for names, places or personal notes. Only the generic pain hierarchy goes in, with a README saying it is AI-generated and counts as leads only.

10. **Two review steps.** `review-build --stage wording|structure` builds both steps from the same sweep and refine runs.
    - The wording set holds `add`, `reword` and `drift`.
    - The structure set holds `merge`, `split`, `keep`, `other-page` and `move`. It reads each pain's name and line from the catalog at build time, so it shows the ingested wording.
    - A structure build refuses while any reword from its refine runs is neither ingested nor in `later.json`.
    - Moves still use the card sorts made on the old wording. Sorts aren't rerun; the founder rejects a move that a reword has made wrong.

    *Why:* a "keep both" decision only makes sense against the final wording, and the catalog is already the one source of wording. *Alternative:* update cards on the page as the founder rewords. Rejected, because the page would have to work out the founder's own wording, duplicate flags and ingest order in the browser, and two separate sets give the same result with no new page logic. Founder decision, 2026-10-20.
11. **Placement waits for ranking.** A new-pain card no longer offers shown or not shown. Accepting it, as proposed or in the founder's own wording, adds the pain with role `not-shown` and `unranked: true`, so it never reaches the editor draft before ranking. Validation allows `unranked` only on accepted, not-shown pains.
    - Ranking (the `pain-tiers` change) ranks `unranked` pains with the rest of their heading and clears the mark. Its role migration maps `unranked` pains to `secondary`, not `hidden`, and every other `not-shown` pain to `hidden` as planned.
    - An `alternative` decision on a new pain from a set built before this (Alternative 2, "shown") is read as accept.
    - Body-mind's 16 new pains, already ingested as 12 shown and 4 not shown, are rewritten once to `not-shown` and `unranked`, with a history entry. None of them is in the editor draft yet, since all were waiting for futures.

    *Why:* choosing shown or not shown before ranking curates a heading twice, and "not shown" would become `hidden`, which ranking skips. Founder decision, 2026-10-20: every accepted new pain is ranked; there is no separate "catalog only" choice in review. *Alternative:* keep the choice and let ranking revisit shown pains only. Rejected, because rare but serious pains accepted as not shown would never be ranked.
12. **Keep inputs, rebuild outputs, archive closed batches.** Only inputs are committed:
    - sweeps: `sweep.json`, `lists.json`, `mapping.json`, `candidates.json`
    - refine: `refine.json`, `alternatives.json`, `overlaps.json`, `labels.json`, `sorts/`
    - reviews: `proposals.json`, `decisions.json`, `ingested.json`

    `check.json`, `coverage.json`, `coverage.md`, `lint.json`, `balance.json`, `refine-check.json` and `review.html` are git-ignored and rebuilt. `archive <set…>` writes one JSON Lines file per batch (`{kind, path, data}` per file) and removes the folders.

    *Why:* the full sweep committed about 74,000 lines of data, and most of it was derived or only needed while a set was open. The catalog already holds each pain's evidence, covered entries and decision history. Founder decision, 2026-10-20. *Alternative:* delete closed runs. Rejected, because it would end coverage reruns and auditing.

## Risks / Trade-offs

- [`pain-pages` hasn't landed, so there's no `retired` field] → Ingest refuses merges of published pains with a clear message until the field exists. Other changes still go through.
- [Agents cite sources that don't support the claim] → The opened passage is stored, and the review page shows it next to the claim. As in the generator, a candidate without a passage fails validation.
- [Card sorts by agents reflect model bias, not people] → They only propose moves, and the founder decides. Research questions about real people's sorting stay open.
- [The catalog and the CMS drift apart] → The drift check runs on every ingest and on demand. The CMS is never overwritten.
- [The review set gets too big to be bearable] → Review sets are split by group, with a target of 50 proposals in under 20 minutes. The pilot (Money, Economy) checks this.
- [Two sets per batch means more steps for the founder] → Each set is shorter, and a structure set is mostly quick "keep both" cards.
- [Coverage numbers hide weak matches] → Each covered entry records the pain that covers it and why, so the founder can spot-check.

## Migration Plan

1. Seed `catalog.json` from the inventory. Validation proves every ID is kept.
2. Switch `cards.py` to the catalog. The existing generator tests must still pass.
3. Move the inventory to `sources/` and leave a pointer in `docs/spec/pains/`.
4. Pilot on Money and Economy, then the founder reviews, then a full sweep.

To roll back, restore the inventory path in `cards.py`. The catalog is additive.

## Open Questions

- Which 211 public reports to use as the standing source (national counts or a few large regions). The sweep picks the best available and records it. This doesn't change the specs.
