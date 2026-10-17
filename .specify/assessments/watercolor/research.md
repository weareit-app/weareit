# Idea Research: Watercolor visual language, generated in code

- **Slug**: watercolor
- **Created**: 2026-10-17
- **Evidence confidence (overall)**: medium on technique and platform (published papers, a working reference, official docs); low on demand (founder-stated only; no user research on visuals yet); low on performance numbers until a prototype is measured on devices.

## Users & Demand

- The founder wants It's watercolor look generated in code so it can be themed, animated and composed, and used instead of AI-generated images. — [source: founder, intake.md] (confidence: high that it is wanted; stated, not observed)
- It's tone already leans on watercolor: the welcome-screen mark is the watercolor orb, and the future and community screens use watercolor clouds, houses and trees. — [source: `apps/app/assets/brand/README.md`, `apps/app/app/index.tsx`, `apps/app/app/onboarding/futures.tsx`] (confidence: high)
- No person outside the founder has been asked how the visuals land, whether a loading animation or gathering animation reads as "coming together", or whether people want to theme the dot. — [ASSUMPTION: no research found in `docs/` or `.specify/`] (confidence: high that the gap exists)
- Concrete places in v0.1 that already show images and could use generated ones: welcome mark; futures page (clouds, house); choice illustrations (charcoal figures, a different style); waiting states while content loads (`apps/app/src/components/content-query-state.tsx`). — [source: repo] (confidence: high)

## Prior Art

### Inside It

- **Static brand art, two styles.** Watercolor washes (orb, clouds, houses, tree, home) and charcoal/crayon line figures (`icon-*.jpg`). All JPEG; 1.7 MB total; provenance and rights not yet confirmed. — [source: `apps/app/assets/brand/README.md`] (confidence: high) *Relevance: line-plus-wash is the classic picture-book pairing; a generated system has to sit beside, or eventually replace, both.*
- **Licensing policy.** App code is AGPL-3.0-or-later; illustrations are CC0 with "generation, source, selection, human editing" provenance kept. — [source: `docs/architecture/licensing.md`] (confidence: high) *Relevance: any third-party rendering code must be AGPL-compatible, and generated images need a provenance story.*
- **Thing / Type / Relation.** A shared layer where records link to Things of Types. Registered scene elements (sun, tree, home, river) could be Things, so a person's choices can select scene parts through existing links. — [source: `docs/architecture/decisions.md`, 2026-10-16] (confidence: medium that it fits; not yet designed)
- No graphics library is installed. Reanimated 4.5 and react-native-worklets 0.10 are. — [source: `apps/app/package.json`] (confidence: high)

### sudoaquarelle.com (studied read-only)

