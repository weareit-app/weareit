# /principles: What will It do when values collide?

**Writer:** drafted from this outline; founder rewrites and approves. **Target:** about 500 words; five principles, each paired with what is true today or an honest "not yet"; two or three dilemmas.

**Guardrail (atlas):** don't say people own or govern It until arrangements actually make that true. Turn each principle into something a reader can check.

## Opening (1 paragraph)

Principles only matter when they cost something. Each one below says what It does today and where it falls short, so you can hold It to it.

## The principles (traceability table, then a short paragraph each)

| Principle                                                                         | What It does today                                                                                                  | Where it's written down                        | Known gap                                                                                                |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Your picks are yours.** What you choose before signing up stays on your device. | Picks, ratings and notes stay on the device until signup; nothing persistent links your visits before signup        | `AGENTS.md` privacy invariants; privacy page   | After signup, picks are stored by It; self-serve export and deletion aren't built (deletion is by email) |
| **We count visits, not people.**                                                  | A per-visit funnel and page views, with a visit ID kept in memory only; never your picks before signup              | Spec 013 / `visit-measurement`; privacy page   | The visit you sign up in is linked to your account, and records are kept indefinitely; say so plainly    |
| **Your attention isn't for sale.** No ads, no selling data.                       | No ads or data sales; funded by voluntary support                                                                   | Support page                                   | A promise, not yet a binding legal commitment                                                            |
| **Say what's real.** Labels separate what works now from what It could build.     | Feature fixes carry roadmap statuses; essays use status labels                                                      | `pain-explorer` spec; `/roadmap`               | Evidence levels for fixes were taken out of v0.1                                                         |
| **Open by default.**                                                              | The code is public (founder, 2026-10-19: public at launch); AGPL code, CC BY-SA writing, CC0 data and illustrations | `docs/architecture/licensing.md`; `/licensing` | Contribution terms (DCO or CLA), the App Store exception and trademark policy aren't written yet         |
| **Built toward shared ownership.**                                                | Not yet: It is one person and an LLC                                                                                | —                                              | Governance, contribution terms and trademark policy are still to be written                              |

Draft one plain paragraph per principle: what it means for the reader, the current behavior, the gap.

## When principles collide (expandable dilemmas)

1. **Should It optimize for engagement?** Today: no feeds or streaks; the explorer ends in a summary, not a loop. Tradeoff: fewer return visits means less support. Unsolved: how to measure usefulness without tracking people.
2. **Who sees my goals?** Today: nobody, before signup; after signup, picks are stored with the account (check exactly who can see them before publishing); nothing is public by default. Unsolved: how matching people with similar goals (a "soon" feature) works without exposing anyone.
3. **Can I leave with my history?** Today: by email request only. Planned: export. Unsolved: moving your history to another provider.

## What remains open

Openness vs safety (some research may be held back), coordination vs autonomy, portability vs development cost.

## Where to go next

Point out a mismatch between a principle and what the product actually does: the contact address. Link `/licensing` and `/privacy`.

**Blocks:** `table` (traceability), `expandable` ×3 (dilemmas).

**Sources to find:** none external; every "today" cell must be checked against the shipped product and the privacy page at publish time.
