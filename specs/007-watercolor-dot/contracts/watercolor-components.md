# UI Contract: watercolor components (007)

Components in `apps/app/src/watercolor/`. `WatercolorDot` has a native file (Skia) and a `.web.tsx` file (the same dot B shader drawn with WebGL; the animated painted orb only if WebGL is unavailable). Props are the contract; both platforms accept the same props.

## `<WatercolorDot>`

The primitive. Decorative by default.

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `size` | number | required | diameter in points |
| `palette` | `Palette` id | `"it-orb"` | FR-014, FR-016 |
| `approach` | `"B" \| "E"` | chosen by proof (constant `WATERCOLOR_APPROACH`) | only the lab overrides it |
| `dot` | PaintedDot id | `"orb-01"` | Option E only |
| `motion` | `"still" \| "bloom-once" \| "bloom-loop" \| "breathe"` | `"still"` | `bloom-once` ends settled and still; `bloom-loop` blooms (crisp edge), rests, softly fades and blooms again (timeline in `packages/watercolor/src/motion.ts`) |
| `seed` | number | `0` | Option B variation |
| `accessibilityLabel` | string | none | if absent, the dot is hidden from assistive tech |

Guarantees:
- Renders the painted orb at the same size and place until the generated dot is ready, and if it fails (FR-010). Never blocks rendering of siblings.
- Reduced motion → still, settled frame; switching mid-animation settles promptly (FR-019).
- Never focusable; no press handling.
- Pauses when the app is backgrounded.

## `<WatercolorLoader>`

Replaces the loading branch of `ContentQueryState` (FR-007).

| Prop | Type | Default |
|---|---|---|
| `label` | string | `"Loading…"` |
| `size` | number | 56 |

Motion: `bloom-loop`, the original B bloom (founder, 2026-10-17; the living-loader direction is on hold, see `explore/living-loader`). Guarantees: appears only after 300 ms (research R8; no minimum display time, because holding the loader would hold back content); text label always visible; announced once; dot itself hidden from screen readers (FR-020, FR-021); no percentage or progress (FR-012). Error state unchanged and the dot is gone (FR-013).

## `<WelcomeMark>`

Replaces the `Image` on the welcome screen (FR-008). Same container size as today (`h-44`, `w-44`). `motion="bloom-once"`, then completely still. `accessibilityLabel` keeps today's meaning ("It's watercolor mark"). "Get started" is never delayed.

## `<StepBloom>`

Small dot in a corner of each onboarding page after a step change (FR-009). Rendered by `Page` when a new `stepBloom` prop is set by the onboarding screens. `motion="bloom-once"`; hidden from assistive tech; not rendered with reduced motion or before ready (spec US4 #3–4).

## Lab route `app/lab/watercolor.tsx` (development builds only)

Not reachable in production builds. Shows painted orb, B and E side by side (FR-001); palette switch `it-orb` / `rose-violet`, still / loader toggle (FR-002); "Measure" runs the one-large and thirty-small samples per approach (FR-003, research R9); "Copy results" copies JSON for `proof/results.md`; verdict buttons B / E / neither include the date in the copied JSON (FR-004).
