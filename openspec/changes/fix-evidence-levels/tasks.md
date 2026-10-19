# Tasks

Do not start until the founder has answered `confirm.md`; adjust specs first if any answer differs from its recommendation.

## 1. Content model

- [ ] 1.1 Add optional `methodEvidence`/`methodEvidenceNote` (features only, both or neither) to `contentFixSchema` and optional `evidence`/`evidenceNote` (both or neither) to `fixDreamLinks` in `packages/content/src/graph-schema.ts`, documenting that a way's own level is read by its kind; verify with content tests for valid, half-filled and non-feature cases, and that a version published before this change still parses
- [ ] 1.2 Split mixed notes in `packages/content/src/fixes.ts` by claim and mark them for founder review; verify content tests pass and the founder has approved the split before publish
- [ ] 1.3 Add a migration with the new nullable columns and checks, and read/write them in `content-repository.ts`; verify with a database test that save → publish → read round-trips every evidence field

## 2. Editor

- [ ] 2.1 Add a Ways tab to `apps/app/app/cms/index.tsx` with type, status, linked futures, own evidence, method evidence (features) and per-link evidence, each labelled by its claim, plus a warning when changing kind on a rated way; verify by editing a way, publishing, and reading the published version
- [ ] 2.2 Add a publish validation issue for a way missing its own level or note and for half-filled optional pairs; verify with a repository test that publishing is refused with the way named
- [ ] 2.3 Check the Ways tab by keyboard and screen reader (each level announced with its claim); verify by a manual pass recorded in the PR

## 3. Not shown

- [ ] 3.1 Add a component test that the pain explorer renders no evidence level or note for any way (including a "Strong" way and a Feature); verify it fails if a level is rendered

## Workflow follow-up

- After archive, replace the content-catalog "Known divergence" line "Fixes record no evidence level yet" with what remains (evidence not shown; sources not linked).
