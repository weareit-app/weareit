"""Trace the founder's group drawings into layered vector icons.

Reads apps/app/assets/brand/drawings/<name>.(png|webp); writes
apps/app/src/content/group-icon-art.ts and apps/app/assets/brand/group-<name>.svg.

    uv run --with potracer --with pillow --with numpy --with scipy python -I tools/icon-trace/trace_icons.py

Each icon is layered back to front: its own paper (figures only), spots under
the ink, the ink, spots over the ink. Spots pick closed white areas ("holes")
or solid ink fills ("solids") by an (x, y) pixel inside them, in the
drawing's own coordinates. "bare" points, and boxes within one area
("bare_parts"), take paper away where the drawing should show the card.
"""

import json
from pathlib import Path

import numpy as np
import potrace
from PIL import Image
from scipy.ndimage import (
    binary_closing,
    binary_dilation,
    binary_fill_holes,
    binary_opening,
    center_of_mass,
    label,
)

ROOT = Path(__file__).resolve().parents[2]
DRAWINGS = ROOT / "apps/app/assets/brand/drawings"
OUT_TS = ROOT / "apps/app/src/content/group-icon-art.ts"
OUT_SVG = ROOT / "apps/app/assets/brand"

# Founder's choices, 2026-10-18. Every icon carries its own paper (cream in
# dark mode) and riso ink; `figure=False` would draw just the UI ink.
ICONS = {
    # Pain and future stage art (the anxious and the steady woman), traced from
    # 2.5x Lanczos upscales of assets/brand/stage-*.png so the tool's sizes
    # apply. The same person in both, skin-3. The pain is ink only; its future
    # adds one spot, a dusk shirt (founder, 2026-10-18). The worry scribble
    # and the rays go; the streaks in her hair and shirt show the card.
    "stage-anxiety": dict(
        file="stage-anxiety.png",
        figure=True,
        despeckle=200,
        drop_small=(60000, 320),
        holes={(472, 549): "skin-3", (601, 1069): "skin-3"},
        bare=[(666, 340), (503, 348), (707, 928), (846, 1034)],
    ),
    "stage-steady-enough-to-plan": dict(
        file="stage-steady-enough-to-plan.png",
        figure=True,
        despeckle=200,
        holes={(446, 546): "skin-3", (519, 1093): "skin-3"},
        bare=[(576, 341), (393, 342), (623, 950), (757, 1037)],
        solids={(700, 1150): ("dusk", [(502, 720, 1050, 1300), (232, 760, 502, 1300)])},
    ),
    # Societal groups, as their drawings arrive.
    # Hands fitting puzzle pieces together: the rays gone, the print speckle
    # cleaned up, each piece its own color. The top two pieces touch the
    # fingers, so boxes pick them out. (The earlier planting drawing is kept as
    # drawings/making-change-planting.webp.)
    "making-change": dict(
        file="making-change.webp",
        figure=True,
        drop_small=(1500, 2000),
        despeckle=200,
        ink_boxes={
            "poppy": [(456, 522, 637, 688)],
            "tide": [(637, 490, 772, 686)],
        },
        ink_pieces={(750, 790): "meadow", (485, 800): "sun"},
        # The hands are open line drawings: cream lines in dark mode.
        light_line_box=(0, 0, 2000, 2000),
    ),
    # A teddy bear and blocks: the bear clay inside its outline, each block's
    # front face its own color; the print speckle cleaned up.
    "kids": dict(
        file="kids.png",
        figure=True,
        despeckle=200,
        solids={
            (581, 467): "clay",
            (422, 688): "clay",
            (449, 804): "clay",
            (751, 637): "sun",
            (743, 710): "poppy",
            (701, 804): "tide",
            (806, 823): "meadow",
        },
    ),
    # A family under an umbrella: the rain gone, the print speckle cleaned up,
    # the umbrella blue, a safe color.
    "safety": dict(
        file="safety.webp",
        figure=True,
        drop_small=(700, 665),
        despeckle=200,
        # A mixed family: the father, the mother and their child.
        holes={
            (480, 717): "skin-4",
            (470, 926): "skin-4",
            (404, 876): "skin-4",
            (764, 777): "skin-1",
            (833, 923): "skin-1",
            (651, 918): "skin-3",
        },
        # The canopy blue to its lowest tip; the shaft stays ink.
        ink_above={(640, 330): ("tide", 645, (580, 492, 640, 700))},
    ),
    # A seedling held in two hands: the seedling green, the hands cream in
    # dark mode.
    "environment": dict(
        file="environment.webp",
        figure=True,
        ink_pieces={(482, 465): "sprout"},
        light_line_box=(0, 0, 2000, 2000),
    ),
    # Two speech bubbles, one each color.
    "information": dict(
        file="information.webp",
        figure=True,
        solids={(530, 515): "tide", (830, 663): "poppy"},
    ),
    # Two people holding a scale: the balance gold, their shirts blue and
    # orange. Each pan shares its ink with the person holding it, so boxes
    # split them.
    "fairness": dict(
        file="fairness.webp",
        figure=True,
        solids={
            (243, 494): ("tide", (160, 560, 330, 725)),
            (1032, 530): ("ember", (945, 585, 1120, 765)),
        },
        # The whole balance gold: beam, chains, column, base and pans.
        ink_boxes={
            "sun": [
                (410, 255, 845, 425),
                (340, 400, 545, 578),
                (705, 400, 912, 578),
                (590, 420, 668, 880),
                (430, 870, 825, 1000),
                (328, 572, 565, 662),
                (688, 572, 928, 662),
            ]
        },
        light_line_box=(0, 0, 2000, 2000),
    ),
    # Neighbors under a tree: the canopy (above the trunk) and bushes green,
    # lit windows; the rest cream in dark mode.
    "community": dict(
        file="community.webp",
        figure=True,
        holes={(291, 811): "sun", (447, 764): "sun"},
        solids={
            # The canopy without the trunk and branches: only parts thicker
            # than the trunk.
            (637, 401): ("sprout", None, 40),
            (333, 655): "meadow",
            (818, 776): "meadow",
            (141, 902): "meadow",
            (1122, 904): "meadow",
        },
        light_line_box=(0, 0, 2000, 2000),
    ),
    # Hands holding a heart: the heart red; the hands cream in dark mode.
    "health": dict(
        file="health.webp",
        figure=True,
        solids={(626, 621): "poppy"},
        light_line_box=(0, 0, 2000, 2000),
    ),
    # Market stalls: awnings red and blue, greens and fruit in season.
    "economy": dict(
        file="economy.webp",
        figure=True,
        solids={
            (331, 507): "poppy",
            (665, 470): "tide",
            (562, 771): "meadow",
            (312, 811): "ember",
            (488, 819): "sun",
        },
        # The open air under each awning is background, not paper.
        bare=[(756, 640), (485, 647)],
        # Vendors, tables and goods turn cream in dark mode, like the flask.
        light_line_box=(0, 0, 2000, 2000),
    ),
    "government": dict(
        file="government.webp",
        figure=True,
        # The very tip gold (spire and cap), the bushes green.
        solids={(192, 979): "meadow", (1062, 981): "meadow"},
        ink_boxes={"sun": [(580, 220, 675, 338)]},
    ),
    "mind": dict(
        file="mind.png", figure=True, holes={(574, 483): "bloom", (508, 717): "skin-2"}
    ),
    # No paper in the hair's light streaks, or in the background between the
    # hair and the arm (it joins the face's area through the neck).
    "body": dict(
        file="body.webp",
        figure=True,
        solids={(766, 861): "tide"},
        holes={(765, 548): "skin-5", (568, 776): "skin-5"},
        bare=[(685, 411), (501, 577), (593, 631)],
        # The strip left of the neck, inside the face's area only (the arm's
        # paper is its own area and stays).
        bare_parts=[((765, 548), (0, 640, 665, 800))],
    ),
    # No paper in the glass or the caps' highlights.
    "time": dict(
        file="time.webp",
        figure=True,
        solids={(627, 504): "sun", (629, 832): "sun"},
        bare=[(484, 297), (547, 397), (414, 940)],
    ),
    # Front bill light, back bill dark; coin faces and edges gold, so no paper
    # shows inside the coins.
    "money": dict(
        file="money.webp",
        figure=True,
        holes={
            (816, 700): "mint",
            (578, 413): "sprout",
            (367, 655): "sun",
            (564, 789): "sun",
            (429, 714): "sun",
            (467, 791): "sun",
            (263, 758): "sun",
            (399, 820): "sun",
            (294, 868): "sun",
        },
    ),
    # Three shirts. The boy's shares its ink with the long-haired girl's hair;
    # the red stops at the narrow join (x 735).
    "people": dict(
        file="people.png",
        figure=True,
        solids={
            (611, 664): ("poppy", (0, 0, 735, 2000)),
            # Their shirts share ink with their hair too: the curly-haired
            # person's starts at the shoulder, the girl's wraps under her hair.
            (349, 840): ("sun", (0, 780, 600, 2000)),
            (773, 969): ("tide", [(600, 800, 860, 2000), (600, 905, 1080, 2000)]),
        },
        drop_rays=True,
        # Skin: the boy, the curly-haired person (face, hand and arm) and the
        # girl (face, arm and hand). Her face, the dog and the other arm share
        # one area, so boxes split it; the dog keeps the paper.
        holes={
            (627, 481): "skin-4",
            (446, 747): "skin-5",
            (258, 781): "skin-5",
            (239, 1020): ("skin-5", (60, 860, 330, 1080)),
            (806, 761): ("skin-2", (650, 560, 940, 860)),
            (892, 1005): "skin-2",
            (973, 864): "skin-2",
        },
        # The figures run off the bottom of the drawing; close that edge so
        # their arms and the dog's body get paper.
        close_bottom=True,
    ),
    # Chimney red; no paper in the roof's streak.
    "home": dict(
        file="home.png",
        figure=True,
        holes={(814, 495): "poppy"},
        solids={(556, 759): "ember", (338, 986): "meadow", (920, 850): "meadow"},
        bare=[(421, 625)],
    ),
    "purpose": dict(
        file="purpose.png",
        figure=True,
        solids={(712, 416): "sun", (262, 841): "meadow"},
        right_bush="meadow",
    ),
    # Pencil yellow on both sides, wrench spots stone; no paper between the wrench and the flask,
    # or inside the flask around its liquid.
    "work": dict(
        file="work.webp",
        figure=True,
        holes={
            (293, 778): "sun",
            (499, 486): "sun",
            # The wrench's light spots.
            (620, 281): "stone",
            (884, 359): "stone",
            (691, 503): "stone",
            (526, 893): "stone",
        },
        solids={(826, 913): "lagoon", (504, 353): "poppy"},
        bare=[(760, 648), (894, 665)],
        # The flask's lines turn cream in dark mode, like Body's and Mind's skin.
        light_line_box=(620, 470, 1160, 1065),
    ),
}
# Skin tones, the same in light and dark (2026-10-18). On the two deepest,
# facial features take the light line so they read in dark mode.
SKIN = {
    "skin-1": "#F5D7C0",
    "skin-2": "#E4AE86",
    "skin-3": "#C68653",
    "skin-4": "#9A6038",
    "skin-5": "#704329",
}
DEEP_SKIN = {"skin-4", "skin-5"}
PREVIEW = {
    **SKIN,
    "riso-paper": "#FFFFFF",
    "riso-ink": "#1F2021",
    "riso-line": "#1F2021",
    "ink": "#1F2021",
    "tide": "#087E9F",
    "sprout": "#00A95C",
    "mint": "#82D8A7",
    "meadow": "#67B346",
    "sun": "#FFB511",
    "lagoon": "#5EC8E5",
    "poppy": "#F15060",
    "ember": "#FF6C2F",
    "bloom": "#FF48B0",
    "stone": "#88898A",
    "clay": "#925F52",
    "dusk": "#765BA7",
}


