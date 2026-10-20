---
description: "Task list for the watercolor dot (spec 007)"
---

# Tasks: Watercolor dot — fidelity proof, v0.1 loader, palette-ready

**Input**: Design documents from `specs/007-watercolor-dot/` (plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md)

**Tests**: Included. The plan's Testing section and quickstart.md call for Vitest, jest-expo and Playwright checks, and the spec's acceptance scenarios need them.

**Organization**: By user story. **US1 (proof) is a gate**: US2–US5 start only after the founder records a verdict of B or E in `specs/007-watercolor-dot/proof/results.md`. If the verdict is "neither", skip to "If the verdict is neither" below.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependency on unfinished tasks)
- **[Story]**: US1–US5 from spec.md

Clean-room rule for every task: write simulation and color code from Curtis et al. 1997 and the Kubelka-Munk equations only. Do not open, copy or adapt code or data from sudoaquarelle.com or Mixbox (FR-005).

---

## Phase 1: Setup

- [X] T001 Install Skia in the app with `npx expo install @shopify/react-native-skia` from `apps/app`, then run `npx expo install --check`; record the resolved version and reason in `docs/architecture/dependency-policy.md` under "Expo and native packages"
- [X] T002 [P] Create workspace package `packages/watercolor` (`package.json` name `@it/watercolor`, `"type": "module"`, exports `./pigment`, `./mix`, `./palettes`, `./manifest`, `./shaders`; dependency `zod` 4.6.7; scripts `typecheck`, `lint` like `packages/domain/package.json`; `tsconfig.json` extending `tsconfig.base.json`). No Expo, React Native or UI imports (constitution IV)
- [X] T003 [P] Create workspace tool `tools/watercolor-sim` (`package.json` name `@it/watercolor-sim`, private, script `paint`), and add `tools/*` to `pnpm-workspace.yaml` packages
- [X] T004 [P] Add `packages/watercolor/tests/**/*.test.ts` and `tools/watercolor-sim/tests/**/*.test.ts` to `include` in `vitest.config.mts`
- [X] T005 Add `@it/watercolor` as a `workspace:*` dependency in `apps/app/package.json` and run `pnpm install`

---

## Phase 2: Foundational (blocks all stories)

