# Design

## Context

See proposal.md for why. Each decision below was settled with the founder on 2026-10-21 in a ticket under the wayfinder map [#140](https://github.com/weareit-app/weareit/issues/140); the ticket's resolution comment is the source, and research findings on the unmerged `research/*` branches are evidence only. Current state, from those tickets and the repo at `2841465`:

- `@it/content` holds 47 Zod schemas plus content data and the essay build; `@it/domain` holds only `onboarding.ts`. 15 shapes are written more than once, such as support frequency in 8 places ([#141](https://github.com/weareit-app/weareit/issues/141)).
- `@it/api` exports `./contract`, `./router`, and `./client`. `client.ts` imports its types from `router.ts`, so the app's type graph reaches `@it/database`, `kysely`, and `pg` ([#141](https://github.com/weareit-app/weareit/issues/141), [#145](https://github.com/weareit-app/weareit/issues/145)).
- Three relative-path edges cross packages: the e2e specs into `packages/database/src/tier1-import`, and `tools/watercolor-sim` into `packages/watercolor/src` and `apps/app/src/watercolor/marks.ts`.
- `pnpm run lint` is `prettier --check .` plus `essays:check`. There is no linter. `essays:check` already fails when an essay module is stale; the essay build formats its output with Prettier.
- `vitest.config.mts` lists 14 test folders by hand. `tools/test-coverage` already fails when a tracked test file is collected by no runner, by asking Vitest and Jest for their file lists. CI already starts Postgres and sets `TEST_DATABASE_URL` (#155).
- The router builds `ORPCError`s by hand and maps payment failures by matching sentinel strings in `error.message`. Plain `Error`s from `content-repository.ts` reach the CMS as "Internal server error" ([#170](https://github.com/weareit-app/weareit/issues/170)).
- About 20 server variables are read directly in five `apps/api-server` files. `EXPO_PUBLIC_API_URL` and its localhost fallback are read in three places, one in `packages/api` ([#171](https://github.com/weareit-app/weareit/issues/171)).
- There is no logger; the server writes with `console`.
- `.claude/skills` and `.agents/skills` each hold 41 skills; `pains-ingest` and `pains-review` are stale in `.agents/`, and nothing checks the two ([#142](https://github.com/weareit-app/weareit/issues/142)).

## Goals / Non-Goals

**Goals:**
- Every mechanical convention fails a check, in CI at least, and every judgement rule is in `CODING_STANDARDS.md`.
- Each step lands as a small PR that can merge between feature PRs without pausing launch work.

**Non-Goals:**
- Rewriting existing error handling and copy beyond what a new lint rule needs. Other screens are brought in line as they are touched.
- Changing any stack choice in `AGENTS.md`. Biome, ESLint, and the other tools are additions to the toolchain, not replacements of Expo, oRPC, Kysely, NativeWind, TanStack Query, or pnpm. The one tool replaced is Prettier, which `decisions.md` records today.

## Decisions

### 1. One Zod-only model package with a module per domain ([#147](https://github.com/weareit-app/weareit/issues/147))

`@it/domain` gets `primitives`, `content`, `essays`, `onboarding`, and `support` modules, each its own export subpath. Module edges follow real dependencies (onboarding → content → primitives; support → primitives; essays → primitives). `@it/content` keeps data and the essay build and imports its schemas. `@it/watercolor` keeps its rendering schemas.

*Alternatives:* a separate `@it/primitives` package, splitting `@it/content` into schemas and data packages, or no move. Each kept a package-edge question per shared shape; modules in one package remove it.

### 2. Types from schemas; generated table types point back at them ([#147](https://github.com/weareit-app/weareit/issues/147))

Types are `z.infer` (or `z.input`). Kysely table types come from kysely-codegen 0.20.0 run against the migrated database, with about 21 overrides (18 `CHECK`-constrained enum columns, 3 `jsonb` columns) that import `@it/domain` types through `--custom-imports`. CI runs it with `--verify` against the Postgres service. A Postgres-backed test reads each enum `CHECK` constraint from the catalog and compares it with its Zod enum.

*Alternatives:* hand-written table types derived from Zod types. Kysely's docs call hand-written types "good enough" in many cases ([#145](https://github.com/weareit-app/weareit/issues/145) findings, checked 2026-10-21), but they let a new column go untyped without failing anything. Codegen plus `--verify` catches that, and the `CHECK` test catches SQL-versus-Zod drift, which neither approach catches alone.

*Check when implementing:* kysely-codegen 0.20.0's `--overrides` and `--custom-imports` syntax, and whether it can name interfaces with a `Table` suffix. If it can, use it; if not, generated names stand.

### 3. `@it/api-contract`, and the router in `apps/api-server` ([#147](https://github.com/weareit-app/weareit/issues/147))

The contract package holds the contract, a client typed from the contract alone (`ContractRouterClient` in `@orpc/contract` 1.15.6, per #145), and the OpenAPI generator. The client factory takes the API URL as an argument. The router moves to `apps/api-server/src/router.ts`; its service port types come from `InferContractRouterInputs` and `InferContractRouterOutputs` plus fields such as `userId`. `@it/api` is deleted in the same PR as the router move, so no PR leaves two copies.

*Alternatives:* keep `@it/api` and only switch `client.ts` to the contract-typed client. That fixes the type graph by convention only; the split makes it structural, and dependency-cruiser can then check it.

### 4. dependency-cruiser owns every boundary rule ([#149](https://github.com/weareit-app/weareit/issues/149))

One `.dependency-cruiser.cjs` holds the package graph, the no-relative-path rule, the third-party allowlist for the four pure packages, the `@it/domain` module edges, the `@orpc/server` rule from #170, and `no-circular`. Type-only imports are included (`tsPreCompilationDeps: true`). It runs inside `pnpm run lint` in CI and as a lefthook job with `--cache`. Version 18.7.0 per #144; the pin follows the two-week rule. Exceptions live only in the config, each with a `comment`; there are none on day one.

The allowlist applies to each pure package's `src/`. The essay build (`packages/content/scripts`, `packages/content/essay-build`) is a build tool with its own dev dependencies; the rule for those folders is "never imported from `src/`". This reading is an assumption, recorded in the decision entry.

*Alternatives:* Turborepo boundaries (experimental, no file-level rules) and Biome `noRestrictedImports` overrides plus a script (rules in three places). Revisit Turborepo boundaries if it leaves experimental and covers file-level and third-party rules.

knip 6.42.1 and sherif 1.13.0 run in CI only. knip needs entries for Expo Router routes, Storybook stories, and the generated essay modules. pnpm catalogs were not chosen because they fight `npx expo install`.

### 5. Biome plus a thin ESLint 10 pass ([#148](https://github.com/weareit-app/weareit/issues/148))

Biome 2.5.15 lints and formats every JS and TS file. Its formatter matches Prettier's defaults; `.prettierignore` becomes Biome's `files.includes`. Rules: recommended plus the `react` and `project` domains, with `useHookAtTopLevel` and `useExhaustiveDependencies` off. ESLint 10.12.0 lints only TS files with typescript-eslint 8.71.1 `recommendedTypeChecked` (type-aware rules only; the rest are off because Biome covers them), `eslint-plugin-react-hooks` 7.1.1 `recommended`, and `@eslint-community/eslint-plugin-eslint-comments` 4.8.1 `require-description`, with `reportUnusedDisableDirectives: "error"`. CI runs `biome ci --error-on-warnings` and `eslint --max-warnings 0`. These versions and their ESLint 10 peer ranges were checked on 2026-10-21 in #148; re-check the two-week rule when pinning.

The essay build stops importing Prettier and formats its output with Biome, so `essays:check` keeps comparing like with like. Biome lands as two PRs: the formatter swap (pure churn, easy to review) and then the lint rules with their fixes.

*Alternatives:* Biome alone (missed all three real promise bugs, no React Compiler rules), ESLint alone with Prettier (slow, still two tools), Oxlint (type-aware mode needs TypeScript 7 and no `baseUrl`). Revisit at TypeScript 7 or when Biome's promise rules leave nursery.

### 6. Two syntax rules go in the ESLint pass ([#147](https://github.com/weareit-app/weareit/issues/147), [#170](https://github.com/weareit-app/weareit/issues/170))

`no-restricted-syntax` bans `new ORPCError(...)` in `apps/api-server/src/router.ts` and its handler files, and bans `.strict()`, `.passthrough()`, and the deprecated string format methods on Zod schemas. ESLint hosts both because it already has the selector rule; Biome would need a GritQL plugin for each. The 39 `.strict()` calls are fixed in the same PR.

### 7. Naming enforced by Biome where mechanical ([#165](https://github.com/weareit-app/weareit/issues/165))

`useFilenamingConvention` (kebab-case), `useNamingConvention` (`strictCase`), `noDefaultExport`, `noBarrelFile` and `noReExportAll`, `useConsistentTypeDefinitions` (`interface`), and `useImportExtensions` set per folder (`.ts` in `tools/*` and `packages/watercolor`, extensionless elsewhere because Metro resolves `foo.native.ts` only for extensionless imports). Overrides: Expo Router names and migrations for file names; `packages/database` table types and typed Stripe and RevenueCat payloads for property names; `apps/app/app/**`, `*.stories.tsx`, and `*.config.*` for default exports; `packages/watercolor/src/shaders/index.ts`, or rename it `shaders.ts`. The rest are `CODING_STANDARDS.md` rules.

*Check when implementing:* each rule name and option against the Biome 2.5.15 docs, whether `useFilenamingConvention` accepts `+not-found` and `[id]` without an override, and whether `noBarrelFile` flags `shaders/index.ts`.

### 8. Colocated tests, Vitest projects, one layout check ([#150](https://github.com/weareit-app/weareit/issues/150))

`vitest.config.mts` uses `test.projects` with globs (`packages/*`, `apps/api-server`, the TypeScript `tools/*`, and an `apps/app` logic project for `*.test.ts`). jest-expo owns `apps/app/**/*.test.tsx` and moves to `jest-expo/universal`. The existing `tools/test-coverage` check is extended rather than replaced: it already asks the runners which files they collect, and gains the three layout rules (no `tests/` or `__tests__`, nothing under `apps/app/app/`, `*.spec.ts` only in `apps/app/e2e`). It already runs in CI and lefthook.

The Postgres harness reads `TEST_DATABASE_URL` from the shared `test-env.ts`; when `CI` is set and the URL is missing, it throws instead of skipping.

The move is one mechanical PR (`git mv` plus globs). The `jest-expo/universal` switch is a separate PR because it changes snapshots.

*Checked when implementing (2026-10-25, jest-expo 58.0.11's `config/getPlatformPreset.js`):* outside `__tests__`, jest-expo matches `foo.test.<platform>.tsx`, not the README's `-test.<platform>.*`. Essay block tests are `*.test.web.tsx`, and the Node project leaves out `web` so they run on web only. Ten component suites failed on web and Node under the universal preset, because React Native Testing Library can't render react-native-web's DOM elements; the founder chose to name them `*.test.native.tsx`, leaving web behavior to Playwright (2026-10-25). Python tests keep their `tests/` folders and are outside the layout rules (founder, 2026-10-25).

### 9. Typed errors in the contract, classes on the server ([#170](https://github.com/weareit-app/weareit/issues/170))

Procedures declare `.errors({ CODE: { status, message, data } })`. Shared failures go on a base built with `oc.errors(...)`. `UNAUTHORIZED` (signed out) and `NOT_FOUND` (a record the caller doesn't own) keep their names; every new code is a domain name (founder answers, below). Repositories and payment services export `Error` subclasses with typed fields (for example `RevisionConflictError { expectedRevision, actualRevision }`); the router catches each and returns `errors.CODE({ data })`. Anything else propagates, so oRPC turns it into `INTERNAL_SERVER_ERROR` with a hidden message, and the server's interceptor logs it with its cause.

The app gets one helper per feature (`describeCmsError`, `describeSupportError`) that narrows with `isDefinedError` and returns copy keyed by code, with one generic sentence as fallback. TanStack Query's `onError` or error state calls it. `describeApiFailure` stays as developer-only detail. The founder approves the copy.

This change converts every existing `new ORPCError` in the router, because the lint rule in decision 6 lands with no baseline. That means the two existing error classes, the three sentinel strings, and the rollback issues. The app side is brought in line for the CMS and Support It, the two screens that show server messages today.

*Check when implementing:* that base errors attach with `oc.errors(...)` before the procedures in 1.15.6, and how the OpenAPI document shows declared errors.

*Alternatives:* a Result type in the domain (rejected: `{ issues }` and `safeParse` already cover it), `safe()` wrappers in the app (rejected: Query's error state is the one place), and keeping server messages as user copy (rejected: it leaks developer text and can't follow the copy guide).

### 10. Logging package ([#170](https://github.com/weareit-app/weareit/issues/170), map carried item)

A new `@it/log` package (`packages/log`) exports `createLog({ level })`, returning `debug | info | warn | error(event, fields)`, each writing one JSON line to `console.log` or `console.error`. The level comes from the calling program's config; the package reads no environment. Callers pass fields, never interpolated strings, so the privacy rules in the spec can be reviewed at the call site. A hosted service later replaces the sink, not the calls.

It depends on nothing, inside the workspace or out. The API server and `@it/database` (for its scripts) may import it; the app, the pure packages, and `tools/*` may not, because the app's logs are not server logs, pure packages don't log, and the tools print output for a person (founder, 2026-10-23).

The server logs a failure it didn't expect (a server error, including an undeclared error sent as an internal server error) at error level with its cause, and an undeclared failure caused by a bad request, such as input that fails validation, at warn level without its cause, because the cause holds the input (founder, 2026-10-23).

*Alternatives:* `apps/api-server/src/log.ts`, rejected by the founder because the database scripts log too; and pino or another library, rejected for now because one small package keeps the vendor behind an It-owned boundary, as `AGENTS.md` asks, and the server's volume doesn't need more.

### 11. Env per program ([#171](https://github.com/weareit-app/weareit/issues/171))

`apps/api-server/src/env.ts`, `apps/app/src/env.ts`, and `packages/database/scripts/env.ts` each export a plain-Zod schema and a `parseEnv(source)` that returns typed config or throws with `z.prettifyError` output (names and rules, not values). The app's file writes each `process.env.EXPO_PUBLIC_X` out by name, with a `satisfies` type that keeps the list complete, because Expo inlines only literal reads (docs.expo.dev "Environment variables in Expo", checked 2026-10-21 in #171). `app.json` becomes `app.config.ts`, which imports and parses the same schema. Biome's `noProcessEnv` is on everywhere except the env files and `test-env.ts`. A Vitest test parses each `.env.example` with its schema and compares keys.

*Alternatives:* T3 Env (an extra dependency for what plain Zod does) and one shared env package (mixes public and secret names). The root `.env` stays shared by the server and the database scripts, both of which read `DATABASE_URL`; this exception to Turborepo's per-app advice goes in the decision entry.

### 12. Generated files, Python tools, and the docs and skills checks (map carried items, [#151](https://github.com/weareit-app/weareit/issues/151), [#152](https://github.com/weareit-app/weareit/issues/152))

- **Generated files:** `essays:check` already regenerates and compares. It moves into a `check:generated` script with the kysely-codegen `--verify` run, so one CI step owns "regenerating changes nothing".
- **ruff:** one pinned ruff version lints and formats `tools/**/*.py` (rules: ruff's defaults plus import sorting), as a lefthook job and a CI step beside Biome. The install route (a pinned `uvx ruff@X`, or a dev requirement) is chosen when pinning; it must not require mise. Existing findings are fixed when it lands.
- **`docs/adr/` check** and **skills drift check:** small Node scripts in `tools/`, each with a test, run in lefthook and CI like `tools/action-pins`. `tools/skills-sync/sync-skills.mjs` copies `.claude/skills` to `.agents/skills`, skipping `openspec-*`; `--check` fails on any difference.

### 13. Order: docs, then packages, then checks

The steering and `CODING_STANDARDS.md` rules land first, because they cost nothing to adopt and let review apply the conventions to new code right away. Then the package moves, because several checks depend on them: dependency-cruiser would fail on `@it/api` and the relative paths, the `ORPCError` rule needs typed errors, and `noProcessEnv` needs the env files. Then each check is turned on, each in its own PR with its fixes and its `decisions.md` entry. tasks.md follows this order; within a group, tasks are independent unless they say otherwise.

## Traceability

| Ticket | Spec requirements | Tasks |
| --- | --- | --- |
| #141, #145 (evidence) | domain-model | 2, 3 |
| #142 (evidence) | agent-steering: Skill set, Skill folders stay in step | 11.1, 11.4 |
| #143, #144, #146 (evidence) | code-checks, package-boundaries, test-layout | 5, 7, 8, 9 |
| #147 schemas | domain-model (all); code-checks: Zod style, Naming judged in review | 1.2, 2, 3, 4.2, 4.3, 4.6, 7.3 |
| #148 linter | code-checks: One formatter, General and Type-aware lint rules, Errors only, Suppressions, Non-null assertions, Where the checks run | 7.1, 7.2, 7.3 |
| #149 dependencies | package-boundaries (all) | 2.5, 2.6, 8 |
| #150 tests | test-layout (all) | 1.2, 5, 9.1 |
| #151 skills | agent-steering: Skill set, Skill folders stay in step, Build path | 11.1, 11.2, 11.4, 11.5 |
| #152 docs | agent-steering: One steering file, AGENTS.md, One source for the invariants, Judgement rules, Decision records, Doc roles | 1.1, 1.3, 11.3 |
| #165 naming | code-checks: Mechanical naming, Naming exceptions, Naming judged in review | 1.2, 7.4, 7.6 |
| #170 errors | api-errors (all); package-boundaries: Server framework stays in the server; code-checks: No hand-built API errors | 1.2, 4.1, 4.4, 4.5, 4.6, 7.3, 8.1 |
| #171 env | runtime-config (all) | 6, 7.5 |
| Map: adoption order | (decision 13) | order of tasks.md |
| Map: generated files | code-checks: Generated files stay in step; domain-model: Generated table types | 3.1, 10.1, 10.3 |
| Map: ruff | code-checks: Python tools are linted and formatted | 10.2, 10.3 |
| Map: logging module | api-errors: Server logging, Undeclared failures logged by cause, Log privacy; package-boundaries: Allowed package graph, Allowed app and tool dependencies, Pure packages use an allowlist | 1.2, 4.1, 4.6, 8.1 |

## Founder answers

The proposal's two open questions, answered by the founder on 2026-10-21 on PR #178:

1. **Shared error codes: keep both, domain names after.** `UNAUTHORIZED` and `NOT_FOUND` stay as they are, so the `support` and `account-signup` specs and the in-flight changes that name them don't change. Every code added from now on is named in domain terms. #170's `NOT_SIGNED_IN` was an example only; the not-signed-in failure on the shared base is `UNAUTHORIZED`.
2. **Logging home: a new package.** A small `@it/log` package now, shared by the API server and the database scripts, instead of `apps/api-server/src/log.ts` (decision 10).

## Risks / Trade-offs

- [Package moves collide with in-flight feature PRs that edit `packages/api` or `packages/content/src/graph-schema.ts`] → Each move is one PR with no behavior change, merged at a quiet point, and announced in its PR body with the old and new paths. In-flight changes keep their tasks; only the paths change.
- [The Biome formatter swap reformats many files and makes open PRs conflict] → Land it alone, between feature PRs; a conflicting branch runs `pnpm run format` after rebasing, which resolves most conflicts.
- [About 115 typescript-eslint and 31 react-hooks findings are more than one PR should fix] → The ESLint PR may turn rules on one plugin at a time, each in its own PR, still with no baseline: a rule is on only once its findings are fixed.
- [kysely-codegen's override syntax may not fit 21 columns cleanly] → Checked first in task 3.1; if it fails, stop and bring it back to the founder rather than fall back to hand-written types silently.
- [`jest-expo/universal` turns up real failures on platforms the tests never ran on] → It is its own PR; failures there are fixed or recorded, not hidden by keeping the old presets.
- [A pre-commit hook that runs more jobs slows commits] → Biome takes about 34 ms and type-aware ESLint about 11 s over the whole repo (measured in #148), and lefthook runs jobs in parallel on staged files only; knip and sherif stay CI-only.
- [The third-party allowlist for `@it/content` scripts is read as `src/` only] → Recorded in the decision entry; the founder can tighten it later.

## Migration Plan

Each group in tasks.md is one or more PRs off `master`, each passing CI on its own. A PR that turns on a check also fixes every existing violation, so `master` never carries a baseline. Rollback is reverting that PR. Nothing ships to people except the error copy in group 4, which goes through the founder's copy approval like any other copy.
