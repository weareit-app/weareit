# Current architecture decisions

This file records decisions made with the project owner. Source architecture proposals are useful context, not automatic instructions; this record supersedes conflicting implementation recommendations.

## Product

- It helps people imagine a better personal and shared future, see a path toward it, and take part with others.
- Onboarding is an exploratory waitlist and a roadmap for It. It offers personal possibilities, ways to help It, and optional support. Invitations are optional for v0.1 (2026-10-16).
- MVP includes the Support It flow. Call giving money "support" (2026-10-16); never "donation" or charitable status.
- First platforms are web and iOS.

## Platform and stack

- Expo Router is the universal app and route system. Revisit a separate Next.js app only if a demonstrated Expo limitation requires it.
- Use pnpm workspaces. The owner uses mise locally; contributor setup remains tool-agnostic.
- Use NativeWind 5.0.0-rc.0 with its exact `react-native-css` 3.1.0-rc.0 pairing for the SDK 57 prototype. NativeWind labels v5 a pre-release and says it is not intended for production, so re-evaluate maturity before launch or switch to a stable compatible release.
- Keep `lightningcss` at 1.30.1 as the NativeWind/react-native-css compatibility override. Dependency refresh rules and current intentional version pins are recorded in `docs/architecture/dependency-policy.md`.
- Use oRPC for typed API contracts and Kysely for SQL access. Keep contracts/framework independent where practical.
- Use Neon initially through a provider-neutral PostgreSQL connection boundary.
- Use TanStack Query for server state. Adopt other TanStack packages only for concrete needs.
- General offline sync is deferred. Pre-signup onboarding still needs local draft persistence and restart recovery on each platform.
- Product content (domains, pains, dreams, first actions, and their provenance) is database-backed from the start, not maintained as Git-authored runtime content. Build a first-party CMS for editing and publishing this structured content. PostgreSQL is the source of truth; Kysely owns migrations and SQL access, and the app receives validated content through semantic oRPC operations. Git may hold schema, migrations, seed/import tools, and snapshots for review, but must not become a competing source of truth.
- The CMS starts with a small structured workflow: edit drafts, validate references and required provenance, preview the onboarding experience, and publish a versioned content snapshot. Keep content revisions and publication history so changes can be reviewed and rolled back. Do not build a general page builder or workflow engine for MVP.

## Identity and privacy

- Pre-signup answers remain on-device.
- On-device drafts do not expire automatically; the person can explicitly clear them.
- Signup is required after the personal and societal pages to continue (2026-10-16). Those two pages work without an account.
- Sign-in offers email OTP and email + password (2026-10-16).
- Use self-hosted Better Auth for email OTP, passwords and sessions, backed by PostgreSQL through its Kysely adapter. Send codes through configurable SMTP; development can log codes locally, while production must have SMTP configured. Authentication and content persistence remain on infrastructure It controls.
- Avoid a stable anonymous identity: nothing persistent on the device and no link between visits before signup. Measurement is owned by spec 013 (2026-10-19, replacing the 2026-10-16 rule). It covers a per-visit stage funnel plus per-page views, including each pain page by ID, and each pain a visit opens, by ID; picks and selected fixes are never sent before signup. The visit ID lives in memory for one visit and is never stored on the device. The visit in which a person signs up or signs in is linked to their account, to allow personalised fixes and research ("This project needs to be treated like science"). Records are kept indefinitely (on account deletion, linked visits are unlinked and kept), with no opt-out and no small-number suppression in founder-only admin. All of it is described in the interface before it is sent.
- Keep private answers and sensitive derivatives out of public artifacts by default.

## Payments

- Stripe is It's primary web payment platform for recurring support, customers, invoices, refunds, and subscription self-service. Web payment uses an embedded Stripe form inside It, replacing hosted Checkout (2026-10-16); the customer portal stays for self-service.
- It keeps its own provider-neutral contribution/transaction records and mappings to Stripe and store transaction IDs. Provider webhooks are signature-verified and idempotent.
- RevenueCat is optional and handles native App Store/Play Store purchases. Store payments bypass Stripe; RevenueCat does not own It account/access data or product entitlements.
- Web support uses Stripe directly. Support can be one-time, monthly or annual on both web and iOS (2026-10-16); iOS is optional for v0.1. VERIFY App Store rules for recurring support without in-app benefits before building iOS recurring.
- Support grants no product access and is not described as a charitable donation.

## Content graph: Thing / Type / Relation

Decided 2026-10-16; assessment in `.specify/assessments/thing-type-relation/`.

- It will have a shared layer where any record can be linked to a **Thing** (e.g. Basketball) of a **Type** (e.g. Sport) through a named **Relation**. The vocabulary is Thing / Type / Relation.
- Types and Things sit on stacked levels: a Type can be described as a Thing only at the level above, never on the same level (as with universes in type theory).
- Existing records (pains, dreams, ideas, skills, occupations, roadmap items) keep their own form and link to Things; they do not become Things.
- Every link is a claim that records who or what made it, its confidence, and its review state. LLM-proposed links above a confidence threshold are used without review; the rest are queued. The threshold starts high and is lowered only as founder audits of random samples show precision.
- The same subject from different sources is linked by a recorded equivalence, not merged.
- The layer must not block v0.1 and is built after launch. v0.1 must give every published record a stable ID, store outside references (pain frameworks, ESCO, Wikidata) in one consistent shape, store Help answers as ESCO references, and keep content versions on picks.
- It stays on PostgreSQL + Kysely. A graph database, graph extension or formal tool needs its own decision record. Tagging people's own data by LLM needs a separate privacy decision.

## Rendering

Expo Router now documents static and request-time server rendering. Start with static output for public content and app routes; evaluate server output for dynamic share previews before adding a separate web framework or custom metadata server. Dynamic server rendering requires a production server runtime, so this decision also depends on the hosting path.

## Open implementation decisions

- Production SMTP provider and sender identity.
- Hosting/runtime and deployment setup. Lean: SST on AWS if it is the cheapest and easiest to change later; keep app code host-neutral (2026-10-16).
- Role-based CMS authorization before inviting additional or outside editors; the initial single-admin token is a bootstrap gate.
- Stripe product identifiers and sandbox/live account setup.
- App Store Connect and RevenueCat product/webhook configuration before the first native purchase.
- Scope and text of the AGPL App Store exception.
- DCO versus CLA for outside contributions.
- Corporate form, mission protections, and trademark policy.

## Change log

- 2026-10-16: founder resolved conflicts with an earlier spec draft (see `docs/spec/CONFLICTS.md`). Changed: signup required after personal + societal pages; email OTP plus password; embedded Stripe form on web; one-time/monthly/annual support on web and iOS; pre-signup stage funnel added (privacy invariant change); invitations optional; "support" wording; hosting lean SST. Kept: oRPC, Kysely, database + CMS.
- 2026-10-16: added the Thing / Type / Relation content graph decision (stacked levels; link, don't convert; links as claims with a confidence threshold; must not block v0.1).
- 2026-10-19: measurement privacy invariant changed (spec 013, founder answers Q1–Q12). Changed: the signup/sign-in visit is linked to the account (reverses 008 FR-028 "never linked"); per-page views including each pain page (reverses the per-pain part of 012 FR-020); each opened pain recorded by ID (reverses 008's "opened pains not sent"); deleted accounts' visits unlinked and kept; exact receive times; records kept indefinitely; no opt-out. Kept: no picks or selected fixes sent before signup; visit ID in memory only; no cross-visit link before signup; how a visit arrived is not recorded; never public. Open: when account linking switches on (010 Q37).
