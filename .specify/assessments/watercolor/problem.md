# Problem Definition: Watercolor visual language, generated in code

- **Slug**: watercolor
- **Created**: 2026-10-17
- **Inputs used**: intake.md, research.md

## Problem Statement

It's feeling — hopeful, dreamlike, a shared picture book — lives today in a handful of fixed watercolor images. Those images cannot change with a person's choices or chosen colors, cannot move to show what is happening (waiting, coming together, becoming something), and each new one needs new painted or AI-generated art with unclear rights. As It grows past onboarding, the gap between what It wants to show and what fixed images can show will widen.

## Affected Users & Stakeholders

- **Users**: people going through onboarding on web and iOS — they meet the watercolor mark first and see watercolor scenes on the futures page. [NEEDS CLARIFICATION: no research yet on how people respond to these visuals.]
- **Users (later)**: signed-in people who could see their own choices reflected in a picture, choose colors, and see shared progress. [NEEDS CLARIFICATION: theming and shared views are not in v0.1 features.]
- **Stakeholders**: the founder — owns the brand and tone, decides scope and stack changes. Future contributors and illustrators — would have to work within whatever system exists. The licensing policy — illustrations are CC0 with provenance; app code is AGPL.

## Goals

- One recognizable watercolor language that feels like It's existing mark, and that It owns outright.
- Visuals that can respond: to a person's choices, to colors they choose, and to what the app is doing (loading, gathering, becoming).
- New pictures without commissioning or generating new raster art each time.
- Works on web and iOS without making the app feel slow or heavy.
- Meaning never depends on the image alone: reduced motion is respected and images have text alternatives.

## Non-Goals

- A painting or drawing tool for people.
- Physically exact watercolor everywhere.
- Replacing the charcoal line figures in this assessment.
- Showing anyone's personal choices to other people.
- A color picker for people in v0.1.

## Success Metrics

- **Fidelity (qualitative):** the founder, comparing a generated dot with `reference-dot.png` side by side, judges it "the same family". (baseline: none generated)
- **Smoothness:** generated visuals hold 60 fps on [NEEDS CLARIFICATION: target iPhone] and a mid-range laptop browser, including ~30 small dots at once. (baseline: unknown)
- **Web weight:** first onboarding screen shows within today's load time; any extra download loads after it. (baseline: current welcome screen load time, unmeasured)
- **Reach:** number of places in the app that use a generated visual instead of a fixed image. (baseline: 0)
- **Art cost:** a new scene or color variant can be made by changing data, not by producing a new image. (baseline: every variant needs a new image)

## Cost of Inaction

It keeps using its seven or so watercolor JPEGs. Onboarding still works. But themes, choice-driven pictures and meaningful animations can't happen, each new screen needs new art with provenance to sort out, and AI-generated imagery stays the default way to get more — which the founder wants to move away from.

## Founder Answers (2026-10-17)

- **It must look like watercolor.** That is the whole point; a generic "watercolor-ish" effect fails the brief.
- **Fidelity:** "same family" as the painted orb — clearly the same style and feel, not a copy.
- **Timing:** part of v0.1.
- **First uses:** the loader and theming.
- **Loader placements in v0.1:** content loading states, the welcome mark (the orb gently alive), and transitions between onboarding steps.
- **Theming in v0.1:** the dot can take any palette and It uses its own; people cannot choose colors yet.
- **Approach:** prove it first — compare a look-alike shader with a physics-painted dot side by side before choosing.

## Open Questions

- [NEEDS CLARIFICATION: Target devices and acceptable extra web download.]
- [NEEDS CLARIFICATION: Are scene elements content (CMS, database, linked to Things) or code?]
- [NEEDS CLARIFICATION: Do generated images count as CC0 illustrations?]
- [NEEDS CLARIFICATION: Should the line-figure style eventually join the system?]
