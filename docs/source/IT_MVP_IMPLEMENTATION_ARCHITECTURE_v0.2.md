# It MVP — Implementation Architecture and Agent Execution Design

**Version:** 0.2  
**Date:** 2026-10-04  
**Status:** Executable implementation guidance for the MVP. Supersedes v0.1.  
**Authority:** The canonical It master specification controls product semantics. `It_Architecture_Constraints_and_Computable_Core` v2.1 controls frozen architectural invariants where applicable. This document chooses a concrete implementation that satisfies those documents and the decisions made on 2026-10-04.

---

## 0. Executive decision

Build **one universal Expo application** for iOS and web, backed by one coarse TypeScript HTTP server on AWS via SST and a managed Postgres database on Neon.

Do **not** introduce Next.js or Solito for the MVP. Expo Router remains the primary product/router framework across native and web. Dynamic Open Graph/share-link HTML is handled by a small server route, not a second application framework.

The MVP stack is:

- **Language:** TypeScript, strict mode.
- **Monorepo:** pnpm workspaces + Turborepo.
- **Application:** React Native + Expo + Expo Router, targeting iOS and responsive web from one route tree.
- **Styling:** NativeWind 4.x / Tailwind CSS 3 semantics, pinned to exact tested versions compatible with the chosen Expo SDK; project-owned design tokens and primitives.
- **Motion:** Reanimated 4; purposeful and reduced-motion aware.
- **Local UI/application state:** Zustand.
- **Pre-signup local persistence:** Zustand persist through a platform storage adapter; `expo-sqlite/kv-store` on native and `localStorage` on web.
- **Pinned onboarding bundle persistence:** the immutable flow/content bundle used by a local draft is stored locally beside that draft so it can resume without a network connection.
- **Remote/server state:** TanStack Query.
- **API:** tRPC v11 + Zod, semantic operation names.
- **Authentication:** Better Auth; typed email OTP in the MVP, architecture prepared for SMS OTP later. OTP delivery is direct from the auth callback, never a scheduled job.
- **Database:** Postgres, initially Neon; provider swappable through `DATABASE_URL`.
- **Database access:** Drizzle as a thin typed SQL layer over `pg`/node-postgres or Neon's transaction-capable pooled connection. Do not use the Neon HTTP driver for transaction-dependent application work.
- **Infrastructure:** AWS through SST: CloudFront/static web, one coarse HTTP Lambda for `/api/*` plus preview routes, and a separate asynchronous outbox worker. Postgres remains externally managed by Neon for cost.
- **Payments/support:** RevenueCat as the cross-platform purchase abstraction; iOS uses optional StoreKit consumable support/tips with no entitlement; web uses RevenueCat Web + Stripe for one-time and recurring support. External web-support CTAs inside iOS are storefront-policy gated.
- **Unit/domain tests:** Vitest.
- **Property tests:** fast-check for flow/domain/privacy invariants.
- **Database/API integration tests:** Vitest + Testcontainers Postgres + real migrations + direct tRPC callers.
- **Web E2E:** Playwright; the web path is the first end-to-end product target because acquisition traffic is expected to land there.
- **Native testing for the four-week slice:** manual/TestFlight smoke testing plus targeted Expo tests only when native-specific behavior requires them. Jest/RNTL and Maestro are named later tools, not mandatory initial scaffolding.
- **Architecture enforcement:** dependency-cruiser plus focused semantic/privacy checks.
- **Editor:** VS Code with checked-in workspace recommendations, tasks, formatting, linting, and test commands.
- **Agent instructions:** one root `AGENTS.md` initially. Add scoped files only when a package genuinely needs additional rules.

### The most important MVP boundary

> **Signup is a person-linked persistence/privacy boundary, not a network boundary for the application.**

Before signup, the app may use the network, server, and database for public/versioned content and may send **one-way anonymous aggregate increments** under the narrow allow-list in §17. A person's draft, ratings, narrative, raw exposure history, and any identifier that could join their choices into a person/session history remain local.

At the signup step—immediately after the personal narrative is generated—the person may choose to create an account. Only then is the local onboarding draft committed to durable user-linked storage.

The anonymous aggregate channel does **not** create an anonymous user/session. It increments coarse counters and discards the request-level semantic event.

# 1. Product behavior this architecture must serve

The current MVP loop is approximately:

```text
Landing
→ personal frustrations
→ world frustrations
→ flip pains toward desired futures
→ “help today?” / “help the world?”
→ candidate fixes / possibilities
→ roadmap / fake-door votes
→ personal narrative / shareable future artifact
→ SIGNUP BOUNDARY
→ positive trusted invite
→ contribution / Support It
```

Exact copy and screen count may change without an architectural rewrite. The implementation must preserve these product properties:

1. onboarding begins from lived frustrations, desires, or desired states;
2. the user reaches at least one recognizable positive future;
3. candidate fixes are concrete and selections can teach us what to build;
4. a personal narrative/artifact can be generated without exposing private pains **or their sensitive derivatives** publicly by default;
5. invitations are positive and trust-oriented rather than referral spam;
6. time, skills, knowledge, introductions, and money can all eventually be contribution modes;
7. the experience ends with a sense that something became more possible;
8. the pain/fix corpus is a seeded starting map, not an ontology frozen forever;
9. user-facing funding language is **Support It**, not charitable-donation language, unless the project's legal status later changes;
10. if the product asks for location, it uses **explicitly consented device location**, not postal code as a covert proxy; pre-signup location remains local;
11. real names are the preferred social presentation where collected, but names are mutable profile data, never identity keys;
12. a minimal crisis/abuse floor exists: static help/resources, a clear “not monitored for emergencies” notice, a conservative keyword-triggered resource prompt anywhere free text exists, and a report mechanism for public/invite surfaces.

The MVP should remain a straightforward product. Do not import long-run mathematical machinery merely because the research program anticipates it. ESCO-backed skills/capability search remains an explicit near-MVP hook, not a requirement for the onboarding slice.

# 2. Design before production code

## 2.1 Recommended workflow

Use a visual/prototyping pass for the onboarding interaction **before polishing production screens**, but do not make a Figma “freeze” a prerequisite for repository/domain work.

Preferred workflow:

```text
project content + existing visual direction
        ↓
Figma Design / Figma Make prototype
        ↓
mobile + desktop responsive states
        ↓
interaction rhythm + motion specification
        ↓
review against MVP content/privacy contract
        ↓
production implementation in Expo
```

Figma Make or another agentic design canvas is appropriate for rapidly exploring screen composition, narrative reveal, selection behavior, responsive layout, and transition rhythm. Treat generated prototype code as disposable. Production source remains the Expo codebase and project design system.

Repository foundation, content import, flow schemas, engine tests, Postgres/RLS work, and API setup may proceed in parallel.

## 2.2 Prototype these states before polishing them

At minimum:

- landing / entry;
- personal frustration multi-selection;
- world frustration multi-selection;
- positive-state flip/reveal;
- “help today?” and “help the world?” choices;
- fix/possibility cards;
- roadmap vote interaction;
- personal narrative reveal;
- signup gate immediately following narrative;
- post-signup artifact view;
- invite flow;
- **Support It** screen;
- public share/invite preview states;
- desktop/web variants;
- loading, stale-content, offline, empty, and recoverable-error states;
- reduced-motion behavior;
- static crisis/help and report affordances.

The prototype should settle **what moves and why**. Reanimated reproduces intentional product motion; it should not decorate unresolved interaction design.

# 3. Universal app strategy: Expo Router, not Next/Solito yet

## 3.1 Decision

Use a single Expo Router application as the product for:

- iOS;
- responsive web;
- public artifact links;
- invitation links;
- issue/entry pages where practical;
- authenticated product UI.

Expo Router is explicitly designed for universal React Native apps and gives native navigation, universal/deep links, web routes, and static rendering from the same filesystem router.

