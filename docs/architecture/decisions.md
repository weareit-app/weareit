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

## v0.1 launch

Decided 2026-10-16 (founder override of the assessment's weak-evidence gate); conditions confirmed 2026-10-19.

- **Go** on the full v0.1, built in the order a visitor meets it, despite weak demand evidence: one informal tester, no interviews or analytics. Launching is how the evidence gets gathered.
- **Launch target:** web. The iOS app is optional for v0.1, ships only if ready, and is kept working throughout.
- **Launch date:** Monday Nov 2, 2026, moved from Oct 26 on 2026-10-21 with the full launch bar (weareit-app/weareit#160). Stripe live setup by Thu Oct 29 and a live test on Sat Oct 31. Checkpoint Wed Oct 28: if signup and Support aren't running in production, ship the smallest version of whatever is slipping rather than move the date again.
- **Smallest version over delay:** if the build is clearly slipping mid-week, ship the smallest version of the slipping feature rather than delay launch.
- **Launch measures are never cut:** selected fixes, the stage funnel (see `visit-measurement`) and support conversion ship in v0.1.
- **Signup review line:** if more than about half of the people who reach the signup gate leave there, revisit required signup, with a decision record.
- **Re-assess about a month after launch:** review the measures and decide what to change.

## Platform and stack

- Expo Router is the universal app and route system. Revisit a separate Next.js app only if a demonstrated Expo limitation requires it.
- Use pnpm workspaces. The owner uses mise locally; contributor setup remains tool-agnostic.
- Use NativeWind 5.0.0-rc.0 with its exact `react-native-css` 3.1.0-rc.0 pairing, chosen for the SDK 57 prototype and kept for SDK 58 (2026-10-20, weareit-app/weareit#79). NativeWind labels v5 a pre-release and says it is not intended for production, so re-evaluate maturity before launch or switch to a stable compatible release.
- Keep `lightningcss` at 1.30.1 as the NativeWind/react-native-css compatibility override. Dependency refresh rules and current intentional version pins are recorded in `docs/architecture/dependency-policy.md`.
- Use oRPC for typed API contracts and Kysely for SQL access. Keep contracts/framework independent where practical.
- Developers get browsable API docs from their local dev server only (founder, 2026-10-21). With `API_DOCS=1`, which the API server's `dev` script sets and `start` never does, the server adds `/openapi.json` (generated from the contract on each request, never committed), a Scalar page at `/docs`, and oRPC's OpenAPI handler under `/api` so the page's "Try it" works with the same router, session, and admin token. The dev server listens on all network interfaces (`0.0.0.0`), so other devices on the same network can reach these routes, as they can `/rpc`. The app keeps using `/rpc`, and production neither serves nor loads any of this. Every operation carries a summary, a description, and a tag, and `cms.*` declares the Bearer admin token. The generator lives in `packages/api`; serving and Scalar live in `apps/api-server`. Say "developers" for this audience: "contribute" means people adding pains, futures, and ways. Serve it publicly, or add hand-written REST paths, only when a real outside consumer appears (a non-TypeScript client, a public API, or agent tools); either of those is a new decision.
- Use Neon initially through a provider-neutral PostgreSQL connection boundary.
- Store uploaded and other non-bundled images in Cloudflare R2, served from It's own domain (founder, 2026-10-19). Code reaches it only through the provider-neutral asset boundary over the S3-compatible API, so S3 with CloudFront stays a configuration swap. Chosen over S3 with CloudFront because DNS is already on Cloudflare (less setup) and R2 charges nothing for downloads. Images that ship with the app stay in the app build.
- Use TanStack Query for server state. Adopt other TanStack packages only for concrete needs.
- General offline sync is deferred. Pre-signup onboarding still needs local draft persistence and restart recovery on each platform.
- Product content (domains, pains, dreams, first actions, and their provenance) is database-backed from the start, not maintained as Git-authored runtime content. Build a first-party CMS for editing and publishing this structured content. PostgreSQL is the source of truth; Kysely owns migrations and SQL access, and the app receives validated content through semantic oRPC operations. Git may hold schema, migrations, seed/import tools, and snapshots for review, but must not become a competing source of truth.
- The CMS starts with a small structured workflow: edit drafts, validate references and required provenance, preview the onboarding experience, and publish a versioned content snapshot. Keep content revisions and publication history so changes can be reviewed and rolled back. Do not build a general page builder or workflow engine for MVP.
- Prettier formats code only (JavaScript and TypeScript). Docs, research data and vendored skills stay as written. `.prettierignore` is the one definition of what gets formatted, used by `pnpm run format`, CI's `pnpm run lint` and the pre-commit hook (weareit-app/weareit#62, #77).

## Identity and privacy

- Pre-signup answers remain on-device.
- On-device drafts do not expire automatically; the person can explicitly clear them.
- Signup is required after the personal and societal pages to continue (2026-10-16). Those two pages work without an account.
- Sign-in offers email OTP and email + password (2026-10-16).
- Passwords and passkeys (2026-10-17 founder review, spec 008): every account is created through an email code, so the email is verified first. Afterwards a person may add a password or register a passkey; both are optional. Passkeys are an addition to C3. Forgotten password means signing in with a code; no separate reset flow in v0.1. Passwords: 10–12 character minimum (exact number set in the plan), checked against known-breached passwords, no composition rules. Hashing uses Better Auth's built-in password hashing (scrypt); the plan records the algorithm and parameters here so that leaving Better Auth later does not force resets. Passkeys stay behind the same It-owned auth boundary.
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

Decided 2026-10-16; research in `docs/research/thing-type-relation.md`.

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

**Approved by the founder 2026-10-17.** Spec: `specs/007-watercolor-dot/spec.md` (being absorbed into `openspec/specs/brand-mark` via change `watercolor-followups`); research in `docs/research/watercolor.md`.

- **Why.** Both candidates in the fidelity proof need GPU shaders: Option B (look-alike shader) draws watercolor marks live, and Option E (dots painted ahead of time by physics) is colored live with Kubelka-Munk pigment optics. Reanimated, already installed, can move, scale and fade existing images but cannot draw new watercolor shapes. Skia gives GPU 2D drawing and custom SkSL RuntimeEffect shaders on iOS and web, driven by Reanimated shared values, and is supported in the Expo SDK 57 docs.
- **Version.** Install with `expo install` so the version matches the app's Expo SDK (SDK 57 when this was decided; SDK 58 since #79); record any pin in `docs/architecture/dependency-policy.md`. Not installed yet; the fidelity proof installs it.
- **Web cost.** Skia on web loads CanvasKit (WebAssembly), about 2.9 MB gzipped, against the founder's 1 MB extra web budget loaded after the first screen (FR-011). So web will likely use the animated painted orb in all three placements, and Skia is used on iOS, unless the fidelity proof finds a web path for the chosen dot within 1 MB. The proof must report the web download for each approach. *(Superseded the same day: see "Web, updated 2026-10-17" below.)*
- **Native cost.** Roughly 4–6 MB added to the iOS binary (figures vary between sources; the proof measures it). Targets are iPhone 12 and newer (founder, 2026-10-17).
- **License.** `@shopify/react-native-skia` is MIT and Skia itself BSD-3-Clause; both are compatible with the AGPL-3.0-or-later app license.
- **Code that may not be copied.** sudoaquarelle.com publishes no license, so it is all-rights-reserved by default; Mixbox is CC BY-NC 4.0 (non-commercial only). Neither its code nor its data may be copied into It. Simulation and color mixing are written from published papers (Curtis et al. 1997 and later work) and the Kubelka-Munk equations.
- **Generated dots.** Dots painted ahead of time are CC0 illustrations under `docs/architecture/licensing.md`, with seed, simulation settings and pigments recorded as provenance; the drawing and simulation code is AGPL app code (founder confirmed 2026-10-17). The simulation is a tool kept outside the shipped app; only its output ships.
- **Web, updated 2026-10-17.** The proof found the lighter web path: dot B's shader is translated to GLSL and drawn with WebGL directly (`apps/app/src/watercolor/webgl-dot.web.tsx`). Skia stays iOS-only plus the dev lab.
- **Fallback.** The painted orb (`apps/app/assets/brand/watercolor-orb.jpg`) is shown in the same place and size wherever a generated dot is not ready, cannot be drawn, or does not fit the web budget, on every platform. No screen or action waits for Skia. If neither B nor E passes the proof, all placements use the animated painted orb and Skia is not adopted.

## Generated possibility content

- Onboarding candidates (dreams and fixes) are generated by the possibility generator (`tools/possibilities/`, run by the `possibilities-*` skills; behavior in `openspec/specs/possibility-generator`). They are drafts in Git for review only. The database and CMS remain the source of truth, and nothing is published from the generator (2026-10-17; moved out of Spec Kit 2026-10-19).
- In generated copy, honesty lives in fields: `status` (real now / existing resource / proposed It feature / societal proposal), exemplar `limits` and `verified`, and `speculative`. It is not written into the prose. Copy is "plain but specific" and follows `docs/style/copy-style-guide.md` (a trusted mentor's or hometown doctor's voice; no separate scenes). This replaces the fifth-grade reading target for generated content. Any UI that shows generated items must display these fields (2026-10-17).
- A real-world example counts only if its source was opened and located in the run; recalled examples are marked unverified. Every number and proper noun in a fix must appear in its cited example's record (2026-10-17, lint added 2026-10-18).
- Each fix has a kind (feature, task, schedule, habit, practice, learn, project, group, new-group; path later), defined in the copy guide. Features are written as capability pitches, not user actions (founder, 2026-10-19).
- Fixes are brainstormed per kind, not by one writer who tags kinds afterwards (founder, 2026-10-20; grilling and `docs/research/fix-kind-ideation/research.md`). The single writer drafted 44% Tasks and 36% Features across 17 pains, leaving every other kind thin. The order is research, then dreams, which the founder reviews before any fix is drafted, then one planner per pain that sets a ceiling per kind for each dream, a pass for fixes that serve several dreams, one brief per kind, a cheap screen, an assembler that links fixes to dreams, the judge panel, and founder review of each fix once. Ceilings rather than quotas, because LLM brainstorms collapse into duplicates and quotas invite filler. Each kind's method (job story, if-then plan, named decision-maker) is stored as fields and never written into copy.
- Generator output is dreams, fixes and fix–dream links, matching the content graph, not cards; a fix can serve several dreams (founder, 2026-10-20). This replaces the card shape.
- Ask and Use a resource join the kinds; Leave and Switch are separate trial kinds until the pilot decides; there is no Give kind, because "support" is reserved for paying It (founder, 2026-10-20). Growing the app's own kinds (today once, habit, group, feature) is a separate change.
- A dream is a desired end state for one pain, not a means of reaching it (founder, 2026-10-20, after the pilot's first dream drafts). The pilot's first drafts were mostly means: one example rewritten as "I…" (a free weekly 5k, a chat bench, rental help through 211, a law capping rent). That left the per-kind fix stages nothing to add. Two checks define a dream:
  - **Why test (not too low):** asking "why do you want that?" doesn't lead to something else inside the same pain. "No planes over my house at night" fails, because the answer is "so I can sleep".
  - **Swap test (not too high):** it wouldn't fit a different pain unchanged. "I'm happy" and "I have energy all day" fail.
  Anything that produces the end state is a fix, however large: a law, a program, a quieter street. A dream describes the world only when the pain itself is about the world.
- Following from that (founder, 2026-10-20):
  - Dreams cite no examples; examples feed the fix stages.
  - Lens and ambition move from dreams to fixes, and coverage is counted on a pain's linked fixes.
  - There is no set number of dreams per pain: as many as are genuinely distinct, with overlaps flagged.
  - An isolated dream screen applies both checks, with reasons, before the founder's review. Dreams it fails stay visible, collapsed, so the founder can rescue one. This replaces the word-level `dream-not-outcome` lint.

## Rendering

Expo Router now documents static and request-time server rendering. Start with static output for public content and app routes; evaluate server output for dynamic share previews before adding a separate web framework or custom metadata server. Dynamic server rendering requires a production server runtime, so this decision also depends on the hosting path.

## Hosting, email and deploys

Decided 2026-10-19 by the founder (ticket "Pick hosting, email provider and deploy flow for launch", weareit-app/weareit#6), replacing the earlier SST on AWS lean on cost and setup time. Revisit at the re-assessment about a month after launch.

- **Hosting:** Render. The web build is a static site at `weareit.app`; the API is an always-on paid web service in Virginia at `api.weareit.app`.
- **Staying portable:** no Render-only features or host-local disks; config only from environment variables; DNS stays on Cloudflare; Render setup lives in one small `render.yaml`; the API has a real build step rather than starting through `tsx`.
- **Database:** Neon in `aws-us-east-1`, starting on the Free plan.
- **Email:** Resend over SMTP behind the `sendEmail` boundary, starting on the Free plan; Postmark is the upgrade if volume or deliverability needs it. Resend keeps email data, including sign-in codes, for 30 days, and the privacy page says so.
- **Deploys:** master deploys to production only after CI passes; pull requests get previews of the static web build only; no staging; database migrations run before each API deploy; rollback is a redeploy of an earlier deploy.
- **CI:** GitHub Actions on standard `ubuntu-latest` runners, which are free for public repositories. Two jobs must pass before master deploys: `check` (typecheck, lint, Vitest, jest-expo) and `e2e` (Playwright web tests). Runner costs and action pins: `docs/architecture/dependency-policy.md`.

## Component review

- Storybook (`@storybook/react-native-web-vite`, web only) shows components one at a time for pull-request review, and `pnpm storybook:review` screenshots every story for a branch and its merge base and reports what changed (founder, 2026-10-20). The founder chose Storybook over an in-app gallery route, on condition that it render the app faithfully. Storybook builds with Vite, not Metro; NativeWind 5's Babel preset and Tailwind's PostCSS plugin both run there, and the stories render the app's tokens, fonts and dark mode. If a NativeWind or Expo update breaks that, fix the Storybook config, or move the stories to an in-app gallery route; don't change the app to suit Storybook. Details: `docs/architecture/storybook.md`.
- Review is local for now: screenshots and a report on the reviewer's machine. Publishing Storybook on pull-request previews waits on the Render preview deploys above (weareit-app/weareit#72).

## Code conventions

Decided 2026-10-21 in the repo conventions map (weareit-app/weareit#140) and carried out by the `repo-conventions` OpenSpec change. Each convention is enforced by a check where it is mechanical, and by a rule in `CODING_STANDARDS.md` where it is a judgement call.

### Docs and steering

Decided with the founder in weareit-app/weareit#152.

- **Decision records** live only in this file: current decisions grouped by topic and edited in place, plus the dated change log below. There is no `docs/adr/` folder; a check that fails if one appears comes with the `repo-conventions` change.
- **`AGENTS.md`** holds guardrails and pointers: product intent, the binding stack lines, and the privacy invariants, plus one pointer to each other doc, worded with when to read it. Anything with another home moves there.
- **The privacy invariants are written only in `AGENTS.md`.** This file records when and why each was decided or changed and links to `AGENTS.md`, without restating them. Changing an invariant still needs a dated entry here.
- **Judgement rules** that review applies and no check can enforce live only in `CODING_STANDARDS.md`. `AGENTS.md` and `openspec/config.yaml` point to it instead of copying its rules. A rule a check can enforce becomes a check instead.
- **Workflow detail** (the OpenSpec workflow, the Spec Kit retirement notes, and skill configuration) lives in `docs/agents/`, with one pointer per file in `AGENTS.md`.
- **One steering file:** one root `AGENTS.md`, with no `CLAUDE.md` and no `.claude/rules/`. Claude Code reads `AGENTS.md` directly when no `CLAUDE.md` exists, and adding a `CLAUDE.md` would stop it loading nested `AGENTS.md` files (checked 2026-10-21 against Claude Code's memory docs, code.claude.com/docs/en/memory). A package gets a nested `AGENTS.md` only when it has rules nothing else carries.
- **Doc roles:** this file says what was decided and why. `docs/architecture/<topic>.md` says how a decided area works (setup, gotchas, versions), and its entry here links to it. An OpenSpec `design.md` covers one change; when the change is archived, each decision that outlasts it gets an entry here.

### Domain model package

Decided with the founder in weareit-app/weareit#147; carried out in group 2 of the [`repo-conventions` change](../../openspec/changes/repo-conventions/tasks.md).

- **One Zod-only package, `@it/domain`,** holds every domain schema and the pure domain logic, with one module per domain, each its own export subpath: `primitives` (slug ID, non-empty text, ISO date, ISO datetime), `content` (the content graph and the tier-1 authoring schemas), `essays`, `onboarding`, and `support`. Modules import along real dependencies only: onboarding → content → primitives; essays → primitives; support → primitives.
- **`@it/content` holds only content data and the essay build,** and imports its schemas from `@it/domain` like every other layer. `@it/watercolor` keeps its rendering schemas (manifest, palette, pigment), which no other layer restates.
- **Types come from schemas:** a type for a value with a schema is `z.infer` (or `z.input` for a value before parsing), never written by hand, and enum unions come from their schema. Hand-written types are for values with no schema, such as props and internal state.
- **Tier-1 authoring schemas are built from the graph schemas** with `pick` and `extend`. A rule both share, such as a feature status being required exactly when a way's kind is feature, lives on the graph schema.
- *Alternatives:* a separate `@it/primitives` package, splitting `@it/content` into schema and data packages, or no move. Each kept a package-edge question for every shared shape; modules in one package remove it.

### Generated table types

Decided with the founder in weareit-app/weareit#147; carried out in group 3 of the [`repo-conventions` change](../../openspec/changes/repo-conventions/tasks.md).

- **Table types are generated, not written by hand.** kysely-codegen writes `packages/database/src/db.ts` from a scratch database migrated to latest (`pnpm db:types`). Enum columns narrowed by `CHECK` and the `jsonb` columns are typed with their `@it/domain` types through column overrides, so the domain stays the one owner of those shapes. Pin and option notes: `docs/architecture/dependency-policy.md`.
- **Check 1, codegen with `--verify`:** CI's `check` job runs `pnpm db:types --verify` against its Postgres service and fails if the committed `db.ts` differs from fresh output. A migration can't land without its types.
- **Check 2, the `CHECK` enum test:** `packages/database/tests/check-enums.test.ts` reads every enum `CHECK` constraint from the Postgres catalog and fails if its values differ from its Zod enum, naming the column and the values. It also fails on an enum `CHECK` with no Zod enum mapped to it. Neither check alone catches both a missing column type and SQL-versus-Zod drift.
- **Generated names are kept:** the database interface is `DB`, as kysely-codegen names it. Table interfaces keep the `Table` suffix (`ContentPainsTable`), produced by kysely-codegen's `singularize` option, so the `Table`-suffix naming rule holds without hand edits.
- *Alternatives:* hand-written table types derived from Zod types. Kysely's docs call hand-written types good enough in many cases (#145, checked 2026-10-21), but a new column can go untyped without failing anything.

## Open implementation decisions

- Sender identity (from-address and reply-to) for service email.
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
- 2026-10-17 (founder review of spec 008): passkeys added as an optional sign-in method alongside email code and password (extends C3); every signup starts with an email code; password rules and hash-recording requirement set.
- 2026-10-19: measurement privacy invariant changed (spec 013, founder answers Q1–Q12). Changed: the signup/sign-in visit is linked to the account (reverses 008 FR-028 "never linked"); per-page views including each pain page (reverses the per-pain part of 012 FR-020); each opened pain recorded by ID (reverses 008's "opened pains not sent"); deleted accounts' visits unlinked and kept; exact receive times; records kept indefinitely; no opt-out. Kept: no picks or selected fixes sent before signup; visit ID in memory only; no cross-visit link before signup; how a visit arrived is not recorded; never public. Open: when account linking switches on (010 Q37).
- 2026-10-19: recorded the v0.1 launch decision and its conditions (from the it-mvp assessment; founder confirmed which still hold); moved assessment research to `docs/research/`.
- 2026-10-19: added the generated possibility content decisions (honesty in fields, plain but specific copy, verified and traced examples, fix kinds); the generator moved from a Spec Kit extension to `tools/possibilities/` and skills.
- 2026-10-19: founder chose hosting, email and deploys for launch (Render, Neon Free, Resend Free, master deploys after CI); replaces the SST on AWS lean.
- 2026-10-19: chose Cloudflare R2 for image storage, behind the asset boundary (over S3 with CloudFront: DNS already on Cloudflare, no download fees).
- 2026-10-20: founder chose Storybook for component review, with a local screenshot comparison per branch; Storybook links on pull-request previews come later.
- 2026-10-20: founder chose to run the Playwright web tests in CI as their own job (weareit-app/weareit#63), reversing the choice in #66 to leave them out as slow and prone to failing for reasons unrelated to the code. Deploys from master now also wait for them; if they prove flaky, remove the `e2e` job.
- 2026-10-20: founder asked to move the app to Expo SDK 58 (weareit-app/weareit#79, a draft until after the Oct 26 launch), mainly for per-route web bundles. Expo Router async routes are limited to web production builds, so development keeps one bundle. The stack is unchanged: same Expo Router, NativeWind pair and Skia, at SDK 58's versions (`docs/architecture/dependency-policy.md`).
- 2026-10-20: recorded the code-only Prettier decision (from #62 and #77), which until then lived only in tool config comments.
- 2026-10-21: founder chose local-only OpenAPI docs for developers: a generated spec, a Scalar page, and an OpenAPI transport beside RPC, all behind `API_DOCS=1`. The app's RPC transport and production are unchanged.
- 2026-10-21: founder moved the v0.1 launch from Oct 26 to Nov 2 with the full launch bar, because none of the four launch features was built yet (weareit-app/weareit#157, #160); added a Wed Oct 28 checkpoint.
- 2026-10-21: added the code conventions topic with the docs and steering decision (weareit-app/weareit#152): decision records only in this file, `AGENTS.md` as guardrails and pointers and the one source of the privacy invariants, judgement rules only in `CODING_STANDARDS.md`, workflow detail in `docs/agents/`, and no `CLAUDE.md`.
- 2026-10-21: added the domain model package decision (weareit-app/weareit#147): every domain schema in one Zod-only `@it/domain` with a module per domain, `@it/content` reduced to data and the essay build, types derived from schemas, and tier-1 authoring schemas built from the graph schemas.
- 2026-10-22: added the generated table types decision (weareit-app/weareit#147): kysely-codegen output checked in CI with `--verify`, a Postgres test that each enum `CHECK` matches its Zod enum, and the generated names kept (`DB`, and the `Table` suffix).
