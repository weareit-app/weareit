# Concept: Watercolor visual language, generated in code

- **Slug**: watercolor
- **Created**: 2026-10-17 (revised the same day after founder answers)
- **Recommended option**: a fidelity proof comparing B and E; the winner carries the v0.1 loader and palette work. Lean: E.

## What the founder asked for (2026-10-17)

It must look like watercolor; "same family" as the painted orb. For v0.1: the dot as a loader in content loading states, on the welcome screen, and between onboarding steps, and the dot ready to take any palette (no picker for people yet). Prove the approach before choosing it.

## Why "looks like watercolor" is the hard part

The marks that make watercolor read as watercolor come from water moving and drying: the darker rim where pigment is carried to the edge, blooms where wet meets damp, pigment settling into the paper's grain, and colors mixing like paint (not like light). A shader that only imitates these with noise often looks smooth, regular and "digital". A physical simulation produces them naturally but is too heavy to run for every dot in a UI. The options below differ in where that physics happens.

## Options

### Option A — Animate the existing paintings

- **Sketch**: Keep the painted orb and animate it: breathe, drift, crossfade. Palettes are tints over the painting.
- **Appetite**: small (days)
- **Trade-offs**: Real paint, no new dependency, no web download. But tinting looks like a filter, so it does not truly meet "ready for any palette", and every new shape needs a new painting.
- **Role now**: the fallback — shown while the renderer loads on web, and for v0.1 if neither B nor E passes the proof.

### Option B — Look-alike shader

- **Sketch**: A single shader draws the dot live from noise: warped round edge, darker rim, blooms, paper grain, pigment mixing. Every frame is computed, so the dot can be any size, color or shape and move freely.
- **Appetite**: medium (weeks)
- **Trade-offs**: Most flexible and the simplest to run; lots of dots at once. Risk: it may not look like real watercolor — the founder's core requirement.
- **Rabbit holes**: endless tuning of noise to fake effects that physics gives for free.

### Option E — Painted by physics ahead of time, colored live

- **Sketch**: It's own watercolor simulation (written from Curtis et al. 1997, not copied) paints a set of dots ahead of time — different seeds, wetness, and frames of the drying and blooming sequence. What is kept is *where the pigment ended up* (grayscale amount maps per pigment), not colors. In the app, a light shader turns those maps into color with real pigment optics (Kubelka-Munk). Changing the palette just changes which pigments are used: the same dot in teal-and-yellow or rose-and-violet still pools and darkens like real paint. The loader plays the painted drying or blooming sequence slowly, like breathing.
- **Appetite**: medium (weeks); the simulation is a tool, not shipped in the app.
- **Trade-offs**: Real watercolor behavior, cheap on the device, palette-ready. Less freedom of shape: new shapes (Earth, sky) must be painted by the tool first, and motions are limited to what was painted plus simple moves, fades and blends. Painted maps add download weight (to measure).
- **Rabbit holes**: tuning the simulation; frame count and texture size versus download; making looped sequences seamless.

### Option C — Scene kit (later)

- **Sketch**: Registered scene parts (sky, hills, water, home, tree, people) painted with the winning approach and composed from data, so a person's choices assemble a picture without AI image generation.
- **Appetite**: large (months). Not v0.1.

### Option D — Live simulation (later, special moments)

- **Sketch**: The simulation from E running live on the device for rare full-screen moments.
- **Appetite**: large. Not v0.1; E's tool makes it cheaper to try later.

## Recommendation

**Run a fidelity proof first, then build the winner for v0.1.** The proof paints the same dot three ways — the painted orb, Option B, and Option E — side by side, each in It's palette and one other palette, still and animated as a loader. The founder picks the one that is "same family". Performance is measured at the same time: one large dot, and ~30 small ones, on web and iPhone.

The lean is **E**, because it gets the watercolor look from physics, which is what the founder said matters most, while staying light enough for loaders. **B** stays in the proof because if it is good enough it is simpler and more flexible. **A** is the fallback for anything v0.1 needs if neither passes.

## Out of Scope (for v0.1)

- Scene kit (C) and live simulation (D).
- A color picker for people (palette-ready only).
- Shapes beyond the dot (Earth, sky); the gathering animation.
- Replacing the charcoal line figures.
- Showing a person's choices to anyone else.

## Assumptions to Validate (in the proof)

- E looks clearly more like watercolor than B; or B is good enough.
- Kubelka-Munk coloring from pigment maps gives paint-like mixes in new palettes.
- A painted loader sequence is small enough to download (target to set) and loops without a visible seam.
- ~30 small dots hold 60 fps on target devices, web included.
- The painted orb as fallback, with the renderer loading after the first screen, is acceptable on mobile web.
- Generated images can be treated as CC0 illustrations, with seed and settings as provenance.

## Ideas Beyond the Brief

The founder asked not to stop at the named uses. Concept-level ideas for later, none in scope for B:

- **Your color.** The pains and dreams someone picks become pigments that mix into their own dot — a quiet portrait of what matters to them, kept on their device.
- **One shared wash.** The societal page as a single large painting where every person who joined adds a faint glaze; it deepens as more join (aggregate only, never who chose what).
- **Progress as painting.** A goal starts as a pencil-light outline and fills with color as steps are taken; done steps "dry" and stay.
- **Remembrance.** Past moments shown as faded, backlit glazes — like holding an old painting to the window.
- **Weather of the moment.** Gentle states (calm, stormy, clearing) shown as sky washes rather than numbers.
- **Night paper.** Dark mode as paint on deep blue paper, not inverted colors.
- **Keepsakes.** A card painted from a person's seed that they can save or share by choice.
- **Line and wash.** The charcoal figures drawn over generated washes — the classic picture-book pairing — so people and places share one page.
- **Sound and touch.** A soft haptic as dots merge; a drop sound on bloom (respecting system settings).
- **Still by default for some.** With reduced motion, every motion has a still "dried" end state that says the same thing.