## 3.2 Why not Next.js in the MVP

Next would create a second runtime/router/build chain exactly when the product needs maximum iteration speed. Expo's own documentation still states that Next is not part of Expo's official universal workflow. NativeWind also has additional Next/RSC constraints.

For the current product, most web value comes from:

- direct links;
- responsive pages;
- shareable artifacts;
- invite links;
- content/issue landing surfaces;
- the same product interactions as native.

None currently requires a separate Next application.

## 3.3 Why not Solito in the MVP

Solito is valuable when a team deliberately owns both an Expo navigation tree and a Next navigation tree and needs a shared navigation abstraction. If there is only one Expo Router tree, Solito is extra indirection.

## 3.4 Reopen trigger

Create an ADR and reconsider Next/Solito only if at least one of these becomes real:

1. public pages require arbitrary request-time SSR that Expo Router's stable web path cannot provide;
2. SEO for large numbers of dynamic pages materially affects acquisition and static/pre-generated routes are inadequate;
3. the web application becomes structurally different from the native product rather than a responsive projection of it;
4. web-specific React Server Component behavior produces a demonstrated product/performance benefit worth a second runtime;
5. a concrete Expo Router limitation forces duplicated platform code that Solito/Next would reduce.

Do not add Next “in case.”

## 3.5 Web rendering and share previews for the MVP

Use Expo web static/client rendering for the application shell, but do **not** rely on client-only rendering for distribution-critical share links.

Canonical URL shapes:

```text
/f/<random-public-slug>
/i/<random-invite-code>
/issue/<slug>
```

`/f/:slug` and `/i/:code` are intercepted by a small server route that returns request-time HTML with Open Graph/social preview metadata and a preview image reference, then bootstraps/links into the Expo web app. This avoids adding Next.js solely for dynamic metadata.

Public slugs and invite codes are random high-entropy tokens; do not expose UUIDv7 creation-time information as public identifiers.

The same-origin web deployment proxies `/api/*` to the HTTP Lambda through CloudFront. Browser auth should not depend on third-party/cross-site cookies or an `execute-api.amazonaws.com` origin.

If the dynamic public-web surface later becomes materially larger than this thin preview layer, revisit §3.4.

# 4. Monorepo and file tree

```text
it/
├── AGENTS.md
├── README.md
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
├── eslint.config.mjs
├── .dependency-cruiser.cjs
├── prettier.config.mjs
├── .editorconfig
├── .env.example
├── .gitignore
│
├── .vscode/
│   ├── extensions.json
│   ├── settings.json
│   └── tasks.json
│
├── apps/
│   ├── app/                              # universal Expo app: iOS + web
│   │   ├── app.config.ts
│   │   ├── eas.json
│   │   ├── metro.config.js
│   │   ├── global.css
│   │   ├── tailwind.config.ts
│   │   ├── app/
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx
│   │   │   ├── onboarding/
│   │   │   │   ├── _layout.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   └── [node].tsx           # thin route → generic renderer
│   │   │   ├── signup.tsx
│   │   │   ├── future.tsx
│   │   │   ├── invite.tsx
│   │   │   ├── support.tsx
│   │   │   └── (app)/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── providers/
│   │   │   ├── storage/
│   │   │   ├── state/
│   │   │   ├── motion/
│   │   │   ├── support/
│   │   │   └── lib/
│   │   └── __tests__/                    # add only when native-specific tests earn their keep
│   │
│   └── server/                           # coarse AWS HTTP + worker entrypoints only
│       └── src/
│           ├── http.handler.ts            # /api/auth, /api/trpc, anonymous counters, webhooks
│           ├── preview.handler.ts         # /f/:slug, /i/:code metadata HTML
│           └── outbox.handler.ts          # async invites/follow-ups; NEVER OTP
│
├── packages/
│   ├── domain/                           # pure product semantics
│   │   └── src/
│   │       ├── ids.ts
│   │       ├── records.ts
│   │       ├── events.ts
│   │       ├── operations.ts
│   │       └── invariants.ts
│   │
│   ├── schemas/                          # Zod runtime contracts
│   │   └── src/
│   │       ├── common.ts
│   │       ├── onboarding.ts
│   │       ├── content.ts
│   │       ├── artifact.ts
│   │       ├── invite.ts
│   │       ├── support.ts
│   │       └── auth.ts
│   │
│   ├── flow-engine/                      # pure deterministic versioned interpreter
│   │   ├── src/
│   │   │   ├── version.ts
│   │   │   ├── schema.ts
│   │   │   ├── conditions.ts
│   │   │   ├── reducer.ts
│   │   │   ├── selectors.ts
│   │   │   ├── narrative.ts
│   │   │   ├── public-artifact.ts
│   │   │   └── validate.ts
│   │   └── test/golden/
│   │
│   ├── content/                          # import/author/publish tooling
│   │   ├── seed/onboarding-v1/
│   │   └── src/
│   │       ├── import.ts
│   │       └── publish-flow.ts
│   │
│   ├── ui/                               # shared universal design system
│   │   └── src/
│   │       ├── primitives/
│   │       ├── patterns/
│   │       ├── tokens/
│   │       └── motion/
│   │
│   ├── local-state/                      # Zustand + persisted draft/bundle adapters
│   │   └── src/
│   │       ├── onboarding-store.ts
│   │       ├── storage.native.ts
│   │       └── storage.web.ts
│   │
│   ├── api/                              # tRPC routers + server application layer
│   │   └── src/
│   │       ├── root.ts
│   │       ├── context.ts
│   │       ├── procedures.ts
│   │       ├── routers/
│   │       │   ├── content.ts
│   │       │   ├── onboarding.ts
│   │       │   ├── roadmap.ts
│   │       │   ├── artifact.ts
│   │       │   ├── invite.ts
│   │       │   └── support.ts
│   │       └── services/
│   │
│   ├── api-client/                       # tRPC/TanStack client wiring only
│   │   └── src/
│   │
│   ├── auth/                             # Better Auth configuration/adapters
│   │   └── src/
│   │       ├── server.ts
│   │       ├── client.ts
│   │       └── transport.ts
│   │
│   ├── db/
│   │   ├── drizzle.config.ts
│   │   ├── migrations/
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   ├── schema/
│   │   │   ├── queries/
│   │   │   ├── rls/
│   │   │   └── transaction.ts
│   │   └── test/
│   │
│   └── testkit/
│       └── src/
│           ├── postgres.ts
│           ├── fixtures.ts
│           ├── actors.ts
│           └── property.ts
│
├── e2e/
│   └── web/                              # Playwright: one golden path first
│       ├── playwright.config.ts
│       └── specs/
│
├── infra/
│   └── sst.config.ts
│
├── docs/
│   ├── architecture/
│   │   ├── IMPLEMENTATION.md
│   │   ├── frozen-architecture.md
│   │   └── master-spec-reference.md
│   ├── adr/                              # create ADRs only when a decision is genuinely reopened
│   └── runbooks/
│       ├── deploy.md
│       └── rollback.md
│
└── scripts/
    ├── check-architecture.mts
    ├── seed-content.mts
    ├── publish-flow.mts
    └── verify-env.mts
```

### Dependency direction

Enforce with dependency-cruiser, not prose alone:

```text
apps/app
   ↓
ui · local-state · api-client · flow-engine · schemas · domain

apps/server
   ↓
api · auth · db · schemas · domain

api-client
   ↓
schemas

api
   ↓
db · schemas · domain

local-state
   ↓
flow-engine · schemas · domain

flow-engine
   ↓
schemas · domain

db
   ↓
domain
```

`domain`, `schemas`, and `flow-engine` must not import React Native, Expo, AWS, Drizzle, browser globals, or provider SDKs.

# 5. State ownership

