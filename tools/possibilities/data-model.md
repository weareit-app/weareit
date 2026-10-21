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
               kind: feature|task|schedule|habit|practice|learn|project|group|new-group|ask|resource|path,
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
- No fix has `featureStatus`. A Feature's roadmap status (Idea, Planned, and so on) is set in the app, never by the generator (founder, 2026-10-20). Staged fixes follow the same rule.
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
`{ painId, runId, startedAt, painName, painLine, finishedAt, searches, pagesOpened, tokens?, tokensByStage?, notes, pilot? }`

`tokensByStage` is `{ <stage>: <tokens> }` for a staged run, written by `finish-run --stage`. `tokens` is then their sum. Card runs record only `tokens`.

`pilot: true` marks a staged run as a pilot run, which also plans and drafts the trial kinds `leave` and `switch` (see *plan.json*). It is set by hand in `run.json`; any other run refuses them.

`painName` and `painLine` are the catalog wording the run was written for (added 2026-10-19; older runs lack them, and `stale` falls back to the catalog history at `startedAt`). `painId` is always the surviving ID: a run started for a merged pain is created for the pain it was merged into.

## Staged runs (schemaVersion 2)
A staged run mirrors the content graph (`packages/content/src/graph-schema.ts`): dreams, fixes, and fix–dream links instead of cards. `new-run <pain-id> --staged` writes `run.json` with `schemaVersion: 2`. The run then gets `exemplars.json` (same shape as above) and `dreams.json`. The plan, fixes, screen, and links files are added by later stages. Card runs (v1) still validate and lint as before.

### Stages
`examples → dreams → dream-review → plan → shared-fixes → kind-pools → screen → assemble → judge → fix-review`. `dream-review` and `fix-review` are founder stops. `status <run>` names the next stage from the files present:
- `examples` is complete when `exemplars.json` exists;
- `dreams` is complete when `dreams.json` exists;
- `dream-review` is complete when every dream in `dreams.json` has a `review` with a `decision`. `dreams-ingest` writes it from the founder's export (see *Dream review files*);
- `plan` is complete when `plan.json` exists;
- `shared-fixes` is complete when `fixes.json` has a `shared` record with `draftedAt`, written by the shared pass even when it drafts no fix;
- `kind-pools` is complete when `fixes.json` has a `pools` entry for every kind the plan gives a ceiling above zero. A kind with only zero ceilings doesn't run;
- `screen` is complete when `screen.json` exists;
- `assemble` is complete when `links.json` exists;
- `judge` is complete when `ranking.json` exists. `select` writes it after `consensus`;
- `fix-review` is complete when `links.json` has a `review` record, written by `fixes-ingest` (see *Fix review files*). `status` then names `done`.

`start <run> <stage>` refuses with a usage error (exit 2) while any earlier stage is incomplete, so no fix stage runs before the dream review is ingested. Otherwise it names the stage's brief:
- for `plan`, `kinds` lists the kinds the planner sets ceilings for, which are the kinds that have a brief (`KIND_BRIEFS` in `cards.py`: every kind except `path`), plus the trial kinds `leave` and `switch` (`TRIAL_KIND_BRIEFS`) in a pilot run;
- for `shared-fixes`, `brief` is `briefs/shared-fixes.md`;
- for `kind-pools`, `brief` is the shared kind brief, `kinds` maps each kind still to draft (a ceiling above zero and no pool yet) to its own brief, and `shared` lists the IDs of the shared pass's fixes, which kind briefs read so they don't repeat them.

`start <run> judge` names `briefs/judge.md`. `start <run> fix-review` exits 2, because the fix review is a founder stop: run `fixes-review-build`, then `fixes-ingest`. Once `fixes.json` exists, `status` also reports the fix pool: `fixes: {total, screenedOut: [fix-id…], unlinked: [fix-id…] | null}`. `unlinked` is `null` until `links.json` exists.

