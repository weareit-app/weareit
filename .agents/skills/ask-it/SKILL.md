---
name: ask-it
description: Ask which skill or flow fits your situation. The one list of this repo's skills and when to use each.
disable-model-invocation: true
---

# Ask It

The founder asked which skill or flow fits. Answer from this map, then name the exact command to type (Claude Code: `/name`; Codex: `$name`; OpenSpec in Claude Code: `/opsx:<verb>`).

The summaries here are for routing only. Before you state what a skill does, or recommend skipping a step, read that skill's `SKILL.md`. Where a vendored skill's text and this repo's docs differ (for example, it writes to `docs/adr/`), the repo's docs win: decision records live in `docs/architecture/decisions.md`.

## Main flow: a change to what the app does

The steps, their order, and when to skip OpenSpec (developer tooling) are in `docs/agents/openspec.md`; read it before routing here. The skills on that path:

- **`/grill-with-docs`** sharpens the idea by interview and records terms in `GLOSSARY.md`. **`/grill-me`** is the same interview with no paper trail, for work with no repo under it. Both run **`/grilling`**, the interview primitive.
- **`/opsx:explore`** (`$openspec-explore`) is a thinking partner before or during a change, when the founder wants to think rather than be interviewed.
- **`/opsx:propose`** (`$openspec-propose`) writes the change: proposal, spec deltas, design, and `tasks.md`.
- **`/opsx:update`** (`$openspec-update-change`) revises a change's plan and keeps its artifacts coherent.
- **`/opsx:apply`** (`$openspec-apply-change`) drives the build from `tasks.md`, the only progress tracker. **`/implement`** or **`/tdd`** does the work; **`/code-review`** reviews it against `CODING_STANDARDS.md` and the spec; **`/pr`** shapes the PR body.
- **`/to-tickets`** is only for handing a task group to a parallel session or person; its issue links the tasks in `tasks.md`.
- **`/opsx:sync`** (`$openspec-sync-specs`) merges a change's spec deltas into `openspec/specs/` early; **`/opsx:archive`** (`$openspec-archive-change`) closes a shipped change and checks every lasting decision is in `decisions.md`.
- **`/retro`** closes the loop after a build: mechanical mistakes become checks, judgement calls become `CODING_STANDARDS.md` rules.

## On-ramps

- **A question that needs a runnable answer** (a state model, a UI to see): **`/prototype`**, with **`/handoff`** to move to and from its own directory.
- **Something broken, flaky, or slow**: **`/diagnosing-bugs`**, then `/retro` in the same session.
- **Raw issues and requests from others**: **`/triage`**. Tickets `/to-tickets` wrote are already agent-ready.
- **Work too big and foggy for one session**: **`/wayfinder`** charts decision tickets; when the fog clears, it hands off to `/opsx:propose`.

## Codebase health

- **`/improve-codebase-architecture`** surveys for deepening opportunities; the one picked goes into the main flow at `/grill-with-docs`.
- **`/codebase-design`** is the deep-module vocabulary for shaping a module's interface.
- **`/domain-modeling`** sharpens domain terms in `GLOSSARY.md` and records decisions in `decisions.md`.

## Content pipelines

Each drives a Python tool; read the tool's README first.

- Pains (`tools/pains/README.md`): **`/pains-discover`** sweeps outside sources for new pains, **`/pains-refine`** proposes sharper wording and group moves, **`/pains-review`** builds the founder's review page, and **`/pains-ingest`** applies the decisions to the catalog.
- Possibilities (`tools/possibilities/README.md`): **`/possibilities-generate`** writes cards, **`/possibilities-judge`** judges and selects, **`/possibilities-repair`** fixes a run, and **`/possibilities-calibrate`** runs the founder's rating rounds.

## Standalone

- **`/research`** sends reading to a background agent that leaves a cited Markdown file; take it into `/grill-with-docs`.
- **`/to-questionnaire`** writes questions for someone else when the answer is in their head.
- **`/wizard`** scripts steps only a human can take (dashboards, secrets, one-off cutovers).
- **`/wait-what`** re-pitches a message that didn't land, in plain words.
- **`/teach`** runs a multi-session lesson in the current folder.
- **`/expo-overview`** routes Expo work (routing, native UI, animation, data fetching, dev builds, SDK upgrades, App Store releases) to Expo's other vendored skills, which agents also load on their own; `AGENTS.md` says which of its suggestions to pass over.
- **`/writing-for-agents`** is the reference for skills, `AGENTS.md`, and docs agents read.
- **`/setup-matt-pocock-skills`** has already been run here (`docs/agents/issue-tracker.md`, `triage-labels.md`, `domain.md`); rerun it only to change those.
- **`/ask-it`** is this map.
