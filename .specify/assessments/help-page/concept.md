# Concept: Help page (features.md §5)

- **Slug**: help-page
- **Created**: 2026-10-17
- **Recommended option**: B — Roadmap asks first, structured background, no matcher (pending founder answers in `questions.md`)

The two meanings of "Help" are shaped separately. Part 1 covers §5 as written (offering help to It). Part 2 says where each "get help" need should live, so §5 doesn't swallow it.

## Part 1 — "What could you help make possible?" (offering help)

### Option A — Founder's direction in full: background → ESCO skills → matched asks
- **Sketch**: After Support (or after skipping it), the person picks their background from ESCO occupations (education too, if decided). They see suggested skills from ESCO's occupation-to-skill links and confirm or adjust them. Then they see the curated roadmap asks that match those skills, and tick the ones they'd help with. Contact consent, a "what happens next" note, and skip at every step. Admin lists offers and marks them followed up.
- **Appetite**: medium (1–2 weeks with ESCO cleanup). This is over the v0.1 one-week budget alongside the other core screens.
- **Trade-offs**: Wins: the full flow the founder wants, with rich structured data for "soon" matching. Sacrifices: time, and ESCO cleanup and matching quality become launch risks. With 5–15 asks, matching mostly hides asks the person might have liked.
- **Rabbit holes**: ESCO volume (dozens of skills per occupation) and cleanup; "modified ESCO" licence/attribution; education taxonomy (ESCO has none; ISCED is another list); the skill-to-ask mapping, which the founder must hand-author per ask; empty matches.

### Option B — Roadmap asks first, structured background, no matcher (recommended)
- **Sketch**: The page opens with the founder's 5–15 curated roadmap asks, each honestly labelled (what it is, rough time, status). The person ticks the ones they'd help with. Below that, an optional, short "what do you bring?" picks from ESCO occupations and (optionally) a capped set of essential skills, stored as ESCO references. There's a separate unticked "It may contact me about these" consent, a plain note on what happens next, and skip. Admin lists offers with consent and marks them followed up, plus counts per ask. Matching is deferred. The data is structured so it can be added later.
- **Appetite**: small (2–4 days, including writing the asks).
- **Trade-offs**: Wins: communicates the roadmap, collects actionable offers, meets the thing-type-relation rule (ESCO references), doesn't block "soon" matching, and fits the it-mvp cut line (all asks shown, skills kept). Sacrifices: no personalised "matched to you" moment. Background and skills are collected without being used visibly yet, so explain why or keep them optional.
- **Rabbit holes**: writing good asks (founder time); ESCO picker UX (search vs list); contact consent wording against the signup opt-in (008).

### Option C — Evolve the existing interests screen
- **Sketch**: Keep `ways-to-help.tsx` and its five categories, move it after signup, and add contact consent and an admin follow-up list. No ESCO, no asks.
- **Appetite**: small (1–2 days).
- **Trade-offs**: Wins: nearly built; the cheapest option. Sacrifices: features.md drops generic categories in favour of curated asks. Free categories don't satisfy "Help answers as ESCO references" (decisions.md) or the "soon" matching guardrail. Offers stay vague.
- **Rabbit holes**: few. The main risk is having to rebuild it later.

### Option D — Merge into Support It as "Other ways to help"
- **Sketch**: No separate page. The Support page (009) gets a section under the payment form, or on skip, listing the curated asks with tick boxes and contact consent.
- **Appetite**: small (2–3 days), but it lands inside lane 009.
- **Trade-offs**: Wins: one fewer screen and one fewer funnel step, and it catches people who skip paying. Sacrifices: clutters the page whose primary goal is Support and risks pulling attention from the form. Mixes "money" and "time" asks; the founder's letter must frame both. Couples 009's schedule to asks content.
- **Rabbit holes**: layout and priority on Support; funnel-stage definitions.

### Option E — Drop from v0.1 (kill)
- **Sketch**: Remove §5 from v0.1. At most, one line on the Support page or after signup ("Want to help build It? Write to …"). Retire the pre-signup interests screen, or leave it as is. Revisit after launch with real visitors.
- **Appetite**: none (hours).
- **Trade-offs**: Wins: frees days for Support, content and safety. Avoids collecting offers with no capacity to follow up. Sacrifices: no structured helper data for "soon" matching, a weaker roadmap message, and it reverses the founder's 2026-10-16 position that Help stays in v0.1.
- **Rabbit holes**: none.

## Part 2 — "Getting help" needs (where each belongs)

| Need | Candidate form | Proposed home | Note |
|---|---|---|---|
| Crisis / abuse resources, "not monitored for emergencies" | Static page reachable without an account | **010 safety floor** | Don't label it with the same "Help" word as §5 in navigation. See Q18. |
| Report a public artifact or invite | Report button/route | **010** | Public artifacts are "soon"; invites are optional. |
| What It stores and why (pre-signup on device, Help answers on account) | Contextual explanations and a privacy page | **010 privacy page**, plus inline copy in each spec | Help answers need a one-line inline note in §5 itself. |
| Manage or cancel recurring support | Stripe portal link | **009** | Already wired: `support-it.tsx:118`. |
| Contact a human / give feedback | Single contact address or a small feedback form | Shared footer; owner TBD (Q12) | A form adds a data store and spam handling; a `mailto` is near-free. |
| FAQ | Static Q&A page | **Not in v0.1** (recommended) | No evidence of need yet. Contextual copy covers the known questions. |
| Contextual help (tooltips, "why we ask") | Inline copy | Each spec | No separate feature. |

**Option F — Make §5 a "get help" page instead** (static FAQ + contact + crisis links + privacy explainer). Appetite: small. It reinterprets the founder's §5, duplicates 009 and 010, and drops the contribution flow entirely. Not recommended unless the founder answers Q1 with "get help".

## Recommendation

**Option B for §5, with Part 2 routed to 009/010 and a minimal contact link.** B delivers what §5 is for (concrete asks, roadmap communication, actionable offers) inside a small appetite. It satisfies the binding rule that Help answers are ESCO references, and it doesn't block "soon" matching. It also matches the it-mvp cut line, which already accepts "show all asks" over a matcher. Option A's matcher adds little value with 5–15 asks and carries the ESCO risk. Option C conflicts with features.md and decisions.md. Option D endangers the primary goal's page. Option E is the right fallback if the founder can't commit to writing asks or to follow-up (Q4, Q8). In that case, kill §5 for v0.1 rather than ship an offer form nobody answers.

## Out of Scope (for the recommended option)

- Automated matching; ranking asks by skills.
- Education taxonomy beyond ESCO occupations, unless Q5 says otherwise.
- Free-text "about me" fields (and with them, the keyword-triggered crisis prompt the architecture doc ties to free text).
- Public counts or names of helpers.
- Volunteer operations (tasks, scheduling, messaging inside It).
- FAQ page; ticketing.
- Crisis/report/privacy pages (010) and support management (009).
- Pre-signup Help answers (the existing on-device `helpInterests` is migrated or retired per Q10).

## Assumptions to Validate

- The founder can write 5–15 honest roadmap asks before launch, and keep them current.
- The founder can follow up on consented offers within a stated window, or the page says plainly that follow-up isn't guaranteed.
- A small ESCO subset (occupations, essential skills, capped) is enough, and its licence allows the planned use with attribution.
- People will tick asks without a "matched to you" step.
- Help after Support doesn't starve Help of visitors. The funnel will show this.
- The roadmap-ask content type fits the existing CMS without a new workflow (decisions.md: no general page builder).