`validate` checks each file below when it is present, and that each file's stage came after the one before: a plan needs an ingested dream review, `fixes.json` needs `plan.json`, kind pools need the `shared` record, `screen.json` needs `fixes.json`, `links.json` needs `screen.json`, and `judgments.json` needs `links.json`. Each file has `schemaVersion: 2` and the `painId` of `run.json`. Only accepted dreams (`accept` or `edit`) can be planned, drafted for, or linked.

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
- Lint applies the dream copy rules (`title-vague`, `title-length`, `dream-not-outcome`, `line-length`, `generic-phrase`, `serial-comma`, `exclamation`, `boilerplate-caveat`, `regional-word`, `acronym-in-title`, and `stacked-hedges`). Its issues carry `dreamId` in place of `cardId`. Coverage is in "lint.json (staged run)".
- `writerNotes` is never shown to judges or on review pages.
- A `review` has a known `decision`. An `edit` keeps the drafted `title` and `line` in `original`, and `title` and `line` hold the founder's wording. Ingest sets `provenance.reviewStatus` to `reviewed`.
- Later stages read only accepted dreams (`accept` or `edit`), through `accepted_dreams(run)`, and the validators check against the same set.

### plan.json (staged run)
```
{ schemaVersion: 2, painId, runId, plannedAt,
  ceilings: { <dream-id>: { <kind>: { max, reason } } } }   # max: 0-5, the most fixes of that kind to draft
```
Rules:
- One row for each accepted dream, and none for a rejected or unknown dream.
- Each row sets a ceiling for every kind that has a brief, and only for those. In a pilot run, that includes the trial kinds `leave` and `switch`. Any other run fails a trial-kind ceiling.
- `max` is an integer from 0 to 5. Zero means the kind isn't drafted for that dream.
- Every ceiling, including a zero, has a one-line `reason`.
- A ceiling is a limit, not a quota: a kind brief may return fewer (see `pools` below).

