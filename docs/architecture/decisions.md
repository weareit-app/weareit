# Current architecture decisions

This file records decisions made with the project owner. Source architecture proposals are useful context, not automatic instructions; this record supersedes conflicting implementation recommendations.

## Product

- It helps people imagine a better personal and shared future, see a path toward it, and take part with others.
- Onboarding is an exploratory waitlist and a roadmap for It. It can offer personal possibilities, ways to help It, ways to invite others, and optional support.
- MVP includes the Support It flow. Use contribution language; do not claim charitable donation status.
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
- Ask for email OTP only when the user chooses to persist their work.
- Use self-hosted Better Auth for email OTP and sessions, backed by PostgreSQL through its Kysely adapter. Send codes through configurable SMTP; development can log codes locally, while production must have SMTP configured. Authentication and content persistence remain on infrastructure It controls.
- Avoid a stable anonymous user/session. Any pre-signup measurement must be coarse aggregate counts and described in the interface.
- Keep private answers and sensitive derivatives out of public artifacts by default.

## Payments

- Stripe is It's primary web payment platform for Checkout, recurring support, customers, invoices, refunds, and subscription self-service.
- It keeps its own provider-neutral contribution/transaction records and mappings to Stripe and store transaction IDs. Provider webhooks are signature-verified and idempotent.
- RevenueCat is optional and handles native App Store/Play Store purchases. Store payments bypass Stripe; RevenueCat does not own It account/access data or product entitlements.
- Web support uses Stripe directly. The iOS MVP offers one-time StoreKit tips through RevenueCat; monthly patronage remains on web until It offers ongoing subscription value in the app.
- Support grants no product access and is not described as a charitable donation.

## Rendering

Expo Router now documents static and request-time server rendering. Start with static output for public content and app routes; evaluate server output for dynamic share previews before adding a separate web framework or custom metadata server. Dynamic server rendering requires a production server runtime, so this decision also depends on the hosting path.

## Open implementation decisions

- Production SMTP provider and sender identity.
- Hosting/runtime and deployment setup.
- Role-based CMS authorization before inviting additional or outside editors; the initial single-admin token is a bootstrap gate.
- Stripe product identifiers and sandbox/live account setup.
- App Store Connect and RevenueCat product/webhook configuration before the first native purchase.
- Scope and text of the AGPL App Store exception.
- DCO versus CLA for outside contributions.
- Corporate form, mission protections, and trademark policy.
