# Proposal

## Why

The founder decided every way keeps an evidence level and note in the content, but none is shown in v0.1 (spec 001 FR-006; features.md Stages, "soon" row "Evidence tags on ways"; decisions.md "Showing information", 2026-10-19). When levels are shown later, evidence that a method works, that it helps a particular future, and that an It feature works are different claims and must not be blurred. Today each way stores one level and one note (14 ways in `packages/content/src/fixes.ts`), with no way to say which claim it is about, and the content editor cannot edit ways at all. The baseline note "Fixes record no evidence level yet" (content-catalog) is out of date: one level per way already exists.

## What Changes

What people see and do:

- **Personal and societal pages, "Ways it can be better"**: nothing new is shown. Ways keep their type and status tags; evidence levels and notes are not shown anywhere in v0.1, and nothing on the page hints at them.
- **Founder's content editor, a Ways tab** (new): the founder sees and edits each way, including its evidence: a level (Strong, Some, Limited, Not tested yet) and a note for the claim the way itself makes, which is "this method works" for a Task, Habit or Takes a group, and "this It feature works" for a Feature.
- **Feature ways**: may also record the evidence for the method they build on (for example, peer support has research behind it while It's check-ins have not been tested), kept apart from the feature's own level.
- **A way's link to each future**: may record its own level and note for "this way helps this future", separate from the method's evidence.
- **Publishing**: a way without a level and note for its own claim cannot be published.

Out of scope: showing evidence to people (features.md "soon"), linking sources to evidence ("with their notes and linked sources" is part of the "soon" row; FR-017 "Read more" sources are separate), evidence for pains or futures, and the evidence-weighing view decisions.md places "where someone weighs acting on a way".

Must leave room for (features.md Stages): evidence tags on ways (stored claims map directly onto the four tags), explicit paths (evidence on a way–future link travels with the link, not the way), and own contributions (an approved way gets "Not tested yet" unless the reviewer sets another level).

## Capabilities

### New Capabilities
None.

### Modified Capabilities
- `content-catalog`: every way records an evidence level and note for its own claim; feature ways may record method evidence; way–future links may record link evidence; the editor can edit ways and their evidence.
- `pain-explorer`: evidence levels and notes are not shown in v0.1.

## Impact

- `packages/content/src/graph-schema.ts` and `fixes.ts` (claim fields on fixes and fix–dream links; seed data split by claim).
- `packages/database` (migration adding the new columns; read/write in `content-repository.ts`).
- `apps/app/app/cms/index.tsx` (Ways tab).
- `apps/app` pain explorer: no visible change; a test guards that evidence is not rendered.
- No API contract change beyond the content schema it already carries.

## Open questions

The full list with options and recommendations is in `confirm.md`. In short:

1. How the three claims are stored.
2. Whether way–future link evidence is optional, and whether "not assessed" differs from "Not tested yet".
3. How much of the Ways tab this change builds.
4. Whether the founder re-rates the existing 14 ways' evidence by claim, or they are migrated mechanically.
5. Whether published content keeps carrying evidence to the app while it is not shown.
6. Whether "Strong" or "Some" need a source before publishing.
