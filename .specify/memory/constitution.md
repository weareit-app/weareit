# It Constitution

DRAFT, not yet ratified by the founder. Detailed, changeable decisions live in `AGENTS.md` and `docs/architecture/decisions.md`. This file holds only the principles every spec and plan must pass.

## Core Principles

### I. The founder decides; sources are evidence
Only decisions recorded with the founder (`docs/architecture/decisions.md`, `AGENTS.md`) bind. Documents in `docs/source/` and drafts in `docs/spec/drafts/` are AI-generated or unchecked. Specs may cite them as candidates but must not treat them as requirements. Open questions go in the spec as `[NEEDS CLARIFICATION]`, never a guess.

### II. Privacy by default
Pre-signup answers stay on the device. No stable anonymous identity or session history. Any pre-signup measurement is coarse, aggregate and described in the UI. Personal selections never appear in public artifacts by default.

### III. Honest about what is real
Every idea shown to a person carries an honest status: real now, existing resource, proposed It feature, or societal proposal. No fake metrics, fake social proof or claims of charity status. Support is a contribution and grants no product access.

### IV. Independent, testable pieces
Domain and content packages import no Expo, React Native, UI or provider code. Untrusted boundaries are validated with Zod. APIs expose semantic operations, not database-shaped endpoints. Vendors (payments, auth, storage) sit behind It-owned boundaries.

### V. Small first, but don't block what's next
v0.1 ships the core features in `docs/spec/features.md`. Each spec states what later features ("soon" in features.md) it must not block, and does not build them.

## Workflow

`/speckit.specify` one feature or screen at a time from `docs/spec/features.md` → `/speckit.clarify` until no `[NEEDS CLARIFICATION]` remains → founder review → `/speckit.plan` → `/speckit.tasks`. Changing an agreed stack choice or privacy invariant requires a decision record.

## Governance

This constitution overrides conflicting guidance in specs and plans. Amendments need founder approval and a version bump.

**Version**: 0.1.0 (draft) | **Ratified**: pending | **Last Amended**: 2026-10-16
