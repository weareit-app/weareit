# Proposal

## Why

The watercolor dot (old spec 007) is built and approved, but some of its decided behaviour exists only in code and in the retired Spec Kit folder, and a few of its checks were never done. This change writes that behaviour into `brand-mark` and finishes the open work so `specs/007-watercolor-dot/` can be deleted (see `docs/spec/speckit-audit-2026-10-19.md` §1).

## What Changes

What people see does not change, except that the Option E painted-dot atlas, no longer used, stops shipping in the app. The change specifies what already happens:

- **Loader**: appears only if content takes longer than 300 ms; no words on screen; screen readers hear "Loading…" once; the dot isn't focusable; no fake progress; on failure the dot goes away and the existing error and retry show.
- **Fallback everywhere**: the painted orb shows in the same place and size wherever a generated dot is not ready, cannot be drawn or would break the web budget, on every platform; nothing waits for the mark.
- **Palettes as data**: colours come from palette data mixed like paint, with a visibility check; there is no colour picker.
- **Accessibility**: the logo is labelled "We are It" and the loader announces "Loading…" once.
- **Performance targets**: the mark adds at most 1 MB to the web download, loaded after the first screen, which is no slower; 60 frames a second with about 30 small dots on iPhone 12.

Open work: measure frame times on iPhone 12 and laptop browsers, measure web first-screen time and iOS binary growth, add the app palette constant with its fallback and tests, record `orb-01` provenance in the brand README, repoint code comments that cite 007, and keep the rendering findings in code.

Out of scope: the "soon" watercolor ideas (scene kit, live simulation, others) listed in `docs/spec/features.md`; the living loader experiments on `explore/living-loader`.

## Capabilities

### New Capabilities

### Modified Capabilities

- `brand-mark`: loader timing, failure and screen-reader behaviour; fallback on every platform; palettes as data with no picker; accessibility; performance targets.

## Impact

- App: `apps/app/src/watercolor/*` (palette constant, removing the Option E atlas path from `painted-dots.ts` / `skia-dot.tsx`), `apps/app/assets/brand/README.md`, `apps/app/assets/watercolor/orb-01/` (removed from the bundle if unused).
- Package: `packages/watercolor` comments and the manifest rules moved into `manifest.ts` / `tools/watercolor-sim/README.md`.
- Docs: `docs/architecture/decisions.md` (record measured iOS binary growth), `docs/spec/MIGRATION.md` (close 007 once done).

## Open questions

- None that change behaviour. If measurements miss the targets, the founder decides whether to change the targets or the mark.