### fixes.json (staged run)
The run's whole fix pool. Fixes that fail the screen or are left unlinked stay in it.
```
{ schemaVersion: 2, painId, runId,
  fixes: { <fix-id>: {
    title, whatChanges,                   # graph fix title and description
    kind, status, origin: "shared" | "kind:<kind>",   # the pass that drafted it
    draftedFor: <dream-id>,               # kind fixes: the dream whose ceiling the fix counts against
    proposedLinks: [ { dreamId, how } ],  # shared fixes, in place of draftedFor: every dream the fix helps
    method: { … },                        # the kind's method fields; never copy, never shown to judges
    exemplarRef | null, speculative: bool, speculativeRationale?,
    firstStep, firstStepMinutes,
    provenance: { sourceId, locator, evidenceType, rights, reviewStatus },
    writerNotes?, review? } },            # review: the founder's decision, written by fixes-ingest
                                          #   { decision: accept|edit|reject, note, decidedAt, ingestedAt,
                                          #     original?: { title, whatChanges, firstStep } }   # on an edit
  pools: { <kind>: { draftedAt, shortfalls: { <dream-id>: <one-line reason> } } },
  shared: { draftedAt, emptyReason? } }     # the shared-fixes pass ran; emptyReason when it drafted no fix
```
Rules:
- `kind` is a kind that has a brief, and `origin` is `shared` or `kind:<kind>`. Every kind with `kind:<kind>` fixes has a `pools` entry. A kind brief adds its entry even when it drafted every ceiling in full, because the entry records that the kind ran.
- The shared pass writes the `shared` record before any kind pool, so `pools` needs it. With no `origin: shared` fix, `shared.emptyReason` says in one line why no fix serves several dreams.
- A shared fix has no `draftedFor` and counts against no ceiling. Its `proposedLinks` name two or more different accepted dreams, each with a one-sentence `how`. They are proposals: `links.json` holds the final links, and the assembler may leave some out.
- A kind fix's `draftedFor` is an accepted dream.
- For each kind with a pool and each accepted dream, the number of fixes with that `kind` and `draftedFor` is at most the plan's `max`. If it is lower, `shortfalls` gives a one-line reason for that dream.
- Status rules: `status` is a known status, and kind `feature` goes with status `proposed_it_feature`, and only with it. A `resource` fix has status `existing_resource` or `real_now`.
- Trial kinds: a `leave` or `switch` fix, or its pool, fails validation unless `run.json` has `"pilot": true`.
- Sourcing rules: either `exemplarRef` resolves to an exemplar in the run, or `speculative: true` with a rationale. `firstStepMinutes` is 1–20.
- `method` holds every field its kind requires:

  | Kind | Field | Value |
  | --- | --- | --- |
  | `task` | `nextAction` | the physical, visible next step |
  | | `doneWhen` | what is true once it's done |
  | | `keepsWorking` | `true` or `false`: a one-time change that keeps working afterward |
  | | `lever` | `default`, `remove-hassle`, `simplify`, `timing`, or `other` |
  | `feature` | `when`, `want`, `soThat` | a job story: the situation, what the person wants, and what that lets them do |
  | | `pattern` | a row of `config/feature-patterns.md`, or `new` |
  | | `dataOrTools` | the public data or tools that would make it work |
  | `schedule` | `what` | what repeats |
  | | `cadence` | how often |
  | `habit` | `cue` | something the person already does, with a clear end point |
  | | `behavior` | the small behavior that follows it |
  | `practice` | `situation` | when the skill comes up |
  | | `move` | one concrete thing to try next time |
  | | `wentBetterWhen` | the sign that it went better |
  | `learn` | `ableTo` | what the reader will be able to do, starting with a verb |
  | | `useWhen` | the situation they'll use it in |
  | `project` | `finishedThing` | what exists at the end |
  | | `doneWhen` | when it's done |
  | `group` | `whatMembersDo` | what members do together |
  | | `howToFind` | how the reader finds theirs |
  | `new-group` | `whoFor` | the people it's for |
  | | `whatMembersDo` | what members would do together |
  | | `firstTest` | the first thing the group does that shows it's working |
  | | `existingFirst` | what to check exists before starting one |
  | `ask` | `decisionMaker` | who can say yes, as a role a reader can find |
  | | `request` | the one specific request they can answer yes or no |
  | `resource` | `provider` | who runs it |
  | | `eligibility` | who qualifies |
  | | `access` | how to reach it: phone, text, web, or a place |
  | | `bring` | what to have ready |
  | `leave` (trial) | `leaving` | what the person stops being part of |
  | | `tradeOff` | what they give up |
  | `switch` (trial) | `switchFrom` | what the person replaces |
  | | `switchTo` | the better version of the same thing |
  | | `tradeOff` | what the move costs or loses |

  Every value is nonempty text, except `keepsWorking` and `lever`. A kind brief may add optional fields, which aren't checked.
- A `review` has a known `decision`. An `edit` keeps the drafted `title`, `whatChanges`, and `firstStep` in `original`, and the fix holds the founder's wording. Ingest sets `provenance.reviewStatus` to `reviewed`.
- A `practice` fix also has `featureIdea`: one line, a coaching feature It could build. It sits on the fix, not in `method`, because the app shows it.

### screen.json (staged run)
```
{ schemaVersion: 2, painId, runId, judge: { context: "isolated", model?, at },
  results: { <fix-id>: { actionable: {pass, reason}, rightKind: {pass, reason}, honestStatus: {pass, reason} } } }
```
Rules:
- The screen runs only after every planned kind has its pool. `results` screens every fix in `fixes.json` exactly once. A fix in `screen.json` that is no longer in `fixes.json` fails validation, so the pool keeps every screened fix.
- Each check has a boolean `pass` and a one-line `reason`.
- The screen judges the copy, not `method` or `writerNotes`.
- A fix is screened out when any check fails. It stays in `fixes.json`, can't be linked, and is listed in `status` as `fixes.screenedOut`.