| State | Owner | Persistence |
|---|---|---|
| current screen/navigation | Expo Router | transient |
| pre-signup onboarding operations | Zustand | local device only |
| pre-signup exposures/ratings | Zustand | local device only |
| pre-signup flow/engine metadata | Zustand | local device only |
| personal narrative before signup | deterministic selector | derived, not persisted separately |
| pinned immutable onboarding bundle | local-state adapter | local with draft; safe public data |
| current remote/server data | TanStack Query | cache |
| anonymous pre-signup learning counts | aggregate-counter service | counters only; no raw event/session |
| authenticated session | Better Auth | SecureStore native / first-party cookie web + auth DB |
| durable user history | Postgres | server after signup |
| canonical content/flow versions | Postgres | authoritative server source |
| derived server projections | Postgres | rebuildable where architecture says so |
| future offline durable app view | SQLite projection | local, non-authoritative |

### Rule

**Do not put server state in Zustand merely because it is convenient.** TanStack Query owns remote cache. Zustand owns client-local interaction state. Derived narrative is recomputed from the operation log; do not persist a second `narrativePreview` truth.

# 6. Pre-signup onboarding and the persistence boundary

## 6.1 What may happen before signup

Allowed before signup:

- fetch the active published onboarding pointer and immutable bundle;
- fetch public/versioned content from server/Postgres through cacheable endpoints;
- persist the person's draft and pinned public bundle locally so onboarding survives restart/offline;
- compute narrative locally from the pinned bundle + engine version + operations;
- send **anonymous aggregate increments** exactly as defined in §17.1.

Not allowed before signup:

- insert personal selections, ratings, narrative, raw exposure history, device location, or free text into durable user-linked storage;
- create a durable anonymous session/profile or stable anonymous identifier;
- include `draftId`, account identifiers, narrative text, rating values, or device location in the anonymous counter request;
- send personal draft state to third-party analytics/crash products;
- write personal exposure/response events to the server.

Privacy copy must say plainly that anonymous counts of choices may be sent before signup and are not tied to an account/person.

## 6.2 Local draft and operations

Use a small serializable Zustand store.

```ts
interface OnboardingDraft {
  draftId: UUIDv7;                 // local idempotency key; NEVER sent pre-signup
  flowId: UUIDv7;
  flowVersion: number;
  engineVersion: number;
  bundleHash: string;
  startedAt: string;
  updatedAt: string;
  currentNodeId: string;
  operations: DraftOperation[];
}

type DraftOperation =
  | {
      id: UUIDv7;
      occurredAtClient: string;
      nodeId: string;
      type: 'expose';
      optionIdsPresented: UUIDv7[]; // ordered set actually presented after filtering/shuffle
    }
  | {
      id: UUIDv7;
      occurredAtClient: string;
      nodeId: string;
      type: 'select' | 'unselect' | 'choose';
      valueId: UUIDv7;
    }
  | {
      id: UUIDv7;
      occurredAtClient: string;
      nodeId: string;
      type: 'rate';
      valueId: UUIDv7;
      rating: number;
    }
  | {
      id: UUIDv7;
      occurredAtClient: string;
      nodeId: string;
      type: 'skip';               // deliberate semantic skip
    };
```

`expose` records the semantic option set/order presented, not pixel-level impression telemetry. If a surface truly paginates/lazy-loads options, emit additional exposure fragments as new options become available.

A deliberate `skip` is an operation. Going back is navigation. Abandoning onboarding produces no invented response.

Store semantic operations, not copies of React component state.

### Native storage

Persist the draft **and pinned immutable bundle** through `expo-sqlite/kv-store`.

### Web storage

Use `localStorage` behind the same storage adapter. Never render persisted draft-dependent UI until Zustand rehydration has completed; otherwise static/web hydration can render the wrong state.

### Retention

Default stale-draft TTL: **7 days**. Clear earlier after successful durable commit or explicit “start over/clear my answers.” On shared/browser environments, make clearing easy and visible.

## 6.3 Deterministic narrative requires interpreter versioning

The deterministic input is:

```text
engineVersion
+ immutable published flow/content bundle
+ semantic operation log
→ NarrativeProjection
```

`packages/flow-engine` owns a numbered interpreter version. Every published flow version declares `minEngineVersion`. A draft pins both `flowVersion` and `engineVersion`.

Rules:

- publishing a flow may use only node kinds/condition operators supported by its declared engine floor;
- web clients may reload to the current engine when incompatible;
- an old iOS build receives the newest flow version compatible with its engine;
- old compatible flow versions/bundles remain servable while supported iOS builds can still use them;
- the server retains the interpreter behavior necessary to validate/recompute drafts from supported engine versions;
- if compatibility cannot be satisfied, show an explicit update/restart state rather than silently changing the narrative.

Narrative rules are typed data, not executable JavaScript stored in the database.

Maintain golden fixtures:

```text
(engineVersion, flowVersion, operations)
→ expected derived state
→ expected private narrative
→ expected public-safe projection
```

The client may display the narrative before signup. At commit time the server recomputes it from the pinned versions and submitted operations; client output is never canonical input.

## 6.4 Signup and commit sequence

```text
[local draft + pinned public bundle]
      ↓
Narrative shown
      ↓
User chooses “save/continue”
      ↓
Email entered                         ← person-linked persistence boundary begins
      ↓
Better Auth sends OTP directly
      ↓
OTP verified
      ↓
actor/account established
      ↓
onboarding.commitDraft(draft)
      ↓
server validates engine + flow + operation sequence
      ↓
server recomputes private narrative + sensitivity metadata
      ↓
ONE transaction writes personal events/payloads/projections
      ↓
commit receipt returned
      ↓
client clears local draft
      ↓
post-signup invite / Support It flow
```

`onboarding.commitDraft` is idempotent on `draftId` **and** its operation digest.

- same `draftId` + same digest → return existing receipt;
- same `draftId` + different digest → `CONFLICT`; never return the old receipt as if it matched.

Default payload limits: max 500 draft operations and max 256 KiB serialized request body. Keep these configurable and test them.

## 6.5 Time semantics

A device timestamp is an observation/claim, not server truth.

At commit:

- `recorded_at` is server time when It durably learned the event;
- `occurred_at_client` preserves the client's claimed time in the personal payload/provenance;
- canonical `occurred_at` is validated/normalized to the interval from the pinned flow's publication time through server `recorded_at` (allowing a small configured clock-skew tolerance before marking it adjusted);
- record whether normalization occurred.

Do not trust a client clock enough to create impossible history.

# 7. Flow and content architecture

## 7.1 Postgres is authoritative; published bundles are immutable and cacheable

Runtime flow/content authoring lives in Postgres.

```text
flows
  id UUIDv7 PK
  key text unique
  kind text
  active_version int

flow_versions
  flow_id UUIDv7
  version int
  status draft|published|retired
  min_engine_version int
  definition jsonb
  bundle_hash text null
  created_at timestamptz
  published_at timestamptz null
  frozen_at timestamptz null
  primary key(flow_id, version)
```

Publishing freezes a version and produces a canonical serialized bundle/hash. Editing means creating a new version.

Serve two cache classes:

```text
GET /api/content/onboarding-main/current
  → short-cache pointer to compatible flowVersion + bundleHash

GET /api/content/bundles/<bundleHash>
  → immutable bundle
  → Cache-Control: public, max-age=31536000, immutable
  → ETag/content hash
```

The first request after CDN miss may hit the API/Postgres; immutable bundles thereafter are CDN/browser cacheable. The “current” pointer must have a short TTL so newly published versions propagate.

Postgres remains the source of truth. S3/static JSON is not introduced as a second authoring source merely for performance.

## 7.2 Generic flow definition and tiny condition language

Keep node types deliberately small:

```ts
type FlowNode =
  | MultiSelectNode
  | SingleSelectNode
  | RatingNode
  | RevealNode
  | NarrativeNode
  | AuthGateNode
  | ArtifactNode
  | InviteNode
  | SupportNode;
```