def ink_of(path):
    """Dark pixels of a drawing, with any transparency laid on white first."""
    image = Image.open(path).convert("RGBA")
    white = Image.new("RGBA", image.size, (255, 255, 255, 255))
    return np.array(Image.alpha_composite(white, image).convert("L")) < 128


def disk(r):
    yy, xx = np.mgrid[-r : r + 1, -r : r + 1]
    return xx**2 + yy**2 <= r * r


def without_rays(ink):
    # People: the three small rays at the top right go.
    lab, n = label(ink)
    for i in range(1, n + 1):
        m = lab == i
        cy, cx = center_of_mass(m)
        if m.sum() < 4000 and cx > 850 and cy < 560:
            ink = ink & ~m
    return ink


def right_bush(ink, sil, solids):
    # Purpose: the right bush shares its ink with the mountain; split along the
    # white arc on the bush's top.
    m = solids == 3
    h, w = ink.shape
    gap = sil & ~ink
    ys, xs = np.nonzero(gap[760:900, 740:1040])
    top = {}
    for x, y in zip(xs + 740, ys + 760):
        top[x] = min(top.get(x, h), y)
    known = np.array(sorted(top))
    arc = np.full(w, h)
    arc[known[0] : known[-1] + 1] = np.interp(
        np.arange(known[0], known[-1] + 1), known, [top[k] for k in known]
    )
    arc[known[-1] + 1 :] = arc[known[-1]]
    arc[:790] = np.maximum(arc[:790], 885)
    yy, xx = np.mgrid[0:h, 0:w]
    return m & (xx >= known[0]) & (yy > arc[xx])


