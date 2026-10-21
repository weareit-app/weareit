# Test setup options for this stack

- **Ticket:** weareit-app/weareit#146 (map #140, "Repo conventions that enforce themselves"). Feeds the test strategy grilling ticket #150.
- **Date:** 2026-10-21. Every web source below was checked on that date.
- **Scope:** facts and trade-offs only. The grilling ticket makes the decision.

## What the repo does today

Read from `master` at `13f9ab3`.

| Runner | Config | What it runs | In CI |
| --- | --- | --- | --- |
| Vitest `^5.0.4` | `vitest.config.mts` (root) | A hand-written `include` list of 12 globs: `tests/` folders in four packages, `apps/api-server`, and four `tools/` folders, plus three folders under `apps/app/src` (`payments`, `theme`, `essays`). One `node` environment for all. | `pnpm run test:unit`, and the pre-commit hook |
| Jest `~30.5.2` with jest-expo `~58.0.11` | `apps/app/jest.config.cjs` | Two Jest projects: `jest-expo` (the iOS preset) for `apps/app/tests/**`, and `jest-expo/web` for `apps/app/tests/essays/**`. The web project borrows the default preset's Babel options. | `pnpm run test:expo` |
| Playwright `^1.64.0` | `apps/app/playwright.config.ts` | `apps/app/e2e/*.spec.ts` (three files) against `expo start --web` on port 4173, Chromium only, `reuseExistingServer: false`. | Separate `e2e` job |
| Python `unittest` | `package.json` `test:tools` | `tools/pains`, `tools/possibilities`, `tools/style` | `pnpm run test:tools` |

Findings that matter for the options below:

