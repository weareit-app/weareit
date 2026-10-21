# Proposal

## Why

The repo's conventions live in people's heads and drift: shapes are written up to eight times, nothing stops a package from importing what `AGENTS.md` forbids, a test in an unlisted folder never runs, and the app's type graph reaches the database through the API client. The wayfinder map ([#140](https://github.com/weareit-app/weareit/issues/140)) settled 13 decisions with the founder on 2026-10-21 so that each convention is enforced by a check where it is mechanical, and by a `CODING_STANDARDS.md` rule where it is a judgement call. This change carries them out, on a light budget: new code follows them now, and existing code is brought in line in small PRs that land alongside feature work.

## What Changes

What people see and do:

- **Nothing new on any screen** except error messages. No `docs/spec/features.md` item covers this change; it is groundwork under the engineering conventions in `AGENTS.md`.
- **Content editor, saving a draft that changed elsewhere**: the founder sees a message that says the draft changed and what to do, instead of "Internal server error".
- **Every screen that shows an API failure**: the words come from the app, written to the copy style guide, instead of the server's developer message. The CMS and Support It are brought in line here; other screens as they are touched.

What contributors (people and agents) see:

- **Schemas and types** live in one Zod-only `@it/domain` package with a module per domain (primitives, content, essays, onboarding, support). `@it/content` keeps only content data and the essay build. Types come from schemas. Database table types are generated and point at the domain types. ([#147](https://github.com/weareit-app/weareit/issues/147))
- **BREAKING (internal)**: `@it/api` goes away. The contract, a client typed from the contract alone, and the OpenAPI document move to `@it/api-contract`; the router moves into `apps/api-server`. ([#147](https://github.com/weareit-app/weareit/issues/147))
- **An allowed package graph**, a third-party allowlist for the pure packages, module edges inside `@it/domain`, and no cycles, all enforced in CI and pre-commit. ([#149](https://github.com/weareit-app/weareit/issues/149))
- **One linter and formatter setup**: Biome lints and formats (replacing Prettier), and a thin type-aware ESLint 10 pass adds the promise and React hooks rules Biome lacks. No warnings, and suppressions need a reason. ([#148](https://github.com/weareit-app/weareit/issues/148))
- **Naming** checked by Biome where it is mechanical. ([#165](https://github.com/weareit-app/weareit/issues/165))
- **Tests beside their code**, found by glob, with one check that fails on a test no runner owns or that breaks the layout. CI fails without Postgres. ([#150](https://github.com/weareit-app/weareit/issues/150))
- **Typed API errors** with domain-named codes, error classes on the server, and app-owned error copy. ([#170](https://github.com/weareit-app/weareit/issues/170))
- **Environment variables** validated once per program at its entry point, with example files kept in step by a test. ([#171](https://github.com/weareit-app/weareit/issues/171))
- **Server logging** through one small It-owned module with levels, writing structured lines to the console. (Map, carried item.)
- **Generated files** stay committed, and CI fails if regenerating them changes anything. (Map, carried item.)
- **Python tools** in `tools/` are linted and formatted by ruff, pinned. (Map, carried item.)
- **Docs and steering**: one root `AGENTS.md` with guardrails and pointers, judgement rules only in `CODING_STANDARDS.md`, workflow detail in `docs/agents/`, decision records only in `docs/architecture/decisions.md`. ([#152](https://github.com/weareit-app/weareit/issues/152))
- **Skills**: `to-spec`, `implement-spec`, and `ask-matt` are removed, a repo `/ask-it` router replaces `ask-matt`, and `.agents/skills` is copied from `.claude/skills` with a drift check. ([#151](https://github.com/weareit-app/weareit/issues/151))

Out of scope (from the map):

- Replacing a settled stack choice (Expo, oRPC, Kysely, NativeWind).
- Feature work and content.
- `docs/spec/pieces.yaml`, which is parked.
- Nested `AGENTS.md` files per package. Checks carry per-package rules; a later `/retro` can add one if agents get lost in a package.
- A hosted logging service, test coverage targets, branded IDs, React Compiler itself, and TypeScript 7.

Must leave room for: `render.yaml` (the env check compares its keys once it lands), Spanish (error copy keyed by code can be translated per locale), and own contributions (new operations declare their errors from the start).

## Capabilities

### New Capabilities

- `domain-model`: where schemas and types live, how types flow from schemas to the database and the wire, and how the contract package stands apart from the server.
- `package-boundaries`: which packages and modules may depend on which, the third-party allowlist for pure packages, and the checks for unused code and version drift.
- `code-checks`: linting, formatting, naming, generated files, and the Python tools, with where each check runs.
- `test-layout`: which runner owns which tests, where tests live, and how the layout and the Postgres tests are enforced.
- `api-errors`: how failures cross the API, what the app shows people, and how the server logs.
- `runtime-config`: how each program validates its configuration and environment variables.
- `agent-steering`: where docs, decision records, judgement rules, and skills live, and how the two skill folders stay in step.

### Modified Capabilities

None. The `support` and `account-signup` specs name the `UNAUTHORIZED` and `NOT_FOUND` codes; they stay unchanged unless the founder answers the first open question differently.

## Impact

- **Packages**: `packages/domain` (new modules), `packages/content` (schemas leave; `buildTier1ContentGraph` arrives), `packages/watercolor` (gains `./marks`), new `packages/api-contract`, `packages/api` removed, `packages/database` (generated table types, `CHECK` test).
- **Apps**: `apps/api-server` (router, `env.ts`, logging module, error mapping), `apps/app` (`app.config.ts` replaces `app.json`, `src/env.ts`, error copy helpers, `.env.example`).
- **Tools and config**: `biome.json`, `eslint.config.mts`, `.dependency-cruiser.cjs`, knip and sherif config, `vitest.config.mts` (projects), `lefthook.yml`, `.github/workflows/ci.yml`, `tools/test-coverage`, a new skills sync script, ruff config.
- **Dependencies added**: Biome, ESLint 10 with three plugins, dependency-cruiser, knip, sherif, kysely-codegen, ruff. Prettier removed. Each pin follows `docs/architecture/dependency-policy.md`.
- **Docs**: `AGENTS.md`, `CODING_STANDARDS.md`, `docs/agents/`, `docs/architecture/decisions.md`, `docs/architecture/dependency-policy.md`, `openspec/config.yaml`.
- **Other in-flight changes**: their tasks name `packages/api/src/router.ts` and `contract.ts`. After the move those paths are `apps/api-server/src/router.ts` and `packages/api-contract/src/contract.ts`; the work is the same.

## Open questions

1. **Shared error codes.** #170 gives `NOT_SIGNED_IN` as an example of a shared code, but five specs and in-flight changes already say signed-out calls fail with `UNAUTHORIZED`, and owner-only lookups with `NOT_FOUND`. Recommended: declare those two under their existing names, which already say what happened, and use domain names for every new code. The alternative renames them and updates `support`, `account-signup`, and four in-flight changes.
2. **Logging module home.** Recommended: `apps/api-server/src/log.ts`, since the API server is the only long-running program. Database scripts keep writing to the console. A shared package would add a node to the package graph.