def paper_of(ink, close_bottom=False):
    """The area a figure's paper fills: everything the ink encloses.

    Closing small gaps lets a nearly closed outline (Body's face) count as
    enclosed, but it also fills notches along the edge (Mind's hair); only
    large gap-closed areas are kept. The paper then stops a little inside the
    outer ink edge, so none of it peeks out around the drawing.
    """
    if close_bottom:
        # A line along the bottom of the drawing, under every column that has
        # ink near the bottom.
        ys, xs = np.nonzero(ink)
        bottom = ys.max()
        near = xs[ys >= bottom - 30]
        ink = ink.copy()
        ink[bottom - 2 : bottom + 1, near.min() : near.max() + 1] = True
    enclosed = binary_fill_holes(ink)
    closed = binary_fill_holes(binary_closing(ink, structure=disk(12))) & ~enclosed
    lab, n = label(closed)
    keep = np.zeros_like(ink)
    for i in range(1, n + 1):
        m = lab == i
        if m.sum() >= 20000:
            keep |= m
    sil = enclosed | keep
    return sil & ~binary_dilation(~sil, structure=disk(3))


def trace_icon(spec):
    ink = ink_of(DRAWINGS / spec["file"])
    if spec.get("drop_rays"):
        ink = without_rays(ink)
    if spec.get("drop_small"):
        # Small separate pieces above a line (raindrops), not the eyes below.
        max_area, max_y = spec["drop_small"]
        pieces, n = label(ink)
        for i in range(1, n + 1):
            m = pieces == i
            if m.sum() < max_area and center_of_mass(m)[0] < max_y:
                ink &= ~m
    if spec.get("despeckle"):
        # Fill the print texture's small white flecks inside the ink.
        flecks, n = label(~ink)
        sizes = np.bincount(flecks.ravel())
        small = (sizes < spec["despeckle"]) & (np.arange(len(sizes)) > 0)
        ink = ink | small[flecks]
    sil = paper_of(ink, spec.get("close_bottom", False))
    gaps, _ = label(sil & ~ink)
    for x, y in spec.get("bare", []):
        if not gaps[y, x]:
            raise SystemExit(f"{spec['file']}: ({x}, {y}) is not inside a paper area")
        sil &= gaps != gaps[y, x]
    for (px, py), (x0, y0, x1, y1) in spec.get("bare_parts", []):
        part = np.zeros_like(sil)
        part[y0:y1, x0:x1] = True
        sil &= ~(part & (gaps == gaps[py, px]))
    holes, _ = label(sil & ~ink)
    solids, _ = label(binary_opening(ink, structure=disk(16)))
    ys, xs = np.nonzero(ink)
    x0, y0 = xs.min(), ys.min()
    w, h = xs.max() - x0 + 1, ys.max() - y0 + 1
    s = 44 / max(w, h)
    ox, oy = 2 + (44 - w * s) / 2 - x0 * s, 2 + (44 - h * s) / 2 - y0 * s

    def path(mask):
        pt = lambda p: f"{p.x * s + ox:.2f} {p.y * s + oy:.2f}"
        d = []
        for c in potrace.Bitmap(~mask).trace(
            turdsize=20, alphamax=1.0, opticurve=True, opttolerance=0.2
        ):
            d.append("M" + pt(c.start_point))
            for g in c.segments:
                d.append(
                    "L" + pt(g.c) + "L" + pt(g.end_point)
                    if g.is_corner
                    else "C" + pt(g.c1) + " " + pt(g.c2) + " " + pt(g.end_point)
                )
            d.append("Z")
        return "".join(d)

    def grouped(lab, spec_map):
        # A spot is a tone, or (tone, box) to keep it inside a box (x0, y0, x1,
        # y1) or a list of boxes, or (tone, box, radius) to keep only its parts
        # thicker than that radius.
        by = {}
        for (x, y), value in spec_map.items():
            if not lab[y, x]:
                raise SystemExit(f"{spec['file']}: ({x}, {y}) is not inside an area")
            tone, box, thick = (
                (value + (None, None))[:3]
                if isinstance(value, tuple)
                else (value, None, None)
            )
            m = lab == lab[y, x]
            if thick:
                m = binary_opening(m, structure=disk(thick))
            if box:
                keep = np.zeros_like(m)
                for x0, y0, x1, y1 in box if isinstance(box, list) else [box]:
                    keep[y0:y1, x0:x1] = True
                m &= keep
            by[tone] = by.get(tone, np.zeros_like(m)) | m
        return list(by.items())

    figure = spec["figure"]
    layers = [{"fill": "riso-paper", "d": path(sil)}] if figure else []
    # Spots under the ink reach a little beneath it, so nothing shows at the seam.
    deep = np.zeros_like(ink)
    for tone, m in grouped(holes, spec.get("holes", {})):
        layers.append(
            {"fill": tone, "d": path(binary_dilation(m, structure=disk(4)) & sil)}
        )
        if tone in DEEP_SKIN:
            deep |= m
    over = grouped(solids, spec.get("solids", {}))
    # The piece of ink above a line that holds a pixel, for a shape joined to
    # the rest lower down (an umbrella's canopy above its shaft).
    for (x, y), (tone, max_y, *leave) in spec.get("ink_above", {}).items():
        above = ink.copy()
        above[max_y:, :] = False
        for x0, y0, x1, y1 in leave:
            above[y0:y1, x0:x1] = False
        pieces, _ = label(above)
        if not pieces[y, x]:
            raise SystemExit(f"{spec['file']}: ({x}, {y}) is not on the ink")
        over.append((tone, pieces == pieces[y, x]))
    # A whole connected piece of ink, picked by a pixel on it.
    if spec.get("ink_pieces"):
        pieces, _ = label(ink)
        by = {}
        for (x, y), tone in spec["ink_pieces"].items():
            if not pieces[y, x]:
                raise SystemExit(f"{spec['file']}: ({x}, {y}) is not on the ink")
            by[tone] = by.get(tone, np.zeros_like(ink)) | (pieces == pieces[y, x])
        over.extend(by.items())
    # Ink of any width inside a box, for thin parts that aren't solid fills.
    for tone, boxes in spec.get("ink_boxes", {}).items():
        box = np.zeros_like(ink)
        for x0, y0, x1, y1 in boxes:
            box[y0:y1, x0:x1] = True
        over.append((tone, ink & box))
    if spec.get("right_bush"):
        closed = binary_fill_holes(binary_closing(ink, structure=disk(12)))
        over.append((spec["right_bush"], right_bush(ink, closed, solids)))
    # Spot-filled ink areas print as spot on paper, not over black: the ink
    # leaves them out, and each spot reaches a little over the ink around it.
    covered = np.zeros_like(ink)
    for _, m in over:
        covered |= m
    printed = ink & ~covered
    ui = np.zeros_like(ink)
    if spec.get("light_line_box"):
        x0, y0, x1, y1 = spec["light_line_box"]
        pieces, n = label(ink)
        for i in range(1, n + 1):
            ys, xs = np.nonzero(pieces == i)
            if xs.min() >= x0 and xs.max() <= x1 and ys.min() >= y0 and ys.max() <= y1:
                ui |= pieces == i
    if deep.any():
        # Eyes and mouths drawn inside the deepest skin tones: small ink pieces
        # surrounded by that skin. They take the light line, so they stay
        # legible on deep skin in dark mode.
        pieces, n = label(ink)
        for i in range(1, n + 1):
            m = pieces == i
            if m.sum() > 4000:
                continue
            ring = binary_dilation(m, structure=disk(4)) & ~m
            if (ring & deep).sum() >= 0.85 * ring.sum():
                ui |= m
    layers.append(
        {
            "fill": "riso-ink" if figure else "ink",
            "evenOdd": True,
            "d": path(printed & ~ui),
        }
    )
    if ui.any():
        layers.append({"fill": "riso-line", "evenOdd": True, "d": path(printed & ui)})
    for tone, m in over:
        layers.append(
            {"fill": tone, "d": path(binary_dilation(m, structure=disk(3)) & ink)}
        )
    return layers


def main():
    art = {name: trace_icon(spec) for name, spec in ICONS.items()}
    lines = [
        "// Generated by tools/icon-trace/trace_icons.py from the founder's drawings",
        "// in assets/brand/drawings. Do not edit by hand; change the script and rerun.",
        'import type { IconPart } from "./icon-part";',
        "",
        "export const groupIconArt: Record<string, IconPart[]> = "
        + json.dumps(art, indent=2)
        + ";",
        "",
    ]
    OUT_TS.write_text("\n".join(lines))
    for name, layers in art.items():
        paths = "".join(
            f'<path d="{l["d"]}" fill="{PREVIEW[l["fill"]]}"'
            + (' fill-rule="evenodd"' if l.get("evenOdd") else "")
            + "/>"
            for l in layers
        )
        (OUT_SVG / f"group-{name}.svg").write_text(
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">{paths}</svg>\n'
        )
        print(name, [l["fill"] for l in layers])


if __name__ == "__main__":
    main()
