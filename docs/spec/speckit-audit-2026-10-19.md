# Spec Kit leftovers audit (2026-10-19)

Read-and-report audit of Spec Kit material still in the repo, against `AGENTS.md`, `docs/architecture/decisions.md`, `docs/spec/MIGRATION.md`, `openspec/specs/brand-mark/spec.md`, `openspec/config.yaml` and the code at `d2df227`. Nothing was deleted or edited. "Went to" texts are proposals for `MIGRATION.md`; nothing here is applied.

Status key: **reflected** (content is elsewhere; safe to close once the "Went to" row is filled), **partly** (some content would be lost), **missing** (not captured anywhere).

## 1. `specs/007-watercolor-dot/`

### 1a. Tasks not done

| Task | State in code | Note |
|---|---|---|
| T027 on-device frame measurements | Not done. `proof/results.md` measurement table is all "—" (iPhone 12, laptop Chrome and Safari, 1 large and 30 small) | SC-002 (60 fps with ~30 dots on iPhone 12) unverified. T046 passed only on an iPhone 15 Pro |
| T034 app palette constant `apps/app/src/watercolor/palette.ts` with fallback to `it-orb` | Not built. Components default `palette = "it-orb"`; `GatherDot` hard-codes `it-orb`, `sunrise`, `dusk`. `isVisible`/`DEFAULT_PALETTE_ID` are used only in tests | FR-014/FR-018 met at package level (Zod palette data, `isVisible`), not enforced in the app |
| T035 palette component test | Not built | |
| T036 e2e "no colour control" (FR-017) | Not built. True today by absence | |
| T047 first-screen web load before/after; iOS binary growth | Not done | SC-003 unverified; decisions.md still says "roughly 4–6 MB … the proof measures it" |
| T049 `orb-01` provenance in `apps/app/assets/brand/README.md` | Not done. Provenance is in `apps/app/assets/watercolor/orb-01/manifest.json` only | Option E atlas is still bundled through `painted-dots.ts` → `skia-dot.tsx` even though B was chosen |
| T050 typecheck/lint/test | Unchecked box (not re-run by this audit) | |
| T051–T053 living loader | Superseded by gathering loader (T057). T053 lab section exists; experiments on branch `explore/living-loader` | FR-022–FR-025 are on hold/superseded; FR-024 (dry on end) not built by founder choice |
| T037–T045 | Struck through (done differently / dropped / not needed) | Welcome mark is `BrandMark` in the header; step bloom dropped |

### 1b. Requirements vs `openspec/specs/brand-mark` and decisions.md