A node describes semantics and content references. It must not contain React component source or arbitrary executable expressions.

Flow-edge conditions use a fixed data DSL, for example:

```ts
type FlowCondition =
  | { op: 'always' }
  | { op: 'selected'; contentId: UUIDv7 }
  | { op: 'not-selected'; contentId: UUIDv7 }
  | { op: 'count-at-least'; nodeId: UUIDv7; n: number }
  | { op: 'rating-at-least'; contentId: UUIDv7; n: number }
  | { op: 'and'; all: FlowCondition[] }
  | { op: 'or'; any: FlowCondition[] };
```

Do not add arbitrary JS, SQL, user-authored expressions, or a mini general route engine.

## 7.3 Publish-time validation

Publishing must fail unless:

- all referenced nodes/content IDs exist and are published/eligible;
- every non-deliberately-detached node is reachable from the root;
- every nonterminal edge targets a valid node;
- every reachable branch terminates or reaches an explicit terminal/gate;
- condition operators belong to the fixed DSL;
- no condition references data unavailable at that point;
- `minEngineVersion` can interpret every node/condition/rule in the bundle;
- no published version is mutated in place.

Property/generative tests should exercise random valid/invalid definitions around these rules.

## 7.4 Content model

Start with stable content objects and explicit relations:

```text
content_items
  id UUIDv7 PK
  kind                         -- personal_pain | world_pain | desired_state | fix | copy | ...
  status                       -- draft | published | retired
  sensitivity                  -- public-safe | sensitive | restricted
  canonical_key optional
  created_at

content_item_versions
  content_id
  version
  label
  short_text
  long_text optional
  metadata jsonb
  source/provenance jsonb
  published_at
  frozen_at

content_relations
  id UUIDv7
  source_id
  relation                     -- desired_alternative_to | alleviates | suggests | derived_from | ...
  target_id
  metadata jsonb
```

Sensitivity is provenance-aware: a derived desired state, narrative fragment, or artifact field inherits the strongest sensitivity of its source chain unless an explicit reviewed declassification/publication rule says otherwise.

## 7.5 Private narrative vs public artifact

Do not implement “public” as `serialize(privateNarrative) - a few fields`.

Use a distinct public projection/template set:

```text
private sources + private narrative rules
→ private narrative

public-eligible sources + public-safe templates
→ public artifact projection
```

Property test generated selection sets containing sensitive pains and assert that no field/text derived from those sources can enter the public projection by default.

## 7.6 Content authoring

Do not build a CMS in the MVP. Use validated seed/import/publish scripts against Postgres. The existing pain/fix corpus is seed material; preserve provenance and stable IDs where available without treating it as final truth.

## 7.7 Compatibility selection

When requesting `current`, the client supplies its `engineVersion` and app/platform version. The server returns the newest published flow compatible with that engine. A draft thereafter pins the exact `flowVersion` and `bundleHash` locally.

# 8. Authentication

## 8.1 Decision

Use **Better Auth** because it supports Expo native + web, has a Drizzle adapter, and supports both email OTP and phone-number OTP through plugins.

MVP:

- email OTP only;
- no password;
- session in native SecureStore through Better Auth's Expo integration;
- normal web cookie/session behavior;
- domain actor identity remains separate from auth/contact identifiers.

Later:

- add SMS OTP through the auth transport/provider abstraction;
- do not remodel domain identity around phone numbers.

## 8.2 Domain identity is not auth identity

Keep:

```text
auth_user/auth_identity
        ↓ linked-to
actor/principal UUIDv7
```

Do not use email as the primary key of domain tables. Email can change; the actor ID does not.

## 8.3 OTP delivery interface

```ts
interface VerificationTransport {
  sendEmailOtp(input: EmailOtp): Promise<void>;
  sendSmsOtp?(input: SmsOtp): Promise<void>;
}
```

Email OTP is sent **directly from Better Auth's send callback**. It is latency-sensitive authentication, not a scheduled/outbox job.

Use typed OTP codes rather than relying on magic-link continuity; acquisition may begin inside TikTok/Instagram in-app browsers and handoff to Safari can break local browser state.

Rate-limit OTP requests, never log OTP secrets, and keep the provider behind the transport interface.

# 9. Backend and API

## 9.1 tRPC is the application API

Use tRPC v11 + Zod + TanStack Query.

Benefits for this repository:

- end-to-end TypeScript types;
- Zod schemas at the trust boundary;
- highly focused procedure tests through direct callers;
- no OpenAPI/codegen loop for the first-party app;
- semantic procedure names align with the architecture's operation model;
- good CLI/source ergonomics for coding agents.

## 9.2 Semantic procedures

Good:

```text
content.onboardingPointer
content.bundle
onboarding.commitDraft
roadmap.vote
artifact.get
artifact.publish
invite.create
invite.respond
support.offerings
support.recordWebhook
account.delete
```

The anonymous counter endpoint is intentionally **not** an ordinary person/session tRPC mutation. It is a narrow unauthenticated HTTP endpoint with the fixed schema in §17.1 and no raw-event persistence.

Bad:

```text
saveScreen3
submitForm
updateCard
setCurrentPage
```

UI structure is not domain identity.

## 9.3 Procedure classes and HTTP shape

```ts
publicProcedure       // published content, public artifacts, invite lookup
protectedProcedure    // authenticated actor
internalProcedure     // workers/admin scripts only
```

One coarse HTTP Lambda serves Better Auth and tRPC under the first-party web domain/proxy:

```text
/api/auth/*
/api/trpc/*
/api/anonymous-count
/api/webhooks/revenuecat
```

Preview HTML routes (`/f/:slug`, `/i/:code`) may use the same runtime or a small separate handler if caching/HTML response behavior makes that cleaner.

For protected procedures:

1. verify Better Auth session;
2. resolve stable actor/principal;
3. open a database transaction;
4. set transaction-local Postgres on-behalf-of context;
5. execute application operation;
6. commit.

Never set a pooled connection's principal context outside a transaction.

## 9.4 Zod boundary

Use Zod for:

- API inputs and outputs;
- flow definitions loaded from Postgres;
- narrative rule definitions;
- imported seed content;
- environment variables;
- webhook/event payloads;
- local persisted draft schema/version migrations.

Do not duplicate Zod schemas as unrelated TypeScript interfaces. Infer types from schemas where the schema is the runtime authority.

---

# 10. PostgreSQL, Drizzle, and SQL-first discipline

## 10.1 Provider and driver

Use **Neon Postgres** initially for cost, but connect transaction-dependent application code through **node-postgres (`pg.Pool`) against Neon's pooled connection endpoint**, with the pool created once at module scope and reused across warm Lambda invocations.

Do **not** use Drizzle's Neon HTTP driver for protected procedures that rely on interactive transactions and transaction-local RLS context.

Reasons for Neon remain: low idle cost, ordinary Postgres semantics, branching for preview/test workflows, and easy provider replacement through `DATABASE_URL`.

AWS/SST remains application infrastructure; Neon is a cost/provider choice, not domain architecture.

## 10.2 Drizzle's role

Drizzle is a typed SQL layer, not the architecture.

Rules:

1. SQL migrations are reviewed and committed.
2. `drizzle-kit push` is not used against shared, staging, or production environments.
3. Generated SQL may be edited when Postgres-specific behavior requires it.
4. RLS policies, functions, indexes, extensions, triggers, recursive SQL, and unusual queries may be written directly in SQL.
5. Application queries should remain inspectable; avoid ORM magic that hides query behavior.
6. Migration history is append-only after deployment.

## 10.3 MVP schema groups

### Core event/history

```text
events(
  id uuidv7 primary key,
  type,
  record_class,
  occurred_at,
  recorded_at,
  flow_id null,
  flow_version null,
  rule null,
  rule_version null,
  payload_id null
)

payloads(
  id uuidv7 primary key,
  data jsonb
)

event_participants(
  event_id,
  principal_id,
  role                  -- actor | chooser | recipient | affected
)
```

