# MVP implementation sequence

## First vertical slice

1. Establish the Expo Router app, workspace conventions, and NativeWind design tokens. **Scaffolded.**
2. Present Tier 1 personal and world pains locally; let people choose, skip, and revise selections. **Scaffolded with local draft persistence.**
3. Reveal desired futures tied to those choices, preserving many-to-many relationships. **Scaffolded.**
4. Offer concrete next paths: explore a personal fix, help build It, invite people, or Support It. **Help interests and a few pain-to-first-action routes are scaffolded; the invitation flow remains open.**
5. Persist the pre-signup draft on-device and resume it after reload/restart. **Scaffolded without a time-based expiry.**
6. Include the optional Support It flow. **Stripe Checkout and the billing portal are wired for web; RevenueCat/StoreKit consumable tips are wired for iOS. Provider dashboards, credentials, and sandbox products still need setup before transactions can complete.**

## Next slices

- Add the PostgreSQL content schema, Kysely migrations, and import path for the sourced Tier 1 corpus. Database content is authoritative; Zod validates import, publish, and API boundaries. **Implemented; initial import publishes content version 1.**
- Build the first-party CMS for structured draft editing, relation/provenance validation, onboarding preview, and versioned publish/rollback. **Implemented for creating, editing, and removing content and sources, with a bootstrap admin token; replace that gate with role-based authentication before inviting outside editors.**
- Serve published onboarding content through oRPC and load it in Expo Router through TanStack Query. **Implemented; personal selections remain on-device.**
- Add deterministic narrative/future artifact generation from the local draft.
- Expand the small, sourced set of pain-to-first-action examples and add follow-up/refusal choices. **Initial conditional HEPA, personal, research, and invitation paths are scaffolded.**
- Turn the exploratory volunteer interests into an actionable, locally resumable waitlist.
- Add email OTP only at the persistence gate, then persist the draft through an oRPC API. **Implemented: people explicitly request a code, verify it, and save their selections against the content version they explored. Production SMTP configuration remains deployment setup.**
- Add public anonymous interest counts under a narrow privacy contract.
- Configure Stripe test/live products, webhook delivery, and customer-portal cancellation behavior; complete Stripe sandbox checkout and refund verification.
- Configure RevenueCat and App Store Connect consumables, then verify an iOS sandbox purchase in an Expo development build.
- Add invitation, public artifact previews, safety/reporting floor, and launch hardening.

## Deferred

- General offline-first sync.
- Skill ontology matching and full volunteer operations.
- General-purpose page builder and workflow engine beyond the focused CMS.
- Dynamic public pages beyond what the Expo Router web rendering path needs.
- Deep formal modeling unless a concrete state or safety problem justifies it.