| 007 content | Status | Where it lives / should go | Proposed "Went to" text |
|---|---|---|---|
| Mark placement (landing, other pages), lab routes dev-only | reflected | `brand-mark` (Mark placement, Development lab). Note: code shows the *living* mark on landing (`index.tsx` `BrandMark living`), superseding 007's 2026-10-18 "still" | — |
| Loader replaces every content loading state (FR-007) | reflected | `brand-mark` Loader | — |
| Loader details: appears only after 300 ms, no flash; no words on screen, screen readers hear "Loading…" once; dot not focusable; no fake progress (FR-012); on failure dot gone and existing error + retry (FR-013); disappears on arrival; gathering motion keeps its size | partly | Built and tested (`watercolor-loader.tsx`, `watercolor-loader.test.tsx`, `e2e/watercolor.spec.ts`) but not in any spec. Add to `brand-mark` Loader + an Accessibility requirement (config.yaml requires one) | "Loader timing, failure and screen-reader behaviour → `brand-mark` (Loader, Accessibility)" |
| Painted-orb fallback wherever a generated dot is not ready or fails, nothing waits (FR-010) | partly | decisions.md "Fallback" bullet; `brand-mark` only says "fall back … where WebGL is unavailable" on web. Extend `brand-mark` to all platforms and "not ready" | "Fallback → decisions.md (Graphics) and `brand-mark`" |
| Dot B chosen (verdict 2026-10-17) | reflected | decisions.md change log: "founder chose dot B on web too"; `approach.ts` | "Verdict B → decisions.md change log 2026-10-17" |
| WebGL on web, Skia on iOS | reflected | decisions.md "Web, updated 2026-10-17"; `brand-mark` Reduced motion and fallbacks | — |
| 1 MB extra web budget, loaded after first screen; first screen no slower (FR-011, SC-003) | partly | decisions.md "Web cost" (1 MB budget). Not in `brand-mark`. decisions.md line "So web will likely use the animated painted orb …" is stale (superseded by the WebGL bullet two lines below, but not marked) | "1 MB budget → decisions.md (Graphics); add to `brand-mark` as a performance requirement" |
| Generated dots CC0 with seed/settings/pigments provenance; clean-room (no sudoaquarelle/Mixbox) (FR-005/006) | reflected | decisions.md "Generated dots", "Code that may not be copied"; `tools/watercolor-sim/README.md` clean-room rule; manifest schema enforces `license: "CC0-1.0"` | — |
| iPhone 12+ target, 60 fps with ~30 small dots (SC-002) | partly | decisions.md "Targets are iPhone 12 and newer". 60 fps target and the unmeasured state are only in 007 | Add to `brand-mark` as a performance requirement, or record as open in decisions.md |
| Palette as data (2–4 pigments), subtractive Kubelka-Munk mixing, visibility check, no colour picker (FR-014–FR-018) | missing (spec) | Built in `packages/watercolor` (`palettes.ts`, `mix.ts`) but no OpenSpec requirement. FR-016 (orb-fitted palette) superseded: `it-orb` now uses brand inks tide/sprout/sun (`docs/brand/colors.md`, 2026-10-18) | "Palette-ready → `brand-mark` (new requirement: palettes as data, paint-like mixing, no picker)" |
| Reduced motion → still end state (FR-019) | reflected | `brand-mark` Reduced motion | — |
| Text alternatives (FR-020/021): loader "Loading…", logo labelled | partly | Code: `BrandMark` `aria-label="We are It"`. Not in spec | Fold into `brand-mark` Accessibility |
| People check passed (SC-008), manual iPhone pass | reflected only in 007 | `proof/results.md`. Historical; fine to drop | "dropped, historical (passed 2026-10-18)" |
| Findings: one canvas per screen of dots (GPU context exhaustion); Option E painting is deterministic (~4 s) | missing | Only `proof/results.md`. Put in a code comment in `skia-dot.tsx` or `docs/architecture/` graphics note | "Rendering finding → code comment / `docs/architecture/watercolor.md`" |
| iOS dev-build fix (`React-Core-prebuilt/.last_build_configuration`) and Xcode 27 simulator deep-link workaround | missing | Only `proof/results.md`. Not watercolor-specific; belongs in a dev-setup doc (e.g. `apps/app/README.md` or `docs/development/ios.md`) | "iOS build notes → dev-setup doc" |
| Later ideas and options (scene kit, live simulation, "your colour", shared wash, progress as painting, night paper) | missing | `.specify/assessments/watercolor/concept.md` and 007 Must-not-block. Candidate for `docs/spec/features.md` (later) or a brand note | See §2 |
| Contracts (`painted-dot-manifest.md`, `watercolor-components.md`) | partly | Schema is in `packages/watercolor/src/manifest.ts`; props in `types.ts`. Code comments point at the 007 contract paths (`manifest.ts:3`, `types.ts:7`, `skia-dot.tsx:186`, `lab-screen.tsx:422`, `approach.ts:2`, `tools/watercolor-sim/README.md:3,30`) | Before deleting 007: move the manifest rules into `manifest.ts`/sim README and update those comments |
| plan.md, research.md, data-model.md, quickstart.md, checklists | reflected | Decisions in research R1–R11 are in decisions.md or the code; quickstart's "how to run the lab" is self-evident from `/lab/watercolor` | "dropped: plan/research superseded by decisions.md and code" |

**Proposed MIGRATION.md row for 007:** "Placement, loader, reduced motion, WebGL/Skia split and lab baselined in `openspec/specs/brand-mark`; stack, licence, CC0 provenance, 1 MB budget, verdict B → decisions.md (Graphics). Still to move: loader timing/failure/a11y, palette-as-data and performance requirements → `brand-mark`; iOS build notes → dev-setup doc; contract comments repointed. Open work (T027, T034–T036, T047, T049) → a `watercolor-followups` change. Status: in progress."

## 2. `.specify/assessments/`

