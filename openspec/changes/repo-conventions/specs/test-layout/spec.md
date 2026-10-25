# Spec Delta

## Purpose

Defines which test runner owns which test files, where tests live, what each layer tests, and the check that keeps every test running, so that no test can sit unrun and no Postgres test is skipped in CI.

## ADDED Requirements

### Requirement: Runners by file name
Logic tests SHALL run under Vitest: every `*.test.ts` in packages, `apps/api-server`, the TypeScript tools, and `apps/app`. React Native component tests (`apps/app` files named `*.test.tsx`) SHALL run under jest-expo. Key journeys SHALL run under Playwright from `apps/app/e2e/*.spec.ts`.

#### Scenario: New package test
- **WHEN** a contributor adds `packages/domain/src/support.test.ts`
- **THEN** Vitest runs it without any config change

#### Scenario: Component test
- **WHEN** a contributor adds `apps/app/src/components/choice-card.test.tsx`
- **THEN** jest-expo runs it

### Requirement: Runners find tests by glob
Each runner SHALL find its tests by glob over whole packages, apps, and tools. No runner config SHALL list test folders by hand.

#### Scenario: New app folder
- **WHEN** a contributor adds a `*.test.ts` in a new folder under `apps/app/src`
- **THEN** Vitest runs it

### Requirement: Universal component tests
Component tests SHALL run on jest-expo's universal preset, on the platforms each test targets, using jest-expo's platform-specific test file names: a `*.test.tsx` runs on iOS, Android, web, and Node; a `*.test.native.tsx` on iOS and Android; a `*.test.web.tsx` on web only. A case for one native platform SHALL be guarded by `Platform.OS` or go in a `*.test.ios.tsx` or `*.test.android.tsx` file.

#### Scenario: Web-only block test
- **WHEN** the essay block tests run
- **THEN** they run only on the web platform

#### Scenario: iOS-only case
- **WHEN** a component test checks behavior only iOS has, such as a screen reader announcement
- **THEN** it runs on iOS and is skipped or absent on Android

### Requirement: Native-only component tests
A component test that React Native Testing Library can't render on web or Node SHALL be named `*.test.native.tsx`. Its web behavior SHALL be covered by the Playwright journeys instead.

#### Scenario: Native component test
- **WHEN** a contributor adds `apps/app/src/components/choice-card.test.native.tsx`
- **THEN** jest-expo runs it on iOS and Android, not on web or Node

### Requirement: Tests beside their code
A JavaScript or TypeScript test SHALL sit beside the file it tests (`foo.ts` and `foo.test.ts`) in every package, app, and tool. Python tests are exempt: they stay in their tool's `tests/` folder (for example `tools/pains/tests/`), where `pnpm run test:tools` finds them with `unittest` discovery. Tests SHALL NOT go inside `apps/app/app/`. Shared helpers, such as the per-file Postgres harness, SHALL go in a test-support file.

#### Scenario: Test under the routes folder
- **WHEN** a contributor adds a test inside `apps/app/app/`
- **THEN** the layout check fails, because Expo Router treats every file there as a route

### Requirement: Layout check
One check, run in CI and the pre-commit hook, SHALL fail when a JavaScript or TypeScript test file belongs to no runner, a `tests/` or `__tests__` folder holding JavaScript or TypeScript files exists, a test file sits inside `apps/app/app/`, or a `*.spec.ts` file sits outside `apps/app/e2e`.

#### Scenario: Tests folder
- **WHEN** a contributor adds `packages/content/tests/graph.test.ts`
- **THEN** the check fails and says the test belongs beside its file

#### Scenario: Python tests folder
- **WHEN** `tools/possibilities/tests/` holds only `test_*.py` files
- **THEN** the check passes, because the layout rules cover JavaScript and TypeScript tests only

#### Scenario: Spec file in a package
- **WHEN** a `*.spec.ts` file is added in `packages/database`
- **THEN** the check fails

### Requirement: Postgres tests in CI
In CI, the Postgres tests SHALL fail the run when no test database is configured. Locally they SHALL skip without one, so contributors without Postgres can run the unit tests. The pre-commit hook SHALL NOT run them.

#### Scenario: CI without a database
- **WHEN** the CI test step runs without `TEST_DATABASE_URL`
- **THEN** the run fails instead of skipping the Postgres tests

#### Scenario: Laptop without Postgres
- **WHEN** a contributor runs the unit tests with no `TEST_DATABASE_URL`
- **THEN** the Postgres tests are skipped and the rest pass

### Requirement: What each layer tests
Each layer SHALL test what it owns: domain and content with pure unit tests; the database with repository behavior on real Postgres; the API with routing, validation, and auth against fakes, never SQL; the app with component behavior through React Native Testing Library and the router test renderer; end to end, a few key journeys (onboarding to signup, Support It). Review judges this, and no test is added for unrelated code.

#### Scenario: SQL in a router test
- **WHEN** a router test connects to Postgres
- **THEN** review flags it, because SQL is tested only in the database package

### Requirement: End-to-end specs import by package
End-to-end specs SHALL import packages through their public exports, never by relative path into a package's source.

#### Scenario: Content graph in an end-to-end spec
- **WHEN** an end-to-end spec needs the tier-1 content graph
- **THEN** it imports the builder from `@it/content`

### Requirement: No coverage targets
Test runs SHALL NOT enforce a coverage threshold.

#### Scenario: Uncovered file
- **WHEN** a pull request adds a file with no test
- **THEN** no coverage check fails, and review decides whether a test is needed
