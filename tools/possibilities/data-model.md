# Possibility generator data model

All files are UTF-8 JSON. Card runs and their files use `schemaVersion: 1`; staged runs use `schemaVersion: 2` in `run.json` and `dreams.json` (see "Staged runs"). IDs match `^[a-z0-9]+(?:-[a-z0-9]+)*$`. Enums:

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

## Staged runs (schemaVersion 2)
A staged run mirrors the content graph (`packages/content/src/graph-schema.ts`): dreams, fixes, and fix–dream links instead of cards. `new-run <pain-id> --staged` writes `run.json` with `schemaVersion: 2`. The run then gets `exemplars.json` (same shape as above) and `dreams.json`. Files for the plan, fixes, screen, and links are added by later stages. Card runs (v1) still validate and lint as before.

### Stages
`examples → dreams → dream-review → plan → shared-fixes → kind-pools → screen → assemble → judge → fix-review`. `dream-review` and `fix-review` are founder stops. `status <run>` names the next stage from the files present:
- `examples` is complete when `exemplars.json` exists;
- `dreams` is complete when `dreams.json` exists;
- `dream-review` is complete when every dream in `dreams.json` has a `review` with a `decision`. `dreams-ingest` writes it from the founder's export (see *Dream review files*).

`start <run> <stage>` refuses with a usage error (exit 2) while any earlier stage is incomplete, so no fix stage runs before the dream review is ingested. Otherwise it names the stage's brief. Stages after `dream-review` aren't built yet.

### dreams.json (staged run)
```
{ schemaVersion: 2, painId, runId, dreams: { <dream-id>: {
    title, line, lens, ambition,          # title names the outcome; line is one first-person sentence
    exemplarRefs: [<exemplar-id>…],       # at least one: the examples that show the outcome is reachable
    provenance: { sourceId, locator, evidenceType, rights, reviewStatus: "unreviewed" },
    writerNotes?, review? } },            # review: the founder's decision, written by dreams-ingest
                                          #   { decision: accept|edit|reject, note, decidedAt, ingestedAt,
                                          #     original?: { title, line } }   # original: the drafted wording, on an edit
  overlaps: [ { a: <dream-id>, b: <dream-id>, reason } ] }
```
Rules:
- `exemplarRefs` names at least one exemplar, and each resolves to an exemplar in the same run.
- `schemaVersion` is 2, and `painId` matches `run.json`.
- Each overlap names two different dreams in the run, with a reason, and each pair is flagged once.
- `title` and `line` map to the graph dream's `title` and `description`.
- Lint applies the dream copy rules (`title-vague`, `title-length`, `dream-not-outcome`, `line-length`, `generic-phrase`, `serial-comma`, `exclamation`, `boilerplate-caveat`, `regional-word`, `acronym-in-title`, and `stacked-hedges`), plus lens and ambition coverage across the drafted dreams. Its issues carry `dreamId` in place of `cardId`. Basics and It-led coverage need linked fixes, so they wait for the fix stages.
- `writerNotes` is never shown to judges or on review pages.
- A `review` has a known `decision`. An `edit` keeps the drafted `title` and `line` in `original`, and `title` and `line` hold the founder's wording. Ingest sets `provenance.reviewStatus` to `reviewed`.
- Later stages read only accepted dreams (`accept` or `edit`), through `accepted_dreams(run)`.

### Dream review files (`<run>/reviews/`)
- **proposals.json**: `{ schemaVersion: 1, setId: "<painId>-<runId>", builtAt, proposals: [ { id, title, line, lens, ambition, examples: [{id, name, place, year, outcome}], overlaps: [{with, title, reason}] } ] }`. Each dream appears once. An overlap is listed under both of its dreams. No `writerNotes`.
- **review.html**: the static page, built from `config/dream-review-page.template.html`. It is derived, so it isn't committed.
- **dreams-decisions.json**: the founder's export, `{ schemaVersion: 1, setId, exportedAt, decisions: { <dream-id>: { decision: accept|edit|reject, note, decidedAt, edit?: { title, line } } } }`. Ingest refuses an export for another run, a page built before `dreams.json` last changed, an unknown dream, an unknown decision, an edit without a title and a line, or any dream left undecided.

## Calibration files (`docs/research/possibilities/calibration/`)
- **baseline.json**: 16 old cards in the `cards.json` card shape, with fixes without exemplars, and `provenance.sourceId` pointing at `founder-review.md` with an anchor locator.
- **set.json**: `{ seed, items: [ { id: "c01", painLine, title, line, fixes:[{title, whatChanges, example?}] } ] }`. Holds no origin information.
- **key.json**: `{ <item-id>: { origin: "old"|"new", painId, sourceCardId, runId?, heldOut: bool } }`. Local only.
- **ratings.json**: `{ rater: "founder", context: "calibration"|"audit", ratings: { <item-id>: { rating, reason?, rewriteAs?, ratedAt } } }`
- **anchors.json** / **heldout.json**: lists of item IDs with rating and reason. Only anchors are passed to the judge.

## State transitions
A card's `provenance.reviewStatus` starts as `unreviewed`. It becomes `reviewed` once the founder has rated it, and `approved` only when the founder chooses Love or Keep in an audit. Nothing is published.