### links.json (staged run)
```
{ schemaVersion: 2, painId, runId, assembler: { context: "isolated", model?, at },
  links: [ { fixId, dreamId, order, how, by: assembler|founder } ],   # graph fixDreamLinks, plus order and how
  pathCandidates: [ { fixIds: [<fix-id>…], reason } ],                # chains in order; no paths are built
  review? }                                                           # written by fixes-ingest: links are then final
```
`review` is `{ ingestedAt, removed: [ { fixId, dreamId, order, how, by, reason: unlinked|rejected } ] }`.
Rules:
- `assembler.context` is `isolated`.
- `fixId` is a fix in `fixes.json` that passed the screen, and `dreamId` is an accepted dream. Each pair appears once.
- `how` is one sentence on how the fix helps that dream. A link `by: founder` may leave it out.
- Each accepted dream has at least 2 links. At most 5 are `by: assembler`. A dream the pools can't serve fails validation, and the run needs a repair. Links `by: founder`, added in the fix review, may take a dream past 5.
- Once `review` is present, `links` are the founder's final links: the 2-link minimum no longer applies, a rejected fix has no link, every fix that passed the screen has a `review` in `fixes.json`, and `ranking.json` must exist.
- Within a dream, each link has its own `order`, a positive integer. Order 1 is shown first.
- A fix may be linked to several dreams. A fix with no link stays in `fixes.json` and is listed in `status` as `fixes.unlinked`.
- A path candidate lists two or more different screened fixes in order, with a one-line reason.

### judgments.json (staged run)
The panel's judgments, in the card-run shape above but keyed by accepted dream ID: each judge scores a dream together with its linked fixes. `judge-input <run>` gives each judge the run's accepted dreams, each with its linked fixes in link order:
```
dreams: { <dream-id>: { title, line, lens, ambition, exemplarRefs,
                        fixes: [ { id, title, whatChanges, kind, status, exemplarRef, speculative, speculativeRationale?,
                                   firstStep, firstStepMinutes, how } ] } }
```
Rules:
- `judge-input` refuses until `links.json` exists and the run validates.
- A fix linked to several dreams appears under each one. Its `method`, `origin`, `draftedFor`, `provenance`, and `writerNotes`, and the dream's `provenance`, `writerNotes`, and `review`, are left out.
- `schemaVersion` is 2, and `painId` matches `run.json`. `scores` has exactly one key for each accepted dream. A score key that is a fix ID fails validation, and that judge is rerun. Pairwise entries name two dreams.
- `judgments-<n>.json` from each judge have the same shape. `consensus` combines them into `judgments.json` with mean scores, a majority vote on honest status, and Borda points, as in a card run.

### ranking.json (staged run)
```
{ schemaVersion: 2, painId, runId, rankedAt, judges,
  ranking: [ { dreamId, wins, meanScore, honestStatus: { pass, reason }, fixIds: [<fix-id>…] } ],
  fixOrder: [<fix-id>…] }
```
Rules:
- `select <run>` writes it from `judgments.json`, with no finalists or audit samples (founder, 2026-10-20). `--seed` doesn't apply. A new `consensus` deletes the old `ranking.json`, so `status` returns to `judge` until `select` runs again.
- `ranking` lists every accepted dream once. Dreams that pass honest status come first, by Borda points (or pairwise wins from a single judge), then mean score, then ID. Dreams that fail honest status follow in the same order and are marked by `honestStatus.pass: false`.
- `fixIds` are the dream's linked fixes in link order.
- `fixOrder` lists each linked fix once, under the best-ranked dream it serves, and this sets the order of the founder's fix review. Unlinked fixes aren't in it; the review lists them after the linked ones.

