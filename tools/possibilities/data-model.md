# Possibility generator data model

All files are UTF-8 JSON with `schemaVersion: 1`. IDs match `^[a-z0-9]+(?:-[a-z0-9]+)*$`. Enums:

- **lens**: `individual | relational | community | market | policy | technology | culture`
- **ambition**: `tonight | this-year | together`
- **status** (honest status, AGENTS.md): `real_now | existing_resource | proposed_it_feature | societal_proposal`
- **rating**: `love | keep | kill | skip`, plus an optional `rewriteAs` string in audits

## exemplars.json (per run)
```
{ schemaVersion, painId, runId, exemplars: { <exemplar-id>: {
    name, place, year, outcome,          # outcome: a concrete number or result, or null
    lens, url, accessed, locator,        # locator: section/page or a quote ≤15 words
    verified: bool, limits } } , shortfallReason? }
```
Rules:
- `verified` requires `url`, `accessed` and `locator`.
- Fewer than 10 exemplars requires `shortfallReason`.
- At least 4 distinct lenses are needed unless `shortfallReason` explains why.

## cards.json (per run)
```
{ schemaVersion, painId, runId, cards: { <card-id>: {
    title, line, lens, ambition, status,          # no scene (dropped 2026-10-17)
    fixes: [ { id, title, whatChanges, who, exemplarRef | null,
               speculative: bool, speculativeRationale?, firstStep, firstStepMinutes, status,
               kind: feature|task|schedule|habit|practice|learn|project|group|new-group|path,
               featureIdea? } ],   # feature ⇔ status proposed_it_feature; practice requires featureIdea
    provenance: { sourceId, locator, evidenceType, rights, reviewStatus: "unreviewed" },
    writerNotes? } } }
```
Rules:
- 2–5 fixes per card (raised from 4 on 2026-10-19 to make room for features found by the feature-pattern pass).
- Either `exemplarRef` resolves to an exemplar in the same run, or `speculative: true` with a rationale.
- `firstStepMinutes` must be 20 or less.
- Fix IDs are unique across the pain.
- `writerNotes` is stripped from judge input.
- The provenance fields mirror `contentProvenanceSchema` (`packages/content/src/graph-schema.ts`).

## lint.json (per run)
`{ passed: bool, issues: [ { cardId, fixId?, rule, detail } ], coverage: { lenses: [...], ambitions: [...] } }`

## judgments.json (per run)
```
{ schemaVersion, painId, runId, judge: { context: "isolated", model?, at },
  scores: { <card-id>: { actionable, nonObvious, namedExample, surprise, voice, power: {score 1-5, reason},
                         honestStatus: { pass: bool, reason } } },
  pairwise: [ { a, b, winner, reason } ], seed }
```

## selection.json (per run)
`{ finalists: [card-id…3–5], auditSample: [card-id…≥2], ranking: [ {cardId, wins, meanScore} ], excluded: [ {cardId, reason} ] }`

## run.json (per run)
`{ painId, runId, startedAt, painName, painLine, finishedAt, searches, pagesOpened, tokens?, notes }`

`painName` and `painLine` are the catalog wording the run was written for (added 2026-10-19; older runs lack them, and `stale` falls back to the catalog history at `startedAt`). `painId` is always the surviving ID: a run started for a merged pain is created for the pain it was merged into.

## Calibration files (`docs/research/possibilities/calibration/`)
- **baseline.json**: 16 old cards in the `cards.json` card shape, with fixes without exemplars, and `provenance.sourceId` pointing at `founder-review.md` with an anchor locator.
- **set.json**: `{ seed, items: [ { id: "c01", painLine, title, line, fixes:[{title, whatChanges, example?}] } ] }`. Holds no origin information.
- **key.json**: `{ <item-id>: { origin: "old"|"new", painId, sourceCardId, runId?, heldOut: bool } }`. Local only.
- **ratings.json**: `{ rater: "founder", context: "calibration"|"audit", ratings: { <item-id>: { rating, reason?, rewriteAs?, ratedAt } } }`
- **anchors.json** / **heldout.json**: lists of item IDs with rating and reason. Only anchors are passed to the judge.

## State transitions
A card's `provenance.reviewStatus` starts as `unreviewed`. It becomes `reviewed` once the founder has rated it, and `approved` only when the founder chooses Love or Keep in an audit. Nothing is published.
