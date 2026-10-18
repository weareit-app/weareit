# Feature Specification: Watercolor dot — fidelity proof, v0.1 loader, palette-ready

**Feature Branch**: `007-watercolor-dot` (spec directory; written on branch `assess/watercolor`, no new branch created)

**Created**: 2026-10-17

**Status**: Reviewed by the founder 2026-10-17

**Input**: User description: "Watercolor dot (short name: watercolor-dot). Input: .specify/assessments/watercolor/decision.md handoff. Scope: (1) fidelity proof comparing painted orb (apps/app/assets/brand/watercolor-orb.jpg), Option B look-alike shader dot, Option E dot painted by physics ahead of time and colored live with Kubelka-Munk, side by side, still and as loader, in It's palette and one other palette, with frame-time measurements for 1 large dot and ~30 small dots on web and iPhone; (2) v0.1 loader in content loading states, welcome mark, between onboarding steps; (3) dot that takes any palette, no color picker for people. Use It spec template override; include reduced-motion and text-alternative checks. Turn decision's open questions into [NEEDS CLARIFICATION] markers. No app code."

Binding inputs: the go decision in `.specify/assessments/watercolor/decision.md` (with `concept.md`, `problem.md`, `research.md`), `AGENTS.md`, `docs/architecture/decisions.md` and `docs/architecture/licensing.md`. The fidelity reference is the painted orb (`apps/app/assets/brand/watercolor-orb.jpg`; crop in `.specify/assessments/watercolor/reference-dot.png`).

## What People See and Do *(mandatory, write this first)*

This spec has no item of its own in `docs/spec/features.md`; it adds the founder's 2026-10-17 v0.1 commitments (decision.md, "v0.1 commitments") to screens that are there: the welcome screen and §1–§2 onboarding pages, plus every place content loads.

Two audiences see this feature: the founder (and contributors) reviewing the fidelity proof, and every person using It.

- **Screen: Fidelity proof (founder only, not part of the shipped app)** - Three dots side by side, the same size: the painted orb, the look-alike dot (Option B) and the physics-painted dot (Option E). Each is shown still and playing as a loader, first in It's palette and then in one other palette. Under each dot: its name, how it was made, and its measured smoothness on a laptop browser and an iPhone, for one large dot and for a screen of about 30 small dots. A note says which pieces are generated and which are paint. - The founder can switch palettes, switch between still and moving, look at any dot full size, and record which one is "the same family" as the painted orb (or that none is).
- **Screen: Welcome** - The It mark is the watercolor dot instead of a fixed picture, gently alive: it slowly blooms and settles like paint drying, then rests completely still, like a dried painting. Until the generated dot is ready, the painted orb is shown in the same place and size, so nothing jumps. - The person reads the welcome and goes on as today; the dot never needs a tap and never delays the "start" action.
- **Screen: Any page while its content loads** - Where It today shows a plain loading state, a small watercolor dot appears on its own, with no words on screen (screen readers hear "Loading…"). Drops of different sizes, in It's colors, drift in from near its edge (never cut off by it), touch and run together into one dot. While loading continues, new drops keep drifting in slowly and bloom into it, bringing sunrise and dusk colors that marble into the wash; the dot keeps its size. When content arrives the loader simply disappears. If loading fails, the dot stops and the existing error message and retry appear. - The person waits or leaves; nothing changes about what they can do.
- **Screen: Moving between onboarding steps** (welcome → personal → societal → futures) - The page changes as it does today, and a small watercolor dot blooms once in a corner of the new page, then rests or fades. It is short and never holds the next page back. - The person keeps tapping on; going back works the same way.
- **With reduced motion on (any screen above)** - Every dot shows its still, "dried" end state: the same picture, no movement. Screen readers still hear "Loading…". Step changes happen without the corner bloom.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Founder chooses the watercolor approach from a side-by-side proof (Priority: P1)

The founder opens the proof and sees the painted orb, the look-alike dot and the physics-painted dot next to each other, still and moving, in It's palette and in a second palette. Next to each are its smoothness numbers on laptop browser and iPhone. The founder decides which (if any) is "the same family" as the painted orb, and that choice decides how the rest of this spec is built.

**Why this priority**: The founder's bar is that it must look like real watercolor. Nothing else in this spec should be built until an approach has passed that bar, and the proof is small compared with building the wrong approach (decision.md, "Go, proof first").

