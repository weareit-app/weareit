# Group icon tracing

`trace_icons.py` turns the founder's drawings in `apps/app/assets/brand/drawings/` into the layered vector icons the personal page shows (`apps/app/src/content/group-icon-art.ts`) and an SVG of each (`apps/app/assets/brand/group-<name>.svg`).

```bash
uv run --with potracer --with pillow --with numpy --with scipy python -I tools/icon-trace/trace_icons.py
```

Spot colors are set per icon in `ICONS`: `holes` are closed white areas inside the ink, `solids` are thick ink fills, each picked by an (x, y) pixel inside it, in the drawing's coordinates. Each icon carries its own paper, cream in dark mode, under charcoal riso ink. Colors are the palette's spot inks (`docs/brand/colors.md`).