### lint.json (staged run)
`{ passed: bool, issues: [ { dreamId | fixId, rule, detail } ], coverage: { lenses, ambitions, basicsTonight?, itLed? }, dreams, checkedAt }`

Rules:
- Each fix gets the card fix rules, checked on its own: `generic-phrase`, `serial-comma`, `exclamation`, `boilerplate-caveat`, `fix-text-length`, `regional-word`, `acronym-in-title`, `not-an-action`, `learn-about-others`, `unsourced-detail` (against the record of the exemplar it cites, or any proper noun in a speculative fix), `title-assumes-example`, `unverified-example`, `not-specific`, `ambiguous-it`, `feature-pitch`, and `built-claim`. `stacked-hedges` counts soft modals in one fix's title and `whatChanges`, where a card counted them across all its fixes.
- Fix copy rules for staged runs only: `template-copy` flags a method written into a title, `whatChanges`, or `firstStep`, such as "When I…, I want…, so I can…", "After I…, I will…", or "If…, then I will…". `near-duplicate-fix` flags two fixes in the pool whose titles share at least 80% of their words, ignoring small words like "the" and "in". The issue names the first fix by ID and the second in `detail`, so the screen can drop one.
- Coverage counts the accepted dreams once the dream review is in, and the drafted dreams before it. Links to screened-out or rejected fixes don't count. After the fix review, `links.json` holds the founder's final links, so coverage checks those, not the assembler's. A coverage issue has `dreamId: "*"`.
  - `lens-coverage`: at least 4 lenses.
  - `ambition-coverage`: all three ambitions.
  - `basics-coverage`, once `links.json` exists: at least 3 distinct fixes with status `real_now` or `existing_resource` linked to a tonight dream.
  - `it-led-coverage`, once `links.json` exists: at least one dream led by It, which means a Feature linked to it anywhere among its fixes (founder, 2026-10-20).
- No kind has a minimum.

### Dream review files (`<run>/reviews/`)
- **proposals.json**: `{ schemaVersion: 1, setId: "<painId>-<runId>", builtAt, proposals: [ { id, title, line, lens, ambition, examples: [{id, name, place, year, outcome}], overlaps: [{with, title, reason}] } ] }`. Each dream appears once. An overlap is listed under both of its dreams. No `writerNotes`.
- **review.html**: the static page, built from `config/dream-review-page.template.html`. It is derived, so it isn't committed.
- **dreams-decisions.json**: the founder's export, `{ schemaVersion: 1, setId, exportedAt, decisions: { <dream-id>: { decision: accept|edit|reject, note, decidedAt, edit?: { title, line } } } }`. Ingest refuses an export for another run, a page built before `dreams.json` last changed, an unknown dream, an unknown decision, an edit without a title and a line, or any dream left undecided.

### Fix review files (`<run>/reviews/`)
- **fix-proposals.json**: `{ schemaVersion: 1, setId: "<painId>-<runId>", builtAt, dreams: [ { id, title, line, ambition, honestStatus } ], proposals: [ { id, title, whatChanges, firstStep, firstStepMinutes, kind, kindLabel, status, statusLabel, example: {id, name, place, year, outcome, limits} | null, speculative, speculativeRationale, featureIdea, links: [ {dreamId, order, how, by} ], method, origin } ] }`. `dreams` are the accepted dreams in ranking order, and `honestStatus` is the panel's pass or fail. `proposals` lists each fix that passed the screen once: linked fixes in `ranking.json` `fixOrder`, then unlinked fixes by ID. A fix's `links` follow the ranking. No `writerNotes` or `provenance`.
- **fix-review.html**: the static page, built from `config/fix-review-page.template.html`. It is derived, so it isn't committed.
- **fixes-decisions.json**: the founder's export, `{ schemaVersion: 1, setId, exportedAt, decisions: { <fix-id>: { decision: accept|edit|reject, note, decidedAt, edit?: { title, whatChanges, firstStep }, links: [<dream-id>…] } } }`. `links` are the fix's final dreams. Ingest refuses an export for another run, a page built before `fixes.json` or `links.json` last changed, an unknown or screened-out fix, an unknown decision, an edit without all three fields, a link to a dream that isn't accepted or is listed twice, or any fix left undecided.
- Ingest keeps the assembler's links that the founder kept, with their `how` and `by`, and adds the founder's as `by: founder` with no `how`. Within a dream, kept links keep their order, and the founder's follow in review order. A rejected fix keeps no link.