**Independent Test**: Run the proof on a laptop browser and an iPhone; all three dots appear in both palettes, still and moving, with smoothness numbers for 1 large dot and ~30 small dots; the founder can record a verdict.

**Acceptance Scenarios**:

1. **Given** the proof is open, **When** the founder looks at it, **Then** the painted orb, the look-alike dot and the physics-painted dot are shown side by side at the same size, each labeled with its name and how it was made.
2. **Given** the proof shows It's palette, **When** the founder switches to the second palette, **Then** both generated dots redraw in the new palette and the painted orb stays as painted (labeled as the reference, not re-colored).
3. **Given** any dot, **When** the founder switches between still and loader, **Then** the dot shows its still end state or plays its loader movement, and the loader loops with no visible jump.
4. **Given** the proof has run on a laptop browser and on an iPhone, **When** the founder reads the numbers, **Then** each generated approach shows its frame time for one large dot and for about 30 small dots on each device, plus the extra download it needs on web and whether that fits within 1 MB.
5. **Given** the founder has compared them, **When** they record a verdict, **Then** the verdict (B, E, or neither) and the date are kept with the proof results, and "neither" means the v0.1 placements use the animated painted orb.

---

### User Story 2 - A person sees the watercolor dot while content loads (Priority: P1)

A person opens a page whose content is still on its way. Instead of a plain loading state they see a small watercolor dot gently breathing, with a word that says what is happening. When content arrives the dot gives way to it.

**Why this priority**: Loading states are the most frequent place the mark can come alive and are a founder commitment for v0.1. It is also the simplest placement to prove the dot works in the real app.

**Independent Test**: Slow the network, open a content page; the dot appears in place of today's loading state (screen readers hear "Loading…"), then disappear when content arrives; with reduced motion on, the dot is still.

**Acceptance Scenarios**:

1. **Given** a page's content is loading, **When** the person looks at it, **Then** a small watercolor dot breathes where the loading state is, with a text label that says content is loading.
2. **Given** the dot is showing, **When** content arrives, **Then** the dot is replaced by the content with no layout jump larger than the dot itself.
3. **Given** loading fails, **When** the error appears, **Then** the dot stops and the existing error message and retry are shown; the dot never implies progress that is not happening.
4. **Given** reduced motion is on, **When** content is loading, **Then** the dot is shown still in its dried end state and the text label is unchanged.
5. **Given** a screen reader is on, **When** the loading state appears, **Then** it is announced once as loading, and the dot itself is not read out as a separate image.

---

### User Story 3 - The welcome mark is gently alive (Priority: P2)

A first-time visitor lands on the welcome screen and sees It's watercolor mark slowly bloom and settle, then rest. It feels like the painted orb, made living.

**Why this priority**: The welcome mark is the first impression and a founder commitment, but the welcome screen already works with the painted orb, so this is an improvement rather than a gap.

**Independent Test**: Open the welcome screen fresh on a slow mobile connection; the painted orb shows at once, the generated dot takes its place without a jump once ready, plays its bloom once, and rests; the start action is usable throughout.

**Acceptance Scenarios**:

