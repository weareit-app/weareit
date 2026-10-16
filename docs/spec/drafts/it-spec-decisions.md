# Technology decisions — DRAFT for founder review

Status key: **AGREED** · **DRAFT** (proposed, not frozen) · **OPEN** (no choice yet).
Door: **2-way** = cheap to reverse (days) · **1-way** = expensive (data/people/money migrate) · **1-way (deliberate)** = accepted on purpose.
"Port" = the It-owned interface that app code depends on. If the port column says *none*, nothing shields us from the vendor.

Sources: architecture plan §4, §9–10, §13–14; product spec §6, §7.4, §12, §14.

## Decision table

| # | Decision | Port (what app code sees) | Door | Coupled to | Revisit trigger | Status |
|---|---|---|---|---|---|---|
| D1 | **TypeScript** everywhere | — (language) | 1-way (deliberate) | everything | never for v0.x | DRAFT |
| D2 | **pnpm workspaces + Turborepo** monorepo, one deployable app | `pnpm --filter` task names | 2-way | CI scripts | Turbo cache/config costs more time than it saves | DRAFT |
| D3 | **Expo (Router) for iOS + web** as the single client | Feature packages export React components taking props/emitting intents (design rule R4) | 1-way-ish: UI code is RN, not DOM | React Native Web, a11y mapping, bundle size | Day 1–2: web a11y (disclosure state, focus, reduced motion) or first-load perf on a mid phone fails acceptance tests 1, 5, 14. Existing scaffold kept; journey logic stays in a UI-free package | **AGREED** 2026-10-16 |
| D4 | **Zod schemas in `contracts/` are the API contract** | `contracts` package: input/output schemas per command & query | 2-way | Zod | Need a non-TS consumer → emit JSON Schema from Zod | **AGREED** 2026-10-16 |
| D5 | **tRPC as one transport** over the Zod contracts | Feature routers built from `contracts`; no feature imports `@trpc/*` outside its router file | 2-way *if* D4 holds; 1-way if procedures become the contract | TS server + TS client | A non-TS client, public API, or webhook-style consumer appears → add REST/OpenAPI transport over same schemas | **AGREED** 2026-10-16 |
| D6 | **Neon** (serverless Postgres) | Plain Postgres connection string | 2-way | Neon branching in dev workflow only | Cost, cold-start latency, or region/data-residency need | DRAFT |
| D7 | **Drizzle** ORM + migrations | Repository ports per concept (`SelectionStore`, `OfferStore`…); Drizzle only inside adapters | 2-way | SQL migration files (portable) | Drizzle blocks a needed query/migration pattern | DRAFT |
| D8 | **SST on AWS** for infra | `Resource` bindings read **only** in composition roots (`apps/api`, `infra/`) | 2-way for app code *if* rule holds; infra itself AWS-tied | AWS (Lambda/CloudFront), SST versioning | App code imports `sst` → fix immediately; AWS bill or SST breaking release | DRAFT |
| D9 | **Better Auth** for accounts, **passwords and passwordless both allowed** | `Identity` port: `currentSubject()`, `requireRole()`, `linkSession()` | 1-way-ish for password users (hash migration); 2-way for passwordless users; tables live in our Postgres | Its DB schema, session cookie format, password-hash algorithm | Leaving Better Auth → new provider must verify existing hashes or force resets. Mitigation: record hash algorithm + params in an ADR | **AGREED** 2026-10-16 |
| D10 | **Stripe, embedded payment UI in It, donor must be signed in.** Homefront (`~/Sites/homefront`) is a working reference, not code to copy verbatim | `Support` port is client-agnostic: server `startDonation(amount, frequency) → clientSecret` (PaymentIntent or `default_incomplete` Subscription); client confirms with Payment Element on web, PaymentSheet (`@stripe/stripe-react-native`) on iOS later. Stripe Billing Portal for cancel / payment method. Webhook → `DonationRecorded`. Stripe SDK only in `payment-connector` | **1-way (deliberate) for recurring**: subscriptions can't move without donors re-entering cards. Account requirement is 2-way (guest checkout can be added later) | Stripe KYC of the recipient (founder/org), fees, webhooks, Stripe API version; `identity` (Stripe customer per account) | Before first recurring donor; start Stripe onboarding Day 1. Native release → check App Store rules for donations. Signup drop-off on Support page → add guest donations | **AGREED** 2026-10-16 |
| D11 | **Content = hand-authored, versioned files in repo** (pains/dreams/ideas) | `Catalog` query: `catalog(version)` | 2-way | Build pipeline | Non-developers need to edit content, or > ~300 items | DRAFT |
| D12 | **Personal + societal pages work without an account; all progress stays on the device; signup required to go further**, then local progress is moved into the account | `Selection` store keyed by owner ref (device session or account); local and server adapters | 2-way | — | Big drop-off at the signup step | **AGREED** 2026-10-16 |
| D13 | **Analytics = our own events table** (funnel events, no third-party trackers) | `Telemetry.record(event)` | 2-way | Postgres | Need dashboards beyond simple SQL → add a privacy-respecting tool behind same port | DRAFT |
| D14 | **Transactional email** (magic links; receipts come from processor) — candidate: AWS SES via SST | `Notify.send(template, to)` | 2-way | Domain DNS (SPF/DKIM) | Deliverability problems | OPEN |
| D15 | **Admin view** = role-gated route in the same app over read-only queries | `Identity.requireRole('admin')` + concept queries | 2-way | — | More than one admin, or follow-up workflow outgrows a table | DRAFT |
| D16 | **Component/algorithm workbench** (Storybook for RN or Expo-native preview) | Fixture states per renderer | 2-way | Expo version | Setup takes > ½ day → use a plain preview route | OPEN |
| D17 | **Boundary enforcement** (dependency-cruiser or eslint-plugin-boundaries) | `pnpm check:boundaries` | 2-way | — | False positives slow work | DRAFT |
| D18 | **Code license** (named in support copy: "check our licensing") | — | **1-way**: relicensing contributions needs contributor consent | Contributor agreements, trust copy §7.9 | Before accepting outside code contributions | OPEN |

## Resolved challenges (2026-10-16)

1. **D3**: the Expo scaffold exists and stays. Guard: journey logic lives in a UI-free package.
2. **D4/D5**: Zod schemas are the contract; tRPC is one transport.
3. **D10**: Stripe with an embedded payment UI; donating requires an account (less complexity for now). Homefront is a reference, not copied verbatim. Its Payment Element is web-only, so the port hands the client a `clientSecret` that works with both Payment Element (web) and PaymentSheet (native later). Embedded Elements keep PCI at the same light level as hosted Checkout (card data stays in Stripe's iframe/SDK). Needs an ADR.
4. **D9**: both passwords and passwordless. Accepted cost: a hash migration if Better Auth is ever replaced. Needs an ADR recording the hash algorithm and params.

## ADRs

One-way doors (D1, D3, D9, D10, D18) get a short ADR in `spec/adr/` when decided: context, decision, reversibility, revisit trigger. Two-way doors stay as table rows only.
