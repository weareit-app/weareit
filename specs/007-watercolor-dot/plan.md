# Implementation Plan: Watercolor dot — fidelity proof, v0.1 loader, palette-ready

**Branch**: `assess/watercolor` (spec dir `007-watercolor-dot`) | **Date**: 2026-10-17 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/007-watercolor-dot/spec.md` (reviewed by the founder 2026-10-17)

## Summary

Build It's watercolor mark as a generated dot in two steps. First, a **fidelity proof**: a development-only lab screen showing the painted orb, a look-alike shader dot (B) and a physics-painted dot coloured live with Kubelka-Munk (E), with frame-time and download measurements on iPhone 12 and a laptop browser; the founder picks B, E or neither. Second, ship the winner on **iOS** in three places — content loading states, the welcome mark (blooms once, then completely still) and a corner bloom on onboarding step changes — with palettes as data and It's orb palette as the default. **Web** uses the animated painted orb in those places for v0.1, because Skia's web runtime (~2.9 MB) is over the 1 MB budget (approved fallback). Pigment maths and schemas sit in a new framework-free package; the physics simulation is an offline tool whose output (pigment-density atlases with CC0 provenance) ships as assets.

## Technical Context

**Language/Version**: TypeScript 5.9.3; SkSL (Skia shading language); GLSL ES 3.0 in the offline sim tool

**Primary Dependencies**: Expo SDK 57, React Native 0.86.3, Reanimated 4.5, `@shopify/react-native-skia` (new, approved 2026-10-17; version from `expo install`), Zod 4.6.7, Playwright (existing dev dependency, runs the sim headless)

**Storage**: Bundled static assets only (`apps/app/assets/watercolor/`); no server or device storage

**Testing**: Vitest (`packages/watercolor`, sim determinism), jest-expo + Testing Library (components), Playwright e2e (web placements), manual iPhone checks and the lab's frame measurements

**Target Platform**: iOS (iPhone 12 and newer) with generated dot; web (current Chrome, Safari) with animated painted orb

**Project Type**: Universal mobile + web app in a pnpm monorepo

**Performance Goals**: 60 fps (no frame > ~16.7 ms after 1 s warm-up over 10 s) for ~30 small dots and for one large dot on iPhone 12 (SC-002)

**Constraints**: first onboarding screen no slower (SC-003); ≤ 1 MB extra on web after first screen (FR-011) — met by not loading Skia on web; ≤ ~400 KB per painted-dot atlas on iOS (target, measured in proof); no code from sudoaquarelle or Mixbox (FR-005); reduced motion → still (FR-019)

**Scale/Scope**: 2 palettes, 1–2 painted dots, 4 components, 1 lab route, 1 sim tool, 1 package

## Constitution Check

*GATE: checked before Phase 0 and after Phase 1.*

| Principle | Status | Notes |
|---|---|---|
| I. Founder decides; sources are evidence | Pass | Built on the founder's assessment decision, spec review and Skia approval (2026-10-17). Proof verdict is the founder's. |
| II. Privacy by default | Pass | No data collected or sent; dots are not built from picks in v0.1; proof results are anonymous. |
| III. Honest about what is real | Pass | Loader shows no fake progress and stops on error (FR-012, FR-013); lab labels paint vs generated. |
| IV. Independent, testable pieces | Pass | `packages/watercolor` imports no Expo/RN/UI; Zod validates manifests and palettes; Skia sits behind It's own `WatercolorDot` component. |
| V. Small first, but don't block what's next | Pass | Only the three v0.1 placements; palettes/pigments/provenance shaped to serve later shapes and scenes without building them. |
| Stack change needs decision record | Pass | Skia record approved in `docs/architecture/decisions.md`. Version pin to be added to `dependency-policy.md` at install. |

Post-design re-check: still passes; no violations, so no Complexity Tracking entries.

## Project Structure

### Documentation (this feature)

```text
specs/007-watercolor-dot/
├── spec.md
├── plan.md              # this file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/
│   ├── watercolor-components.md
│   └── painted-dot-manifest.md
├── proof/results.md     # filled during the proof (measurements, verdict, people check)
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
packages/watercolor/            # NEW, framework-free (no Expo/RN imports)
├── src/
│   ├── pigment.ts              # Pigment + K/S derivation from masstone/tint (R5)
│   ├── mix.ts                  # Kubelka-Munk mixer, linear↔sRGB
│   ├── palettes.ts             # it-orb (default), rose-violet; visibility check (R6)
│   ├── manifest.ts             # Zod schema for painted-dot manifests
│   └── shaders/                # SkSL sources as strings: km.sksl, dot-b.sksl, dot-e.sksl
└── tests/                      # vitest

tools/watercolor-sim/           # NEW, offline tool, not shipped
├── README.md                   # method + clean-room note (Curtis 1997, K-M)
├── sim.html, sim.js            # WebGL2 shallow-water/pigment/capillary model
└── paint.ts                    # Playwright headless runner → atlas.png + manifest.json

apps/app/
├── assets/watercolor/orb-01/   # NEW painted dot (E)
├── app/lab/watercolor.tsx      # NEW dev-only proof route
├── app/index.tsx               # welcome: Image → <WelcomeMark>
├── app/onboarding/*.tsx        # set stepBloom on Page
├── src/components/page.tsx     # optional <StepBloom> corner
├── src/components/content-query-state.tsx  # loading branch → <WatercolorLoader>
├── src/watercolor/             # NEW components (.tsx native Skia, .web.tsx animated orb)
│   ├── watercolor-dot.tsx / .web.tsx
│   ├── watercolor-loader.tsx
│   ├── welcome-mark.tsx
│   └── step-bloom.tsx
└── tests/watercolor-*.test.tsx

docs/architecture/dependency-policy.md      # add Skia version pin
vitest.config.mts                            # include packages/watercolor/tests
```

**Structure Decision**: Follow the repo's split — pure logic and schemas in a `packages/*` workspace (like `@it/domain`), UI in `apps/app/src`, and tooling outside the shipped app (`tools/`, new top-level folder added to `pnpm-workspace.yaml`). Platform split by `.web.tsx` keeps Skia out of the web bundle.

## Phasing

1. **Foundation**: `packages/watercolor` (pigments, mixer, palettes, manifest schema, shaders) with tests; install Skia; pin version.
2. **Option E tool**: `tools/watercolor-sim` paints `orb-01` deterministically.
3. **Proof**: lab route with B, E and the painted orb; measurements; founder verdict in `proof/results.md`. **Gate** — stop here if verdict is "neither" and ship the animated painted orb (web path) on iOS too.
4. **Placements** with the chosen approach: `WatercolorDot`, `WatercolorLoader`, `WelcomeMark`, `StepBloom`, web fallbacks; tests; e2e.
5. **People check** (3–5 people) and fixes before shipping.

## Complexity Tracking

None.