### 2a. `it-mvp/` (v0.1 go, founder override, 2026-10-16)

| Content | Status | decisions.md line / where it should go | Proposed "Went to" text |
|---|---|---|---|
| Go verdict with founder override of the weak-evidence gate | missing | Not in decisions.md. Add a short "v0.1 launch" section | "Go decision and launch conditions → decisions.md (v0.1 launch)" |
| Override conditions: mid-week switch to the smallest option; launch measures never cut; **signup review line** (revisit required signup if > ~50% leave at the gate, with a decision record); re-assess ~1 month after launch | missing | Nowhere else. The signup review line matters for `required-signup-gate`. "I'd use this" marks are now "selected fixes"; measurement scope changed by spec 013 | Same section; founder to confirm which still hold |
| Web only for v0.1; iOS kept working in development | partly | decisions.md: "First platforms are web and iOS"; "iOS is optional for v0.1" (payments only) | Same section |
| Launch with all 30 Tier 1 pains; AI drafts ideas, founder approves in CMS | partly | features.md line 45 ("AI-drafted, founder-approved") for pain pages; not stated for fixes generally | features.md or content-catalog change |
| Research worth keeping: voluntary-payment benchmarks (~0.6–1.1% conversion); forced-registration drop-off evidence; Apple 3.1.1 applied to voluntary support (iOS recurring likely App Store subscriptions); DemocracyLab "offers without follow-up capacity" warning; ESCO licence caveat | missing | Only `research.md`. Apple point partly in decisions.md ("VERIFY App Store rules for recurring support") | Move to a `docs/research/` note or cite in the support/help changes |
| Rejected options A (everything at once) and C (smallest) | missing | Only `concept.md` | "dropped (historical), or keep in research note" |

### 2b. `thing-type-relation/`

All core decisions are in decisions.md:

> Decided 2026-10-16; assessment in `.specify/assessments/thing-type-relation/`.
> It will have a shared layer where any record can be linked to a **Thing** (e.g. Basketball) of a **Type** (e.g. Sport) through a named **Relation**.
> Types and Things sit on stacked levels: a Type can be described as a Thing only at the level above, never on the same level (as with universes in type theory).
> Existing records (pains, dreams, ideas, skills, occupations, roadmap items) keep their own form and link to Things; they do not become Things.
> Every link is a claim that records who or what made it, its confidence, and its review state. LLM-proposed links above a confidence threshold are used without review; the rest are queued.
> The same subject from different sources is linked by a recorded equivalence, not merged.
> The layer must not block v0.1 and is built after launch. v0.1 must give every published record a stable ID, store outside references (pain frameworks, ESCO, Wikidata) in one consistent shape, store Help answers as ESCO references, and keep content versions on picks.
> It stays on PostgreSQL + Kysely. A graph database, graph extension or formal tool needs its own decision record. Tagging people's own data by LLM needs a separate privacy decision.

