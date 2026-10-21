# Spec Delta

## Purpose

Defines which workspace packages, apps, tools, and third-party libraries each part of the repo may depend on, and the checks that fail when an import breaks those rules or code and versions drift.

## ADDED Requirements

### Requirement: Allowed package graph
Workspace dependencies SHALL follow this graph, and any edge not listed SHALL fail the check:

| Package | May depend on |
| --- | --- |
| `@it/domain`, `@it/watercolor` | nothing |
| `@it/content`, `@it/api-contract` | `@it/domain` |
| `@it/database` | `@it/domain`, `@it/content` |
| `apps/api-server` | `@it/api-contract`, `@it/database`, `@it/domain`, `@it/content` |
| `apps/app` | `@it/api-contract`, `@it/content`, `@it/domain`, `@it/watercolor` |
| `tools/*` | any package |

#### Scenario: App imports the database
- **WHEN** a file in `apps/app` imports from `@it/database`
- **THEN** the check fails and names the file and the forbidden edge

#### Scenario: Something imports an app
- **WHEN** a package or tool imports from `apps/api-server` or `apps/app`
- **THEN** the check fails, because nothing depends on an app

### Requirement: Imports cross packages by name
An import from another package SHALL use the package name and one of its `exports` subpaths. A relative path into another package's folder SHALL fail the check. Each library SHALL list named export subpaths that point at source, with no root export.

#### Scenario: End-to-end spec reaches into a package
- **WHEN** an end-to-end spec imports `../../../packages/database/src/tier1-import`
- **THEN** the check fails, and the fix is to import the function through a package export

### Requirement: Pure packages use an allowlist
`@it/domain`, `@it/watercolor`, and `@it/content` SHALL import only `zod` from outside the workspace. `@it/api-contract` SHALL import only `zod`, `@orpc/contract`, and `@orpc/client`. Adding a library to one of these packages SHALL require editing the allowlist. This is how the rule that domain and content stay free of Expo, React Native, UI, and provider imports is checked.

#### Scenario: React Native in content
- **WHEN** a file in `@it/content`'s source imports `react-native`
- **THEN** the check fails with the package's allowlist in the message

### Requirement: Server framework stays in the server
Only `apps/api-server` SHALL import the oRPC server library. Repositories, services, and domain logic SHALL NOT import any oRPC library.

#### Scenario: Repository throws an oRPC error
- **WHEN** a file in `@it/database` imports from `@orpc/server` or `@orpc/client`
- **THEN** the check fails

### Requirement: Module edges inside the domain package
Inside `@it/domain`, onboarding MAY import content, content MAY import primitives, support MAY import primitives, and essays MAY import primitives. Any other edge between modules SHALL fail the check.

#### Scenario: Support imports content
- **WHEN** the support module imports from the content module
- **THEN** the check fails and names both modules

### Requirement: Type-only imports count
Every boundary rule SHALL apply to type-only imports exactly as it applies to runtime imports.

#### Scenario: Type import across a forbidden edge
- **WHEN** an app file writes `import type` from `@it/database`
- **THEN** the check fails as it would for a runtime import

### Requirement: No circular imports
A cycle of imports, between packages or between files in one package, SHALL fail the check.

#### Scenario: Two files import each other
- **WHEN** two files in `apps/app/src` import each other
- **THEN** the check fails and lists the cycle

### Requirement: Where the boundary check runs
The boundary check SHALL run in CI as part of lint and in the pre-commit hook. It SHALL start with no baseline: every existing violation is fixed when it lands. An exception SHALL live only in the check's config, with a comment giving its reason.

#### Scenario: Commit with a violation
- **WHEN** a contributor commits a file that breaks a boundary rule
- **THEN** the pre-commit hook fails before the commit is made

### Requirement: Unused code and version drift
CI SHALL fail on unused files, unused exports, unused dependencies, and dependencies used but not declared. CI SHALL also fail when two workspace packages declare different versions of the same dependency. Neither check runs in the pre-commit hook.

#### Scenario: Export nobody imports
- **WHEN** a package exports a subpath that no other file imports
- **THEN** CI fails and names the export