- **A test can be silently left out.** A new `*.test.ts` under `apps/app/src/auth/` (or any `src` folder not in the list) matches neither the Vitest `include` list nor the Jest `testMatch` (`<rootDir>/tests/**`), so no runner picks it up and nothing fails. The same is true of a new package's `tests/` folder until someone adds it to `vitest.config.mts`.
- **The Postgres tests never run in CI.** `packages/database/tests/roadmap-items.test.ts` and `feature-statuses.test.ts` use `describe.skipIf(!connectionString)` on `TEST_DATABASE_URL`. `.github/workflows/ci.yml` doesn't set that variable or start Postgres, so both suites are skipped there and pass. Locally they run only if someone starts a disposable server by hand (the comment in the test suggests `docker run ... postgres:17-alpine`).
- **The harness for real Postgres already exists.** `packages/database/tests/test-database.ts` creates one fresh database per test file (`drop database if exists ... with (force)`, `create database`, then runs the Kysely migrations), so test files can run in parallel against one server.
- **The API test fakes the database.** `apps/api-server/tests/support-access.test.ts` builds a Kysely instance on a `DummyDriver` with a hand-written connection that returns canned rows. It doesn't touch Postgres.
- `compose.yaml` runs `postgres:17-alpine` for development, with a named volume, on port 5432.
- **No coverage is collected** by any runner, and nothing gates on it. (`tools/typecheck-coverage` and `tools/story-coverage` check that files are in a typecheck project and have stories; they aren't code coverage.)
- `CONTRIBUTING.md` documents the three runners and says "Do not add tests for unrelated code".

## 1. Vitest projects instead of the hand-written include list

**What the docs say** ([Vitest: Projects](https://vitest.dev/guide/projects), [Vitest 5.0 announcement](https://vitest.dev/blog/vitest-5), dated 2026-09-03):

- `test.projects` in the root config takes globs, config file paths, or inline config objects. A glob like `'packages/*'` makes every matching folder a project "even if it doesn't have a config file inside", and `!` excludes folders.
- Each project can set its own `name`, `include`, and `environment`. Names must be unique.
- Options such as `coverage` and `reporters` stay global: "the root configuration will only influence global options such as `reporters` and `coverage`."
- The old `workspace` option has been deprecated since Vitest 3.2 and replaced by `projects`.
- Vitest 5 changes that matter here: inline projects inherit the root config (plugins, `resolve.alias`) by default, a project's own config can declare nested projects, `--project` has a `-p` shorthand and understands the hierarchy, and inline projects that don't change Vite config share one Vite server. Vitest 5 requires Node 22.12 or later; the repo pins Node 24. `clearMocks` now defaults to `true`.

**Options for this repo:**

| Option | How it looks | Gains | Costs |
| --- | --- | --- | --- |
| A. Keep the list | As today | No change. | The silent-gap risk above stays. A new folder needs a config edit, which is easy to forget. |
| B. One broad `include` | e.g. `["{packages,apps,tools}/**/*.test.ts"]` with `exclude` for `apps/app/tests/**` (Jest owns those) | A new test file is picked up wherever it lands. | One environment for everything. The exclusion of Jest's files becomes the thing to remember instead. |
| C. Projects by glob | `projects: ["packages/*", "apps/api-server", "tools/*", { name: "app-logic", root: "apps/app", include: ["src/**/*.test.ts"] }]` | New packages are picked up automatically. `vitest -p database` runs one package. Each package can later have its own `vitest.config` (for example a database project with a global setup that starts Postgres). | Folders with no tests become empty projects (Vitest reports "no test files found" per project unless `passWithNoTests` is set; check behavior on adoption). Some tool folders are Python and would need excluding. |
| D. Projects by kind | Inline projects named `unit`, `db`, and so on, each with its own `include` and setup | Lets the pre-commit hook run only `unit` while CI runs `db` too. | Still a hand-maintained list, though shorter. |

A check that fails when a `*.test.*` file is matched by no runner would close the silent-gap risk under any option. The repo already has this pattern for typecheck and stories (`tools/typecheck-coverage`, `tools/story-coverage`).

## 2. Tests next to the code or in `tests/` folders

The repo does both: `tests/` folders in packages and in `apps/app`, and colocated `*.test.ts` in three `apps/app/src` folders.

**What the docs say:**

- Expo Router: "When using Expo Router, do not put your test files inside the **app** directory", because "All files inside your **app** directory must be either routes or layout files." It recommends a `__tests__` directory or a separate directory ([Expo Router: Testing](https://docs.expo.dev/router/reference/testing/)). This applies to `apps/app/app/` only, not `apps/app/src/`.
- Expo's unit testing guide calls a root `__tests__` folder, or several next to the code, "a common pattern" and leaves the choice to the project ([Expo: Unit testing](https://docs.expo.dev/develop/unit-testing/)).
- Vitest's default `include` is `**/*.{test,spec}.?(c|m)[jt]s?(x)`, so it supports either layout without configuration ([Vitest: include](https://vitest.dev/config/include)).

**Trade-offs:**

| | Colocated (`foo.ts` + `foo.test.ts`) | `tests/` folder per package |
| --- | --- | --- |
| Finding the test | Next to the file; a missing test is visible in the file tree. | One place per package; mirrors the public surface. |
| Runner config | Two runners in `apps/app` must agree on which files each owns, by name (for example `*.test.tsx` for Jest and `*.test.ts` for Vitest) or by folder. | Ownership by folder is simple, which is what `apps/app` does now. |
| Typecheck and lint | Test files sit inside `src`, so `tsconfig` `include` and future lint rules (such as "no Expo imports in domain packages") see them unless excluded. | Tests are outside `src`; package `tsconfig` must still include them to typecheck. |
| Packaging | Packages here are workspace-only (`exports` point at `src/*.ts`), so shipping test files isn't a concern. | Same. |
| Expo Router | Never inside `apps/app/app/`. | No conflict. |

## 3. jest-expo or Vitest for React Native code

**What the sources say:**

- React Native's docs say the default template "ships with Jest" with "a preset that's tailored to this environment", and point to React Native Testing Library for component tests. Vitest isn't mentioned ([React Native: Testing](https://reactnative.dev/docs/testing-overview)).
- Expo describes `jest-expo` as "a Jest preset that mocks the native part of the Expo SDK" and recommends `@testing-library/react-native`. For SDK 58 and later, jest-expo needs Jest 30, and Expo Router tests need React Native Testing Library 14 or later. Vitest isn't mentioned ([Expo: Unit testing](https://docs.expo.dev/develop/unit-testing/)). The repo matches: Jest 30.5, jest-expo 58, RNTL 14.1.
- jest-expo's README calls `jest-expo/universal` "the recommended way to test your project": each test runs on iOS, Android, web, and Node, with per-platform snapshots. The plain `jest-expo` preset runs in the iOS environment "for legacy purposes". Single-platform presets can be combined with Jest `projects` ([jest-expo README](https://github.com/expo/expo/tree/main/packages/jest-expo)). The repo uses `jest-expo` (iOS) and `jest-expo/web`.
- Expo Router's `renderRouter` (from `expo-router/testing-library`) builds an in-memory router for integration tests and extends RNTL's `render` ([Expo Router: Testing](https://docs.expo.dev/router/reference/testing/)).
- The only Vitest route for React Native found is the community `vitest-react-native` plugin, whose README says "This package is still WIP", with no releases listed ([vitest-community/vitest-react-native](https://github.com/vitest-community/vitest-react-native)). No first-party Vitest, Expo, or React Native statement of support was found.

**Options:**

| Option | Gains | Costs |
| --- | --- | --- |
| A. Keep both runners: Vitest for logic, jest-expo for components | Follows Expo's and React Native's documented path; native module mocks and `renderRouter` work. Logic tests stay fast. | Two runners, two configs, two mocking APIs (`vi` and `jest`). The boundary between them needs a rule (see section 2). |
| B. Move all `apps/app` tests to jest-expo | One runner per app; `jest-expo/universal` covers web and native in one go. | Pure logic tests in `apps/app/src` pick up Babel and preset startup cost. Packages still use Vitest. |
| C. Move components to Vitest (web-only, via `react-native-web` and jsdom or browser mode) | One runner for the whole repo. | Tests only the web rendering, not the native one. Depends on an unmaintained-looking WIP plugin or hand-built aliasing. Off Expo's documented path. |
| D. Switch to `jest-expo/universal` within option A | Each component test also runs on Android and Node (SSR), as jest-expo recommends. | Roughly four runs per test; snapshots per platform. The repo's current web project exists because essays are web-only, so they'd need platform-specific test files. |

## 4. Testing database code against real PostgreSQL

**What the sources say:**

- GitHub Actions service containers: define `services.postgres` with an `image`, set `POSTGRES_PASSWORD`, and add health-check options (`--health-cmd pg_isready ...`) so the job waits until Postgres accepts connections. A job running directly on the runner maps `ports: - 5432:5432` and connects to `localhost`. Service containers need a Linux runner ([GitHub Docs: PostgreSQL service containers](https://docs.github.com/en/actions/tutorials/use-containerized-services/create-postgresql-service-containers)). The CI jobs already run on `ubuntu-latest`.
- PostgreSQL template databases: `CREATE DATABASE ... TEMPLATE` copies an existing database, but "no other sessions can be connected to the source database while it is being copied" ([PostgreSQL 18: Template databases](https://www.postgresql.org/docs/current/manage-ag-templatedbs.html)). The default `STRATEGY WAL_LOG` "is the most efficient strategy in cases where the template database is small" ([PostgreSQL 18: CREATE DATABASE](https://www.postgresql.org/docs/current/sql-createdatabase.html)). This would let the harness migrate one template once and clone it per test file instead of migrating each file's database.
- Testcontainers for Node has a PostgreSQL module: `new PostgreSqlContainer(image).start()`, `getConnectionUri()`, and `snapshot()` / `restoreSnapshot()` to reset state. It needs Docker on the machine, and the snapshot feature can't use the `postgres` system database ([Testcontainers: PostgreSQL module](https://node.testcontainers.org/modules/postgresql/)).
- PGlite is "a WASM Postgres build packaged into a TypeScript/JavaScript client library", described as "perfect for unit tests" with "a unique fresh Postgres for each test" ([PGlite: About](https://pglite.dev/docs/about)). The page doesn't state its Postgres version, and doesn't cover node-postgres or Kysely; the repo's `createDatabase` uses `pg`, so PGlite would need a different Kysely dialect in tests. That means tests would not exercise the production driver.

**Options:**

| Option | Local | CI | Gains | Costs |
| --- | --- | --- | --- | --- |
| A. Service container plus `TEST_DATABASE_URL` | Developer runs `pnpm db:up:docker` (or a test-only compose service) and sets the variable | `services: postgres` in the `check` job (or a new `db` job), `TEST_DATABASE_URL` in `env` | Smallest change; reuses `test-database.ts`. Same `postgres:17-alpine` image as `compose.yaml`. | Locally the suites still skip silently without the variable, unless the skip becomes a failure when `CI` is set. |
| B. Testcontainers from a Vitest global setup | Starts its own container if Docker is running | Same code; Docker is available on GitHub's Ubuntu runners | No variable to set; local and CI behave the same. | Adds a dependency (needs review and pinning under `docs/architecture/dependency-policy.md`). Requires Docker locally; the pre-commit hook would either start a container or have to skip the database project. |
| C. PGlite in-process | No Docker | No service | Fast, no setup. | Different driver from production; extension and version parity unverified. |
| D. Keep the `DummyDriver` fakes for API tests, real Postgres for repository tests | Either of the above | Either | API tests stay fast and don't need a database. | Fakes can drift from the real schema; they check the router, not the SQL. |

Related details for whichever option is chosen:

- **Turning the skip into a failure in CI.** For example `describe.skipIf(!connectionString && !process.env.CI)`, or a Vitest `db` project that throws in global setup when the variable is missing. Without this, a broken CI setting looks like a passing run.
- **Pre-commit hook.** `lefthook.yml` runs `pnpm -s test:unit` on every code commit. If database tests stop skipping locally, the hook needs Postgres or a project filter (`vitest -p unit`, section 1).
- **Version.** Development and the test comment use Postgres 17; production will be Neon. The current PostgreSQL docs are version 18.

## 5. Coverage gates, and whether they are worth having for a small team

**What the tools offer:**

- Vitest: the `v8` provider is the default and "since v3.2.0 ... has used AST based coverage remapping for V8 coverage, which produces identical coverage reports to Istanbul". By default only files imported during the run are reported; `coverage.include` is needed to count untested files ([Vitest: Coverage](https://vitest.dev/guide/coverage)).
- Vitest thresholds: `lines`, `functions`, `branches`, `statements`; a negative number means a maximum count of uncovered items; `perFile`; `100: true`; per-glob thresholds; and `autoUpdate`, which rewrites the config's thresholds upward when coverage improves ([Vitest: coverage config](https://vitest.dev/config/coverage)). Coverage settings are global, not per project ([Vitest: Projects](https://vitest.dev/guide/projects)).
- Jest and jest-expo: `collectCoverage` and `collectCoverageFrom` ([Expo: Unit testing](https://docs.expo.dev/develop/unit-testing/)). Jest's report is separate from Vitest's, so a repo-wide number would need merging the two reports.

**What a first-party practitioner source says** ([Google Testing Blog, "Code Coverage Best Practices", 2020-08-07](https://testing.googleblog.com/2020/08/code-coverage-best-practices.html)):

- Coverage "is not a perfect measure of test quality" and is "a lossy and indirect metric"; the value is mostly in showing what isn't covered.
- There is no universal target. Google's guidance is 60% "acceptable", 75% "commendable", and 90% "exemplary", with team-chosen values rather than mandates.
- Gating mechanisms include all code or new code only, and a fixed number or a delta from the prior version. Targets can turn into a checkbox: "pressure to 'hit the metric' almost never yields the desired outcome."
- Seeing uncovered lines in code review is described as more useful than a project-wide number.

**Options for a team of one founder plus agents:**

| Option | Gains | Costs |
| --- | --- | --- |
| A. No coverage | Nothing to maintain. | No signal on untested code; agents get no feedback beyond review. |
| B. Report only (CI artifact or summary) | Shows uncovered code in review without a target to game. | Someone has to look. Two runners mean two reports. |
| C. Ratchet (`autoUpdate`, or fail on any drop) | Coverage can't go down; no arbitrary number to argue about. | Each improvement rewrites the config, so commits touch it often. A legitimate deletion of tested code can trip the gate. |
| D. Fixed threshold on chosen paths (per-glob, for example `packages/domain/**` and `packages/database/**`) | Holds the logic that matters most to a bar, leaves UI alone. | Picking the paths and the number is a judgement call; agents may write low-value tests to meet it, which `CONTRIBUTING.md` already warns against for unrelated code. |
| E. Global fixed threshold | Simple. | The checkbox risk the Google post describes; UI code with jest-expo would need its own number. |

## Open questions for the grilling ticket

1. Should a check fail when a test file isn't matched by any runner?
2. Projects by package, projects by kind, or one broad `include`?
3. Colocated, `tests/` folders, or a per-area rule (for example colocated in `src`, never in `apps/app/app`)?
4. Keep Vitest plus jest-expo, and if so, what is the boundary between them? Move to `jest-expo/universal`?
5. How does CI get Postgres (service container or Testcontainers), and should a missing database fail in CI rather than skip?
6. Should the pre-commit hook run database tests?
7. Coverage: none, report only, ratchet, or thresholds on chosen paths?

## Sources

All checked 2026-10-21.

- Vitest: [Projects](https://vitest.dev/guide/projects), [Coverage guide](https://vitest.dev/guide/coverage), [Coverage config](https://vitest.dev/config/coverage), [include](https://vitest.dev/config/include), [Announcing Vitest 5.0](https://vitest.dev/blog/vitest-5) (2026-09-03), [blog index](https://vitest.dev/blog)
- Expo: [Unit testing with Jest](https://docs.expo.dev/develop/unit-testing/), [Expo Router testing](https://docs.expo.dev/router/reference/testing/), [jest-expo README](https://github.com/expo/expo/tree/main/packages/jest-expo)
- React Native: [Testing overview](https://reactnative.dev/docs/testing-overview)
- [vitest-community/vitest-react-native](https://github.com/vitest-community/vitest-react-native)
- Playwright: [Web server](https://playwright.dev/docs/test-webserver) (`reuseExistingServer`, multiple servers as an array; relevant if E2E tests later need the API server too)
- PostgreSQL 18: [Template databases](https://www.postgresql.org/docs/current/manage-ag-templatedbs.html), [CREATE DATABASE](https://www.postgresql.org/docs/current/sql-createdatabase.html)
- GitHub Docs: [Creating PostgreSQL service containers](https://docs.github.com/en/actions/tutorials/use-containerized-services/create-postgresql-service-containers)
- [Testcontainers for Node: PostgreSQL module](https://node.testcontainers.org/modules/postgresql/)
- [PGlite: About](https://pglite.dev/docs/about)
- Google Testing Blog: [Code Coverage Best Practices](https://testing.googleblog.com/2020/08/code-coverage-best-practices.html) (2020-08-07)
- Repo: `vitest.config.mts`, `apps/app/jest.config.cjs`, `apps/app/playwright.config.ts`, `.github/workflows/ci.yml`, `compose.yaml`, `lefthook.yml`, `packages/database/tests/`, `apps/api-server/tests/support-access.test.ts`, `CONTRIBUTING.md`
