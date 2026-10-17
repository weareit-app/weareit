# Concept: It MVP (v0.1)

- **Slug**: it-mvp
- **Created**: 2026-10-16
- **Recommended option**: B — Full v0.1, built in launch order with cut lines

Inputs: `problem.md` (primary goal: people support It; general public, about 100–1,000 people in month one; web only; one-week budget, founder's judgment), `research.md`, founder answers. Founder decisions that bind every option: signup required after the two pages (review line at about 50% drop-off), email code and password, embedded Stripe form for once / monthly / yearly support, all 30 Tier 1 pains in full with AI-drafted ideas that the founder approves, picks stay on device before signup.

## Options

### Option A — Everything in features.md, all at once
- **Sketch**: Build every core and optional item in `features.md` in parallel: the personal and societal pages with all 30 pains in full, signup, Support with the embedded form plus the comparison sidebar and in-app management, the Help page (background → ESCO-suggested skills → matched roadmap asks), invitations, and the full admin view. Launch when everything is done.
- **Appetite**: medium (weeks). This is more than the one-week budget.
- **Trade-offs**: Wins: the complete picture on day one. Sacrifices: launch date and focus. Everything finishes late together, and nothing ships if one piece stalls. Support, the primary goal, waits on the least important parts.
- **Rabbit holes**: comparison sidebar (sourced, dated numbers); in-app subscription management; invitations; all the rabbit holes listed under B.

### Option B — Full v0.1, built in launch order with cut lines (recommended)
- **Sketch**: The same core scope, built and made launchable in the order a visitor meets it: (1) personal and societal pages with content, honest labels, "I'd use this" marks and the stage funnel; (2) signup by email code or password, saving picks; (3) Support with the founder's letter and the embedded Stripe form (once, monthly, yearly) plus the Stripe portal link; (4) Help: pick your background (occupations, education or work), get skills suggested automatically from ESCO's occupation-to-skill links (many-to-many) to confirm or adjust, as in Homefront, and see the roadmap items you've chosen that match, then tick the ones you'd help with; (5) a small admin view with totals, support payments and help offers to mark as followed up. Content drafting and approval run alongside the build from day one. Optional items come in only after all five work end to end.
- **Appetite**: small to medium. It is planned as one week (founder's judgment), with a fixed cut order if it runs over.
- **Trade-offs**: Wins: Support (the primary goal) is usable as early as possible, every day ends with something launchable, and research's concern about scope versus time is handled by cutting rather than slipping. Sacrifices: optional extras probably miss v0.1, and the Help page may launch with simpler matching than intended.
- **Cut order if late** (first to go first): comparison sidebar → managing support inside It (the portal link covers it) → invitations → admin screens (use database queries instead) → Help matching (show all roadmap asks instead of matched ones; keep suggested skills). **Never cut**: honesty labels, privacy promises, the embedded Support form, "I'd use this" marks, the stage funnel, content quality.
- **Rabbit holes**:
  - **Content approval**: about 200–250 ideas plus extra dreams for 29 pains. Founder review time is the likeliest bottleneck. Approve in batches, and publish pains as they're ready.
  - **Embedded recurring payments**: monthly and yearly need subscriptions, webhooks, failed payments and cancellation. Use the Stripe portal for changes; don't build it in It.
  - **ESCO cleanup**: the full list has thousands of skills. Clean it only enough for the suggestions to feel right, and reuse Homefront's approach rather than inventing a new one.
  - **Skill suggestions**: these come straight from ESCO's occupation-to-skill links, with no AI model. The risk is volume: one occupation can link to dozens of skills, so the page needs a sensible cap or order (for example, ESCO's essential skills first).
  - **Roadmap asks**: someone has to write them. The founder curates a short list (about 5–15) for v0.1.
  - **CMS creep**: use what exists; add only what's needed to approve ideas and roadmap asks.
  - **NativeWind v5 is a pre-release**: re-check before launch, per decisions.md.

### Option C — Smallest thing that could work
- **Sketch**: Launch only the personal and societal pages, signup and Support. The Help page becomes a short "how could you help?" with a few checkboxes and an opt-in, and admin is database queries. The ESCO Help flow follows in a second release.
- **Appetite**: small (days).
- **Trade-offs**: Wins: fastest route to Support, the primary goal, and the least risk to the one-week budget. Sacrifices: the Help flow the founder wants and believes is easy (proven in Homefront), and the chance to recruit helpers with clear asks at launch.
- **Rabbit holes**: content approval and embedded recurring payments, as in B.

*Do nothing* is not a real option: the founder will continue regardless, and the cost of inaction (no income, no evidence) is the problem itself.

## Recommendation

**Option B.** It keeps the founder's decided scope, including the ESCO Help flow, but builds in the order a visitor meets it. Support (the primary goal) is ready early, and the "I'd use this" marks and stage funnel (the main learning signals) are never cut. It answers research's main worry, that the scope is bigger than one week, with a fixed cut order instead of a later launch. Option C becomes the fallback if day 3–4 shows content approval or payments taking most of the week.

## Out of Scope (for the recommended option)

- Native iOS release and iOS payments (web only; keep the app working on iOS in development).
- Personal story, sharing, matching people with people, starting from a dream (all "soon").
- Invitations, comparison sidebar and in-app support management, unless the five core steps are done (optional; first to cut).
- AI-generated content published without founder approval.
- Tracking individual picks before signup, or any stable anonymous ID.
- A general page builder or workflow engine in the CMS.
- "Donation" wording, charity or tax-deductible claims.

## Assumptions to Validate

- One week is enough for the five core steps plus content (founder's judgment; research flagged it as a risk). Check at the midpoint of the week.
- The founder can approve about 200–250 AI-drafted ideas within the week without the quality slipping.
- Homefront's background → skills approach transfers to It with modest ESCO cleanup.
- ESCO and O*NET are CC BY 4.0 (founder-stated); the attribution wording still needs adding.
- Skill suggestions come from ESCO's many-to-many occupation-to-skill links (founder, 2026-10-16). No outside AI service is involved; what needs checking is that the suggestion list is short enough to confirm comfortably.
- Required signup does not lose so many people that few reach Support (review line: about 50% drop-off at the gate).
- Stripe's embedded form handles once, monthly and yearly support in one form, with the portal covering changes and cancellation; the Stripe account is already verified (founder).
- 5–15 founder-curated roadmap asks are enough for the Help page to feel concrete.