1. **Given** a first visit on any device, **When** the welcome screen appears, **Then** the mark is visible straight away (painted orb if the generated dot is not ready yet) and the welcome screen is no slower to appear than today.
2. **Given** the generated dot becomes ready, **When** it replaces the painted orb, **Then** it appears in the same place and size with a soft fade, not a jump.
3. **Given** the dot has bloomed, **When** the person stays on the screen, **Then** the dot rests completely still in its dried end state, with no further motion.
4. **Given** reduced motion is on, **When** the welcome screen appears, **Then** the mark shows its still end state and never animates.
5. **Given** a screen reader is on, **When** focus reaches the mark, **Then** it is described in words that say what it is (It's watercolor mark), matching today's label in meaning.

---

### User Story 4 - Moving between onboarding steps feels like one painting (Priority: P3)

As a person moves from welcome to the personal page, the societal page and the futures page, a small watercolor dot blooms once in a corner of each new page, a quiet sign that the pages belong to one painting.

**Why this priority**: A founder commitment, and the least necessary for understanding the app.

**Independent Test**: Walk through onboarding forward and back; each step change shows the corner bloom, it never delays the next page being usable, and with reduced motion it is skipped.

**Acceptance Scenarios**:

1. **Given** a person moves to the next onboarding step, **When** the step changes, **Then** the page changes as today, a small dot blooms once in a corner, and the next page is usable within the same time it is today.
2. **Given** a person goes back a step, **When** the step changes, **Then** the same corner bloom plays on the earlier page, and nothing they picked is lost or hidden.
3. **Given** reduced motion is on, **When** the step changes, **Then** the page changes and the corner dot is shown still, or not at all.
4. **Given** the generated dot is not ready (for example on a slow web connection), **When** the step changes, **Then** the page changes plainly, with no wait for the dot.

---

### User Story 5 - It can give the dot any palette, without people choosing one (Priority: P2)

It's team can give the dot a different set of pigments (for a season, a page, or a future theme) by changing data, not by painting a new image, and it still pools, darkens and mixes like paint. People in v0.1 see only It's own palette and have no color picker.

**Why this priority**: Palette-readiness is a founder commitment and is what makes the dot better than the fixed orb, but no v0.1 screen needs a second palette yet beyond the proof.

**Independent Test**: Swap the dot's palette to the proof's second palette in data only; the dot redraws in the new pigments everywhere it appears and keeps its watercolor marks; no screen offers people a palette choice.

**Acceptance Scenarios**:

1. **Given** the dot uses It's palette, **When** the team replaces it with another palette of two to four pigments in data, **Then** every dot redraws in the new pigments with no new image made.
2. **Given** two pigments overlap in the dot, **When** they mix, **Then** the overlap looks like paint mixing (e.g. blue and yellow make a green), not a see-through blend of light.
3. **Given** a palette with a very light or very dark pigment, **When** the dot is drawn on It's paper color, **Then** the dot stays visible and the edge still reads as a darker rim.
4. **Given** any screen in v0.1, **When** a person looks for a way to change colors, **Then** there is none.

### Edge Cases

- **Slow web connection**: the painted orb shows wherever a dot would, until the generated dot is ready; no screen waits for it. If it never becomes ready, the painted orb (still, or gently animated) stays.
- **Generated dot fails to draw** (unsupported browser, graphics error): the painted orb is shown instead and the person sees nothing broken; the failure is not reported with any personal content.
- **Many dots at once** (several loading areas on one page): the page stays smooth; if it cannot, dots fall back to the still end state rather than stutter.
- **Very short loads**: if content arrives almost at once, the dot does not flash on and off.
- **Very long loads**: the dot keeps a calm loop with no visible seam and does not speed up or suggest a percentage.
- **Low-power mode or a hot device**: dots may pause at their still end state.
- **Reduced motion turned on mid-animation**: the dot settles to its still end state promptly.
- **Dark mode**: the dot stays visible on dark backgrounds; full "night paper" styling is not in scope.
- **Second palette that is unsuitable** (pigments too pale to see on paper): the team is warned before it ships; people never see an invisible dot.
- **Neither generated approach passes the proof**: all three placements use the animated painted orb, and palette-readiness is reported as not met for v0.1.

## Clarifications

### Session 2026-10-17

- Q: What does "between steps" look like? → A: The page changes as today, with a small dot bloom in a corner of the new page (no full-screen wash, no traveling dot).
- Q: What is It's own palette? → A: The orb's teal, green and yellow pigments for the dot now; the app's color tokens are brought in line later.
- Q: Target devices and acceptable extra web download? → A: iPhone 12 or newer; up to 1 MB extra on web, loaded after the first screen.
- Q: Do generated images count as CC0 illustrations with seed and settings as provenance? → A: Yes.

### Founder review 2026-10-17

- Q: After the welcome dot blooms and settles, what does it do? → A: Rests completely still, like a dried painting.
- Q: Which second palette does the proof use? → A: Rose and violet.
- Q: Should people besides the founder see the loader before it ships? → A: Yes, a quick check with 3–5 people.
- Q: If the chosen dot can't fit the 1 MB web budget, is web with the animated painted orb acceptable for v0.1? → A: Yes; revisit after v0.1.

### After the proof 2026-10-17

- Q: Which approach? → A: B, the look-alike shader.
- Q: Web too? → A: Yes, B on web. Drawn with WebGL from the same shader (a few KB), so FR-011's 1 MB budget holds; the painted orb is only the fallback when WebGL is unavailable.
- Q: How does the loader move? → A: A bloom loop: the dot blooms from small and soft to full and settled, rests, then dissolves well back (to about 40% of its width, very soft-edged, at least 45% visible) into the next bloom, while its pigments keep slowly swirling and drifting so the colors trade places (one full turn every 20 s; the outline does not turn). Not a breath, no fade-out.
- Q: Should the loader read as paint? → A: Yes: it must look like blooming and drying, not a fade. Each loop the drop spreads wet (dark, glossy, feathered edge creeping outward), then dries (paler and matte, the rim darkens, the bloom line forms late, granulation shows), rests, re-wets and draws back into a fresh drop.
- Q: Only It's colors? → A: No: the loader travels through other palettes too (It orb → sunrise → dusk → It orb), changing to the next palette while the drop is small and re-wetting, so each bloom is in one palette's own colors.

### Loader chosen 2026-10-17: gathering

After the living-loader experiments were parked, the founder storyboarded four ideas (ink in water, brushstroke, gathering drops, glazing), chose **gathering**, and refined it in the lab (branch `explore/living-loader`):

- Drops come in varied sizes; each looks like a small dot-B watercolor drop.
- The first drops are It's colors and gather into one dot; afterwards new drops keep arriving (about every 1.5 s, drifting in over about 3.4 s) and bloom in with sunrise and dusk pigments, staying vivid for a while before marbling in.
- The first drops look wet while they travel; drops join with no gap, along a ragged seam with a pale halo.
- The dot keeps its size: a drop shapes the outline only until it has run in.
- Colors change smoothly; nothing changes all at once.
- When content arrives the loader simply disappears (founder's choice; drying on arrival not wanted).

This supersedes the bloom-loop loader and the "Loader redefined" answers below.

### Loader redefined 2026-10-17 — on hold

**On hold (founder, 2026-10-17):** none of the living-loader versions matched what the founder had in mind. The shipped loader returns to the original B bloom loop while alternatives are explored; the experiments are on branch `explore/living-loader`.


The bloom loop (spread, dry, re-wet, repeat) read as a blurry pulse, not paint. The founder redefined the loader:

- Q: What should it feel like? → A: Watercolor being applied and spreading, then staying alive: colors mingling, merging, transforming. The edge should look like real watercolor, close to the first B bloom (not blurry).
- Q: How does new color come in? → A: Both: the pigments inside keep flowing and marbling, and every few seconds a drop of a new color lands inside and blooms outward (wet-in-wet).
- Q: Does it dry? → A: Only when loading ends, and only if the loader was seen (on screen about 1.5 s or more). It dries while the content appears, so nothing waits (FR-010). Quick loads just disappear. [Assumption: "dry while content appears" pairs the founder's choice with the no-waiting rule; confirm in review.]
- Q: Shader B or a live paint simulation? → A: Try both and compare in the lab: push shader B toward mingling, and prototype a live wet-paint simulation for the loader alone.

This supersedes the earlier loader answers (breath, then bloom loop with re-wet and palette steps). Palettes the loader can draw new colors from: It orb, sunrise, dusk (LOADER_PALETTES).
## Requirements *(mandatory)*

### Functional Requirements

**Fidelity proof**

- **FR-001**: The proof MUST show three dots side by side at the same size: the painted orb (reference), the look-alike dot (Option B: watercolor marks imitated live) and the physics-painted dot (Option E: painted ahead of time by It's own watercolor simulation, colored live with pigment optics).
- **FR-002**: Each dot in the proof MUST be viewable still and as a loader, and each generated dot MUST be viewable in It's palette and in one other palette.
- **FR-003**: The proof MUST report, for each generated approach on a laptop browser and on an iPhone, the frame time for one large dot and for about 30 small dots on one screen, and the extra web download each approach needs, measured against the 1 MB web budget (FR-011). Measurements MUST use an iPhone 12 (or the oldest supported iPhone available).
- **FR-004**: The proof MUST let the founder record a verdict (B, E or neither) with the date, kept with the measurements.
- **FR-005**: Generated dots in the proof MUST NOT reuse code or data from sudoaquarelle or Mixbox; the simulation and color mixing MUST be written from published papers and the Kubelka-Munk equations.
- **FR-006**: For every dot painted ahead of time, the seed, simulation settings and pigments MUST be recorded as provenance.

**v0.1 loader (built with the approach the founder chooses)**

- **FR-007**: Every content loading state in the app MUST show the watercolor dot with a text label saying content is loading, in place of today's loading indicator.
- **FR-008**: The welcome screen's mark MUST be the watercolor dot, playing a slow bloom-and-settle once and then resting completely still in its dried end state.
- **FR-009**: On each change between onboarding steps, the page MUST change as it does today, and a small watercolor dot MUST bloom once in a corner of the new page; no full-screen wash and no dot traveling between pages in v0.1.
- **FR-010**: Wherever a generated dot is not ready or cannot be drawn, the painted orb MUST be shown in the same place and size, and no screen or action MUST ever wait for the generated dot to be ready.
- **FR-011**: The first onboarding screen MUST appear no slower than it does today; any extra web download for the generated dot MUST load after it and MUST NOT exceed 1 MB (compressed). If the chosen approach cannot fit in 1 MB on web, web MUST use the animated painted orb in all three placements, and iOS MUST still use the generated dot.
- **FR-012**: Loader animations MUST loop with no visible seam and MUST NOT suggest a percentage or progress that is not real.
- **FR-013**: When loading fails, the dot MUST stop and the existing error and retry MUST be shown.

**Palette-ready**

- **FR-014**: The dot MUST accept a palette of two to four pigments supplied as data and redraw in it without any new painted or generated image.
- **FR-015**: Overlapping pigments in the dot MUST mix like paint (subtractive), not like light.
- **FR-016**: It MUST ship with its own palette as the default: the painted orb's teal, green and yellow pigments, matched to the orb. The app's color tokens are not changed by this spec; bringing them in line with the palette is a later, separate change.
- **FR-017**: v0.1 MUST NOT offer people any way to choose or change colors.
- **FR-018**: A palette MUST be checked before use so that the dot stays visible on It's paper color.

**Accessibility**

- **FR-019**: With reduced motion on, every dot MUST show its still, dried end state, and the step-change corner dot MUST be shown still or not at all.
- **FR-020**: Every dot MUST have a text alternative that says what it means in that place ("Loading…" for loading states; It's mark on the welcome screen); the purely decorative step-change corner dot MUST be hidden from screen readers.
- **FR-021**: No meaning MUST depend on the dot's color or motion alone. Exception (founder, 2026-10-17): the loader shows no words on screen; it stands in the place where content will appear and screen readers hear "Loading…".

**Living loader (redefined 2026-10-17) — on hold, see Clarifications**

- **FR-022**: The loader dot MUST arrive as paint being applied and spreading, with an edge that reads as real watercolor (close to the first B bloom; not blurred).
- **FR-023**: While loading continues, the dot MUST stay wet and alive: its pigments flow and marble into each other, and at intervals a drop of a new color lands inside and blooms outward, mixing with the existing paint. It MUST NOT shrink, pulse or fade out between these.
- **FR-024**: When loading ends after the loader was on screen for at least about 1.5 s, the dot MUST dry (rim and bloom lines form) for a moment while the content appears, then fade; it MUST NOT delay the content. If it was on screen for less, it disappears with the content.
- **FR-025**: The founder MUST compare a shader-B version and a live-simulation version of the living loader side by side in the lab before either ships, including web download and frame time for one 56 pt dot on web and iPhone.

### Key Entities

- **Palette**: a named set of two to four pigments that color the dot. It's own palette (the orb's teal, green and yellow) is the default; the proof's second palette is the only other one in v0.1.
- **Pigment**: one paint color described by how it absorbs and scatters light, so that mixes behave like paint.
- **Painted dot** (Option E only): a dot painted ahead of time by It's simulation, stored as where each pigment ended up (not as colors), with its frames of blooming and drying, and its provenance (seed, settings, pigments).
- **Proof result**: per approach and device, the frame times (1 large dot, ~30 small dots), the extra web download, and the founder's verdict and date.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The founder, comparing the chosen generated dot with the painted orb side by side, judges it "the same family" — recorded as a verdict in the proof results.
- **SC-002**: About 30 small dots on one screen animate at 60 frames per second (no frame over about 16.7 ms in a 10-second sample, outside of the first second) on an iPhone 12 and on a mid-range laptop browser (current Chrome and Safari); newer iPhones are assumed to do at least as well.
- **SC-002a**: The generated dot adds no more than 1 MB (compressed) to the web download, all of it loaded after the first screen; if it cannot, web uses the animated painted orb (FR-011).
- **SC-003**: The first onboarding screen appears within today's load time (measured before and after on the same device and connection).
- **SC-004**: All three v0.1 placements (content loading states, welcome mark, onboarding step changes) use the watercolor dot, or the animated painted orb if neither approach passes (or, on web only, if the chosen approach exceeds the 1 MB budget).
- **SC-005**: A new palette can be applied by changing data only, and the dot shows paint-like mixing in at least It's palette and one other palette, as judged by the founder.
- **SC-006**: With reduced motion on, no dot moves on any of the three placements (checked on web and iOS).
- **SC-007**: Every dot placement has a text alternative or is correctly hidden as decorative, verified with a screen reader on web and iOS.
- **SC-008**: Before the loader ships, 3–5 people besides the founder watch the loader and welcome dot and say what it feels like; their responses are recorded with the proof results, and any reading of the motion as anxious, broken or slow is resolved before shipping.

## It Checks *(mandatory)*

### Privacy

- **Before signup, stays on device**: nothing new is collected. The dot shows It's palette only and is not built from a person's picks in v0.1.
- **Before signup, sent** (coarse totals / stage funnel only, disclosed in UI): nothing. Loading or failing to load the generated dot is not measured per person.
- **After signup, stored on server**: nothing new.
- **Never public by default**: not applicable in v0.1. Any later dot drawn from a person's picks (concept.md, "Your color") is personal data and must not appear in shared or public images by default.

### Honest Status

N/A for ideas — no ideas are shown. The loader itself must be honest: it never shows fake progress, and it stops when loading fails (FR-012, FR-013). The proof labels which dots are paint and which are generated.

### Must Not Block

- Personal story of your chosen futures (soon): the dot takes palettes as data, so a later story can color a picture from a person's picks without changing how the dot is drawn.
- Sharing a future or path (soon): no dot carries personal content in v0.1, so sharing stays an explicit, separate act later.
- Native iOS app (optional): the dot and its fallback work in the iOS build as well as on web.
- Later watercolor work outside v0.1 (concept.md: scene kit, live simulation, shapes beyond the dot, gathering animation, color picker): the palette, pigment and provenance records are defined so they can serve more shapes later; none of these is built here.

### Accessibility

- Keyboard: dots are never focus stops and never trap focus; the welcome "start" action and all onboarding controls stay reachable and usable while any dot animates.
- Screen reader (incl. expanded/collapsed state): loading states are announced once as loading (text, not the image); the welcome mark has a label saying it is It's watercolor mark; the step-change corner dot is hidden as decorative. No expandable controls are added.
- Reduced motion: every dot shows its still, dried end state; the step-change corner bloom does not play; switching the setting mid-animation settles the dot promptly.
- Meaning never by color alone: loading is always also stated in words; no state is told apart by palette or hue.

### Research Questions

- Does the generated dot read to people as "watercolor" and as It's mark, compared with the painted orb?
- Does a breathing watercolor loader make waiting feel calmer or slower than a plain indicator?
- How much extra download and battery does an always-on loader cost on mobile web and iPhone?
- Do Kubelka-Munk mixes from a small pigment set stay paint-like across very different palettes (e.g. rose and violet versus teal and yellow)?

## Assumptions

- The proof is a founder-facing review, not a screen people see in the shipped app.
- The founder's verdict on the proof decides between B and E; the rest of this spec is built only with the chosen approach. If neither passes, v0.1 uses the animated painted orb in all three placements and FR-014–FR-016 are reported as not met.
- The second palette for the proof is rose and violet (founder, 2026-10-17), clearly different from It's, so mixing can be judged.
- Adding a GPU drawing library for the dot is a change to the agreed stack and needs a decision record before planning (decision.md). The research names `@shopify/react-native-skia` at about 2.9 MB extra on web, well over the 1 MB web budget (FR-011), so web will likely use the animated painted orb unless the proof finds a way to draw the chosen dot on web within 1 MB; the proof must report this.
- The simulation used to paint Option E dots is a tool kept outside the shipped app; only its output ships.
- Generated dots are CC0 illustrations under `docs/architecture/licensing.md`, with seed, simulation settings and pigments as their provenance, while the drawing code is AGPL app code (founder confirmed 2026-10-17).
- "Content loading states" means every place that today uses the shared content loading state, not one-off spinners inside forms or payments.
- Target devices are iPhone 12 and newer, and a mid-range laptop on current Chrome and Safari (founder, 2026-10-17).
- The four onboarding steps are welcome, personal, societal and futures, as in the current app.
- 60 fps (about 16.7 ms per frame) is the smoothness target from decision.md.
