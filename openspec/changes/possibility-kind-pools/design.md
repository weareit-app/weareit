# Design

## Context

See proposal.md (Why) for the motivation. Today a run is one writer agent that writes `exemplars.json` and `cards.json`. Kinds are tagged afterwards (`briefs/classify-kinds.md`), features are rewritten (`briefs/feature-pitch.md`), three judges score cards, and `select` picks finalists for calibration. `tools/possibilities/cards.py` (stdlib Python, about 750 lines, 59 tests on the pain-catalog branch) does validation, lint, judge input, consensus, selection, and the calibration and audit sets.

Constraints:
- The pain-catalog change (PR #27) is unmerged. It changes how a run finds its pain and adds stale-run detection. This change builds on that version of `cards.py`.
- The pain pipeline (`tools/pains/`) already has a founder review flow: `review-build` writes `proposals.json` and a static `review.html`, which is served locally from a launch config. The founder exports `decisions.json`, and `ingest` applies it. The founder got through 60 decisions in about 13 minutes with it.
- The content graph (`packages/content/src/graph-schema.ts`) already holds `dreams`, `fixes` and many-to-many `fixDreamLinks`. Its `fixKinds` enum is `once | habit | group | feature`; this change does not touch it.
- Skills exist for Claude (`.claude/skills/possibilities-*`) and Codex (`.agents/skills/possibilities-*`) and must stay in step.
- Research findings: `docs/research/fix-kind-ideation/research.md`.

## Goals / Non-Goals

**Goals:**
- A staged run whose files mirror the content graph, so a later import is a mapping, not a reshaping.
- The helper refuses stages out of order, so no agent drafts fixes for dreams that weren't reviewed.
- Founder review pages that work like the pain review, to reuse a flow the founder already uses quickly.
- One brief per kind, short enough to hold that kind's method and examples, with no knowledge of the other kinds' quotas.

**Non-Goals:**
- Changing the app's kinds, its schema, or the editor.
- Running stages in parallel across pains, or any scheduler. The skills run one pain at a time.
- Automatic import into the editor draft.

## Decisions

### Run files mirror the graph (schemaVersion 2)
A v2 run replaces `cards.json` with the following files:
- `dreams.json`, with each dream's lens, ambition, overlap flags and review decision;
- `fixes.json`, the full pool, including screened-out and unlinked fixes, each with `kind`, `method` fields, `status`, `exemplarRef` or `speculative`, `firstStep`, and `origin` (`shared` or `kind:<kind>`);
- `plan.json`;
- `links.json`, with `{fixId, dreamId, order, how}` from the assembler and `pathCandidates`;
- `screen.json`.

Founder decisions go in `reviews/dreams-decisions.json` and `reviews/fixes-decisions.json`.

- *Alternative:* keep `cards.json` and duplicate shared fixes. Rejected: the founder decides a fix once, and duplicates would drift apart under repair.
- v1 runs stay readable for `validate`, for the stale list, and as the "old" side of the pilot comparison. Nothing writes v1 after the pilot passes.

### Stage is derived from the files present
`cards.py status <run>` reports the next stage by checking which files exist and whether the review decisions were ingested. Each stage's subcommand refuses unless the stage before it is complete:

```
examples → dreams → dream review* → plan → shared fixes → kind pools → screen → assemble → judge → fix review*
                                                                                    (* = founder stop)
```

- *Alternative:* a `stage` field in `run.json`. Rejected: it can disagree with the files, and the files are what agents actually leave behind.

### Review pages copy the pain review pattern
`dreams-review-build` and `fixes-review-build` write `proposals.json` and a static `review.html` into `reviews/`. The page is served with a new local launch config, and the founder exports decisions as JSON. `dreams-ingest` and `fixes-ingest` validate the export with the same checks as `validate` and apply it. Edits are kept beside the original text. The fix page lists each fix once with chips for its linked dreams, which the founder can add or remove from the keyboard.
- *Alternative:* private Artifacts, like the calibration pages. Rejected for review: the pain review page already works offline, keeps decisions in Git, and the founder knows it. Calibration and the pilot comparison stay on Artifacts, because they need a blind set with a key kept apart.

### Briefs: a shared header plus one file per kind
`briefs/kinds/<kind>.md` holds that kind's method, required `method` fields, boundary tests against neighboring kinds, and a good and a bad example in It's voice. The examples come from the research note's sections. All kind briefs start from `briefs/kinds/_shared.md`, which covers sourcing, voice, the ceiling and `shortfallReason`, and the order of fields first, then copy. Each brief sees only:
- the accepted dreams;
- the examples;
- its own row of the plan;
- the shared fixes already drafted, so it doesn't repeat them.

The current briefs change as follows:
- `feature-pitch.md` folds into `kinds/feature.md`.
- `classify-kinds.md` retires. Its boundary tests move into each kind brief and into the screen judge's "is this the right kind?" check.
- `writer.md` stays only for the old flow until the pilot passes. It is then removed.

New single briefs:
- `dreams.md`;
- `planner.md`;
- `shared-fixes.md`;
- `screen.md`;
- `assembler.md`.

### Isolation and homogenization
Every stage runs as a fresh subagent (a new thread in Codex). In this design, isolation is about context, not true independence: the research shows that agents on the same model converge. Three mitigations:
- each kind brief is narrowly conditioned, which the research found raises diversity;
- every brief sees the shared fixes and earlier pools, so it doesn't repeat them;
- a new lint rule, `near-duplicate-fix`, uses title-token overlap within the pain and flags pairs for the screen.

### Screen, then panel
The screen is one isolated judge per run that scores each fix on three things:
- actionable;
- the right kind;
- honest status.

It writes `screen.json`. The panel's `judge-input` lists each accepted dream with its linked fixes in order, and repeats a shared fix under each dream. Consensus works as today, keyed by dream ID. `select` no longer picks finalists or audit samples (founder, 2026-10-20): it writes `ranking.json`, which orders the fix review page.

### Coverage and kind rules in lint
Coverage moves from cards to accepted dreams and their linked fixes. The "led by It" check means a dream with at least one Feature linked (founder, 2026-10-20). There is no kind minimum. The trial kinds `leave` and `switch` are valid only when `run.json` has `"pilot": true`. The 2–5 limit applies to the assembler's links; links the founder adds in review may take a dream past 5, and `fixes-ingest` records them as founder links. Method-field checks are per kind. For example, Ask needs `decisionMaker` and `request`, and Use a resource needs `provider`, `eligibility`, `access` and `bring`.

### Pilot comparison
`compare-build <pain…>` pairs the newest v1 run with the newest v2 run for each pilot pain. If the v1 run is stale against the catalog, the skill first reruns the old flow on the current wording, so both sides use the same pain text. It builds a blind calibration-style set, with items as dreams plus their fixes, and keeps a separate key. `compare-report <export>` computes three things:
- the mean rating for each flow;
- the number of distinct kinds among linked fixes;
- the founder's review time, from the timestamps the review pages export.

It prints `scale-up` or `iterate`. Review time for the old flow is the calibration page's timing on the old items in the same set.

### Copy guide and decisions
The "Kinds of fixes" table gains rows for Ask (`message-circle-question`), Use a resource (`life-buoy`), and the trial kinds Leave (`door-open`) and Switch (`arrow-left-right`), as the founder chose on 2026-10-20. `docs/architecture/decisions.md` was updated on 2026-10-20. No privacy invariant or stack choice changes.

## Risks / Trade-offs

- **More founder stops per pain** (two reviews instead of one calibration) → Review pages reuse the fast pain-review pattern, and the pilot's review-time check fails the change if it's slower.
- **Assembled dreams feel incoherent** because fixes were drafted by kind, not by dream → The assembler must say how each fix helps its dream, and the panel judges dream plus fixes as a set.
- **Planner ceilings become quotas in practice** → `shortfallReason` is first-class, the screen fails filler, and the comparison report shows the average fill rate against the ceilings so creeping quotas are visible.
- **Agents on the same model homogenize** → narrow per-kind conditioning, earlier pools as context, and `near-duplicate-fix` lint (see Isolation).
- **Token cost rises** with up to 13 kind briefs per pain → Kinds with zero in the plan don't run. `finish-run` records tokens per stage, and the pilot report shows the cost.
- **The pain-catalog version of `cards.py` changes under this work** → Start implementation only after PR #27 merges (the proposal's dependency). Tests from both changes must pass together.
- **Two flows coexist until the pilot passes** → v1 is frozen. Only `validate`, `stale` and `compare-build` read it, and the old flow is removed in the same task group that switches the skills.

## Migration Plan

1. Merge the pain-catalog change and the full pain sweep.
2. Build v2 behind new subcommands. The old flow keeps working unchanged.
3. Run the pilot on the founder's chosen pains, then build the comparison set and get the founder's ratings.
4. If the report says `scale-up`: switch `possibilities-generate` and its Codex copy to the staged flow, remove `writer.md`, `classify-kinds.md` and `feature-pitch.md`, and regenerate the 17 pains with runs. Old runs stay as history.
5. If it says `iterate`: adjust briefs or the plan rules and rerun the pilot. Rolling back means not switching the skills.
