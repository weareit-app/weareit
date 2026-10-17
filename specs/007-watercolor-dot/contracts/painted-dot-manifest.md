# Asset Contract: painted dot manifest (007, Option E)

Produced by `tools/watercolor-sim`, consumed by `<WatercolorDot approach="E">`. Validated with the Zod schema in `packages/watercolor` at load; an invalid manifest means the painted orb fallback is shown (FR-010) and the unit tests fail.

## Files

```
apps/app/assets/watercolor/<id>/
├── manifest.json
└── atlas.png      # frames laid out left→right, top→bottom; RGBA channel n = pigment slot n density (0–255 → 0–1)
```

## `manifest.json`

```json
{
  "schema": 1,
  "id": "orb-01",
  "size": 256,
  "frames": 20,
  "columns": 5,
  "pigmentSlots": 3,
  "fps": 12,
  "breathe": { "from": 16, "to": 19, "periodSeconds": 6 },
  "provenance": {
    "seed": 1729,
    "simVersion": "0.1.0",
    "settings": { "steps": 900, "evaporation": 0.0004, "edgeFlow": 0.6, "...": "every sim parameter" },
    "pigmentsUsed": ["teal-blue", "cyan-green", "warm-yellow"],
    "createdAt": "2026-10-20",
    "license": "CC0-1.0",
    "method": "Curtis et al. 1997 shallow-water watercolor model, implemented in tools/watercolor-sim"
  }
}
```

Rules:
- `frames ≥ 1`; the last frame is the still, dried state.
- `breathe.from..to` must loop with no visible seam (checked by eye in the lab; the sim paints the loop as a closed cycle).
- `pigmentSlots` 2–4 and ≤ the palette's pigment count.
- `atlas.png` dimensions = `size × columns` by `size × ceil(frames / columns)`.
- Re-running the sim with the same `seed`, `simVersion` and `settings` reproduces the atlas (provenance, FR-006).