### Exposure/response

Store exposure and response as distinct events. A query projection may join them for analytics/UI.

### Flows/content

As in §7.

### Auth

Better Auth-owned tables live in a distinct schema or clearly prefixed group. The application does not pretend they are actor/domain tables.

### Actor-linked onboarding commit

```text
onboarding_imports(
  draft_id uuidv7 primary key,
  actor_id uuidv7 not null,
  flow_id uuidv7 not null,
  flow_version int not null,
  operation_digest text not null,
  committed_at timestamptz not null
)
```

This makes commit retries idempotent. It is actor-linked interaction history and is deleted with the account.

### Projections

Only create projections the MVP needs:

```text
proj_actor_profile
proj_onboarding_selections
proj_roadmap_votes
proj_artifacts
proj_invites
proj_contribution_intents
```

Do not normalize the entire long-run ontology into hundreds of tables before product use demands them.

## 10.4 Row-level security and database roles

RLS is part of correctness, not a controller convention.

Use distinct roles:

```text
it_owner       -- migrations/schema owner; never used by app requests
it_app         -- production application; NOBYPASSRLS; does not own protected tables
it_test        -- integration tests; NOBYPASSRLS; does not own protected tables
```

Better Auth tables receive only the grants its runtime requires; do not grant the application role blanket ownership.

Integration tests must connect as `it_test`, **not** the Testcontainers `postgres` superuser. Explicitly assert:

```text
current_user = it_test
rolsuper = false
rolbypassrls = false
```

Critical tests:

- with no principal/on-behalf-of context, protected queries return zero rows or fail closed;
- A cannot read B's private rows;
- A cannot infer B's private rows through protected procedures;
- public rows remain readable as intended;
- transaction-local principal context cannot leak through the pool;
- signup/import cannot attach one local draft to another actor;
- the production role owns no protected application tables.

Use `FORCE ROW LEVEL SECURITY` selectively where owner access paths could otherwise undermine a security invariant, while keeping migrations/maintenance practical.

# 11. Future SQLite/offline architecture

## 11.1 What we do now

Use SQLite only as the implementation behind local key/value persistence on native.

Do **not** build general offline sync in the four-week MVP.

## 11.2 What we preserve for later

Choose today's primitives so offline does not force identity or mutation redesign:

- client-generatable UUIDv7 IDs;
- explicit `occurred_at` and server `recorded_at`;
- immutable version references;
- semantic mutation/operation names;
- idempotency keys;
- event-oriented history where required by the frozen architecture;
- deterministic pure reducers where possible.

## 11.3 Future model

```text
Postgres = authoritative durable server state

SQLite = local materialized projection/cache
       + local operation outbox
       + sync cursor
```

Sync operations/events, not arbitrary ORM row diffs.

A later offline operation might be:

```ts
{
  operationId: UUIDv7,
  actorId: UUIDv7,
  type: 'roadmap.vote',
  occurredAt: ISODate,
  baseVersion?: string,
  payload: {...}
}
```

Server behavior:

```text
receive operation
→ authenticate actor
→ check idempotency
→ validate against current semantics/permissions
→ accept / reject / transform explicitly
→ append server event
→ return new sync cursor
```

Do not promise CRDT conflict resolution now. Many It operations have semantics that cannot safely be reduced to “last write wins.”

## 11.4 Local Drizzle later

Drizzle's SQLite support may be useful when full local tables arrive, but do not force the Postgres schema and SQLite schema to be identical. SQLite is a projection/cache; Postgres semantics include RLS and server-only constraints that have no reason to be mirrored exactly.

---

# 12. UI system

## 12.1 NativeWind

Use stable NativeWind 4.x and Reanimated 4 versions known to work with the chosen Expo SDK. **Pin exact versions in the lockfile/package manifest for the MVP; do not float these foundational packages with broad ranges.**

Foundation phase must smoke-test:

- styles applied before and after mount;
- Reanimated transitions on styled components;
- reduced-motion behavior;
- web hydration;
- iOS release/dev builds.

Use NativeWind for layout/common styling, but keep semantic components project-owned.

## 12.2 Tokens

Own tokens centrally:

```text
color roles
spacing
radius
font families/sizes/line heights
motion duration/easing
content widths
breakpoints
shadows/elevation
```

Components use roles (`surface`, `text-muted`, `accent`) rather than arbitrary raw colors.

## 12.3 Responsive design

The whole product works on web and native, but responsive does not mean pixel-identical.

- shared semantic component;
- shared data/operation behavior;
- platform-aware layout when warranted;
- native gestures only where they improve native experience;
- web keyboard/focus semantics treated as first-class.

## 12.4 Reanimated

Use Reanimated 4 for:

- option selection/reordering feedback;
- pain → desired-state transformation;
- progressive reveal;
- narrative reveal;
- “something changed” transitions;
- collective/invite visualization.

Rules:

- motion communicates state change;
- no animation may be required to understand state;
- honor reduced-motion preferences;
- make animation timings deterministic enough that E2E tests can wait on semantic state, not sleeps.

---

# 13. Infrastructure with SST/AWS

## 13.1 Production shape

```text
                           weareit.app
                               │
                         CloudFront/SST
                    ┌──────────┼───────────┐
                    │          │           │
              static Expo   /api/*     /f/* /i/*
                 web           │           │
                               ▼           ▼
                       coarse HTTP Lambda  preview HTML handler
                         │   │     │
                         │   │     └── RevenueCat webhooks
                         │   └──────── Better Auth + direct OTP callback
                         └──────────── tRPC + anonymous counter
                                      │
                                      ▼
                              Neon pooled Postgres

separate async worker
  ← transactional outbox
  → invite/follow-up email, durable notifications
  (never auth OTP)
```

The web app uses same-origin `/api/*` so Safari/browser auth is not designed around cross-site cookies. Native clients may call the same canonical HTTPS API origin.

## 13.2 Keep Lambdas coarse

Do not create one Lambda per procedure. A single HTTP runtime reduces configuration and cold-start duplication; split only when measured workload/security needs justify it.

## 13.3 Transactional outbox

Use the outbox for durable asynchronous side effects such as:

- invite email;
- follow-up reminders;
- artifact/social notifications;
- background projection work if needed.

Do **not** route sign-in OTP through scheduled polling. Authentication code delivery is direct.

## 13.4 Anonymous counter endpoint/logging

For `/api/anonymous-count`:

- disable CloudFront/API access logging for that path where configurable;
- never log request bodies in Lambda/application logging;
- option/content IDs appear only in the POST body, never the URL/query string;
- no cookies/auth/session/draft IDs are accepted;
- use only an ephemeral best-effort abuse throttle keyed on source IP in process memory; never persist the IP/hash for analytics;
- store aggregate increments only, with lifetime or daily buckets—not fine-grained timestamps.

The system cannot truthfully claim the network never processes an IP address; the guarantee is that It does not **persist or intentionally join** the IP with semantic selections.

## 13.5 Secrets

SST secret/env management for database credentials, auth secrets, email provider credentials, RevenueCat webhook/auth keys, Stripe/RevenueCat web configuration, and any future SMS provider. No secrets in Expo bundles except provider-designated public SDK keys.

## 13.6 Environments

Separate dev/staging/prod resources and Neon branches/projects. Automated tests never target production. Published production flow bundles are immutable; staging can exercise publish/retire behavior independently.

# 14. Testing architecture: optimized for human + agent red→green→refactor

## 14.1 Initial four-week stack

