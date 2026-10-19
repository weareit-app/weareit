# Design

## Context

See proposal.md. The behaviour is built: `apps/app/src/watercolor/watercolor-loader.tsx` (300 ms delay, single "Loading…" announcement, failure handling), `brand-mark.tsx` (`aria-label="We are It"`), `packages/watercolor` (`palettes.ts`, `mix.ts`, Zod palette data, `isVisible`), WebGL on web (`webgl-dot.web.tsx`) and Skia on iOS. Tests exist in `watercolor-loader.test.tsx` and `apps/app/e2e/watercolor.spec.ts`. Open items come from old 007 tasks T027, T034–T036, T047, T049.

## Goals / Non-Goals

**Goals:** make the specs match the code; finish the measurements; stop shipping the unused Option E atlas; leave nothing in `specs/007-watercolor-dot/` that isn't elsewhere.

**Non-Goals:** new visuals; the "soon" watercolor ideas; reviving the living loader.

## Decisions

1. **App palette constant.** Add `apps/app/src/watercolor/palette.ts` exporting the default palette ID (`it-orb`, now in the brand inks tide/sprout/sun) and a `resolvePalette(id)` that falls back to it when missing or failing `isVisible`. `GatherDot`'s hard-coded palettes go through it.
2. **Remove the Option E atlas from the app bundle.** Dot B was chosen; drop the `painted-dots.ts` → `skia-dot.tsx` atlas path and the `orb-01` assets from the app if nothing else uses them, keeping them in the lab or tools if still useful. Record `orb-01` provenance in `apps/app/assets/brand/README.md` either way.
3. **Keep 007's findings in code.** Add a comment in `skia-dot.tsx` on using one canvas per screen of dots (GPU context exhaustion) and that Option E painting is deterministic (~4 s). Move the manifest rules from 007's contract into `packages/watercolor/src/manifest.ts` and `tools/watercolor-sim/README.md`, and repoint every comment that cites `specs/007-watercolor-dot/`.
4. **Measurements.** Frame times on iPhone 12 (real device) and laptop Chrome and Safari with 1 large and 30 small dots; web first-screen time before and after; iOS binary growth recorded in `decisions.md` replacing "roughly 4–6 MB".

## Risks / Trade-offs

- [iPhone 12 misses 60 fps] → Founder decides: fewer dots, simpler shader, or a lower target.
- [Removing the atlas breaks the lab] → Keep it behind the lab route if the lab still uses it.
