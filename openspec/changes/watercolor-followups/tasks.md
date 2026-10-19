# Tasks

## 1. Palettes

- [ ] 1.1 Add `apps/app/src/watercolor/palette.ts` with the default palette and `resolvePalette` fallback; route `GatherDot` and the dot components through it
- [ ] 1.2 Component test: a missing or invisible palette falls back to the default
- [ ] 1.3 e2e: no screen offers a colour control

## 2. Bundle and provenance

- [ ] 2.1 Remove the Option E atlas path from the app bundle (keep it in the lab or tools if used there)
- [ ] 2.2 Record `orb-01` provenance in `apps/app/assets/brand/README.md`

## 3. Code notes and pointers

- [ ] 3.1 Move the manifest rules from 007's contract into `packages/watercolor/src/manifest.ts` and `tools/watercolor-sim/README.md`
- [ ] 3.2 Repoint comments citing `specs/007-watercolor-dot/` (`manifest.ts`, `types.ts`, `skia-dot.tsx`, `lab-screen.tsx`, `approach.ts`, `tools/watercolor-sim/README.md`)
- [ ] 3.3 Add the one-canvas-per-screen and deterministic-painting notes to `skia-dot.tsx`

## 4. Measurements

- [ ] 4.1 Frame times on a real iPhone 12 and laptop Chrome and Safari (1 large, ~30 small dots)
- [ ] 4.2 Web first-screen time and download size before and after the mark
- [ ] 4.3 iOS binary growth; record it in `docs/architecture/decisions.md`

## 5. Verification

- [ ] 5.1 Typecheck, lint, unit and e2e tests pass
- [ ] 5.2 Confirm nothing in `specs/007-watercolor-dot/` is still needed; fill its `docs/spec/MIGRATION.md` row and delete the folder

## Workflow follow-up

- Archive with `/opsx:archive` once done.
