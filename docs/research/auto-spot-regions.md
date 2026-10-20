# Can the trace tool propose spot regions on its own?

Research for [#31](https://github.com/weareit-app/weareit/issues/31), part of the map [Pain art pipeline (#28)](https://github.com/weareit-app/weareit/issues/28). Written 2026-10-19 against commit `b177f92`.

## Answer

Yes for finding regions; partly for labeling them.

- **Finding regions is already automatic in practice.** The tool's own two segmentations (closed white areas inside the figure, and thick ink fills) contain every one of the 77 hole and solid picks across the 20 configured icons (18 groups and the 2 stage drawings). 71 of the 77 picked points are exactly the deepest pixel of their region, so the (x, y) values in `ICONS` were already being produced by a script, not by hand. The founder's real input is the **label and ink** for each region, and the **splits** where one region covers two things.
- **Labeling needs judgment, and a vision model can do the first pass.** Shape rules (size, position, thickness) can't tell skin from a shirt or a door from a bush. An agent that looks at the drawing next to a numbered region map ("Set-of-Mark" prompting) can name what each region is and pick an ink by region ID. In Claude Code the agent's own vision does this, so it costs nothing extra.
- **Almost half the icons need more than whole-region picks.** 9 of the 20 icon configs use a box, a thickness filter or custom code to split a region that runs across two objects. Automatic proposals should flag these instead of guessing; the cheaper fix is upstream, by preferring generated candidates whose shapes are separated by white.
- **Config format:** move each pain's spot choices into a data file keyed by region, with the proposal, the reason and the approval status side by side. The trace tool reads the same `holes`/`solids` mapping it reads today.

## How the tool picks regions today

From `tools/icon-trace/trace_icons.py`:

- `ink_of` thresholds the drawing at 128 gray. `paper_of` fills everything the ink encloses (plus nearly enclosed areas over 20,000 px after a 12 px closing) to make the figure's silhouette.
- **Holes** are connected components of `silhouette & ~ink`. A hole picked in `holes` gets a spot under the ink; an unpicked hole stays paper.
- **Solids** are connected components of the ink after a binary opening with a 16 px disk, so only ink thicker than about 32 px counts. A picked solid gets a spot over the ink; unpicked solids stay ink.
- `bare` removes a hole's paper so the card shows through (highlight streaks, open air under an awning).
- Escape hatches for regions that don't match one object: a box or list of boxes on a pick, `(tone, box, radius)` to keep only thick parts, `ink_boxes`, `ink_pieces`, `ink_above`, `bare_parts`, and the one-off `right_bush` function.

Connected components here use SciPy's default cross-shaped structure, so only edge neighbors connect, not diagonals ([`scipy.ndimage.label`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.ndimage.label.html)).

## Experiment: candidate regions against the founder's picks

Script (scratch, not committed): for each icon in `ICONS`, rerun the tool's cleanup (`drop_rays`, `drop_small`, `despeckle`), build its hole and solid label maps, keep every region of at least 1,000 px, and check where each founder pick falls.

| | Picks | Picks inside a candidate | Candidates (all icons) |
| --- | --- | --- | --- |
| Holes | 39 | 39 | 111 |
| Solids | 38 | 38 | 156 |
| Bare points | 20 | 20 (all are holes) | — |

- That is about 13 candidates per icon (from 2 in Information to 35 in Government), of which about 4 get a spot. So an agent has to choose a few regions out of about a dozen; the rest keep their default.
- At a 1,500 px floor, three small skin regions are lost (Safety's hands at 1,101 and 1,168 px, a Community window at 1,458 px). The floor must be low and scale with the drawing size; the stage art was upscaled 2.5x "so the tool's sizes apply", so every size constant here assumes drawings of about 1,200 px.
- Picks are not simply the largest regions. Their size rank runs from 1 to 11 (Economy's goods are 8th, 10th and 11th largest solids), so "color the biggest N" won't work.
- **Pick points are computable.** For 71 of 77 picks, the point is exactly the region's deepest interior pixel: the maximum of the Euclidean distance transform, which gives each pixel's distance to the nearest background pixel ([`distance_transform_edt`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.ndimage.distance_transform_edt.html)). The other 6 sit elsewhere inside their region. So the tool can name each region by a stable point with no human input.

### Escape hatches across the 20 configs

| Mechanism | Icons using it |
| --- | --- |
| Box on a hole or solid pick (9 picks), including one thickness filter | stage-steady, fairness, community, people |
| `ink_boxes` (paint ink inside boxes) | making-change, fairness, government |
| `ink_pieces` (a whole connected ink piece) | making-change, environment |
| `ink_above` (ink above a line) | safety |
| `bare_parts` | body |
| custom code (`right_bush`) | purpose |
| `light_line_box` (dark-mode line color, not a spot) | 7 icons |

11 of 20 icons are fully described by whole-region picks plus cleanup (Environment's `ink_pieces` also picks whole pieces). The other 9 needed a split, because one connected region spans two objects. Examples seen in the region maps:

- **People:** the long-haired girl's hair and the boy's shirt are one solid; another girl's hair and shirt are one solid; one hole covers a face, an arm and the dog.
- **Safety:** the umbrella canopy is three solids (the white ribs split it), and coloring all three would miss the thin rim and tips, so the config takes all ink above y = 645 instead.
- **Fairness:** each scale pan is joined to the hand holding it.

A connected-components pass can't fix these: the pixels really are connected. Splitting them needs a box, a cut line, or a shape the drawing doesn't have.

### Unspoken rules visible in the configs

These come from comments in `ICONS` and help a labeling prompt:

- Skin goes on holes inside faces, hands and arms; each person gets one tone across all their regions (Safety's father is skin-4 on face, hand and arm).
- Clothing and hair usually stay ink. A shirt gets a spot only when it is the point (the steady woman's dusk shirt; the three shirts in People).
- One or two objects carry the meaning and get the spot (the heart, the umbrella, the seedling).
- Highlight streaks in hair, glass or roofs are often `bare`, but not always: the highlights in Home's bushes stay paper. That choice changes only dark mode, so it is a judgment call to show the founder, not a rule.
- On skin-4 and skin-5, eyes and mouths switch to the light line automatically; the agent doesn't pick that.

## Labeling options

### Shape rules alone

Size, position, thickness (the distance-transform maximum), elongation and whether a hole has small ink pieces inside (eyes) can sort regions into "probably a face", "probably a highlight streak" and "large object". That is useful as hints in the proposal, but it can't separate a face from a window, or a shirt from a bush, and it can't decide which object carries the meaning. Not enough on its own.

### A vision model on a numbered region map

The technique is Set-of-Mark prompting: segment the image first, overlay each region with a number, and ask the model about the numbers. Yang et al. found GPT-4V with such marks beat the best fine-tuned model on a referring-expression benchmark (RefCOCOg) zero-shot ([arXiv:2310.11441](https://arxiv.org/abs/2310.11441)). The paper segments with SAM or SEEM; here the trace tool's own components are the segmentation, and they are exact on a clean two-tone drawing, so a general segmenter such as SAM ([arXiv:2304.02643](https://arxiv.org/abs/2304.02643)) adds nothing for finding regions. It might help to propose splits, but that wasn't tested.

Why IDs and not coordinates: Anthropic's vision docs say Claude's coordinate and localization outputs are approximate and should be verified ([Vision: limitations](https://platform.claude.com/docs/en/build-with-claude/vision)). The model should answer "H3 = chimney, poppy", and the tool supplies the exact point.

Image size: a 1,000 px map costs about 1,300 visual tokens, and images over 2,576 px on the long edge are downscaled on current models (same page). One drawing plus one map per pain is cheap; for 125 pains that is about 325,000 input tokens, roughly $1.30 at Opus 5.5's listed $4 per million, and no extra cost inside a Claude Code session.

Informal check (biased, because the reviewer had already read the founder's config): from side-by-side drawing and map images of Home, Safety, People and Work, the obvious labels were easy to read off: door, bushes, chimney, smoke, faces and hands, umbrella panels, flask and liquid, pencil parts. The hard parts were exactly the merged regions above (People's hair-and-shirt solids, Safety's canopy). A fair test needs a blind run on new drawings, compared with the founder's choices. That belongs in the prototype ticket.

What the model gets in its prompt:
- the drawing and the numbered map, side by side, with each region's area and thickness;
- the pain's approved concept (what the picture is about);
- the ink list from `docs/brand/colors.md` and the rules above;
- the running count of skin tones across approved art, so it can balance skin-1 to skin-5 across the set (a map requirement).

What it returns, per region: what it is, which person it belongs to (for skin), the proposed ink or "keep default", and a flag `needs-split` with a short reason when a region spans two things.

### Upstream: draw for the tracer

Every split in the existing set comes from a drawing where two objects touch in solid black. The pain art is generated, so the generation prompt can ask for shapes separated by a white gap, and the candidate judge can count regions flagged `needs-split` and prefer candidates with none. That moves work from the founder to the generator, where it is cheaper.

## What the founder reviews

Per pain, one sheet (or one row of a batch sheet):

1. The drawing.
2. The numbered region map.
3. The traced result with the proposed spots, light and dark (the tool already writes an SVG per icon).
4. A table: region, what it is, proposed ink, reason, and a change field.
5. Any `needs-split` flags, each with the agent's proposed box drawn on the map.

The founder approves the row, changes an ink by region number, or rejects the candidate. The batch review surface itself is ticket [#36](https://github.com/weareit-app/weareit/issues/36).

## What this means for the `ICONS` format

Today `ICONS` is a Python dict in the script, keyed by point, with comments for reasons. For 125+ pains written by agents and approved by the founder, a data file per pain works better:

```yaml
# tools/icon-trace/pains/<pain-id>.yaml (illustrative)
file: <pain-id>.png
figure: true
despeckle: 200
status: proposed            # proposed | approved
regions:
  H1: { at: [480, 717], is: "father's face", ink: skin-4 }
  H3: { at: [470, 926], is: "father's hand", ink: skin-4 }
  S2: { at: [625, 408], is: "umbrella canopy, middle panel", ink: tide }
  S6: { at: [503, 589], is: "father's hair", ink: null }   # keeps the default
  H10: { at: [421, 625], is: "roof highlight", bare: true }
splits:
  - region: S3
    reason: "hair and shirt are one shape"
    box: [600, 800, 860, 2000]
    ink: tide
```

- `at` is the deepest pixel, so the entry still works if region numbers change after a redraw; the tool fails loudly, as it does now, when a point is no longer inside a region.
- `is` and the reason replace today's comments and are what the founder reads.
- The tool converts `regions` and `splits` to the same `holes`, `solids` and `bare` mappings it uses now, so the tracing code doesn't change. The 21 group icons can stay in the script; the map puts redoing them out of scope.
- Every region over the floor is listed, including ones that keep the default, so the founder can see what was considered and turn any of them on.

## Open questions

- How well does a blind Set-of-Mark pass match the founder on new drawings? Needs a prototype with 5–10 generated pains.
- Can the agent propose splits (boxes or cut lines) reliably, or should a split always mean "regenerate"?
- What is the size floor for drawings at other resolutions? Normalizing every input to the same size, as the stage art was, avoids the question.

## Sources

- `tools/icon-trace/trace_icons.py` and `tools/icon-trace/README.md` at `b177f92`.
- `apps/app/assets/brand/drawings/*` and the traced output in `apps/app/src/content/group-icon-art.ts`, `apps/app/assets/brand/group-*.svg`.
- `docs/brand/colors.md` (ink list).
- SciPy: [`ndimage.label`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.ndimage.label.html), [`ndimage.distance_transform_edt`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.ndimage.distance_transform_edt.html).
- Yang et al., "Set-of-Mark Prompting Unleashes Extraordinary Visual Grounding in GPT-4V", [arXiv:2310.11441](https://arxiv.org/abs/2310.11441).
- Kirillov et al., "Segment Anything", [arXiv:2304.02643](https://arxiv.org/abs/2304.02643).
- Anthropic, [Vision](https://platform.claude.com/docs/en/build-with-claude/vision) (image sizes, token cost, limitations).
