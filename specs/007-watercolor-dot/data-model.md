# Data Model: Watercolor dot (007)

All of this is static, bundled data and in-memory state. Nothing is stored on a server or on the person's device, and nothing is personal (spec, It Checks → Privacy). Schemas live in `packages/watercolor` as Zod schemas and are validated when bundled assets load.

## Pigment

One paint color.

| Field | Type | Rules |
|---|---|---|
| `id` | string | kebab-case, unique within a palette |
| `name` | string | human name, e.g. "Teal blue" |
| `masstone` | sRGB hex | color at full strength |
| `tint` | sRGB hex | color when thinly diluted over white paper; must be lighter than `masstone` |
| `granulation` | number 0–1 | how much it settles in paper valleys (used by B shader; E bakes it in) |
| `k`, `s` | [r,g,b] numbers ≥ 0 | derived from `masstone` + `tint` (research R5); not hand-authored |

## Palette

| Field | Type | Rules |
|---|---|---|
| `id` | string | e.g. `it-orb`, `rose-violet` |
| `name` | string | |
| `pigments` | Pigment[2–4] | FR-014 |
| `paper` | sRGB hex | defaults to It's paper color |
| `visible` | derived boolean | passes the visibility check (research R6, FR-018); a palette that fails cannot be used at runtime and fails its unit test |

v0.1 has exactly two palettes: `it-orb` (default, FR-016) and `rose-violet` (proof only).

## PaintedDot (Option E only)

A dot painted ahead of time by `tools/watercolor-sim`. Stored as `apps/app/assets/watercolor/<id>/manifest.json` + `atlas.png`. Contract: `contracts/painted-dot-manifest.md`.

| Field | Type | Rules |
|---|---|---|
| `id` | string | e.g. `orb-01` |
| `size` | integer px | square frame size, e.g. 256 |
| `frames` | integer ≥ 1 | bloom-and-settle sequence; last frame is the still "dried" state |
| `pigmentSlots` | 2–3 | atlas RGB channels used; slot n is colored by palette pigment n (alpha unused: premultiplication would corrupt it) |
| `densityScale` | number > 0 | byte v → density v / 255 × densityScale |
| `fps` | number | playback rate for the sequence |
| `breathe` | object | optional slow loop: frame range and period, seamless (FR-012) |
| `provenance` | object | `seed`, `simVersion`, `settings` (all sim parameters), `pigmentsUsed` (the palette ids/densities painted with), `createdAt`, `license: "CC0-1.0"` (FR-006) |

## Dot state (runtime, in memory)

```
hidden → (loading > 300 ms) → fallback (painted orb) → ready (generated) → blooming → settled
                                         ↘ failed → fallback stays
reduced motion: any state → settled (still)
app backgrounded / low power: animating → paused (still)
```

- On web in v0.1, `ready` is never reached; fallback is animated with simple opacity/scale (research R2).
- Loader dots that are `ready` loop `breathe`; welcome dot goes `blooming → settled` once and then rests completely still (spec, founder review).

## ProofResult

Committed by hand to `specs/007-watercolor-dot/proof/results.md` from the lab's "copy results" JSON.

| Field | Type |
|---|---|
| `approach` | `B` \| `E` |
| `device` | e.g. "iPhone 12, iOS x" / "MacBook Air M1, Chrome x" |
| `scenario` | `one-large` \| `thirty-small` |
| `frameMsP99`, `frameMsMax` | number |
| `webDownloadBytes` | number (CanvasKit + shader + atlas) |
| `fitsWebBudget` | boolean (≤ 1 MB, FR-011) |
| `verdict` | `B` \| `E` \| `neither`, with date (founder) |
| `peopleCheck` | 3–5 anonymous responses (SC-008) |