| Layer | MVP tool | Why |
|---|---|---|
| pure TS/domain/flow engine | **Vitest** | fast focused watch/filter loop; terse failures |
| architecture/property tests | **fast-check + Vitest** | seeded, shrunk, replayable counterexamples |
| Postgres/RLS/migrations | **Vitest + Testcontainers Postgres** | real RLS/transactions/roles |
| tRPC procedures | **Vitest + `createCaller` + Testcontainers** | application semantics without HTTP noise |
| web product E2E | **Playwright** | strongest acquisition path; traces + network inspection |
| architecture imports | **dependency-cruiser** | machine-enforced dependency graph |

**Deferred until earned:** broad `jest-expo`/RNTL component coverage and Maestro native E2E scaffolding. Add targeted Expo tests when native-only behavior appears; add Maestro before native regressions justify it or before a wider native beta, not as week-one ceremony.

## 14.2 Mandatory red → green → refactor scope

Strict test-first red→green→refactor is mandatory for:

- flow engine/interpreter changes;
- narrative/public-projection behavior;
- API/domain behavior;
- persistence, idempotency, RLS, deletion, privacy boundaries;
- bugs where a deterministic regression can be expressed.

Do **not** force artificial test-first ceremony for purely visual spacing/copy tweaks. Visual UI work still runs relevant existing tests and Playwright golden paths before merge.

## 14.3 Pure/domain + golden tests

Run constantly:

- operation reducer transitions;
- engine/flow compatibility;
- fixed condition DSL;
- deterministic narrative;
- public sensitivity propagation;
- artifact projection;
- invite/support domain state;
- schemas/content mappings.

Golden fixtures:

```text
(engineVersion, flowVersion, operations)
→ derived selections/state
→ private narrative
→ public-safe artifact
```

## 14.4 Property tests — architecture guardrails

At minimum:

- published flow versions cannot mutate;
- publish-time graph validation rejects unreachable/dangling/nonterminating definitions;
- replaying an operation sequence is deterministic;
- serialization/deserialization preserves semantics;
- sensitivity never weakens through derivation unless an explicit allowed rule does so;
- public output contains no sensitive-source derivative by default;
- response/non-response/delivery-failure remain distinct;
- same `draftId`/same digest is idempotent; different digest conflicts;
- support payments never unlock product authorization/entitlements;
- identity remains stable through version/type changes.

## 14.5 Database integration tests

Spin up real Postgres, apply migrations from zero, create owner/app/test roles, connect assertions as `it_test`, seed minimum content, execute, assert.

Critical suites:

- migration from empty DB;
- role/RLS fail-closed checks;
- flow publish immutability;
- signup import transaction/idempotency/conflict;
- deletion implemented record classes;
- outbox atomicity;
- anonymous counter stores aggregate only;
- invite suppression/unsubscribe semantics;
- RevenueCat webhook idempotency/verification once support ships.

## 14.6 Web E2E — first browser priority

Start with **one Playwright golden path**, then add only high-value cases:

1. landing → onboarding → narrative → signup;
2. public artifact preview/privacy;
3. invite deep link.

The pre-signup golden path records every network request and acts as an **egress allow-list**. Before signup, it permits public bundle/pointer traffic and `/api/anonymous-count` only. The anonymous body must match the exact schema. Fail if any request contains:

- `draftId` or stable local identifier;
- rating values;
- narrative/private text;
- location;
- raw exposure history;
- unexpected selected-content payloads outside the approved aggregate shape.

Run this path in Chromium and WebKit; explicitly smoke-test TikTok/Instagram in-app browsers on real devices before launch.

## 14.7 Native beta testing

Keep TestFlight in the MVP path, but do not block web launch on Beta App Review. Before a TestFlight candidate, manually verify:

- fresh install onboarding;
- restart/resume local draft + pinned bundle;
- email OTP;
- narrative → commit;
- support IAP sandbox flow;
- invite deep link;
- reduced motion/accessibility basics.

Add Maestro when repeating these manually becomes a meaningful cost/risk.

## 14.8 Agent-friendly command contract

```bash
pnpm test:unit                # Vitest pure/unit/golden
pnpm test:arch                # fast-check + dependency-cruiser
pnpm test:db                  # Testcontainers integration
pnpm test:web                 # Playwright golden path
pnpm check                    # typecheck + lint + unit + arch
pnpm check:full               # + DB + web E2E
```

Optional/later commands appear only after their suites exist; agents should never be instructed to run nonexistent ceremony.

## 14.9 CI is authority

Agents report what they ran for debugging/context, but CI status is the merge authority. A prose claim that tests passed never overrides CI.

## 14.10 Do not overmock

Prefer direct pure functions, explicit fake ports, real Testcontainers Postgres for database semantics, tRPC `createCaller` for API semantics, and Playwright for browser/network behavior. Do not build a parallel fake backend.

# 15. API and operation examples

## 15.1 Public content

```ts
content.onboardingPointer({ flowKey, engineVersion })
content.bundle({ bundleHash })
artifact.public({ slug })
invite.lookup({ code })
```

No personal pre-signup selections are arguments to public content procedures.

## 15.2 Anonymous pre-signup count

Plain HTTP POST body only:

```ts
const AnonymousCount = z.object({
  flowVersion: z.number().int().positive(),
  nodeId: z.string().uuid(),
  optionId: z.string().uuid().optional(),
  action: z.enum(['screen_reached', 'selected_on_exit', 'skipped_on_exit', 'fake_door_vote']),
}).strict();
```

Send the final screen outcome on exit, not every tap. No rating value is sent pre-signup. No session, draft, account, IP-derived identifier, narrative, location, or free text enters application storage.

## 15.3 Signup import

```ts
onboarding.commitDraft({
  draftId,
  flowId,
  flowVersion,
  engineVersion,
  bundleHash,
  operations,
})
```

Server validates auth, supported engine, immutable bundle/hash, operation graph, payload caps, timestamps, operation digest/idempotency, and sensitivity/public-projection rules before writing.

## 15.4 Roadmap vote

```ts
roadmap.vote({ fixId, stance: 'want' | 'not-for-me' | 'unsure' })
```

Do not infer negative preference from silence.

## 15.5 Invite

```ts
invite.create({
  recipient: { kind: 'email', value },
  complimentContent?,
  artifactId?,
})
```

Non-user recipient contacts require:

- per-sender/IP abuse limits;
- unsubscribe/suppression support;
- no repeated send after suppression;
- plaintext contact deletion on expiry, unsubscribe, or sender-account deletion unless the recipient independently creates/owns the resulting account/contact relationship;
- a one-way/HMAC suppression key may remain so “do not contact” survives deletion without keeping the plaintext address.

Chooser/sender, recipient, delivery outcome, and recipient response remain distinct.

## 15.6 Support It

Product semantics:

```text
support ≠ product entitlement
support ≠ charitable donation claim
```

**iOS**

- RevenueCat + StoreKit consumable IAP products for optional one-time support/tips;
- no feature/content entitlement attached;
- fixed approved support tiers;
- App Review notes explicitly describe them as optional developer support/tips with no charitable-fundraising representation;
- external “Support on the web” CTA is shown only for storefronts where current Apple policy permits it. If storefront eligibility is unknown, hide the external CTA rather than infer from GPS/IP.

**Web**

- RevenueCat Web backed by Stripe for fixed one-time support and recurring support;
- recurring support lives primarily on web because a pure patronage subscription does not need to manufacture premium app value;
- no support tier changes authorization or feature access.

Where policy permits, the iOS UI may offer a web-support route with carefully reviewed copy such as “Support on the web” / “More of your support reaches It.” Do not hard-code U.S.-specific steering globally.

RevenueCat webhooks are verified and idempotent. Financial/provider records may have refund/accounting/tax retention requirements independent of ordinary interaction-history deletion. Minimize actor linkage and document the applicable retention basis; do not silently promise payment-processor erasure on account deletion.

# 16. Error model

Shared typed errors:

```text
UNAUTHENTICATED
FORBIDDEN
NOT_FOUND
CONFLICT
STALE_VERSION
STALE_ENGINE
INVALID_OPERATION
PAYLOAD_TOO_LARGE
RATE_LIMITED
TEMPORARILY_UNAVAILABLE
INTERNAL
```

