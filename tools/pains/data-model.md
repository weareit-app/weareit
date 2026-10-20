# Pain catalog data model

All files are UTF-8 JSON with `schemaVersion: 1` where shown. IDs match `^[a-z0-9]+(?:-[a-z0-9]+)*$`. The catalog record is described in [README.md](README.md#the-catalog).

## Sweep run: `docs/research/pains/sweeps/<scope>/<runId>/`

`<scope>` is a group ID (`money`), a page (`personal`, `societal`) or `all`. Made by `sweep-new`; never overwritten.

**sweep.json**: `{ schemaVersion, scope, runId, startedAt, finishedAt, searches?, pagesOpened?, notes }`

**lists.json**: the outside lists read in this sweep, each entry as the list names it.
```
{ lists: { <list-id>: { name, url, accessed, entries: { <entry-id>: { name, url?, passage? } } } } }
```

**mapping.json**: where each list entry went. One of:
```
{ entries: { "<list-id>/<entry-id>": { painId, why }        # an existing pain covers it
                                   | { candidate }          # a new candidate in this sweep
                                   | { broader }            # a pain covers it, but more broadly
                                   | { outOfScope } } }     # with a short reason
```

**candidates.json**: new pains proposed by the sweep.
```
{ candidates: { <id>: { id, name, line, page, group, aliases?,
    sources: [ { url, accessed, passage } ],   # opened in this sweep; empty means draft
    leads?: [ text ],                           # unopened hints (founder pool, AI registries)
    prevalence?: text,                          # every figure must appear in a cited passage
    covers: [ { list, entry } ],
    newEvidence?: bool,                         # set when a rejected pain has a new source
    ownPain?: bool } } }                        # only when the founder said it is their own
```

**check.json** (written by `sweep-check`): `{ issues, proposed: [{candidate, newEvidence?, earlier?, rejection?}], drafts, skipped: [{candidate, reason}], covered: [{list, entry, painId}] }`

**coverage.json** and **coverage.md** (written by `coverage`): per list `{ name, url, entries, covered, share, meetsTarget, coveredEntries, uncovered: [{entry, name, url, reason}] }`, target 0.9.

## Refine run: `docs/research/pains/refine/<scope>/<runId>/`

Made by `refine-new`; never overwritten.

**refine.json**: `{ schemaVersion, scope, runId, startedAt, notes }`

**lint.json** (written by `refine-lint`): `{ issues: [ { painId, rule, detail, severity: fail|note, group? } ], failing: [painId] }`. Rules: `not-first-person`, `line-length`, `vague-line`, `name-length`, `loaded-term`, `generic-phrase`, `regional-word`, `clinical-term`, `mixed-labels` (fail); `id-mismatch`, `graphic-wording` (note; graphic only on sensitive pains). Word lists: `tools/pains/config/pain-lint.json` and `tools/possibilities/config/banned-phrases.json`.

**balance.json** (written by `refine-lint`): `{ sizes: {group: shown}, flags: [ {group, shown, median, flag: small|large} ] }`. Small is at most half the page's median; large is at least twice it.

**alternatives.json**: `{ alternatives: { <painId>: [ { name, line, why } ] } }`, one or two per pain, each passing lint. Every failing pain needs at least one.

**overlaps.json**: `{ pairs: [ { a, b, action: merge|split|keep|other-page, survivor?, splitOf?, into?: [ {name, line} ], distinction?, reason } ] }`. Every `overlaps` and `other-page` relation in scope needs a pair. The reason is one sentence.

**labels.json**: `{ labels: { <painId>: problem|area } }`

**sorts/<n>.json**: `{ sorter: "isolated", placements: { <painId>: <groupId> } }`, at least three, each placing every pain in scope.

**refine-check.json** (written by `refine-check`): `{ issues, moves: [ {painId, from, to, sorts} ], disagreements: [ {painId, current, sorts} ] }`. A move needs two sorts agreeing on a group other than the current one.

## Review set: `docs/research/pains/reviews/<set>/`

**proposals.json** (written by `review-build`): `{ schemaVersion, setId, builtAt, runs, flags, covered: [{list, entry, painId}], proposals: [ {
  id, kind: add|reword|merge|split|keep|other-page|move|drift, painIds, group, current, proposed, alternatives,
  why: { prompt, detail, sources? }, side, draft, allowOwn, newEvidence?, rejection?, origin, payload } ] }`.
`payload` holds what ingest applies (the candidate record, the survivor, the split, the move's groups) and is left out of the page. For `add`, `proposed` has role `not-shown` and the first alternative is the same wording, `shown`.

**decisions.json** (downloaded from the page): `{ schemaVersion, setId, decisions: { <proposal-id>: { decision: accept|alternative|own|reject|later, choice?, own?: { name, line, role? }, note, decidedAt } } }`. `choice` 0 is the first alternative. A draft can only be decided `own`, `reject` or `later`.

**ingested.json** (written by `ingest`): `{ set, decided, later, held, catalogChanged, editor: { changes, waiting, conflicts, refused, warnings, schemaChecked?, revision? }, log, ingestedAt }`. A set is ingested once.

## later.json: `docs/research/pains/later.json`

`{ schemaVersion, proposals: [...] }`: proposals marked "later" or left undecided, with their payloads. `review-build` puts them first in the next set.