- A browser watercolor simulator by @lionel_mora. Front end is plain ES modules (`main.js` 28 KB, `sim.js` 42 KB, `pigments.js` 7 KB, `ui.js` 10 KB) on **WebGL2** with half-float render targets. — [source: sudoaquarelle.com/js/*.js] (confidence: high)
- **Model**, as its own comments describe it, "after Curtis et al. 1997", three layers per texel:
  - *Surface water*: height and velocity, moved by semi-Lagrangian advection, pushed downhill by water height plus paper relief, slowed by drag, and drained into the paper.
  - *Pigment*: 8 pigment channels, each split into *suspended* (moves with the water) and *deposited* (settled on the paper). Pigment settles as the film thins, settles more in paper valleys (granulation), and lifts back up in fast water unless the pigment is "staining".
  - *Capillary layer*: paper saturation that spreads through fibres, optionally as invasion percolation for feathered edges.
  - *Paper*: generated from layered value noise (fbm) as height, absorbency, fibre direction and pore threshold.
  - *Edge darkening*: evaporation at the wet/dry boundary drives an outward flow that carries pigment to the rim, which is what makes the darker ring.
  - *Optics*: Kubelka-Munk (K-M). Each pigment has absorption K and scattering S per colour channel; layers composite physically; wet paint is drawn darker and richer; dried washes are "baked" into the paper as a transmittance filter so later glazes sit on top. Also a backlit (transmitted light) view and salt, alcohol and rain effects.
  - — [source: sudoaquarelle.com/js/sim.js] (confidence: high)
- **License: none published.** `https://sudoaquarelle.com/LICENSE` returns 404 and the source files carry no license header. Unlicensed code is all-rights-reserved by default, so **none of it can be copied into It**. It is useful as proof the approach runs in a browser and as a checklist of effects. Anything It builds must be written from the published papers and K-M maths. — [source: HTTP check 2026-10-17; ASSUMPTION about default copyright, not legal advice] (confidence: high on the finding, medium on the conclusion)
- **Cost signal:** a full-screen multi-pass sim with 4+ float textures and many steps per frame is a heavy GPU load. It suits one canvas, not dozens of small dots across a UI. — [ASSUMPTION: from the shader structure; not measured] (confidence: medium)

### Published techniques

- **Curtis, Anderson, Seims, Fleischer & Salesin, "Computer-Generated Watercolor", SIGGRAPH 1997.** The source model: shallow water, pigment, capillary layers; edge darkening, backruns, granulation, glazing; K-M compositing. — [source: cited by sudoaquarelle; widely known] (confidence: high)
- **Bousseau, Kaplan, Thollot & Sillion, "Interactive watercolor rendering with temporal coherence and abstraction", NPAR 2006.** Not a fluid sim: an image filter. Abstract the image into flat regions, then apply watercolor effects (paper texture, pigment density variation, edge darkening, wobbling edges) as image-space filters, with methods to keep animation coherent. — [source: artis.inrialpes.fr/Publications/2006/BKTS06] (confidence: high) *Relevance: the "look-alike without physics" route, built for animation.*
- **Montesdeoca et al. (real-time watercolor in Maya).** Edge darkening by difference-of-Gaussians with gradual pigment build-up, and a split paper granulation filter that controls paper roughness and pigment pooling in the paper's valleys. — [source: dr.ntu.edu.sg bitstreams, NTU] (confidence: medium)
- **Other real-time work** uses a Sobel filter for edge darkening and per-pigment granulation constants. — [source: cs.nthu.edu.tw/~chunfa/pcm2004.pdf] (confidence: medium)
- **Layered polygon deformation** (the technique popularised by generative artist Tyler Hobbs): many low-opacity copies of a recursively jittered polygon give soft, bled watercolor shapes with no shader at all. — [ASSUMPTION: from memory of his published essay; not re-checked this session] (confidence: medium)
- **Mixbox (Secret Weapons).** Pigment-like colour mixing via K-M with an RGB-in/RGB-out API; ships GLSL plus a lookup texture. **License: CC BY-NC 4.0, non-commercial only**; commercial use needs a separate agreement. — [source: github.com/scrtwpns/mixbox, scrtwpns.com/mixbox/docs] (confidence: high) *Relevance: not usable as-is under It's AGPL app license; a small K-M mixer for 2–4 known pigments can be written from the maths instead.*

### Rendering options in It's stack

- **`@shopify/react-native-skia`.** Supported in the Expo SDK 57 docs. Gives GPU 2D drawing and custom **SkSL RuntimeEffect** shaders on iOS, Android and web; animates from Reanimated shared values. Web runs through **CanvasKit (WebAssembly)**, about **2.9 MB gzipped** per the official install notes, loaded before Skia can draw; native adds roughly 4–6 MB to the app binary. License MIT (Skia itself BSD-3), both AGPL-compatible. — [source: docs.expo.dev/versions/v57.0.0/sdk/skia; mintlify.com/shopify/react-native-skia/getting-started/installation] (confidence: medium–high; size figures vary between sources)
- **Reanimated 4 alone.** Moves, scales and fades views and images on the UI thread. Can animate pre-rendered watercolor images (e.g., gather dots, crossfade to Earth) but cannot draw new watercolor shapes. Already installed. — [source: `apps/app/package.json`] (confidence: high)
- **SVG filters (`feTurbulence` + `feDisplacementMap`).** Cheap watercolor-ish edges on web only; react-native-svg does not support these filter primitives on iOS. — [ASSUMPTION: from memory of react-native-svg's filter support] (confidence: medium)
- **WebGPU / `react-native-wgpu`.** Could host a full Curtis-style sim on native and web. Newer and heavier; not needed for UI-scale effects. — [ASSUMPTION] (confidence: low)
- **Pre-rendered** (PNG sequences, video, Lottie). Lowest risk, but loses theming, choice-driven composition and uniqueness, which are the founder's goals. — [ASSUMPTION] (confidence: high)

## Market & Context

- Today It uses static JPEGs. Doing nothing costs nothing now, but every new scene, colour theme or animation needs new painted (or generated) art, and AI-generated images bring rights and consistency questions the licensing policy already flags. — [source: brand README, licensing.md] (confidence: medium)
- Few apps generate their illustration style procedurally; most ship static or Lottie art. A consistent generated watercolor language would be distinctive. — [ASSUMPTION] (confidence: low)
- Key technical finding: most of the founder's named uses (loader, themed dot, gathering, morphing) do not need live physics. A **procedural** shader — a noise-warped shape, a darker edge ring, soft blooms from layered noise, paper grain, K-M-style mixing of a few pigments — can give the look for many small instances at once. A real sim can be kept for rare full-screen moments, or run ahead of time to bake textures. — [ASSUMPTION: from the techniques above; to be proven by a prototype] (confidence: medium)

## Data & Constraints

- **Platforms:** web and iOS first (Expo Router universal app). Anything chosen must render on both. — [source: decisions.md] (confidence: high)
- **Web download:** CanvasKit adds ~2.9 MB gzipped. For onboarding on mobile web, the first screen should not wait for it; a static image fallback (the current JPEG) is needed until it loads. — [source: Skia docs; ASSUMPTION on UX impact] (confidence: medium)
- **Dependencies:** adding Skia is a change to the agreed stack and needs a decision record; versions must come from `expo install`. — [source: AGENTS.md, dependency-policy.md] (confidence: high)
- **Licensing:** rendering code must be AGPL-compatible (rules out copying sudoaquarelle and using Mixbox without a deal); generated illustrations are CC0 with provenance. — [source: licensing.md] (confidence: high)
- **Privacy:** a dot or scene built from a person's pre-signup choices is personal data drawn on screen. It may be shown to that person on device; it must not appear in shared or public images by default. — [source: AGENTS.md privacy invariants] (confidence: high)
- **Accessibility:** the spec template requires a reduced-motion behaviour; generated images need text alternatives that say what they mean. — [source: `.specify/templates/overrides/spec-template.md`] (confidence: high)
- **Performance:** no measurements yet. Budget questions: frame time for 1 large dot, for ~30 small dots at once, and battery cost of an always-on loader. [NEEDS CLARIFICATION: target devices]

## Evidence Against the Idea

- **No demand evidence** beyond the founder. Visual polish may matter less for v0.1 than the core personal and societal pages. — [ASSUMPTION] (confidence: medium)
- **Matching hand-painted quality is hard.** Procedural watercolor can look "digital" (too regular, too smooth, wrong colour mixing). The founder's reference is a real painting with real pigment behaviour; a look-alike shader may fall short and a real sim is expensive. — [ASSUMPTION] (confidence: medium)
- **Web cost.** ~2.9 MB of CanvasKit before the first generated pixel is a real cost on a mobile-web onboarding flow. — [source: Skia docs] (confidence: medium)
- **New dependency and skill.** Shader code is a specialist area; it adds a native module, a decision record, and maintenance. — [ASSUMPTION] (confidence: medium)
- **Style split.** The charcoal line figures are a second style; a generated watercolor system does not cover them, and mixing generated washes with hand-drawn lines needs care. — [source: brand assets] (confidence: medium)

## Gaps & Open Questions

- [NEEDS CLARIFICATION: Which use matters first for v0.1, if any, versus "must not block"?]
- [NEEDS CLARIFICATION: Acceptable web download for the first screen, and whether a static fallback is fine while Skia loads.]
- [NEEDS CLARIFICATION: Target devices and frame-time budget.]
- [NEEDS CLARIFICATION: How faithful to the reference: "indistinguishable" or "same family"?]
- [NEEDS CLARIFICATION: Are registered scene elements content (CMS, database) or code? Who designs them?]
- [NEEDS CLARIFICATION: Do generated images count as "illustrations" (CC0) while the shader code is AGPL app code?]
- [NEEDS CLARIFICATION: Should the charcoal line style also become generated, or stay hand-drawn?]
- Not yet checked: Skia RuntimeEffect performance with many small canvases on web; react-native-skia version for SDK 57; Bousseau 2006 full text; Tyler Hobbs essay.

## Sources

- https://sudoaquarelle.com/ and https://sudoaquarelle.com/js/sim.js (host: sudoaquarelle.com, policy: confirmed-by-user)
- https://docs.expo.dev/versions/v57.0.0/sdk/skia (host: docs.expo.dev)
- https://mintlify.com/shopify/react-native-skia/getting-started/installation (host: mintlify.com)
- https://github.com/scrtwpns/mixbox and https://scrtwpns.com/mixbox/docs/ (hosts: github.com, scrtwpns.com)
- https://artis.inrialpes.fr/Publications/2006/BKTS06 (host: artis.inrialpes.fr)
- https://www.cs.nthu.edu.tw/~chunfa/pcm2004.pdf (host: cs.nthu.edu.tw)
- https://dr.ntu.edu.sg/server/api/core/bitstreams/81a53675-526a-4be8-bb80-34bea86e872b/content (host: dr.ntu.edu.sg)
- https://www.tweag.io/blog/2024-07-04-image-transition-react-native-skia (host: tweag.io) — RuntimeEffect example
- Repo: `apps/app/assets/brand/README.md`, `apps/app/package.json`, `docs/architecture/licensing.md`, `docs/architecture/decisions.md`, `docs/architecture/dependency-policy.md`, `AGENTS.md`
