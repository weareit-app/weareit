# OpenSpec workflow

How a change to what the app does goes from idea to shipped. `AGENTS.md` points here.

## Where specs live

- `openspec/specs/` describes what the app does today, one capability per folder.
- `openspec/changes/<name>/` holds proposed work: proposal, spec deltas, design, and tasks.
- Project rules for proposals and specs are in `openspec/config.yaml`.

## Steps

1. Interview the founder with `/grill-with-docs` (or `/grill-me`), reading the matching old Spec Kit material as evidence (`docs/agents/spec-kit.md`).
2. Write the change with `/opsx:propose` (Codex: `$openspec-propose`). Specs live only in OpenSpec.
3. Build with `/opsx:apply` plus `/tdd` or `/implement`; review with `/code-review`; `/opsx:archive` when shipped.

Developer tooling, or a stack change with no user-facing behaviour, skips OpenSpec: grill, record the decision in `docs/architecture/decisions.md`, then build and review as in step 3.

## Roles

OpenSpec owns *what* the app does (specs and changes); Matt Pocock's skills own *how* the work is done (grilling, TDD, review, debugging).

## Tracking progress

Progress lives in the change's `tasks.md` checkboxes, the single tracker. Use `/to-tickets` only to hand work to parallel sessions or people: one GitHub issue per task group on `weareit-app/weareit`, linking its tasks in `tasks.md` rather than copying them. Tick the boxes as work lands; close the issue when its group is done.