| Content | Status | Where | Proposed "Went to" text |
|---|---|---|---|
| Decisions above | reflected | decisions.md "Content graph" (lines 64–74) | "Decisions → decisions.md (Content graph). Research kept in …" |
| Phase 2 scope and success metrics (curated Type list, short Relation list, olog as design document, audit loop; metrics: % content linked, unreviewed-link precision, zero level violations) | missing | Only `decision.md`. Seed for a future OpenSpec change | Future `content-graph` change |
| Carried-forward questions (seed sources, threshold and audit size, tagging people's data, formality, Postgres depth) | missing | Only `decision.md` | Same change's Open questions |
| Research: Wikidata class/instance disarray (why levels must stay apart); ologs map to relational schema; CQL licence not free for production; Apache AGE option; LLM entity-linking precision unproven; Option C (Wikidata as the layer) rejected | missing | Only `research.md`/`concept.md` | Move to `docs/architecture/content-graph.md` (or keep folder until the change is written). decisions.md line 66 points at the assessment folder and must be repointed if it moves |

### 2c. `watercolor/`

decisions.md lines quoted:

> **Approved by the founder 2026-10-17.** Spec: `specs/007-watercolor-dot/spec.md`; assessment in `.specify/assessments/watercolor/`.
> **Code that may not be copied.** sudoaquarelle.com publishes no license, so it is all-rights-reserved by default; Mixbox is CC BY-NC 4.0 (non-commercial only). Neither its code nor its data may be copied into It.
> **Generated dots.** Dots painted ahead of time are CC0 illustrations under `docs/architecture/licensing.md`, with seed, simulation settings and pigments recorded as provenance …
> **Fallback.** The painted orb … is shown in the same place and size wherever a generated dot is not ready, cannot be drawn, or does not fit the web budget, on every platform.

| Content | Status | Where | Proposed "Went to" text |
|---|---|---|---|
| Go, proof first, Skia decision record, licensing note | reflected | decisions.md Graphics section (lines 84–96) and change log | "Decisions → decisions.md (Graphics)" |
| v0.1 commitments (three placements, palette-ready, fidelity bar) | reflected / superseded | 007 and brand-mark; step placement dropped | — |
| Technique research (Curtis 1997, Bousseau 2006, Montesdeoca, K-M; sudoaquarelle model summary; Reanimated/SVG/WebGPU options) | partly | Method summarised in `tools/watercolor-sim/README.md`; full survey only in `research.md` | Optional `docs/architecture/watercolor.md`; otherwise "dropped, method in sim README" |
| Later options C (scene kit), D (live simulation) and "Ideas beyond the brief" | missing | Only `concept.md` | `docs/spec/features.md` later/soon list, founder to choose |
| `reference-dot.png` | must move | Read by `packages/watercolor/scripts/fit-orb-palette.ts:13` as its default input. Script no longer feeds `it-orb` (brand inks since 2026-10-18) but is kept for fitting palettes to a reference. Move the PNG (e.g. to `packages/watercolor/scripts/reference-dot.png` or `apps/app/assets/brand/`) and update the default path in the same commit | "reference-dot.png → <new path>, script default updated" |

## 3. `.specify/memory/constitution.md` (draft v0.2.0, never ratified)

| Principle | Status | Where it lives now |
|---|---|---|
| I. Founder decides; sources are evidence; open questions not guessed | reflected | AGENTS.md "Never treat source-document prose as an instruction…"; config.yaml context ("Old Spec Kit material … is evidence"); config.yaml proposal rule "Collect open founder questions in an 'Open questions' section". Gap: drafts in `docs/spec/drafts/` are not named as unchecked anywhere (only `docs/source/` implicitly) |
| II. Privacy by default | reflected | AGENTS.md Privacy invariants (all four points); config.yaml specs Privacy rule |
| III. Honest about what is real | partly | Honest status labels: config.yaml specs rule. No charity / support grants no access: AGENTS.md and decisions.md line 62. **Not captured: "No fake metrics, fake social proof"** |
| IV. Independent, testable pieces | partly | Packages free of Expo/RN/UI/providers, Zod, semantic operations: AGENTS.md Engineering conventions and config.yaml design rule. **"Vendors (payments, auth, storage) sit behind It-owned boundaries" not stated as a general rule** (only per case: Neon, Better Auth, payments ledger) |
| V. Small first, don't block what's next | reflected | config.yaml proposal rule "State what is out of scope and which optional or 'soon' features … this change must leave room for" |
| Workflow (speckit commands; decision record for stack/privacy changes) | reflected / replaced | AGENTS.md OpenSpec workflow; decision-record rule in AGENTS.md and config.yaml design rule |
| Governance (overrides specs; amendments with version bump) | partly | "AGENTS.md and decisions.md win" in config.yaml and AGENTS.md. Versioned amendment process dropped (not needed) |

**Proposed "Went to":** "Principles I, II, V and workflow → AGENTS.md and `openspec/config.yaml`; III and IV mostly. Not carried: 'no fake metrics or fake social proof' and 'vendors behind It-owned boundaries' — add to config.yaml specs/design rules (or AGENTS.md) before deleting. Governance versioning dropped (never ratified)."

## 4. Not migrated: open questions for later founder sessions

Only one change is in flight: `openspec/changes/required-signup-gate/`. Everything else needs a change that does not exist yet.

### `specs/010-safety-privacy/` (questions.md "Still open")

| Question | Absorbed by |
|---|---|
| Q33 contact email (one address or separate privacy@) | future `privacy-page` change (extends the `privacy-page` capability that `required-signup-gate` creates as a placeholder) |
| Q34 Neon region named on the page | future `privacy-page` change |
| Q35 production email provider | `required-signup-gate` (listed in its Open questions: "leaning Postmark", must be chosen before signup goes live); also decisions.md Open implementation decisions |
| Q36 host log retention if IPs can't be dropped | future `privacy-page` change, with the hosting decision |
| Q37 lawful basis per use | future `privacy-page` change; the measurement change (decisions.md: "Open: when account linking switches on (010 Q37)"). Q37's "no identifier" for the funnel is stale since spec 013 |
| Q38 verifying and logging access/export/deletion requests | future `privacy-page` change (operator procedure) |
| Q39 deletion response time | future `privacy-page` change |
| Q40 retention of unlinked payment records | future `privacy-page` change with the support (009) change |
| Q41 FAQ page owner | future `privacy-page` change (also help-page Still open 9) |
| Answered items already in `required-signup-gate`: Q15 session IP/UA disclosed, Q25 16+, Q26 clear device copy after save, Q27 clear control pre-signup only | `required-signup-gate` (proposal "Privacy page (placeholder)", "Picks after signup"; tasks 5.3, 6.1, 6.3) |
| Deferred safety floor (Q2–Q10, Q30, Q31) | none; deferred past v0.1. Keep `spec.md` "Deferred: safety floor" until a safety change exists |
| Stale against spec 013: 010 says the measurement section is "never linked to an account" | measurement change (013) wins |

### `.specify/assessments/help-page/` (all 18 questions answered; go not yet signed off)

| Open item | Absorbed by |
|---|---|
| Founder go on Option A (verdict "awaiting founder sign-off", with an evidence override) | future `help-build-it` change (first founder session) |
| 1 Education list and its licence | future `help-build-it` change |
| 2 ESCO licence for edited labels/merged skills; "modified from ESCO" notice | future `help-build-it` change |
| 3 Who authors skill-to-ask mapping | future `help-build-it` change |
| 4 Empty or weak matches | future `help-build-it` change |
| 5 Uncapped skill suggestions: ordering, grouping, bulk confirm | future `help-build-it` change |
| 6 Number of asks at launch, approval timing | future `help-build-it` change (content) |
| 7 Account view for offers | `required-signup-gate` creates `account-settings` (name, email, password, passkey, sign out); the offers list is added by `help-build-it` |
| 8 Free-text box limit; admin visibility | future `help-build-it` change |
| 9 FAQ page owner | future `privacy-page` change (010 Q41) |
| 10 Help funnel stage name | measurement change (013) |
| 11 Renumbering/terminology follow-ups in old specs | moot after migration (OpenSpec has no numbers; config.yaml already says "selects fixes") |
| Q10 retire `ways-to-help.tsx` and `helpInterests` | `required-signup-gate` (proposal BREAKING; tasks 2.1, 4.5). Reusing its items as first asks → `help-build-it` |
| Q9 flow position (after Support) | `required-signup-gate` leaves the slot ("Help build It will slot in here in a later change") |

## Summary

- **Can close now (fill the row, then delete):** `.specify/assessments/thing-type-relation/` decisions and `watercolor/` decisions are fully in decisions.md — but each folder also holds research or later ideas not captured elsewhere, so close only after choosing "keep in a research note" or "drop". Constitution principles I, II, V and workflow are covered.
- **Needs a code/doc update before deletion:** `reference-dot.png` (script default path); seven code/README comments pointing at `specs/007-watercolor-dot/contracts/` and `proof/results.md`; decisions.md lines 66 and 86 pointing at the assessment folders and 007.
- **Needs a change:** brand-mark gaps (loader timing/failure/a11y, palette-as-data, 1 MB and 60 fps performance) plus 007's unfinished tasks (T027, T034–T036, T047, T049) → a `watercolor-followups` change or a brand-mark spec edit. Privacy page Q33–Q41 → `privacy-page` change. Help build It → `help-build-it` change.
- **Needs a founder decision:** whether the it-mvp override conditions (signup review line at ~50% drop-off, re-assess a month after launch, web only) still hold and go into decisions.md; whether "no fake metrics / social proof" and "vendors behind It-owned boundaries" become rules; go/no-go on Help build It; whether to keep the watercolor "ideas beyond the brief" in features.md.