## Calibration files (`docs/research/possibilities/calibration/`)
- **baseline.json**: 16 old cards in the `cards.json` card shape, with fixes without exemplars, and `provenance.sourceId` pointing at `founder-review.md` with an anchor locator.
- **set.json**: `{ seed, items: [ { id: "c01", painName, painLine, title, line, fixes:[{title, whatChanges, example?, firstStep?, kind?, featureIdea?, status?}] } ] }`. Each item is a dream with its fixes in order: a card's title, line, and fixes, or a staged dream with its linked fixes in link order. Holds no origin or flow information, so card and staged items can share one blind set.
- **key.json**: `{ <item-id>: { origin: "old"|"new", painId, sourceCardId | sourceDreamId, runId?, heldOut: bool } }`. `sourceDreamId` marks an item from a staged run, `sourceCardId` one from a card run or the baseline. Local only. The audit's `audit-key.json` has the same shape, with origin `finalist` or `sample` for a card run, and `ranked` for every dream in a staged run that passed honest status.
- **ratings.json**: `{ rater: "founder", context: "calibration"|"audit", ratings: { <item-id>: { rating, reason?, rewriteAs?, ratedAt } } }`
- **anchors.json** / **heldout.json**: lists of item IDs with rating and reason, each keyed to the `dreamId` (staged) or `cardId` it rates. Only anchors are passed to the judge.

## Pilot comparison files (`docs/research/possibilities/evaluations/pilot-2026-10/`)
- **compare-set.json**: the calibration `set.json` shape. Each item is a dream with its fixes: a card run's finalist, or a staged dream that passed honest status, with the assembler's links in their first order. Dreams and fixes keep their drafted wording: `review.original` undoes a founder edit. The dream review still decides which dreams are in. Holds no origin or flow information.
- **compare-key.json**: the `key.json` shape, with origin `old` (card run) or `new` (staged run), `runId`, and `heldOut: false`.
- **compare-metrics.json**: written by `compare-report`: `{ pains, rates, meanRating, kindsPerPain, reviewMinutes, fillRate, tokens, gate: { result, checks, failing } }`, each by flow (`old`, `new`).
  - `meanRating` scores Love 2, Keep 1, and Kill 0, leaving out Skip.
  - `kindsPerPain` is the mean, across pilot pains, of the distinct kinds among the fixes in that flow's items.
  - `reviewMinutes.new` is the founder's time on each staged run's dream review and fix review, from the `decidedAt` stamps that `dreams-ingest` and `fixes-ingest` record. `reviewMinutes.old` is the time on the old items in the comparison export, from its `ratedAt` stamps. Both count the gap before each decision. The first decision on a page counts nothing, and a gap over 10 minutes is a break that counts nothing. A flow with nothing to time (a staged run whose reviews have no stamps, or no timed old item) gives `null`, which fails the check.
  - `fillRate.new` is the mean share of each ceiling above zero that its kind filled, overall and by kind. Shared fixes count against no ceiling.
  - `tokens` is each flow's total and, for staged runs, `byStage`.
  - The gate's checks are `newMeanRating>=oldMeanRating`, `newKindsPerPain>oldKindsPerPain`, and `newReviewMinutes<=oldReviewMinutes`.

## State transitions
A card's `provenance.reviewStatus` starts as `unreviewed`. It becomes `reviewed` once the founder has rated it, and `approved` only when the founder chooses Love or Keep in an audit. Nothing is published.
