# Current architecture decisions

This file records decisions made with the project owner. Source architecture proposals are useful context, not automatic instructions; this record supersedes conflicting implementation recommendations.

## Product

- It helps people imagine a better personal and shared future, see a path toward it, and take part with others.
- Onboarding is an exploratory waitlist and a roadmap for It. It offers personal possibilities, ways to help It, and optional support. Invitations are optional for v0.1 (2026-10-16).
- MVP includes the Support It flow. Call giving money "support" (2026-10-16); never "donation" or charitable status.
- First platforms are web and iOS.

## Showing information

Decided 2026-10-19.

- Show information when it helps the person make the decision they are making now, not because the system knows it. In onboarding the question is "could this help me?"; detail for "should I do this, and why believe it?" (evidence, sources, costs, downsides) belongs where someone weighs acting on a way.
- Keep what is hidden in the data. Ways keep their evidence levels, notes and sources, and every future–way link, so later views and paths can use them.

## Contributions: people add pains, futures and ways

Decided 2026-10-18. This replaces spec 001's "no free text in v0.1" assumption; founder approval of everything others see stays.

- The MVP lets people add their own pain, a future to a pain, or a way to a future. This is the point of "We are It", not an extra.
- Writing one before signup is allowed and works like any other pick: the text stays on the device. It is sent only after signup, and only when the person explicitly chooses to send it for review. Writing it never sends it.
- Sent contributions go into a review queue in the CMS. Nothing a person contributes is shown to anyone else until the founder approves it, and the founder may edit the wording. The contributor always sees their own, marked "In review" until a decision is made.
- Published content never says who contributed it, or implies that they have that pain. Who contributed what is kept privately, as provenance, for review and abuse handling.
- An approved way gets the usual type and an evidence level of "Not tested yet" unless the reviewer has a reason to set another.
- Each pain's futures are ordered by a per-pain position on the link, not by the order of taps or by a global order. A contributor places their future in that order, with a live preview of the joined sentence; the reviewer can change it.
- Contributions are validated with Zod at the boundary: a future's line is one first-person sentence ending in a period, so any set of chosen futures can be joined with commas and "and".
- VERIFY before launch: limits on how many contributions an account can send, and reviewer guidance for contributions that suggest someone is in crisis.

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
- Avoid a stable anonymous user/session. Pre-signup measurement is limited to coarse aggregate counts plus a per-visit stage funnel (stages only, never which pains/dreams/ideas; the visit ID lives in memory for one visit and is never stored on the device). Both are described in the interface (2026-10-16).
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

## Typography

Decided 2026-10-18; details in `docs/architecture/typography.md`.

- Bitter SemiBold for display text and headings, Bitter Regular/Italic/SemiBold for reading text, Inter for interface text. Both are free under the SIL Open Font License and ship the same files to web and iOS.
- Type is applied through role tokens (`font-display`, `font-heading`, `font-body`, `font-ui` and their weights), not weight utilities.
- The hand-drawn logo stays the only place its letters appear.

## Graphics: `@shopify/react-native-skia` for the watercolor dot

**Approved by the founder 2026-10-17.** Spec: `specs/007-watercolor-dot/spec.md`; assessment in `.specify/assessments/watercolor/`.

- **Why.** Both candidates in the fidelity proof need GPU shaders: Option B (look-alike shader) draws watercolor marks live, and Option E (dots painted ahead of time by physics) is colored live with Kubelka-Munk pigment optics. Reanimated, already installed, can move, scale and fade existing images but cannot draw new watercolor shapes. Skia gives GPU 2D drawing and custom SkSL RuntimeEffect shaders on iOS and web, driven by Reanimated shared values, and is supported in the Expo SDK 57 docs.
- **Version.** Install with `expo install` so the version matches SDK 57; record any pin in `docs/architecture/dependency-policy.md`. Not installed yet; the fidelity proof installs it.
- **Web cost.** Skia on web loads CanvasKit (WebAssembly), about 2.9 MB gzipped, against the founder's 1 MB extra web budget loaded after the first screen (FR-011). So web will likely use the animated painted orb in all three placements, and Skia is used on iOS, unless the fidelity proof finds a web path for the chosen dot within 1 MB. The proof must report the web download for each approach.
- **Native cost.** Roughly 4–6 MB added to the iOS binary (figures vary between sources; the proof measures it). Targets are iPhone 12 and newer (founder, 2026-10-17).
- **License.** `@shopify/react-native-skia` is MIT and Skia itself BSD-3-Clause; both are compatible with the AGPL-3.0-or-later app license.
- **Code that may not be copied.** sudoaquarelle.com publishes no license, so it is all-rights-reserved by default; Mixbox is CC BY-NC 4.0 (non-commercial only). Neither its code nor its data may be copied into It. Simulation and color mixing are written from published papers (Curtis et al. 1997 and later work) and the Kubelka-Munk equations.
- **Generated dots.** Dots painted ahead of time are CC0 illustrations under `docs/architecture/licensing.md`, with seed, simulation settings and pigments recorded as provenance; the drawing and simulation code is AGPL app code (founder confirmed 2026-10-17). The simulation is a tool kept outside the shipped app; only its output ships.
- **Web, updated 2026-10-17.** The proof found the lighter web path: dot B's shader is translated to GLSL and drawn with WebGL directly (`apps/app/src/watercolor/webgl-dot.web.tsx`). Skia stays iOS-only plus the dev lab.
- **Fallback.** The painted orb (`apps/app/assets/brand/watercolor-orb.jpg`) is shown in the same place and size wherever a generated dot is not ready, cannot be drawn, or does not fit the web budget, on every platform. No screen or action waits for Skia. If neither B nor E passes the proof, all placements use the animated painted orb and Skia is not adopted.

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
- 2026-10-18: added the typography decision (Bitter and Inter in display, heading, reading and interface roles).
- 2026-10-16: added the Thing / Type / Relation content graph decision (stacked levels; link, don't convert; links as claims with a confidence threshold; must not block v0.1).
- 2026-10-17: founder approved adding `@shopify/react-native-skia` for the watercolor dot (spec 007). Web likely uses the animated painted orb because CanvasKit (~2.9 MB gzipped) exceeds the 1 MB web budget; generated dots are CC0 with provenance.
- 2026-10-17: founder chose dot B on web too. Web draws it with the browser's own WebGL (the same shader, translated from SkSL; a few KB), not with Skia's web runtime, so the 1 MB web budget holds. The painted orb remains the fallback where WebGL is unavailable.
