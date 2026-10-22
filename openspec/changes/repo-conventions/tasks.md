# Tasks

Order (design decision 13): write the conventions down, move packages, then turn checks on. Each numbered task is one small PR unless it says otherwise, and can land between feature PRs. A PR that turns on a check fixes every existing violation in the same PR; there is no baseline. Each PR that adds or changes a tool records its pin in `docs/architecture/dependency-policy.md` (two-week rule) and, if it changes a CI step, the "Continuous integration" section there.

## 1. Write the conventions down

- [x] 1.1 In `docs/architecture/decisions.md`, add a "Code conventions" topic and the docs and steering decision (#152): decision records stay in this file, `AGENTS.md` is guardrails and pointers and the single source of the invariants, judgement rules live only in `CODING_STANDARDS.md`, workflow detail lives in `docs/agents/`, one root `AGENTS.md` and no `CLAUDE.md`. Add a dated change-log line. Fix the `docs/adr/` diagram in `docs/agents/domain.md` to show `decisions.md`. Verify the diagram names no `docs/adr/` and the entry links to `AGENTS.md` without restating the invariants
- [x] 1.2 Add the judgement rules to `CODING_STANDARDS.md`: one owner per shape (#147); schema naming `fooSchema` / `Foo` / `FooInput` (#147); CONSTANT_CASE, file named after its main export, boolean prefixes, `Table` suffix where codegen allows, `@it/<kebab>` packages with subpaths named after files (#165); error classes instead of sentinel strings, app copy keyed by code, return values in pure domain logic (#170); log fields, never interpolated personal data (logging); the per-layer test guide, keeping the existing rule against tests for unrelated code (#150); and the three rules moving from `AGENTS.md` (Zod at untrusted boundaries, semantic API operations, vendors behind It-owned boundaries). Verify `/code-review` on a sample diff cites a rule from the new sections
- [x] 1.3 Using `/writing-for-agents`, cut `AGENTS.md` to product intent, the binding stack lines, the privacy invariants, and one pointer per doc worded with its trigger. Move the OpenSpec workflow, the Spec Kit retirement notes, and the skill config into files under `docs/agents/`, and point `openspec/config.yaml`'s design rules at `CODING_STANDARDS.md` instead of copying them. Verify every line removed from `AGENTS.md` appears in exactly one new home (list them in the PR body)

## 2. Domain package

- [x] 2.1 Add `primitives` (slug ID, non-empty text, ISO date, ISO datetime) and `support` (frequency, contribution status, processor, transaction status) modules to `@it/domain`, each its own export subpath with tests beside it, and replace every copy found in #141's duplicated-shapes table with an import. Verify by grepping for the old literals (for example the slug pattern and `"one_time"`) outside `@it/domain` and finding only SQL migrations
- [x] 2.2 Move the content and essay schemas (`graph-schema`, `essay-schema`, `schema`) from `@it/content` into `@it/domain`'s `content` and `essays` modules, and update `@it/content`, `@it/database`, and the app's 22 imports to the new subpaths. `@it/content` keeps only data and the essay build and re-exports nothing. Verify typecheck, unit tests, jest-expo, and e2e pass, and that the published content graph parses byte for byte as before (a test against the seed)
- [x] 2.3 Move `onboarding.ts` into an `onboarding` module and replace the hand-written `UserOnboardingDraft` (and its `helpInterests: string[]`) with the schema's type. Verify an onboarding draft saved before the change parses after it (test with a stored fixture)
- [x] 2.4 Build the tier-1 authoring schemas from the graph schemas with `pick` and `extend`, moving shared rules such as the feature-status rule onto the graph schema. Verify the existing tier-1 tests pass and a feature way without a status fails both schemas
- [x] 2.5 Move `buildTier1ContentGraph` into `@it/content` as a new export, and change the e2e specs and `@it/database` to import it by package name. Verify no file imports `packages/database/src` by relative path (`git grep`)
- [x] 2.6 Move `IT_MARK` and `WE_ARE_IT_MARK` into `@it/watercolor` as `./marks`, and change the app and `tools/watercolor-sim` to import `@it/watercolor` subpaths only. Verify `git grep` finds no relative import from `tools/watercolor-sim` into `packages/` or `apps/`
- [x] 2.7 Record the model-package decision (#147: one Zod-only package with a module per domain, types from schemas) in `decisions.md`, in the PR that finishes this group. Verify the entry links to this change

## 3. Database types

- [ ] 3.1 First check kysely-codegen 0.20.0's `--overrides` and `--custom-imports` syntax and `Table` naming against its docs; if 21 overrides don't fit, stop and ask the founder. Then generate the table types from the migrated database with overrides pointing at `@it/domain` types, commit the output, delete the hand-written `types.ts`, and add a `db:types` script plus a `--verify` step in CI's `check` job. Verify CI fails on a branch that adds a migration without regenerating
- [ ] 3.2 Add a Postgres-backed test in `packages/database` that reads each enum `CHECK` constraint from the catalog and compares it with its Zod enum. Verify it fails when a value is added to a Zod enum only
- [ ] 3.3 Add the generated-table-types part of the #147 decision entry (codegen with `--verify`, the `CHECK` test, generated names kept). Verify the entry names both checks

## 4. API contract, errors, and logging

- [ ] 4.1 Add the `@it/log` package (`packages/log`: debug, info, warn, error; one JSON line per event; level passed in by the caller; no dependencies), use it in the API server and the database scripts in place of `console`, and log every undeclared API error with its operation and cause through an oRPC interceptor. Verify with tests that an undeclared error writes one error-level line and that a sign-in failure line holds neither the code nor the email
- [x] 4.2 Create `packages/api-contract` with the contract, the OpenAPI generator, and a client factory typed with `ContractRouterClient` that takes the API URL as an argument. Point the app at it. Verify with `tsc --explainFiles` for the app that no file reached through `@it/*` is from `@it/database`, `kysely`, or `pg` (`kysely`'s types still arrive through Better Auth's client until better-auth/better-auth#6183)
- [x] 4.3 Move the router and its tests into `apps/api-server`, derive its service port types from `InferContractRouterInputs` and `InferContractRouterOutputs`, and delete `packages/api`. Verify typecheck, the router tests, the API docs tests, and e2e pass, and `git grep "@it/api\""` finds nothing
- [x] 4.4 Declare errors in the contract: a shared base for the signed-in (`UNAUTHORIZED`, unchanged) and CMS-access failures, `NOT_FOUND` for owner-only lookups (unchanged), and `REVISION_CONFLICT`, `CONTENT_NOT_PUBLISHED`, `PAYMENTS_NOT_CONFIGURED`, and the codes for the two existing error classes, the support lookups, and rollback issues (as `data`). Replace the sentinel strings and plain `Error`s with error classes in the packages that throw them, and map each in the router with `errors.X`. Verify router tests for each code, and a test that an undeclared error reaches the client as `INTERNAL_SERVER_ERROR` with no detail
- [ ] 4.5 Add `describeCmsError` and `describeSupportError` helpers that narrow with `isDefinedError` and return copy keyed by code with one generic fallback, and use them in `cms/index.tsx` and `support-it.tsx` in place of `error.message`. The founder approves the copy. Verify with component tests that a revision conflict shows its message, an undeclared error shows the fallback, and both are announced to screen readers; check keyboard focus by hand and note it in the PR
- [ ] 4.6 Record the contract package decision (#147) and the errors decision (#170: typed contract errors with domain codes, error classes on the server, return values in the domain, app-owned copy, the logging module) in `decisions.md`. Verify each entry links to its ticket

## 5. Tests beside their code

- [ ] 5.1 In one mechanical PR, `git mv` every test out of `tests/` folders to beside the file it tests, move shared helpers into test-support files, switch `vitest.config.mts` to `test.projects` by glob, and set jest-expo's `testMatch` to `apps/app/**/*.test.tsx`. Verify the number of tests each runner reports is the same before and after (counts in the PR body)
- [ ] 5.2 Add the shared `test-env.ts`, and make the Postgres harness fail when `CI` is set and `TEST_DATABASE_URL` is missing, while skipping locally. Verify by running the database tests with `CI=1` and no URL (fails) and with neither (skips)
- [ ] 5.3 In a separate PR, switch jest-expo to `jest-expo/universal` and rename the web-only essay block tests to jest-expo's platform-specific names (check the naming in jest-expo's docs first). Verify `pnpm test:expo` passes and the block tests run on web only
- [ ] 5.4 Record the test decision (#150: colocated tests with a layout check, Vitest projects plus jest-expo on `jest-expo/universal`, failing in CI without Postgres, no coverage targets) in `decisions.md`. Verify the entry names the layout check

## 6. Environment variables

- [ ] 6.1 Add `apps/api-server/src/env.ts` with the server rules (`NODE_ENV` required, all-or-none Stripe, SMTP, and RevenueCat groups, required in production, empty means unset), parse it once in `index.ts`, and pass typed config into auth, email, Stripe, RevenueCat, and the local mock. Change tests to build config objects instead of setting `process.env`. Verify with tests for a missing `NODE_ENV`, a half group, production without SMTP, and an error message that holds no value
- [ ] 6.2 Add `packages/database/scripts/env.ts` and use it in the three database scripts. Verify each script refuses to start without `DATABASE_URL` and names it
- [ ] 6.3 Add `apps/app/src/env.ts` (each `EXPO_PUBLIC_*` read by name, `satisfies` for completeness), replace `app.json` with `app.config.ts` that parses it, remove the localhost fallbacks, and move every public variable, including `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY`, into `apps/app/.env.example`. Verify `expo export` fails with a bad `EXPO_PUBLIC_API_URL` and the web and iOS builds still start with the example values
- [ ] 6.4 Add a Vitest test that parses each `.env.example` with its schema and compares keys. Verify it fails when a key is added to a schema only
- [ ] 6.5 Record the env decision (#171), including the shared root `.env` as a deliberate exception to per-app env files, in `decisions.md`. Verify the entry names the exception and its reason

## 7. Lint and format

- [ ] 7.1 Replace Prettier with Biome 2.5.15's formatter: `biome.json` with Prettier's defaults and `.prettierignore` moved to `files.includes`, the `format` and `lint` scripts, the lefthook format job, and the essay build formatting its output through Biome. Remove Prettier. Replace the Prettier line in `decisions.md`'s "Platform and stack" with the Biome decision (#148) and add a change-log line. Verify `pnpm run lint` passes, no Markdown file changed, and `essays:check` passes
- [ ] 7.2 Turn on Biome's lint rules (recommended plus the `react` and `project` domains, its two hook rules off, `noNonNullAssertion` off in tests and `tools/`, warnings as errors) and fix every finding: about 39 general findings and about 100 non-null assertions in source. Add Biome lint on staged files to lefthook. Verify `biome ci --error-on-warnings` passes in CI
- [ ] 7.3 Add ESLint 10.12.0 over TS files with typescript-eslint 8.71.1 `recommendedTypeChecked` (type-aware rules only), `eslint-plugin-react-hooks` 7.1.1 `recommended`, eslint-comments `require-description`, unused directives as errors, and `no-restricted-syntax` for `new ORPCError` in the router and for `.strict()`, `.passthrough()`, and deprecated Zod string formats. Fix every finding, including the three promise bugs in `apps/api-server`; this may land as one PR per plugin, each rule on only once its findings are fixed. Needs 4.4. Verify `eslint --max-warnings 0` passes in CI and lefthook runs it on staged TS files
- [ ] 7.4 Turn on Biome's naming rules (#165) with their overrides, after checking each rule and option against the Biome 2.5.15 docs. Fix the about 10 `ID`, `URL`, and `OTP` spellings, give the two lab screens named exports, and settle `shaders/index.ts`. Verify lint fails on a sample `userID` and a default export in `apps/app/src`, and passes on `_layout.tsx`
- [ ] 7.5 Turn on Biome's `noProcessEnv` everywhere except the env files and `test-env.ts`. Needs group 6. Verify lint fails on a sample `process.env` read in a service file
- [ ] 7.6 Record the naming decision (#165) in `decisions.md`, beside the Biome entry from 7.1. Verify the entry lists the overrides

## 8. Package boundaries

- [ ] 8.1 Add dependency-cruiser with one config for the package graph, cross-package relative paths, the third-party allowlist for `@it/domain`, `@it/watercolor`, `@it/content` (`src/` only), and `@it/api-contract`, `@it/log` (no dependencies, imported only by `apps/api-server`, `@it/database`, and `tools/*`), the `@it/domain` module edges, the `@orpc/server` rule, and no cycles, with type-only imports included. Run it in `pnpm run lint` and as a lefthook job with `--cache`. Needs groups 2 and 4. Verify with a sample violation of each rule on a scratch branch that CI fails and names it
- [ ] 8.2 Add knip (with entries for Expo Router routes, stories, and generated essays) and sherif to CI only, and fix every finding, including the about 7 export entries nobody imports. Verify both pass in CI
- [ ] 8.3 Record the boundaries decision (#149: allowed graph, allowlist, dependency-cruiser with type-only imports and no baseline, knip and sherif in CI) in `decisions.md`, including the reading of the `@it/content` allowlist as `src/` only. Verify the entry includes the graph table

## 9. Test layout check

- [ ] 9.1 Extend `tools/test-coverage` to fail on a `tests/` or `__tests__` folder, a test inside `apps/app/app/`, and a `*.spec.ts` outside `apps/app/e2e`, alongside its existing check that every test belongs to a runner. Needs 5.1. Verify with a test per rule in the tool's own test file

## 10. Generated files and Python tools

- [ ] 10.1 Add a `check:generated` script that runs `essays:check` and the kysely-codegen `--verify` step, and call it from CI in place of the two separate steps. Verify CI fails on a branch with an essay changed but not rebuilt
- [ ] 10.2 Add ruff, pinned, to lint and format `tools/**/*.py`, in lefthook and CI beside Biome, through an install route that doesn't need mise. Fix every finding and record the pin in `dependency-policy.md`. Verify `pnpm run test:tools` still passes and CI fails on a sample unused import
- [ ] 10.3 Record the generated-files and ruff decisions in `decisions.md`. Verify each entry says where its check runs

## 11. Skills and docs checks

- [ ] 11.1 Remove `to-spec`, `implement-spec`, and `ask-matt` from `.claude/skills` and `.agents/skills`, list each as not vendored in `dependency-policy.md`, and remove their mentions from `AGENTS.md` and `docs/agents/`. Verify `git grep -e to-spec -e implement-spec -e ask-matt` finds only the not-vendored list and history
- [ ] 11.2 Using `/writing-for-agents`, add the repo skill `/ask-it` (Codex: `$ask-it`), manual-only (`disable-model-invocation: true`), that routes OpenSpec, the vendored skills that stay, and the `pains-*` and `possibilities-*` skills, and add its pointer to `AGENTS.md`. Verify every skill in `.claude/skills` is named in it
- [ ] 11.3 Add a check in `tools/` that fails if `docs/adr/` exists, run in lefthook and CI, with a test. Verify the test covers both a present and an absent folder
- [ ] 11.4 Add `tools/skills-sync/sync-skills.mjs`, which copies `.claude/skills` to `.agents/skills` skipping `openspec-*`, with `--check` for drift in lefthook and CI and a test. Run it once to fix the stale `pains-ingest` and `pains-review`. Verify `--check` passes and fails after editing one copy
- [ ] 11.5 Record the skills decision (#151) in `decisions.md`. Verify the entry lists the removed skills and the sync rule

## 12. Integration check

- [ ] 12.1 On a fresh clone of `master` after every group has landed, run `pnpm install`, `pnpm run lint`, `pnpm run typecheck`, `pnpm test`, and a commit through lefthook. Confirm every requirement in this change's specs has its check or `CODING_STANDARDS.md` rule, and every ticket in design.md's traceability table has its `decisions.md` entry. Verify by listing each in the PR that ticks this box

## Workflow follow-up

- In-flight changes (`embedded-support`, `own-contributions`, `spanish-language`, `visit-measurement`, `required-signup-gate`, and others) name `packages/api/src/router.ts` and `contract.ts`; after group 4 those files are `apps/api-server/src/router.ts` and `packages/api-contract/src/contract.ts`.
- Archive this change with `/opsx:archive` once every box is ticked, and confirm each decision that outlasts it is in `decisions.md`.
