# Problem Definition: Help page (features.md §5)

- **Slug**: help-page
- **Created**: 2026-10-17
- **Inputs used**: intake.md, research.md

## Problem Statement

People who sign up and want to do more than pick futures (or more than support with money) have no clear, concrete way to offer their time and skills to It. It, a solo project, has no way to learn who could help with which specific roadmap needs, or to follow up only with people who agreed to it. Today's pre-signup interests list (`ways-to-help.tsx`) records vague categories with no concrete asks and no path to follow-up. The structured data the "soon" matching feature needs is not collected.

Secondary (the "get help" meaning, assessed so it isn't lost): a person may need to understand what It stores, manage recurring support, reach a human, or read a short FAQ. None of these has a home yet. Most of them belong to other lanes (009, 010), not to §5. (Crisis resources were deferred past v0.1 by the founder on 2026-10-18.)

## Affected Users & Stakeholders

- **Users — signed-up visitors who want to contribute.** They need to see specific, honest asks they could help with, and say what they bring without writing about themselves. [research: one tester preferred pickers; demand otherwise unknown]
- **Users — any visitor needing assistance** (privacy, managing support, contact, FAQ). Served mainly by 009/010. [ASSUMPTION]
- **Stakeholder — founder.** Decides the asks, does all follow-up, and needs offers they can act on without being overwhelmed.
- **Stakeholder — future matching feature ("soon").** Needs structured background and skills (ESCO references) to exist.

## Goals

- A signed-up person can offer help toward specific, honestly labelled roadmap asks in a few taps, or skip.
- The founder receives offers they can act on, with clear consent to be contacted, and can mark them followed up.
- Answers are stored in structured form (ESCO references) so later matching isn't blocked.
- The page communicates the roadmap (what It is building and needs), in line with the product intent.
- People are told honestly what happens after they offer (no implied guaranteed response or match).
- Test whether background → suggested skills → matched asks works for people (added by founder, 2026-10-18).
- Asks are not limited to the prioritised roadmap; other things It needs help with can be added as asks (founder, 2026-10-18).

## Non-Goals

- Automated matching of people to people (that's "soon").
- Volunteer operations: scheduling, task tracking, team spaces.
- A help centre, knowledge base or ticketing system.
- Privacy page, contact address and FAQ page as part of §5. They belong to 010 (FAQ owner proposed). Crisis resources and the report button are deferred past v0.1.
- Managing or cancelling support. That belongs to 009 (Stripe portal).
- Public display of who offered what.
- Pre-signup storage of Help answers beyond what exists today.

## Success Metrics

- Share of people reaching the Help stage who submit at least one offer (baseline: unknown; stage funnel from spec 001/it-mvp).
- Share of offers that include contact consent (baseline: none).
- Share of offers the founder marks followed up within an agreed window (baseline: none). [NEEDS CLARIFICATION: target window]
- Number of roadmap asks with at least one offer (baseline: 0 asks exist).
- Qualitative: offers are specific enough that the founder can act on them (founder judgment).

## Cost of Inaction

Without a Help page, v0.1 still meets its primary goal (Support). It loses the chance to recruit helpers at launch, and the roadmap isn't communicated as a set of concrete asks. The existing interests screen keeps collecting categories nobody can act on. If structured skills aren't collected now, the "soon" matching feature starts with no data. Cost: medium for learning and recruiting; low for the primary goal.

## Open Questions

All 18 questions in `questions.md` were answered by the founder on 2026-10-18. The answers select concept Option A (full flow). What remains open is listed in `decision.md` under "Still open".
