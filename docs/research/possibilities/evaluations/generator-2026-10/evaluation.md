# Generator evaluation (calibration and fresh-pain audit complete)

**Numeric gate: passes. Readiness to scale: not yet.** Every rating check clears its bar, but the founder's audit notes show structural problems that ratings don't measure. The founder: "Overall, though, this is higher quality than I expected… don't overassume that because I 'loved' a lot of things that the pipeline is working perfectly now. It's not."

## Ratings

| Round | Cards | Love | Keep | Kill | Founder time |
| --- | --- | --- | --- | --- | --- |
| Calibration, new cards (8 known pains, blind) | 24 | 24 | 0 | 0 | 21 min (40 cards) |
| Calibration, old packet | 16 | 3 | 4 | 9 | |
| Audit, fresh-pain finalists | 40 | 37 | 3 | 0 | 48 min (56 cards) |
| Audit, lower-ranked samples | 16 | 14 | 1 | 1 | |

Gate checks (FR-021): new Love + Keep 100%, new Love 100%, fresh finalists Love + Keep 100%, and judge top-3 agreement 8 of 8. **All four pass.**

**The judges aren't separating good from weaker cards yet.** Lower-ranked samples were loved as often as finalists (14 of 16 against 37 of 40). Either the pool is uniformly strong, or the founder's ratings at this stage reward something the judges don't rank on. In both cases, three-judge ranking currently adds cost without measurably improving what the founder sees.

## What the founder found (structural problems)

1. **Kinds are too coarse, and Habit is mostly wrong.** Of the 20 fixes labeled Habit in the audit, almost none are habits as the founder reads them. They are settings changed once (7), recurring schedules (6), practices or skills learned over time (4), or choices (3). "We're learning that our definitions of fixes are not enough because there are many ways to accomplish something." "Ask about their experience, then share yours isn't a habit, nor a task… We need to figure this out."
2. **"Learn how…", "Read…", "Know…" are not actions.** "Great, I learned how someone else did it. Now how do I do it!?" (a48). Information belongs in the fix text. The fix itself should be the thing the person does.
3. **"Ask whether…" sometimes means It should ask.** "Ask whether the problem is the work itself or how it is managed" is a clarifying follow-up It could ask later (a24). It is not a task for the user.
4. **Dreams are sometimes actions, not outcomes.** "*Telling my legislators I want limits on addictive app design* is not quite an outcome, whereas *I get limits on addictive app design* would be." (a04)
5. **Some fixes combine two ideas.** These should be split, one idea per fix.
6. **Topic drift.** *Stopping an argument before it turns into a fight* got Kill: "I don't think this is about polarization at all." (a39) Writers need a short scope note per pain saying what it means and what it doesn't.
7. **Features are under-generated, and some don't read as features.** The founder named 11 more features on audited cards (`founder-feature-ideas.md`). They form recurring patterns, now drafted in `../../generator/feature-patterns.md`. "The features need to be reworded to sound like actual features." (a15)

## Proposed pipeline changes (pending founder decisions)

- A richer fix taxonomy (see the decision questions in the session).
- Lint and judge checks that ratings can't replace:
  - dream titles that read as actions;
  - "Learn/Read/Know" fix titles;
  - one idea per fix;
  - a per-pain scope check.
- A feature-discovery pass on every card using the pattern library. Feature titles name the capability.
- Spend less on ranking (fewer judges, no round-robin) and more on structure. Add structural measures to the gate: kind accuracy, outcome framing, on-topic rate, features per card.

## Approximate cost so far

About 12M agent tokens across writing, two judging rounds and repair for 16 pains. These are rough estimates from agent usage reports.
