# Spec Kit → OpenSpec migration

Spec Kit was retired on 2026-10-19. Its tooling is gone; its content stays here as source material until each piece has informed a new OpenSpec spec or decision. The full Spec Kit state is tagged `speckit-final`.

Rules:

- New specs are written from what the founder wants now. Old specs, their answered questions and the code are evidence, not text to copy.
- An artifact is deleted only after its row says where its content went (an OpenSpec change or spec, a decision record, or "dropped, because …").
- Where artifacts disagree, AGENTS.md and `docs/architecture/decisions.md` win. Spec 013's 2026-10-19 measurement change postdates 001 and 008–012.

| Artifact | State at retirement | Went to | Status |
|---|---|---|---|
| `specs/001-personal-page/` | Spec; largely built (onboarding redesign); synced with the 2026-10-17/18 review | Built behaviour → baseline `openspec/specs/pain-explorer`, `on-device-choices`. Unbuilt parts → changes `own-contributions`, `fix-evidence-levels`, `locked-content-ids` (all confirmed 2026-10-19), (001 FR-027, linking opened pains to pain pages, dropped by the founder 2026-10-19); measurement → `visit-measurement` (2026-10-19) | drafted; founder confirm pending |
| `specs/007-watercolor-dot/` | Full plan and tasks; approved 2026-10-17 | Placement, loader, reduced motion, WebGL/Skia split and lab → baseline `brand-mark`; stack, licence, CC0 provenance, budget, verdict B → decisions.md (Graphics); iOS build notes → `docs/dev/ios.md`; remaining behaviour and open tasks → change `watercolor-followups` (2026-10-19) | in progress (delete when `watercolor-followups` is done) |
| `specs/008-signup-gate/` | Spec, founder answers applied; 4 open questions | Re-grilled 2026-10-19 → `openspec/changes/required-signup-gate/` (all 008 decisions kept; Q21 → one line on the name step; Q22 → browser passkey suggestion on web; password minimum 12; measurement linking moved to the measurement change) | in progress (delete after archive) |
| `specs/009-support-page/` | Spec, founder answers applied; 3 open questions | Drafted and confirmed 2026-10-19 → `openspec/changes/embedded-support/` | confirmed; build after required-signup-gate |
| `specs/010-safety-privacy/` | Privacy page, contact and FAQ; safety floor deferred | Placeholder → `required-signup-gate`; full page, FAQ and contact → `openspec/changes/full-privacy-page/` (grilled 2026-10-19); safety floor deferred (kept only in `speckit-final`) | in progress (delete after archive) |
| `specs/012-entry-links/` | One page per pain at `/p/<slug>`; 4 open questions | Drafted and confirmed 2026-10-19 → `openspec/changes/pain-pages/` (per-pain counting moved to `visit-measurement`; ID lock in `locked-content-ids`) | confirmed |
| `specs/014-i18n-spanish/` | Spec, plan and tasks (approved 2026-10-17); branch `claude/it-i18n-support-plan-7006e5` holds reusable code | Drafted and confirmed 2026-10-19 → `openspec/changes/spanish-language/` (reusable code noted in its design.md) | confirmed; delete branch `claude/it-i18n-support-plan-7006e5` after its code is reused |
| `specs/013-measurement/` | Spec; all questions answered; changed the measurement invariant | Drafted and confirmed 2026-10-19 → `openspec/changes/visit-measurement/` | confirmed; build after required-signup-gate |
| `.specify/assessments/help-page/` | Help build It assessment | Founder go on Option A (2026-10-19) and grilling → `openspec/changes/help-build-it/` | in progress (delete after archive) |
| `.specify/assessments/it-mvp/` | v0.1 go decision (founder override) | Go decision and launch conditions → decisions.md "v0.1 launch" (founder confirmed 2026-10-19). Research (voluntary-payment benchmarks, forced-registration drop-off, Apple 3.1.1, DemocracyLab warning) still only here | in progress |
| `.specify/assessments/thing-type-relation/` | Decided 2026-10-16 | Decisions → decisions.md (Content graph); research and options → `docs/research/thing-type-relation/` | done (folder deleted 2026-10-19) |
| `.specify/assessments/watercolor/` | Decided | Decisions → decisions.md (Graphics); research, options and `reference-dot.png` → `docs/research/watercolor/` (script path updated); later ideas → features.md "soon" | done (folder deleted 2026-10-19) |
| `.specify/memory/constitution.md` | Draft principles | AGENTS.md and `openspec/config.yaml`; the two uncaptured principles ("no fake metrics or social proof", "vendors behind It-owned boundaries") added 2026-10-19 | done (file deleted 2026-10-19) |
| `.specify/templates/overrides/spec-template.md` | It checks (privacy, honest status, must-not-block, accessibility, research questions) | `openspec/config.yaml` rules (privacy, honest status, must-not-block, accessibility, screen-by-screen first). Research questions dropped: they fed `pieces.yaml`, which is parked. | done (file deleted 2026-10-19) |
| `docs/spec/reviews/2026-10-18-founder-answers.md` | Founder answers for 008–012 | | not started |

Audit of the remaining artifacts (007, assessments, constitution, 010, Help build It): `docs/spec/speckit-audit-2026-10-19.md`.
