# watercolor-sim

Paints watercolor dots ahead of time for It's watercolor dot (Option E in `specs/007-watercolor-dot`). Output ships as assets; this tool does not ship in the app.

## Method

A simplified version of the model in Curtis, Anderson, Seims, Fleischer & Salesin, _Computer-Generated Watercolor_ (SIGGRAPH 1997):

- **Paper**: seeded noise for the tooth (height), how readily it drinks, and how far a wash may reach.
- **Water**: a shallow layer that flows between neighboring cells from a higher surface (water + paper relief) to a lower one. A drop spreads onto dry paper until its edge pins.
- **Pigment**: up to three pigments, suspended in the water and carried by it, settling onto the paper as the film thins, more in the paper's valleys (granulation).
- **Edge darkening**: once the edge is pinned it evaporates fastest, so water flows outward to replace it and carries pigment into a darker rim.
- **Wet-in-wet**: an optional splash of clean water into the still-wet dot pushes pigment outward into a ragged bloom line.

Transport conserves water and pigment, and everything runs on the CPU from a seeded generator, so the same seed and settings always paint the same atlas.

Color is not simulated here. The atlas stores how much of each pigment ended up where; the app colors it with Kubelka-Munk optics (`packages/watercolor`), so one painted dot works with any palette.

## Clean-room rule

This code is written from the paper and the Kubelka-Munk equations only. Do not copy or adapt code or data from sudoaquarelle.com (no license) or Mixbox (CC BY-NC 4.0).

## Use

```bash
pnpm --filter @it/watercolor-sim paint -- --id orb-01 --seed 1729 --date 2026-10-17
node --experimental-strip-types tools/watercolor-sim/preview.ts --seed 1729 --palette it-orb --out /tmp/orb.png
```

`paint` writes `apps/app/assets/watercolor/<id>/atlas.png` and `manifest.json` (contract: `specs/007-watercolor-dot/contracts/painted-dot-manifest.md`). `preview` writes a colored contact sheet of the frames for judging by eye.

Painted dots are CC0 illustrations. Their manifest records the seed, simulator version and every setting, so they can be repainted exactly.
