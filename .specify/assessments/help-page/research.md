# Idea Research: Help page (features.md §5)

- **Slug**: help-page
- **Created**: 2026-10-17
- **Evidence confidence (overall)**: low (internal records are clear; user evidence is almost absent)

No web fetches were made in this pass. External findings are carried over from `.specify/assessments/it-mvp/research.md`, which cites them.

## Users & Demand

- **No observed demand for either meaning of Help.** There are no interviews, support tickets, analytics or waitlist data on people wanting to offer help or needing help content. — [source: `.specify/assessments/it-mvp/decision.md` scorecard, "Evidence strength: weak"] (confidence: high that the evidence is absent)
- **One tester preferred picking from options over writing about herself.** This supports structured pickers over free text for "say your background". — [source: it-mvp research.md, founder-reported, n=1] (confidence: low)
- **The founder wants this flow and has built it before (Homefront).** "Background → suggested skills → asks" is the founder's stated direction and is believed to be easy. — [source: it-mvp problem.md open questions; features.md §5] (confidence: medium for intent, low for fit with It)
- **Helpers are a named stakeholder:** "future supporters and helpers ... need honest information about what is real today and what is only planned." — [source: it-mvp problem.md] (confidence: medium)

## Prior Art

- **Internal: `ways-to-help.tsx`.** Five fixed interest categories, pre-signup, on-device, saved with the draft at the email gate. No asks, no skills, no follow-up path. It already recruits "invite", "check a source" and "give feedback" as tasks with time estimates. — [source: repo]
- **Internal: it-mvp Option B.** The hand-off covers background, ESCO skill suggestions (essential skills first, capped), about 5–15 founder-curated roadmap asks, tick what you'd help with, skip, and ESCO/O*NET CC BY 4.0 attribution. Its cut line is to show all asks instead of matched asks while keeping suggested skills. Option C (smallest) is "a few checkboxes and an opt-in". — [source: `.specify/assessments/it-mvp/concept.md`, `decision.md`]
- **Internal: `docs/spec/pieces.yaml`.** The `offer` piece (state: free text, tags, availability, preferred contact, follow-up status new/contacted/matched/closed; "never shown as matched until a human matched it") and `sync-contact-requires-consent` ("Contact without consent is impossible through the app"). Both are `mvp: true`. — [source: repo, from the unchecked it-spec draft; evidence, not requirement]
- **Internal: thing-type-relation decision.** v0.1 must "store Help answers as ESCO references". — [source: `docs/architecture/decisions.md`] (binding)
- **External: volunteer-skills matching.** DemocracyLab found the main barrier was the weak link between projects and skilled volunteers, and that onboarding a volunteer can cost more than they give unless the project is organised first. Code for Canada uses a staged marketplace: post challenges, volunteers apply, the organisation chooses. — [source: it-mvp research.md, civictech.guide / codefor.ca] (confidence: medium)
- **"Get help" meaning, internal.** The unchecked architecture source asks for a "crisis / abuse floor": static crisis/help resources reachable without an account, a "not monitored for emergencies" notice, and a report route. — [source: `docs/source/IT_MVP_IMPLEMENTATION_ARCHITECTURE_v0.2.md` lines 133, 1545–1550; evidence only] This was the 010 safety-floor lane. As of 2026-10-18, crisis resources and reporting are planned for after v0.1, and 010 covers the privacy page only.
- **"Get help" meaning, roadmap.** `docs/roadmap/mvp.md` lists "safety/reporting floor" under Next slices. No FAQ or contact page appears anywhere in features.md or the roadmap. — [source: repo]

## Market & Context

- What people do today to offer help to early projects: email the founder, join a Discord/Slack, or use volunteer marketplaces. — [ASSUMPTION] (confidence: low)
- It is a one-person project under near-term financial pressure, and Support is the primary v0.1 goal. Help competes for the same week. — [source: it-mvp problem.md, concept.md]

## Data & Constraints

- **Privacy.** Help comes after signup (signup is required after pages 1–2), so answers can be stored on the account. Background and skills are personal data. They must never appear in public artifacts by default, and admin totals must not expose individuals beyond what a consented follow-up needs. — [source: AGENTS.md privacy invariants]
- **Must not block "soon" matching:** answers must use structured lists (job titles, skills), not just free text. — [source: features.md stages table]
- **ESCO.** Available as CSV/RDF and an API. Europa content defaults to CC BY 4.0, but parts draw on O*NET with its own terms, and the ESCO-specific licence page has not been read. One occupation can link to dozens of skills. — [source: it-mvp research.md] (confidence: medium)
- **Honest status.** Roadmap asks are "proposed It features" or tasks and must be labelled as such. An offer must not look "matched" before a human matched it. — [source: constitution III; pieces.yaml offer]
- **Consent.** The signup email opt-in (features §3, spec 008) is for emails from It. Whether contacting someone about their help offer needs a separate consent is undecided. — [source: features.md §3; pieces.yaml sync-contact-requires-consent]
- **Domain packages stay free of UI/provider imports.** ESCO data would be content or reference data, not app code. — [source: AGENTS.md]

## Evidence Against the Idea

- **Follow-up capacity is the classic failure.** Offers that nobody follows up hurt trust more than having no form (DemocracyLab). A solo founder whose priority is launch and Support may not have time to follow up. — [source: it-mvp research.md]
- **Scope is already larger than the one-week appetite**, and Help is the least defined of the core screens. The ESCO cleanup and matching are the riskiest part. — [source: it-mvp research.md "Evidence Against"]
- **Signup comes before Help**, and Support comes before Help in the page order. Few people may reach it. — [source: it-mvp research.md; features.md order]
- **Roadmap asks don't exist yet.** Matching against an empty or tiny list is theatre. With about 5–15 asks, a plain list may beat a matcher. — [ASSUMPTION, supported by it-mvp concept.md cut line]
- **Two meanings of "Help"** risk confusing a contribution page with "get help" content in navigation and copy. — [ASSUMPTION] *Resolved 2026-10-18: the page is named "Help build It".*

## Gaps & Open Questions

- [NEEDS CLARIFICATION: Which meaning of Help is in scope (see questions.md Q1)]
- [NEEDS CLARIFICATION: What v0.1 must learn from Help: willingness to help, which skills exist, which asks attract people]
- [NEEDS CLARIFICATION: Founder follow-up capacity per week]
- [NEEDS CLARIFICATION: ESCO licence terms and what "modified" means]
- [NEEDS CLARIFICATION: Whether Homefront's pickers can be reused (repo at `~/Sites/homefront`, outside this worktree, not inspected)]

## Sources

- Repo files cited inline (no network).
- civictech.guide, codefor.ca, esco.ec.europa.eu: cited second-hand from `.specify/assessments/it-mvp/research.md`. Not fetched in this pass.
