# Idea Intake: It MVP (v0.1)

- **Slug**: it-mvp
- **Created**: 2026-10-16
- **Source**: repo paths `docs/spec/features.md` (screen-by-screen features, core/optional tags) and `docs/architecture/decisions.md` (founder decisions, change log 2026-10-16). Background evidence: `docs/source/`, `docs/spec/drafts/`, `docs/spec/CONFLICTS.md` (AI-generated, unchecked).
- **Type**: new-capability

## Idea (as captured)

From `docs/spec/features.md` (DRAFT):

> 1. Personal: "What could be better for you?" (no account) — see everyday pains, open one to see several possible better futures ("dreams"), pick dreams, see honestly labelled ideas under each, mark ideas "I'd use this". Picks stay on your device.
> 2. Societal: "What could be better for us?" (no account) — same, for society-wide problems.
> 3. Sign up (required to go further) — email code or email + password; picks saved to the account; opt-in for emails.
> 4. Support: "It's free for you—and you're not the product." — founder letter; support once, monthly or annually through an embedded Stripe form; skip allowed.
> 5. Help: "What could you help make possible?" — ILL-DEFINED, needs its own design pass. Rough direction: background → suggested skills from a modified ESCO list → curated roadmap items It needs help with. Skip allowed.
> 6. Admin (founder only) — totals of picks (never individuals), support payments, help offers.

Staging: **core** must ship, **optional** if time allows, **soon** not built but must not be blocked (personal story, sharing, matching, starting from a dream). Optional extras: native iOS app with support, invitations.

From `docs/architecture/decisions.md`:

> Onboarding is an exploratory waitlist and a roadmap for It. It offers personal possibilities, ways to help It, and optional support.

## Restated

Ship a first version of It (web, iOS optional) where a person explores personal and societal pains, picks better futures and sees honest ideas without an account, then signs up and can optionally support It financially and offer help. It doubles as a waitlist and a public roadmap for what It will build.

## Origin & Context

- **Raised by**: the founder (Josh Smith).
- **Trigger**: a combination of the founder's own idea and AI-generated artifacts (product/UX spec, onboarding content spec, architecture plans in `docs/source/`; it-spec drafts in `docs/spec/drafts/`). Conflicts between the drafts and the repo's records were resolved by the founder on 2026-10-16 (`docs/spec/CONFLICTS.md`).

## First-Glance Unknowns

- [NEEDS CLARIFICATION: Who is the first audience — friends and network, a specific community, or the general public?]
- [NEEDS CLARIFICATION: What does "success" for v0.1 mean — signups, supporters, help offers, validated pains/dreams, or learning which ideas people would use?]
- [NEEDS CLARIFICATION: Is there a target launch date or time budget (appetite)?]
- [NEEDS CLARIFICATION: What is the Help page actually for, and is it in v0.1 scope or its own assessment?]
- [NEEDS CLARIFICATION: How much content (pains, dreams, ideas) must exist at launch, and who checks the AI-generated content?]
- [NEEDS CLARIFICATION: Does required signup after two pages cost too many people before Support and Help?]
- [NEEDS CLARIFICATION: Does a first-party CMS belong in v0.1, or can content be seeded and edited by the founder another way at first?]
- [NEEDS CLARIFICATION: App Store rules for recurring support without in-app benefits (blocks iOS support, which is optional).]
- [NEEDS CLARIFICATION: Which "soon" features are missing from the must-not-block list?]