- [X] T006 [P] Implement `Pigment` in `packages/watercolor/src/pigment.ts`: Zod schema with `id` (kebab-case), `name`, `masstone` (sRGB hex), `tint` (sRGB hex, "must be lighter than `masstone`"), `granulation` ("number 0–1"); function `deriveKS(pigment)` returning `k`, `s` as `[r,g,b]` numbers ≥ 0 from masstone and tint using single-constant Kubelka-Munk inversion over white (research R5)
- [X] T007 [P] Implement the mixer in `packages/watercolor/src/mix.ts`: sRGB↔linear conversion; `mix(pigments, densities, paper)` summing density-weighted K and S and returning sRGB reflectance with the K-M finite-layer formula over the paper color
- [X] T008 Implement palettes in `packages/watercolor/src/palettes.ts`: Zod `Palette` schema (`id`, `name`, `pigments` "2–4", `paper` defaulting to It's paper `#ffffff`); `isVisible(palette)` failing when any pigment at mid density over paper differs in luminance from paper by < 0.15 (research R6); palette `rose-violet` (rose and violet pigments); palette `it-orb` as a placeholder to be fitted in T009; export `DEFAULT_PALETTE_ID = "it-orb"` (FR-016)
- [X] T009 Fit `it-orb` pigments (teal-blue, cyan-green, warm yellow) by sampling dense and thin areas of `.specify/assessments/watercolor/reference-dot.png` with a script `packages/watercolor/scripts/fit-orb-palette.ts`, and write the resulting hex values into `packages/watercolor/src/palettes.ts`
- [X] T010 [P] Implement the painted-dot manifest Zod schema in `packages/watercolor/src/manifest.ts` exactly per `specs/007-watercolor-dot/contracts/painted-dot-manifest.md`: `schema: 1`, `frames ≥ 1`, `pigmentSlots` 2–3 (RGB only), `densityScale > 0`, `columns ≥ 1`, `breathe.from < breathe.to < frames`, `provenance` with `seed`, `simVersion`, `settings`, `pigmentsUsed`, `createdAt`, `license: "CC0-1.0"`, `method`; helper `atlasSize(manifest)` returning `size × columns` by `size × ceil(frames / columns)`
- [X] T011 [P] Write the SkSL K-M coloring function in `packages/watercolor/src/shaders/km.ts` (exported string) mirroring `mix.ts`, taking up to 4 pigments' K/S as uniforms
- [X] T012 [P] Unit tests in `packages/watercolor/tests/mix.test.ts`: blue + yellow pigments mix to a hue between them and darker than either tint (FR-015); zero density returns paper color
- [X] T013 [P] Unit tests in `packages/watercolor/tests/palettes.test.ts`: `it-orb` and `rose-violet` pass `isVisible`; a near-white pigment fails; palettes with 1 or 5 pigments are rejected (FR-014, FR-018)
- [X] T014 [P] Unit tests in `packages/watercolor/tests/manifest.test.ts`: sample manifest from the contract passes; `frames: 0`, `pigmentSlots: 4`, missing `provenance.seed` and wrong `license` fail

**Checkpoint**: `pnpm test:unit` passes; palettes and mixer are ready.

---

## Phase 3: User Story 1 — Founder chooses the approach from a side-by-side proof (P1) 🎯 Gate

**Goal**: A development-only lab showing painted orb, Option B and Option E side by side with measurements, and a recorded verdict.

**Independent test**: open `/lab/watercolor` on iPhone 12 and a laptop browser; all three dots appear in both palettes, still and moving, with frame times for 1 large and ~30 small dots and the web download; the founder records a verdict (quickstart §3).

### Option E: simulation tool

- [X] T015 [US1] Write `tools/watercolor-sim/README.md`: method (Curtis et al. 1997 shallow-water, pigment and capillary layers; K-M), the clean-room rule, how to run `paint`, and that outputs are CC0 with provenance
- [X] T016 [US1] Implement the simulation in `tools/watercolor-sim/sim.ts` (CPU, deterministic; changed from WebGL2 during implementation) from the paper: seeded paper height/absorbency from value noise; water height + velocity with semi-Lagrangian advection, downhill flow, drag and evaporation; per-pigment suspended and deposited density (up to 4) with deposition, lifting and granulation in paper valleys; capillary spread; edge flow toward the drying boundary for the darker rim. Deterministic for a given `seed` and settings
- [X] T017 [US1] Implement `tools/watercolor-sim/paint.ts`: run a circular drop with given seed/settings, capture `frames` snapshots of deposited+suspended density across bloom and drying (last = dried), pack pigment densities into RGB channels of `atlas.png` per the contract, paint a seamless `breathe` cycle, and write `manifest.json` with full provenance to `apps/app/assets/watercolor/<id>/`; CLI `--id --seed --size --frames`
- [X] T018 [P] [US1] Determinism test in `tools/watercolor-sim/tests/paint.test.ts`: two runs with the same seed produce byte-identical atlases, and the manifest validates with `@it/watercolor/manifest`
- [X] T019 [US1] Paint `orb-01` with `pnpm --filter @it/watercolor-sim paint -- --id orb-01 --seed 1729 --size 256`, tuning settings until it reads like the orb; commit `apps/app/assets/watercolor/orb-01/` and note the atlas size

### Option B: look-alike shader

- [X] T020 [P] [US1] Write SkSL for Option B in `packages/watercolor/src/shaders/dot-b.ts`: noise-warped circular distance for the bled edge, edge-darkening term, layered-noise pigment density with bloom fronts, granulation from a paper-noise term, time uniforms for breathe and bloom-and-settle, color via the `km.ts` function (research R3)
- [X] T021 [P] [US1] Write SkSL for Option E in `packages/watercolor/src/shaders/dot-e.ts`: sample the atlas frame (frame index and columns as uniforms), map RGBA densities to pigment slots, color via `km.ts`

### Lab

- [X] T022 [US1] Create shared native renderer `apps/app/src/watercolor/watercolor-dot.tsx` with Skia `Canvas` + `RuntimeEffect`, props per `contracts/watercolor-components.md` (`size`, `palette`, `approach`, `dot`, `motion`, `seed`, `accessibilityLabel`), Reanimated shared values for time; painted-orb fallback until ready or on error (FR-010); `useReducedMotion()` → still settled frame; pause on `AppState` background
- [X] T023 [US1] Create the lab route `apps/app/app/lab/watercolor.tsx`, rendered only when `__DEV__` (redirect to `/` otherwise): painted orb (labeled "Reference — paint"), B and E side by side at the same size with names and "how it was made"; toggles for palette (`it-orb` / `rose-violet`, painted orb never re-colored) and still / loader (FR-001, FR-002)
- [X] T024 [US1] Add measurement to `apps/app/app/lab/watercolor.tsx`: per approach, "one large" (1 dot, 240 pt) and "thirty small" (6×5 grid, 40 pt) scenes, `useFrameCallback` sampling 10 s after 1 s warm-up, showing p99 and max frame ms (research R9)
- [X] T025 [US1] Add web measurement to the lab: on web only, lazy-load Skia/CanvasKit inside the lab route (`apps/app/app/lab/watercolor.web.tsx` if a separate file is needed) and report bytes for CanvasKit wasm + shader + atlas and whether ≤ 1 MB (FR-003, FR-011); confirm CanvasKit is not in the main web bundle (research R11)
- [X] T026 [US1] Add verdict buttons (B / E / neither) and "Copy results" producing JSON with device, scenario, `frameMsP99`, `frameMsMax`, `webDownloadBytes`, `fitsWebBudget`, verdict and date (FR-004) in `apps/app/app/lab/watercolor.tsx`
- [ ] T027 [US1] Create `specs/007-watercolor-dot/proof/results.md` with a table for measurements, sections for the verdict and the people check, and fill measurements from iPhone 12 and laptop Chrome and Safari
- [X] T028 [US1] Founder reviews the lab and records the verdict and date in `specs/007-watercolor-dot/proof/results.md`; set `WATERCOLOR_APPROACH` in `apps/app/src/watercolor/approach.ts` to the chosen value

**Checkpoint (gate)**: verdict recorded. B or E → continue. Neither → "If the verdict is neither".

---

## Phase 4: User Story 2 — Dot while content loads (P1)

**Goal**: Every content loading state shows a breathing dot with "Loading…".

**Independent test**: slow the network on a content page; dot + "Loading…" appear after 300 ms and give way to content; reduced motion → still; error → retry, no dot (quickstart §4–5).

- [X] T029 [P] [US2] Create web fallback `apps/app/src/watercolor/watercolor-dot.web.tsx`: same props; renders `watercolor-orb.jpg` at `size`, animating `breathe` and `bloom-once` with Reanimated opacity/scale only; still with reduced motion; never imports Skia (research R2)
- [X] T030 [US2] Create `apps/app/src/watercolor/watercolor-loader.tsx`: shows after 300 ms (R8; minimum display dropped, see research); `WatercolorDot motion="breathe"` hidden from assistive tech; visible text label (default "Loading…") announced once (`accessibilityLiveRegion="polite"`, iOS `announceForAccessibility`); no percentage (FR-007, FR-012, FR-020, FR-021)
- [X] T031 [US2] Replace the loading branches in `apps/app/src/components/content-query-state.tsx` with `WatercolorLoader` inside the existing `Page`; keep the error branch unchanged with no dot (FR-013)
- [X] T032 [P] [US2] Component tests in `apps/app/tests/watercolor-loader.test.tsx`: nothing at 200 ms; dot + "Loading…" after 300 ms; dot hidden from accessibility; reduced motion renders still; asset load failure shows the painted orb
- [X] T033 [P] [US2] E2E in `apps/app/e2e/watercolor.spec.ts`: throttled network on a content page shows "Loading…" then content; failed load shows "Try again" and no dot; no CanvasKit/wasm request outside `/lab`

---

## Phase 5: User Story 5 — Any palette as data, no picker (P2)

**Goal**: The dot redraws in any valid palette from data; people can't change colors.

**Independent test**: switch the app's palette constant to `rose-violet`; every dot redraws with paint-like mixing; no color control exists (quickstart §2–3).

- [ ] T034 [US5] Add `apps/app/src/watercolor/palette.ts` exporting the app's current palette id (default `DEFAULT_PALETTE_ID`) used by all watercolor components; invalid or invisible palettes fall back to `it-orb` and log a development warning (FR-014, FR-018)
- [ ] T035 [P] [US5] Component test in `apps/app/tests/watercolor-palette.test.tsx`: changing the palette id re-renders `WatercolorDot` uniforms with the new pigments' K/S; an invisible palette falls back to `it-orb`
- [ ] T036 [P] [US5] Add a check in `apps/app/e2e/watercolor.spec.ts` that welcome and onboarding pages contain no color or palette control (FR-017)

---

## Phase 6: User Story 3 — Welcome mark gently alive (P2) — done differently

Done as `BrandMark` in the page header (commit `4fa4ae8`) and the large orb removed (founder, 2026-10-18); T037–T040 are not built.

**Goal**: The welcome orb is the watercolor dot, blooms once, then rests completely still.

**Independent test**: open welcome on a slow connection; painted orb shows at once; generated dot fades in at the same size, blooms once, rests still; "Get started" usable throughout (quickstart §5).

- [x] ~~T037~~ [US3] Create `apps/app/src/watercolor/welcome-mark.tsx`: `WatercolorDot` at the current container size with `motion="bloom-once"`, ending completely still in the dried frame; soft fade from the painted orb when ready; `accessibilityLabel` "It's watercolor mark" (FR-008, FR-020)
- [x] ~~T038~~ [US3] Replace the `Image` in `apps/app/app/index.tsx` with `WelcomeMark`, keeping the `h-44` container and layout
- [x] ~~T039~~ [P] [US3] Component test in `apps/app/tests/welcome-mark.test.tsx`: label present; reduced motion never animates; fallback orb shown before ready
- [x] ~~T040~~ [P] [US3] E2E in `apps/app/e2e/watercolor.spec.ts`: welcome mark visible immediately and "Get started" navigates without waiting

---

## Phase 7: User Story 4 — Step bloom between onboarding pages (P3) — dropped

Dropped (founder, 2026-10-18); T041–T044 are not built.

**Goal**: A small dot blooms once in a corner of each new onboarding page.

**Independent test**: walk onboarding forward and back; each page shows the corner bloom; nothing waits for it; reduced motion skips it (quickstart §5).

- [x] ~~T041~~ [US4] Create `apps/app/src/watercolor/step-bloom.tsx`: small `WatercolorDot motion="bloom-once"` in a corner, hidden from assistive tech, not rendered with reduced motion or before the dot is ready (FR-009, FR-019)
- [x] ~~T042~~ [US4] Add an optional `stepBloom` prop to `apps/app/src/components/page.tsx` that renders `StepBloom` without affecting layout, and set it on `apps/app/app/onboarding/personal.tsx`, `apps/app/app/onboarding/world.tsx` and `apps/app/app/onboarding/futures.tsx`
- [x] ~~T043~~ [P] [US4] Component test in `apps/app/tests/step-bloom.test.tsx`: hidden from accessibility; not rendered with reduced motion
- [x] ~~T044~~ [P] [US4] E2E in `apps/app/e2e/onboarding.spec.ts`: forward and back through onboarding still works and picks are kept

---

## Phase 7b: Living loader (redefined 2026-10-17, FR-022–FR-025) — on hold

**On hold (founder, 2026-10-17):** the loader returns to the original B bloom loop; T051–T053 work lives on branch `explore/living-loader`. T054–T055 are done with the gathering loader (T057).

**Goal**: The loader arrives as paint spreading, stays wet and alive with colors flowing and new drops blooming in, and dries when a noticed load ends. Two versions compared in the lab before one ships.

**Independent test**: in the lab, both versions run side by side for 30 s: the edge looks like the first B bloom, colors keep changing, new drops land and bloom, nothing shrinks or fades between; "Content arrived" makes each dry in place.

- [ ] T051 [US2] Shader B living mode in `packages/watercolor/src/shaders/dot-b.ts` and `packages/watercolor/src/motion.ts`: restore the crisp first-bloom edge; add up to 4 recent "drops" as uniforms (center, radius growth, pigment, landing time) that push existing pigment outward and mix in a new color; continuous marbling flow; a `dry` input driven by the loader's end instead of a timer. Replace `bloom-loop` with `alive` and `dry-out` motions; keep the timeline worklet-safe
- [ ] T052 [P] [US2] Live simulation prototype for one dot on web: WebGL2 ping-pong version of the Curtis-style model from `tools/watercolor-sim/sim.ts` at about 128², with drops added over time and pigments colored by Kubelka-Munk, in `apps/app/src/watercolor/lab/live-dot.web.tsx` (lab only)
- [ ] T053 [US2] Lab section "Living loader": both versions side by side at 56 pt and 200 pt, a "Content arrived" button that triggers drying, frame time and download size for each
- [X] T054 [US2] Founder compares and chooses (FR-025); record in `specs/007-watercolor-dot/proof/results.md`
- [X] T055 [US2] Wire the chosen version into `WatercolorLoader`: dries on end only if shown ≥ 1.5 s, without delaying content (FR-024); update `apps/app/tests/watercolor-loader.test.tsx` and `apps/app/e2e/watercolor.spec.ts`

- [X] T056 Storyboard alternative loader ideas (ink in water, brushstroke, gathering drops, glazing / filmed paint) on branch `explore/living-loader`: `tools/watercolor-sim/storyboards.ts` writes `specs/007-watercolor-dot/explore/storyboard-*.png`
- [X] T057 [US2] Gathering loader (founder's choice, 2026-10-17): `packages/watercolor/src/gather.ts` (timeline) and `shaders/gather.ts`; `apps/app/src/watercolor/gather-dot.tsx` (Skia, iOS) and `gather-dot.web.tsx` (WebGL), painted orb as fallback; `WatercolorLoader` uses it and disappears when content arrives. Tests: `packages/watercolor/tests/gather.test.ts`, shader compile, loader component test, web e2e (keeps changing, keeps its size, no Skia download)

## If the verdict is neither

- [x] ~~T045~~ (not needed: approach B passed) Use `watercolor-dot.web.tsx` behavior (animated painted orb) on iOS too by re-exporting it from `apps/app/src/watercolor/watercolor-dot.tsx`, then do T030–T033, T037–T044; record in `proof/results.md` that palette-readiness (FR-014–FR-016) is not met for v0.1

---

## Phase 8: Polish & cross-cutting

- [x] T046 (passed on iPhone 15 Pro, founder 2026-10-18; the corner bloom item no longer applies, see proof/results.md) Manual iPhone 12 pass per quickstart §5: loader loops with no seam, welcome rests completely still, corner bloom on each step, Reduce Motion on → nothing moves, VoiceOver reads "Loading…" once and the welcome label and skips the corner dot; note results in `specs/007-watercolor-dot/proof/results.md`
- [ ] T047 Measure before/after first-screen web load time and iOS binary growth; record in `specs/007-watercolor-dot/proof/results.md` (SC-003)
- [x] T048 People check (passed, founder 2026-10-18; see proof/results.md): show loader and welcome dot to 3–5 people, ask what it feels like, what is happening, and whether waiting feels calmer or slower; record anonymous answers in `specs/007-watercolor-dot/proof/results.md` and fix anything that reads as anxious, broken or slow (SC-008)
- [ ] T049 [P] Add provenance for `orb-01` to `apps/app/assets/brand/README.md` (generated, CC0, seed and settings in its manifest)
- [ ] T050 Run `pnpm typecheck`, `pnpm lint`, `pnpm test` and fix failures

---

## Dependencies & Execution Order

- Setup (T001–T005) → Foundational (T006–T014) → **US1 gate** (T015–T028).
- After the gate: US2 (P1) first; US5, US3 (P2) and US4 (P3) can follow in any order. US3 and US4 reuse `WatercolorDot` and the web fallback from US2 (T029).
- Polish after the stories are in.

Within US1: T016 → T017 → T018/T019; T020, T021 in parallel with the sim; T022 needs T011/T020/T021; T023–T026 need T022 and T019; T027 → T028.

## Parallel examples

- Setup: T002, T003, T004 together.
- Foundational: T006, T007, T010, T011 together; then T012–T014 together.
- US1: T020 and T021 while T016–T017 are built.
- US2: T032 and T033 alongside T031.
- After US2: US3, US4 and US5 by different people in parallel (different files, except `page.tsx` in US4 only).

## Implementation strategy

1. **MVP = the proof (US1).** Nothing ships to people until the founder's verdict.
2. Then **US2** (loader): the most frequent placement and the cheapest to validate.
3. Then **US5** and **US3**, then **US4**.
4. Polish, people check, ship.
