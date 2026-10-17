# Research: Watercolor dot (007)

Phase 0 for `plan.md`. Each entry: decision, rationale, alternatives. Background evidence is in `.specify/assessments/watercolor/research.md`.

## R1. Renderer on iOS

- **Decision**: `@shopify/react-native-skia`, installed with `expo install`, drawing with SkSL `RuntimeEffect` shaders whose uniforms are Reanimated shared values.
- **Rationale**: Approved in `docs/architecture/decisions.md` (2026-10-17). Runs shaders on the GPU, animates on the UI thread without React re-renders, and is in the Expo SDK 57 docs. Both proof options (B and E) are fragment shaders, so one renderer serves both.
- **Alternatives**: `react-native-wgpu` (newer, heavier, not needed for 2D); Reanimated alone (cannot draw new shapes); pre-rendered video (no palettes).

## R2. Web in v0.1

- **Decision**: Web shows the **animated painted orb** (Reanimated opacity/scale on `watercolor-orb.jpg`) in all three placements. Skia is not loaded on web in the shipped app. The proof route on web loads Skia's CanvasKit lazily, only to measure B and E, and reports the ~2.9 MB download against the 1 MB budget.
- **Rationale**: CanvasKit exceeds the 1 MB budget (FR-011); the founder accepted the painted-orb fallback for web in v0.1 (spec review, 2026-10-17). Platform split via `.web.tsx` files keeps CanvasKit out of the web bundle.
- **Alternatives**: a raw WebGL2 canvas running the same shader on web (small, likely well under 1 MB) — recorded as the first thing to try after v0.1; loading CanvasKit after the first screen anyway (breaks the budget).

## R3. Option B — look-alike shader

- **Decision**: One fragment shader per dot, all procedural: a noise-warped circular signed distance for the bled edge; an edge-darkening term from distance to the edge (Bousseau 2006 / Montesdeoca-style); pigment density from layered value noise with low-frequency "bloom" fronts; paper grain from a static noise texture modulating density in the paper's valleys (granulation); colour from the shared Kubelka-Munk mixer (R5). Time drives slow noise drift for "breathe" and a radius/density curve for "bloom-and-settle".
- **Rationale**: The cheapest flexible option; the techniques are published and need no physics.
- **Alternatives**: SVG filters (web only, not iOS); polygon-layer deformation à la generative-art practice (CPU-heavy at many layers, harder to animate).

## R4. Option E — painted ahead of time

