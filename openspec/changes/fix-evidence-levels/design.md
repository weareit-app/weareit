# Design

## Context

See proposal.md for why. Current state:

- `contentFixSchema` (`packages/content/src/graph-schema.ts`) already requires `evidence` (`strong | some | limited | untested`) and `evidenceNote` on every fix; migration `005_content_fixes` stores them as NOT NULL columns with a check constraint. `fixDreamLinks` are `{fixId, dreamId}` only.
- The 14 seeded ways (`packages/content/src/fixes.ts`, from the 2026-10-18 prototype) have one rating each; some notes mix claims, for example the check-ins feature: "Peer support has research behind it, but this It feature hasn't been tested." Its file comment says no rating has linked sources yet.
- The app never renders `evidence` (grep: only first actions' unrelated `candidate | practical` field is shown, in `first-action-card.tsx`). Published content carries the fields to the app.
- The CMS edits domains, pains, dreams and first actions; ways come only from the seed import, so the founder cannot change evidence without a code change. decisions.md says Git must not become a competing source of truth for content.
- The stored value `untested` is shown to the founder as "Not tested yet".

## Goals / Non-Goals

**Goals:**

- Each stored level says which claim it is about, without a schema that has to change again when levels are shown.
- The founder can maintain evidence in the editor.

**Non-Goals:**

- Showing evidence to people; sources linked to evidence; a general claims model (the Thing / Type / Relation layer is built after launch).

## Decisions

1. **Claim fields where the claim lives** (confirm.md Q1). Keep `evidence` and `evidenceNote` on the way as its own claim, interpreted by `kind`: method for `once | habit | group`, It feature for `feature`. Add optional `methodEvidence` and `methodEvidenceNote` on features only (schema refuses them on other kinds). Add optional `evidence` and `evidenceNote` to `fixDreamLinks` for "this way helps this future". Both optional pairs are all-or-nothing. _Alternatives:_ a general evidence-claims list `{subject, claimType, level, note}`, rejected for v0.1 as more machinery than one editor needs and likely to be replaced by the post-launch claims layer; a single `claimType` field per way, rejected because a feature has two claims at once.

2. **No new level for "not assessed".** A link without a level is not assessed; "Not tested yet" means nobody has tested it (confirm.md Q2). Keeping absence distinct stops a default from looking like a judgement.

3. **Ways tab in the CMS** (confirm.md Q3). Add `fixes` to the editor's kinds with fields for title, description, type, status, linked futures (with per-link evidence), own evidence and, for features, method evidence. Use the same draft/save/publish path; publish validation already rejects schema failures, and adds a check for half-filled optional pairs.

4. **Migration.** Add nullable `method_evidence`, `method_evidence_note` to `content_fixes` (check: only when `kind = 'feature'`, both or neither) and nullable `evidence`, `evidence_note` to `fix_dream_links` (both or neither, same value check). Published versions written before this change parse because the new fields are optional.

5. **Seed data.** Split existing notes by claim where they mix them (for example, check-ins: feature `untested`; method `some` "Peer support has research behind it"), subject to founder review (confirm.md Q4). No link evidence is seeded.

6. **Not shown, still sent.** The published content keeps the evidence fields (confirm.md Q5); a component test asserts the pain explorer renders none of them.

## Overlaps

- `own-contributions`: its contribution-review "Approved way defaults" sets "Not tested yet"; its approval flow needs the Ways tab this change adds. Both changes touch `apps/app/app/cms/index.tsx`.
- `locked-content-ids`: the new Ways tab must show way IDs as locked once published, as that change requires for every kind.
- Pain pages (`/p/<slug>`): "Evidence not shown in v0.1" applies to ways listed on pain pages too; launch-set pages with sourced text must not present way evidence levels.
- `required-signup-gate`, measurement: none (no personal data involved).

## Risks / Trade-offs

- [Founder records link evidence inconsistently because it is optional] → The editor labels each claim plainly; showing evidence later will force a review anyway.
- [Field interpretation by `kind` is implicit] → Document it in the schema and label it in the editor ("Evidence this method works" / "Evidence this It feature works").
- [Changing a way's kind flips what its level means] → The editor warns when changing kind on a way that has a level.

## Migration Plan

- One migration adding nullable columns and checks; backfill not needed. Re-seed or edit in the CMS to split mixed notes.
- Rollback: drop the new columns; older app code ignores the optional fields.
