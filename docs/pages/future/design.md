# /future: design

How the page could look and behave, built only from the named blocks in the `public-pages` change (`openspec/changes/public-pages/design.md`, decision 2). Nothing here needs a new component.

## Start small (first version)

- The essay from `outline.md`, about 500 words, as `packages/content/essays/future/essay.md`.
- Three `expandable` sections, one per horizon. The heading shows the horizon's name and its status label in words; collapsed, each shows one line. Open, each shows "What it would look like", "What would have to be true" and "What could go wrong".
- One `diagram` (Mermaid, left to right): built → prototype → unresolved research → speculative, with a written description as the scripts-off fallback.
- No illustration, chart, external forecast or interest vote. One next action: the contact address.

That matches the atlas rule for a first version: one distinctive visual (the diagram), one evidence element (the status labels on the chain, each traceable to `/roadmap` or the code), one real next action.

## The five atlas dimensions, made concrete

| Dimension | Atlas sketch | Concrete for It now | Later |
| --- | --- | --- | --- |
| **More interactive** | Explore three horizons or pick a prerequisite; each opens obstacles and dependencies | Three `expandable` horizons. In the diagram, each box names the horizon or page that depends on it, as ordinary text links (no clickable graph) | Pick a prerequisite ("If independent systems could cooperate reliably…") to highlight what depends on it; would need a new block type, which isn't planned |
| **More beautiful** | Branching illustrated futures, not a rocketship | Nothing in the first version; the diagram carries the branching | The watercolor mark branching into three soft paths in different palettes, with no people, cities or vehicles that suggest one way of living. Disclosed as AI-generated, as `/ai` requires |
| **More meaningful** | Conditional scenarios, failure modes, governance, chance it doesn't work | Every horizon has a "What could go wrong" list, including "it doesn't work"; the closing section names a signal that would change course | A dated "what changed our mind" entry in the change list when a horizon is revised |
| **Participatory / MVP link** | Ask what readers want or fear; route interest to roadmap items and expertise to /help | One line at the end: what would you want or fear from this? → contact address. Links to `/roadmap` items named in horizon 1 | The `/help` link with governance, human-computer interaction, economics or infrastructure preselected, once `help-build-it` ships; reuse roadmap interest, not a new vote |
| **More dataful** | Visible prerequisite chain; external forecasts with who, when, assumptions | The chain diagram with a status on every box, each checked against the release at publish time | `evidence` cards for at most two external forecasts, each beside a card on how often long-range forecasts miss (`research.md`) |

## Blocks

| Block | Count | Data file | Notes |
| --- | --- | --- | --- |
| `expandable` | 3 | `horizon-1`, `horizon-2`, `horizon-3` | Numbered IDs so renaming a horizon (Q3) doesn't touch file names. Status label in the title text, never color alone |
| `diagram` | 1 | `what-first.yaml` (Mermaid plus description) | Description must list every box and its status |
| `evidence` | none first, at most two later (Q9) | `forecast-<name>.yaml` | Claim, who, date, assumptions, limitation |

## Status labels used

From the essay spec's list: **planned engineering** (horizon 1 items already on `/roadmap`), **working hypothesis** (that people will use and support It), **speculative direction** (horizons 2 and 3), **open question** (the research boxes). The essay spec has no label for something already built; the "Built" box states facts checked against the release, and Q11 asks whether to show the roadmap's "Shipped" status there.

## Not on this page

- Dates, timelines or probabilities for any horizon.
- A feature list; that's `/roadmap`.
- How composition works technically; that's `/technology`.
- Pain → future → fix examples; that's `/possibility`.
- New interaction components, a second explorer, or a live data feed.

## Dependencies

- `public-pages` lands the essay pipeline and the `expandable` and `diagram` blocks (issue #39 and its build tickets).
- `/roadmap`, `/technology`, `/possibility` and `/research` should exist before `/future` links to them, or the links are left out.