Do not leak raw Postgres/provider errors.

Pre-signup bundle/network failure must not destroy a local draft. `CONFLICT` includes same `draftId` with a different digest. `STALE_ENGINE` means the pinned interpreter can no longer be safely processed and must produce an explicit update/restart path.

# 17. Observability without violating the signup boundary

## 17.1 Anonymous pre-signup product-learning channel

This is an explicit exception to “no answer data leaves the device,” but it is **not person-linked persistence**.

Allowed body fields are exactly:

```text
flowVersion
nodeId
optionId?          # semantic ID only, final screen choice
act                # allow-listed action enum
```

Rules:

1. POST body only; semantic IDs never appear in path/query parameters.
2. No session/cookie/account/draft identifier.
3. Send final screen outcomes on exit, not tap-by-tap interaction streams.
4. No rating values, narrative text, location, free text, raw exposure list, user agent fingerprint, or timestamp supplied by the client.
5. Endpoint stores **aggregate counters only**, never a raw request/event table.
6. Counter buckets are lifetime or daily; no hourly/minute buckets.
7. Endpoint/application/request-body access logging is disabled; do not persist IPs.
8. Best-effort anti-abuse may inspect source IP ephemerally in memory but cannot write it into analytics/storage.
9. Internal learning counts are distinct from public social-proof/released aggregates.
10. Public “N people feel this” numbers come from signed-up/released counts or pass a separate threshold/sanity/release policy; unauthenticated counters are not automatically trusted social proof.
11. Privacy copy discloses the anonymous-count behavior plainly.

The endpoint therefore supports aggregate funnel questions without reconstructing a person-level funnel.

## 17.2 Other pre-signup telemetry

Operational metrics may include endpoint latency, HTTP status counts, bundle/version requested, and coarse app/platform version **only if they cannot be joined to semantic choice bodies into a person/session trace**.

Third-party crash/analytics SDKs must be configured so they do not attach Zustand state, request bodies, narrative text, or local draft identifiers before signup.

## 17.3 After signup

Instrument semantic events/exposures according to the frozen architecture. Analytics is a projection of first-party events, not a second opaque behavioral source.

# 18. Security, privacy, safety, and public projection baseline

MVP baseline:

- TLS everywhere;
- Better Auth session handling;
- SecureStore on iOS for auth/session material;
- same-origin first-party web API routing;
- Postgres RLS with non-owner/NOBYPASSRLS app role;
- no secrets in clients beyond provider-designated public SDK keys;
- rate-limit OTP and invite endpoints;
- validate every external payload with Zod;
- sensitive data excluded from logs;
- separate auth/contact identifiers from domain actor ID;
- local draft TTL and clear control;
- sensitivity propagates through derivation by default;
- public artifact generation uses a separate public-safe compiler/template set, not field subtraction;
- no public artifact or social proof relies on anonymous raw per-person history.

### Location

If MVP asks for location, request device geolocation with explicit OS/product consent. Do not use postal code as a hidden stand-in for consented device location. Before signup, exact location remains local and cannot enter the anonymous count endpoint. After signup, persist only the resolution required by the product operation and its permission policy.

### Names

Real/display names are preferred social presentation where collected, but remain editable profile data. Actor identity is the stable UUIDv7.

### Crisis / abuse floor

- static crisis/help resources reachable without an account;
- clear notice that It is not an emergency-monitoring service;
- where any free text exists, a conservative local/client-side keyword trigger may surface resources without transmitting the triggering text merely for classification;
- report button/route for public artifacts and abusive invites;
- no claim that this static floor constitutes clinical monitoring or emergency response.

### Payment/support records

Support is optional and never changes access. Payment provider transaction records are minimized and isolated from product-history semantics; retention/deletion follows applicable payment/refund/accounting obligations after counsel review.

# 19. VS Code workspace

Check in workspace conventions so a human and agent see the same environment.

## 19.1 Recommended extension classes

Recommend, do not require:

- Expo tooling;
- ESLint;
- Prettier;
- Tailwind CSS IntelliSense;
- Vitest runner/explorer;
- Jest runner;
- Playwright;
- YAML support for Maestro;
- PostgreSQL/SQL syntax tooling;
- EditorConfig.

Avoid dependencies on editor-only behavior. Every meaningful action must have a CLI equivalent.

## 19.2 Settings

Repository settings should enable:

- format on save;
- ESLint fixes on save where deterministic;
- TypeScript workspace SDK;
- no implicit import sorting if it fights the formatter;
- consistent LF/newline/trailing whitespace behavior.

## 19.3 Tasks

Expose VS Code tasks for:

- app dev (Expo);
- web dev;
- API dev through SST;
- unit watch;
- app test watch;
- DB integration;
- Playwright UI/debug;
- architecture/property tests.

A human should be able to run the same command shown to the agent.

---

# 20. AGENTS.md strategy

Start with **one root `AGENTS.md`**. It must be short enough that coding agents actually obey it and specific enough to encode the dangerous boundaries.

It contains:

- governing-document order;
- universal Expo/no Next/Solito rule;
- dependency direction + `pnpm test:arch` enforcement;
- signup/person-linked persistence boundary and anonymous-count exception;
- flow + engine version compatibility;
- SQL/RLS role rules;
- semantic operation/event distinctions;
- support-payment rules;
- targeted red→green→refactor protocol;
- CI as authority;
- no silent dependency/architecture substitutions.

Add a scoped `AGENTS.md` later only when a package acquires rules that would otherwise bloat or conflict with the root instructions. Do not scaffold five instruction files just because the architecture has five packages.

# 21. CI/CD

## 21.1 Pull request checks

Required fast checks:

```text
typecheck
lint
format-check
Vitest unit/golden
fast-check architecture properties
dependency-cruiser architecture rules
```

Then for affected changes:

```text
Postgres/Testcontainers integration
web build
Playwright golden path
```

No mandatory repo-wide Jest/Maestro suite exists until those suites are intentionally introduced.

## 21.2 Main branch/staging

On merge:

- deploy SST staging;
- apply staging migrations through owner/migration role;
- publish Expo web staging;
- run Playwright against staging;
- build iOS preview only when native/config/purchase work changed materially.

## 21.3 Web launch and TestFlight

Web can launch without waiting for TestFlight Beta App Review. They are parallel deliverables from one universal codebase.

Before TestFlight candidate:

```text
pnpm check:full
production-like migration dry run
Playwright production-smoke candidate
manual native onboarding/restart/OTP/support/deep-link smoke
EAS Build
App Review notes explaining optional StoreKit support/tips
TestFlight submission
```

Android is not an MVP release target.

# 22. Implementation sequence

## Phase A — design pass + repository foundation in parallel

Design deliverables:

- onboarding → narrative → signup → invite → Support It prototype;
- mobile + desktop web states;
- motion notes and public/private artifact states.

Engineering deliverables:

- pnpm/Turbo workspace;
- Expo Router iOS + web shell;
- exact-pinned NativeWind/Reanimated smoke test;
- dependency-cruiser architecture rules;
- SST dev stage + same-origin API routing;
- Neon dev DB + owner/app/test roles;
- SQL migration pipeline;
- Better Auth typed email OTP spike;
- root `AGENTS.md`.

## Phase B — content + versioned flow engine

- content/flow tables/importer;
- publish/freeze/bundle hash;
- engineVersion + minEngineVersion;
- fixed condition DSL + publish validator;
- pure operation reducer including expose/rate/skip;
- deterministic private narrative + public-safe projection;
- golden fixtures across engine/flow versions;
- cacheable current pointer + immutable bundle endpoint;
- corpus seed import.

## Phase C — local onboarding + anonymous learning