- **Decision**: A simulation tool at `tools/watercolor-sim/`, written from Curtis et al. 1997: shallow-water layer (height, velocity), pigment suspended/deposited per pigment, capillary layer, paper height/absorbency from seeded noise, evaporation-driven edge flow. Implemented in plain TypeScript on the CPU (Float32Arrays, seeded generator), run with Node, so painting is a reproducible command with byte-identical output. (Planned as WebGL2 under headless Playwright; changed during implementation because the CPU version is simpler, needs no browser, and paints a 256² dot in a few seconds.) Output per painted dot: an RGB PNG atlas where each channel holds one pigment's density (up to 3 pigments; alpha cannot carry data because decoders premultiply it), one frame per step of the bloom-and-settle sequence, plus a JSON manifest with provenance. In the app, a Skia shader samples the atlas frame and colours it with the K-M mixer (R5).
- **Rationale**: Physics gives the marks that make watercolor read as real (founder's main requirement); baking keeps the device cost to one texture lookup and the mixer. Storing densities, not colours, makes palettes a data change (FR-014).
- **Clean-room rule**: no code or data from sudoaquarelle (no license) or Mixbox (CC BY-NC). Implementers work from the paper and K-M equations; the tool's README cites them (FR-005).
- **Alternatives**: Python/NumPy CPU sim (simpler to read, slow at 512²); running the sim live on device (Option D, out of scope).
- **Sizing (to measure in proof)**: assume 256×256 per frame, 16–24 frames for bloom-and-settle, 1 frame for still. Target: ≤ 400 KB of PNG per painted dot on iOS. Not shipped to web in v0.1 (R2).

## R5. Pigment mixing

- **Decision**: A small Kubelka-Munk mixer in `packages/watercolor` (TypeScript, for tests and palette checks) mirrored in SkSL. Each pigment has K and S per RGB channel. Mix = sum of density-weighted K and S; reflectance over paper with the standard K-M finite-layer formula; convert linear → sRGB. Pigment K/S values are derived from a target masstone colour and a target tint colour using the single-constant K-M inversion, so a palette is authored as colours a designer can pick.
- **Rationale**: Paint-like (subtractive) mixing is required (FR-015); the maths is public; deriving K/S from colours keeps palettes data.
- **Alternatives**: Mixbox (license excludes it); RYB or plain multiply blending (fails blue + yellow → green convincingly).

## R6. Palettes

- **Decision**: It's palette: three pigments matched to the orb (teal-blue, cyan-green, warm yellow), fitted by sampling `reference-dot.png`. Proof palette: rose and violet (founder, 2026-10-17). Palettes are Zod-validated data. A visibility check (FR-018) computes K-M reflectance of each pigment at mid density over It's paper colour and fails if contrast against paper is below a threshold (initially luminance difference ≥ 0.15; tune in proof).
- **Rationale**: Matches spec FR-014–FR-018 and keeps the domain-style package framework-free (constitution IV).

## R7. Reduced motion, accessibility, power

- **Decision**: Reanimated `useReducedMotion()` decides static vs animated; static renders the final frame (E) or `t = settled` (B). Dots never take focus. Loading state: text "Loading…" with `accessibilityRole="progressbar"`-free plain announcement via `accessibilityLiveRegion="polite"` on web/Android and an `AccessibilityInfo.announceForAccessibility` call on iOS, once. Welcome mark keeps a label in the meaning of today's ("It's watercolor mark"). Corner dot: `accessibilityElementsHidden` / `aria-hidden`. Animation pauses when the app is backgrounded (`AppState`).
- **Rationale**: FR-019–FR-021, spec edge cases.

## R8. Loading flicker

- **Decision**: Show the loader dot only after 300 ms of loading; once shown, keep it at least 600 ms.
- **Rationale**: Spec edge case "very short loads". Common practice for avoiding flashes.

## R9. Measuring the proof

- **Decision**: The proof route (`apps/app/app/lab/watercolor.tsx`, available only in development builds) measures frame times with Reanimated `useFrameCallback` over a 10-second sample after a 1-second warm-up, for 1 large dot and a 6×5 grid of small dots, per approach. It shows max and 99th-percentile frame time and lets the founder copy the results as JSON. Results and the verdict are committed to `specs/007-watercolor-dot/proof/results.md`. Download size: bytes of the CanvasKit wasm (web), atlas PNGs and shader sources.
- **Rationale**: SC-002 and FR-003/FR-004 need repeatable numbers from an iPhone 12 and a laptop browser.
- **Alternatives**: Xcode Instruments only (accurate but not visible to the founder in the proof).

## R10. People check (SC-008)

- **Decision**: After the founder's verdict and before shipping, show the loader and welcome dot to 3–5 people (iPhone or recorded video), ask three open questions (what it feels like; what is happening; would waiting feel calmer or slower), and record answers, without names, in `proof/results.md`.
- **Rationale**: Founder decision 2026-10-17; keeps personal data out of the repo.

## R11. Version and setup

- **Decision**: `npx expo install @shopify/react-native-skia` in `apps/app`; record the resolved version in `docs/architecture/dependency-policy.md`. iOS needs a new dev-client build (`pnpm ios`). No CanvasKit setup script for web in v0.1 except inside the lab route's lazy load.
- **Unknown to confirm at install**: exact SDK 57 compatible version, and whether Skia's web entry can be lazy-loaded from a single route without pulling CanvasKit into the main bundle. If it cannot, the lab's web measurement uses a separate web-only build flag and this is noted in results.
