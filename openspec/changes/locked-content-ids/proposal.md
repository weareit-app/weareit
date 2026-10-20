# Proposal

## Why

Saved picks, selected fixes and future links all point at content IDs, so an ID must never change once published (spec 001 FR-020; decisions.md "Content graph": "v0.1 must give every published record a stable ID"). Today the content editor lets the founder rename a published record's ID (`updateRecord("id", …)` in `apps/app/app/cms/index.tsx`), which cascades to links inside the draft but silently breaks picks already saved on devices and accounts (content-catalog "Known divergence").

## What Changes

What the founder sees and does in the content editor (people using It see no change; their picks simply keep working):

- **A record that has been published**: its "Stable ID" is shown but cannot be edited, with a short line saying published IDs never change and that wording and slugs can.
- **A record not yet published**: its ID can still be edited, as today.
- **Publishing**: if the draft would drop an ID that was published before (for example by deleting a record, or by a rename made outside the editor), publishing lists those IDs and goes ahead only if the founder confirms each removal. The same applies to rolling back to an older version.
- **First publish of a record**: publishing lists the IDs being published for the first time, so the founder approves them knowing they become permanent, and refuses IDs that still have the editor's placeholder form (`new-…`).

Out of scope, and the boundary with the pain-pages change (`/p/<slug>`, spec 012): readable slugs, old-slug aliases, retired pains and replacements all belong to pain pages. This change only guarantees that the ID underneath never changes; a slug is separate from the ID and may change. Also out of scope: role-based editor access, and re-checking saved picks against removed IDs (the signup-gate change already drops unmatched picks).

Must leave room for (features.md Stages): personal story and explicit paths (both rely on picks pointing at stable IDs), and the post-launch Thing / Type / Relation layer (links refer to stable IDs).

## Capabilities

### New Capabilities
None.

### Modified Capabilities
- `content-catalog`: published IDs are locked in the editor and protected at publish and rollback; first-time IDs are confirmed and placeholders refused.

## Impact

- `apps/app/app/cms/index.tsx` (ID field read-only for published records; confirmation lists at publish and rollback).
- `packages/database/src/content-repository.ts` (set of IDs ever published; removed-ID and new-ID checks in publish and rollback).
- `packages/api/src/contract.ts` and `router.ts` (publish and rollback accept the confirmed removals and new IDs; validate returns them).
- No migration needed if the ID set is computed from `published_content_versions`; no new dependencies.

## Open questions

All answered by the founder on 2026-10-19, each as recommended; see `confirm.md`.
