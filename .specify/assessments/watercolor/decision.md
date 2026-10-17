# Decision: Watercolor visual language, generated in code

- **Decided**: 2026-10-17 (revised after founder answers the same day)
- **Slug**: watercolor
- **Verdict**: go — fidelity proof first (B vs E, lean E), then the winner for the v0.1 loader and palette work
- **Artifacts reviewed**: intake.md | research.md | problem.md | concept.md

## Scorecard

| Criterion | Rating | Justification |
|-----------|--------|---------------|
| Problem validity | adequate | Fixed images can't take new palettes, show waiting, or move with meaning, and each new image raises rights questions (problem.md, research.md). The founder has put the loader and palette-readiness into v0.1. |
| Evidence strength | adequate | Good technique evidence: a working browser reference, Curtis 1997 for physics, Bousseau 2006 and Montesdeoca for look-alikes, Kubelka-Munk for color, an Expo-supported renderer. Demand is the founder's, which suits a brand decision they own. Whether either generated approach looks like real watercolor is unproven — hence the proof. |
| Value vs. inaction | adequate | Without it v0.1 keeps a still orb and plain loading states; with it the mark comes alive where people wait and can take any palette later. |
| Feasibility / appetite | adequate | Proof is small; the winner is medium (weeks). E's simulation is a tool, not shipped. v0.1 has three placements to fill, all with the painted orb as fallback. |
| Strategic fit | strong | Matches It's mark and tone, moves away from AI imagery, fits licensing (own code; no sudoaquarelle or Mixbox code) and privacy. |
| Risk posture | adequate | Fidelity risk is met by the proof and the painted-orb fallback; web weight by loading after the first screen; licensing by writing from papers. Download size of painted sequences and device performance are unmeasured until the proof. |

## Verdict & Rationale

**Go, proof first.** The founder's bar is that it looks like watercolor, "same family" as the painted orb. Physics produces the marks that make watercolor read as real, so the lean is Option E: paint with It's own simulation ahead of time, color live with pigment optics. Option B (look-alike shader) stays in the proof because it is simpler if it passes. The founder picks the winner from a side-by-side; anything v0.1 needs falls back to the animated painted orb (Option A) if neither passes.

## v0.1 commitments (founder, 2026-10-17)

- Loader in three places: content loading states, the welcome mark, and between onboarding steps.
- Palette-ready: the dot takes any palette; It ships its own; no picker for people.
- Fidelity: "same family" as `reference-dot.png`.

## Required before or during specification

- **Decision record**: adding `@shopify/react-native-skia` (version via `expo install`) to the agreed stack, per AGENTS.md; note the ~2.9 MB web download and the painted-orb fallback. Needed for both B and E.
- **Licensing note**: sudoaquarelle has no license, Mixbox is CC BY-NC; neither may be copied. Record seed, simulation settings and pigments as provenance for generated CC0 illustrations.

## If go — Handoff to `/speckit-specify`

- **Problem**: It's watercolor feeling lives in a few fixed images that can't take new palettes or show what the app is doing.
- **Chosen approach**: fidelity proof comparing B and E (lean E), then the winner as a watercolor dot loader and palette system.
- **In scope (v0.1)**: the proof; the dot; loader in content loading, welcome mark and step transitions; It's palette plus palette-readiness; painted-orb fallback; reduced-motion still state; text alternatives.
- **Out of scope**: color picker; shapes beyond the dot; gathering animation; scene kit; live simulation; line figures; showing personal choices to others.
- **Success metrics**: founder judges "same family" side by side; 60 fps with ~30 small dots on target iPhone and laptop browser; first onboarding screen no slower; download added by painted sequences within a target to set.
- **Carried-forward open questions**:
  - Target devices and acceptable extra web download?
  - What It's own palette is (the orb's teal, green and yellow pigments, or the `global.css` tokens)?
  - What "between steps" looks like: a wash across the screen, or the dot moving?
  - Do generated images count as CC0 illustrations, with seed and settings as provenance?
