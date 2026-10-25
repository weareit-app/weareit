# CMS

## Purpose

The onboarding content is part of the product model. Product owners need to revise pains, dreams, first actions, and their relationships without shipping an app release for every copy change. PostgreSQL is the source of truth from the start, and the MVP includes a small first-party authoring interface.

This is a focused CMS for It's structured content, not a general page builder.

## MVP content

- Domains group personal and societal pains.
- Pains have presentation copy, kind/scope, and links to one or more dreams.
- Dreams can relate to more than one pain where appropriate.
- First actions have presentation copy, effort/evidence/safety fields, and links to one or more pains.
- Provenance records capture source, evidence type, review state, and rights/license. Provenance must be reviewable before publishing.
- Stable content IDs are used in local onboarding drafts. Editing copy must not silently invalidate saved selections.

The seed corpus remains in `docs/source/` as provenance and import input. The current `@it/content` literals are temporary scaffold/import data. They must not remain a second production source of truth after database-backed content is wired into the app.

## Publishing model

Use Kysely migrations and normalized PostgreSQL tables for editable content and its relationships. Validate imported and edited records with Zod at API boundaries. A publish operation validates the complete linked content set, then creates an immutable, versioned snapshot consumed by the app. Keep prior snapshots available for rollback. The app requests the current published version through semantic oRPC operations and caches it with TanStack Query; pre-signup personal answers remain local and are never sent with content requests.

Draft editing and publishing should be distinct operations. A partially edited draft must not appear in onboarding. Published content is read-only to app clients. An admin-only content API controls authoring and publication.

## CMS workflow

1. Create, edit, or remove structured records and their links. Update source records and per-record provenance in the same draft.
2. Validate required copy, stable IDs, references, provenance, and applicable safety notes.
3. Preview the onboarding screens using a draft snapshot.
4. Publish a versioned snapshot and retain the prior version for rollback.

The first version needs basic access control and an edit/publish history. It does not need multi-stage approvals, arbitrary layouts, plugin fields, or a configurable workflow engine.

## Rights and privacy

Knowledge-graph claims use the current CC0 working decision; authored guides use CC BY-SA 4.0; illustrations use CC0 with provenance records. Personal onboarding answers are not content records. Do not store them in the CMS, associate them with content edits, or expose them in published snapshots.

## Initial implementation status

- Kysely defines normalized PostgreSQL tables and migration `001_initial_content`.
- The one-time seed imports the sourced Tier 1 corpus with stable IDs, relations, rights, and document locators, then publishes its initial snapshot.
- oRPC exposes published reads and protected draft, validation, preview, publish, version history, and rollback operations.
- Expo Router screens fetch only published content through TanStack Query. Personal selections and draft answers remain in the on-device store.
- `/cms` provides structured record and source creation/editing/removal, relationship and provenance controls, preview, publish validation, and rollback. Removing a domain also removes its child pains and related links from the unsaved draft; removing a referenced source is blocked until its provenance references are reassigned.
- `/cms` has a Feature statuses panel: each Feature fix's roadmap status (Live, In progress, Planned, Exploring or Idea), the date it last changed and a note of what changed. Saving a status change without a new note is refused, by the screen and by the API; the date defaults to the day of the change.
- `/cms` has a Roadmap section: roadmap items (readable stable ID, title, one line, status, status date and note) that the founder adds, edits, reorders and removes, and the Feature fixes connected to each. A connected fix has no status of its own: it shows its item's status everywhere, and the Feature statuses panel leaves it out. Disconnecting a fix, or removing its item, gives the fix the status, date and note it was showing in the saved draft (its item's, or its own if it was connected only in this edit), and that alone needs no new note. An item's status change needs a new note, like a fix's; a new item needs none and records the day it is saved. In both the Roadmap section and the Feature statuses panel, a status date must be a real date written year-month-day; the screen says so in plain words and refuses the save otherwise. Items are stored in `roadmap_items` (migration 007) and publish and roll back with the content version.
- Repository tests that need PostgreSQL (`packages/database/src/feature-statuses.test.ts`, `roadmap-items.test.ts`, `readiness.test.ts`, and `check-enums.test.ts`, which checks that each enum `CHECK` constraint lists exactly its `@it/domain` Zod enum) run when `TEST_DATABASE_URL` points at a disposable Postgres server and skip otherwise; each test file drops and recreates its own database there. CI sets it for the unit tests, against a Postgres service container in the "Typecheck, lint and unit tests" job (`.github/workflows/ci.yml`).
- Initial CMS access uses `CMS_ADMIN_TOKEN` as a bootstrap gate. This must move to role-based authentication before multiple or outside editors are invited.

## Pending content edits

The seed only fills an empty database, so a copy change made in `@it/content` does not reach a database that already has content. Make each edit below through `/cms` in every existing database (local and deployed), publish, then remove it from this list.

| Record | Field | From | To | Why |
|---|---|---|---|---|
| Dream `moving-with-friends` (Body → Fitness) | description | "Exercise is something we do together." | "I exercise with people I like." | First person, so it joins with the other Fitness lines (2026-10-19). |
| Dream `healthcare` (world, Health) | description | "You get care when you need it." | "We get care when we need it." | The world page speaks as "us" (2026-10-18). |

For local setup, see the root README. The API server uses the Node PostgreSQL driver and accepts any PostgreSQL connection URL, including Neon pooled URLs; it does not depend on Neon-specific APIs.
