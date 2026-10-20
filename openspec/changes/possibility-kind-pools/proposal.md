# Proposal

## Why

One writer drafts every fix for a pain, and a later pass tags each fix's kind. Across the latest runs for 17 pains, 44% of the 720 fixes are Tasks and 36% are Features. Schedule, Habit, Practice, Learn, Project, Group and New group share the remaining 20%, so the "ways it can be better" under each dream (features.md, personal page core rows) lean on "do this once" or "It could build this." The founder decided on 2026-10-20 to brainstorm fixes per kind, each with a method suited to that kind (`docs/research/fix-kind-ideation/research.md`), and to review dreams before any fixes are drafted. This needs to land before the pain sweep's new and reworded pains get their dreams and fixes.

## What Changes

What the founder sees and does, step by step. People using the app see nothing new from this change.

- **Dream review (new).** For each pain, a review page lists the drafted dreams, one wording each, built from the run's opened examples. The founder accepts, edits or rejects each one. Near-duplicate dreams are flagged as possible overlaps, as the pain review flags duplicates. No fixes are drafted until this review is ingested.
- **Kind plan (new, view only).** After dream review, the founder can see the plan for the pain. For each accepted dream it gives the most fixes to draft of each kind, zero allowed, with a one-line reason. For example: "Sleeping in separate rooms: Task 3, Schedule 1, Feature 1, Group 0, because few group options exist." The plan is not a gate.
- **Fix review (new).** One list per pain. Each fix appears once, with its kind, its honest status, its cited example, and the dreams it is linked to beside it. The founder accepts, edits or rejects it, and can add or remove linked dreams. Fixes that were drafted but not linked appear last, so the founder can link them to a dream. A fix that helps several dreams is decided once.
- **Pilot comparison (new, once).** On the pilot pains, the founder rates old and new output side by side and blind, on the existing ratings page. The new pipeline passes if it rates at least as well, covers more kinds, and takes no longer to review. If it passes, all 17 pains with runs are regenerated, and the old runs are kept as history.
- **Calibration ratings (changed).** Rating pages show a dream with its linked fixes in place of a card.
- **New kinds.** **Ask** (needs someone else's yes; names a decision-maker and one specific request) and **Use a resource** (an existing service: who runs it, who qualifies, how to reach it, what to bring). **Leave** (stop being part of something, with nothing lined up to replace it) and **Switch** (replace something with a better version of the same thing) are two separate trial kinds in the pilot only. The pilot decides whether each one stays. There is no Give kind; mutual aid stays under Group and New group.
- **Removed.** Cards go away (**BREAKING** for run files and the helper). The "at least 3 features per pain" minimum goes. The single writer and the kind-tagging pass after it are replaced.

Out of scope:
- Adding the new kinds to the app. The app shows four kinds today (Task, Habit, Takes a group, Feature). That gets its own change, after the pilot settles the list.
- Importing generated content into the editor (the existing `possibility-generator` divergence).
- Building explicit paths. The assembler only notes chains of fixes as path candidates.
- Starting the pilot. It waits until the pain-catalog change (PR #27) and the full pain sweep are merged. The founder picks the pilot pains then.

Must leave room for (features.md Stages):
- **Explicit paths (? soon).** Path candidates are recorded with ordered fix IDs that already exist.
- **Evidence tags on ways (soon).** Every fix keeps its cited example and limits. Links between a fix and a dream stay separate records, so link-level evidence can be added later.
- **Review queue for contributions (core).** Generated fixes use the same fix shape and links as contributed ways, so both queues can converge.

## Capabilities

### New Capabilities
None.

### Modified Capabilities
- `possibility-generator`:
  - runs record dreams, fixes and fix–dream links in place of cards;
  - the founder reviews dreams before fixes are drafted;
  - a kind plan per pain sets ceilings;
  - a pass drafts fixes that serve several dreams, then one brief runs per kind, with fields for that kind's method;
  - each fix gets a cheap screen, the assembler links fixes to dreams, and the judge panel scores each dream with its linked fixes;
  - the founder reviews each fix once on a list;
  - the kind list gains Ask and Use a resource, with Leave and Switch on trial;
  - the coverage rules drop the minimum number of features;
  - a blind pilot comparison gates the switch.

## Impact

- `tools/possibilities/`:
  - `cards.py` gains subcommands for dream review, plans, pools, assembly, fix review, and comparison, and its validation, lint, judge input, consensus and selection change shape;
  - its tests change with it;
  - `data-model.md`, `README.md`, briefs (new: dreams, planner, shared fixes, one per kind, screen, assembler; `writer.md`, `classify-kinds.md` and `feature-pitch.md` retired or folded in), `config/rubric.md`, and a review page template.
- `.claude/skills/possibilities-*` (and their Codex copies): generate becomes a staged flow with founder stops.
- `docs/style/copy-style-guide.md`: the "Kinds of fixes" table gains Ask (`message-circle-question`), Use a resource (`life-buoy`), and the trial kinds Leave (`door-open`) and Switch (`arrow-left-right`).
- `docs/architecture/decisions.md`: updated 2026-10-20 ("Generated possibility content").
- Depends on the `pain-catalog` change. This change's "Runs per pain" delta builds on that change's version, so `pain-catalog` must be archived first.
- No app, API or database change.

## Open questions

1. Which pains is the pilot run on? The founder picks them once the pain sweep is merged.

Answered by the founder on 2026-10-20:
- **Finalists and audit samples are dropped.** The founder reviews every dream and every fix, so the judges' ranking only orders the fix review list.
- **Names and icons:** Ask (`message-circle-question`) and Use a resource (`life-buoy`). "Leave or switch" was two kinds in one, so it became the trial kinds Leave (`door-open`) and Switch (`arrow-left-right`).
- **More than 5 fixes:** the assembler proposes 2–5 fixes per dream, but the founder's review may link more.
- **Led by It** means a dream with at least one Feature linked, anywhere in its fixes.