- Zustand draft + bundle persistence;
- SQLite KV/native + localStorage/web adapters;
- rehydration gate;
- generic renderer + Reanimated transitions;
- 7-day TTL/clear answers;
- anonymous count endpoint/counter table/privacy copy;
- Playwright pre-signup egress allow-list test.

Exit: complete onboarding to narrative, restart/resume on pinned bundle, while only allowed aggregate increments leave the browser/device.

## Phase D — signup persistence boundary

- direct email OTP;
- actor creation/link;
- `commitDraft` idempotency + digest conflict;
- payload/timestamp validation;
- server engine/flow recomputation;
- event/payload/participant writes;
- RLS through `it_app`/`it_test` roles;
- local clear-on-ACK.

## Phase E — artifact, roadmap, invite, support

- roadmap vote;
- provenance-aware sensitive public projection;
- random public artifact/invite tokens + preview HTML/OG image;
- invite abuse limits, suppression/unsubscribe, contact lifecycle;
- RevenueCat setup;
- iOS StoreKit consumable support products;
- web RevenueCat/Stripe one-time + recurring support;
- storefront-gated external web-support CTA;
- crisis/help/report baseline.

## Phase F — hardening + launch/beta

- Playwright golden paths incl. WebKit;
- real-device TikTok/Instagram browser smoke;
- Testcontainers/RLS/property suites;
- deploy + rollback runbooks;
- web launch;
- EAS/TestFlight candidate in parallel.

Do not let TestFlight review block web launch.

# 23. Explicit non-goals for the four-week MVP

Do not build:

- Next.js;
- Solito;
- general offline sync/CRDT framework;
- a local SQLite domain replica;
- graph database/RDF store;
- Kafka;
- custom sync engine;
- general route engine;
- XState protocol runtime unless the actual MVP flow outgrows the small interpreter;
- runtime LLM narrative generation;
- general annotation infrastructure;
- differential privacy;
- broad public commons-contribution UI beyond what MVP exposes;
- Android release pipeline;
- a CMS;
- a universal ontology;
- broad Jest/RNTL component coverage before native-specific tests justify it;
- Maestro automation before repeated native manual regression cost justifies it;
- person/session-level pre-signup analytics.

A dependency is not justified because it appears in the long-run architecture.

# 24. Architecture acceptance tests

### Universal product

- same Expo route tree produces usable iOS and web product;
- web is polished/tested first for acquisition;
- `/f/:slug` and `/i/:code` produce correct unfurled previews without Next;
- TestFlight can ship independently of web launch.

### Signup/privacy boundary

- person can reach narrative before account creation;
- draft + pinned public bundle survive restart;
- no person/session-linked onboarding history is durable before signup;
- the only semantic pre-signup network write is the strict anonymous aggregate endpoint;
- Playwright egress test proves unexpected personal draft data does not leave;
- signup commit is idempotent and conflicting retries fail.

### Flow/engine

- Postgres is authoritative;
- immutable bundle URLs are long-cacheable; current pointer is short-cacheable;
- published flow versions are immutable;
- engine compatibility is explicit;
- old supported iOS clients receive a compatible flow;
- publish validator proves the finite flow definition is structurally valid;
- golden fixtures reproduce narrative across supported versions.

### Data/privacy semantics

- UUIDv7 identity is stable;
- device time is treated as claimed time;
- exposure and response are distinct after commit;
- deliberate skip is not abandonment;
- sensitivity propagates through derivation;
- public artifact compiler excludes sensitive derivatives;
- RLS tests run as a non-owner/NOBYPASSRLS role and fail closed without principal context.

### Support

- iOS support is StoreKit/RevenueCat and grants no entitlement;
- web support uses Stripe through RevenueCat Web for one-time/recurring support;
- external web CTA is storefront-policy gated;
- account deletion does not accidentally promise deletion of provider records needed for refunds/accounting.

### Testability/agents

- focused Vitest/fast-check/DB/Playwright commands exist;
- dependency direction is machine enforced;
- CI, not agent prose, is merge authority;
- red→green→refactor is mandatory where behavior/invariants are deterministic, not for every visual tweak.

# 25. Decisions deliberately left open

Not blockers:

- exact email delivery provider;
- later SMS provider;
- exact minimum privacy-release threshold for public social proof;
- exact RevenueCat/Stripe support amount tiers and final App Review copy;
- long-run payment/financial-record retention policy after counsel review;
- long-run local/offline conflict semantics;
- whether Next/Solito is introduced after measured web requirements;
- when targeted Expo component tests or Maestro become worth their maintenance;
- later CMS/editor;
- public annotation infrastructure;
- long-run matching/routing/math machinery.

The anonymous pre-signup aggregate channel, engine versioning, TestFlight target, consented device-location approach, real-name preference, crisis/abuse floor, and Support It payment model are **decided for this architecture**.

# 26. Source documents an agent must read

Before changing architecture-sensitive code, read the relevant portions of:

1. **`IT_MASTER_SPEC_v1.3_2026-10-04_CC0_SUPPORT.md`**
   - §7 current MVP product contract;
   - §8 pain corpus/fixes;
   - §14 invite/growth;
   - §15 shareable artifacts;
   - §16 privacy/discoverability/consent;
   - §19 event/evidence model;
   - §39 immediate work sequence;
   - §40 MVP acceptance tests.

2. **`It_Architecture_Constraints_and_Computable_Core_v2.1_FROZEN_CC0.md`**
   - record/history classes;
   - M1–M12 MVP hard invariants;
   - compatibility hooks;
   - build/borrow/defer boundaries.

3. **`Weve_Architecture_and_It_Assessment.md`**
   - §3 operations rather than model-owned canonical state;
   - §4 editable IR vs constrained IR;
   - §6 validation as architecture;
   - §14 recommended layered architecture;
   - §15 inherit/extend/reject decisions.

These documents constrain implementation. They are not excuses to import the entire research program into the MVP.

---

# 27. External implementation references checked for this design

Current as of 2026-10-04:

- Expo Router — universal native/web routing.
- Expo SQLite — `expo-sqlite/kv-store`.
- NativeWind + Reanimated — pin exact compatible versions and smoke-test after mount.
- tRPC v11 + TanStack Query.
- Better Auth — Expo integration, Postgres/Drizzle support, email OTP/phone hooks.
- Drizzle/Neon — use transaction-capable pooled Postgres access for interactive transactions; do not depend on `neon-http` for RLS transaction context.
- PostgreSQL RLS — owners/superusers bypass by default; app/tests use non-owner NOBYPASSRLS roles.
- SST/CloudFront — first-party web/API routing and coarse Lambdas.
- Vitest + fast-check + Testcontainers + Playwright.
- Apple App Review Guideline 3.1.1 — in-app purchase may be used for developer tips; 3.1.2 subscriptions require ongoing customer value; U.S. storefront rules permit external purchase CTAs without the external-link entitlement; nonprofit fundraising has separate rules.
- RevenueCat — tracks consumable/non-consumable IAPs, supports Stripe/RevenueCat web one-time and recurring purchases, and supports storefront-dependent app-to-web purchase flows.

Provider/platform rules can change. Payment/storefront behavior must be rechecked before App Store submission rather than treated as permanent architecture law.

# 28. Final implementation rule

When there is tension between elegance and shipping, use this order:

```text
1. preserve frozen semantic/privacy invariants;
2. preserve the person-linked signup boundary and the narrowly specified anonymous-count exception;
3. preserve deterministic versioned interpretation (engine + flow + operations);
4. preserve provenance/sensitivity so public output cannot inferentially launder private input;
5. preserve SQL/RLS correctness and explicit transaction semantics;
6. choose the simplest replaceable implementation;
7. ship web + iOS from one Expo product, with web launch not blocked by TestFlight;
8. let real use tell us which long-run machinery is actually needed.
```

“Support It” is optional patronage, not a premium tier and not a charitable-donation claim. Knowledge remains free; support keeps the gift running.

