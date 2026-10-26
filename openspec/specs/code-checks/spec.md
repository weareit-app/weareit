# code-checks Specification

## Purpose
Defines the lint, format, and naming checks for the repo's code, which files each covers, how suppressions work, and where each check runs, so that mechanical conventions fail a check instead of waiting for review.

## Requirements

### Requirement: One formatter for code
All JavaScript and TypeScript SHALL be formatted by one formatter, with 2-space indents and 80 columns. Docs, research data, and vendored skills SHALL stay as written. One list SHALL define which files are formatted, used by the format command, CI, and the pre-commit hook.

#### Scenario: Unformatted file in CI
- **WHEN** a TypeScript file is committed unformatted with `--no-verify`
- **THEN** CI's lint step fails

#### Scenario: Markdown is left alone
- **WHEN** the formatter runs on the whole repo
- **THEN** no Markdown file changes

### Requirement: General lint rules
All JavaScript and TypeScript SHALL be linted with the general linter's recommended rules plus its React and project rules. Hook rules SHALL be owned by the type-aware pass alone.

#### Scenario: Missing JSX key
- **WHEN** a component renders a list without keys
- **THEN** lint fails

### Requirement: Type-aware lint rules
TypeScript files SHALL also pass a type-aware lint with the recommended type-checked rules and the React hooks rules, including the React Compiler rules. A floating promise or an async function passed where a callback's result is ignored SHALL fail it.

#### Scenario: Async server handler
- **WHEN** an `async` function is passed to `createServer`
- **THEN** the type-aware lint fails

### Requirement: Errors only
Every lint rule SHALL be either an error or off. A warning SHALL fail CI.

#### Scenario: Rule reports a warning
- **WHEN** any lint tool reports a warning
- **THEN** CI fails

### Requirement: Suppressions give a reason
A lint suppression SHALL be inline and SHALL state its reason. A suppression without a reason, or one that suppresses nothing, SHALL fail lint.

#### Scenario: Bare disable comment
- **WHEN** a file has an ESLint disable comment with no description
- **THEN** lint fails

### Requirement: Non-null assertions
Non-null assertions SHALL fail lint in app and package source, and SHALL be allowed in tests and `tools/`.

#### Scenario: Assertion in a test
- **WHEN** a test file uses `value!`
- **THEN** lint passes

### Requirement: Zod style
Object schemas SHALL be written with `z.strictObject`, and string formats with the top-level functions (`z.url()`, `z.uuid()`, `z.iso.datetime()`). `.strict()`, `.passthrough()`, and the deprecated string format methods SHALL fail lint.

#### Scenario: Legacy strict call
- **WHEN** a schema calls `.strict()`
- **THEN** lint fails and suggests `z.strictObject`

### Requirement: Mechanical naming
Lint SHALL enforce: kebab-case file and folder names; camelCase values, PascalCase types and components, and strict acronyms (`userId`, never `userID`); named exports only; no barrel files; `interface` for object shapes; and extensionless relative imports in bundled code, with `.ts` in `tools/*` and `packages/watercolor`.

#### Scenario: Default export in a component
- **WHEN** a file in `apps/app/src` has a default export
- **THEN** lint fails

#### Scenario: Acronym spelling
- **WHEN** a contributor names a variable `apiURL`
- **THEN** lint fails and asks for `apiUrl`

### Requirement: Naming exceptions at the edges
Naming rules SHALL allow only these exceptions: Expo Router file names (`_layout`, `+not-found`, `[id]`) and numbered snake_case migrations; any property name in `packages/database` (its table types and queries) and in the Stripe and RevenueCat code; default exports in `apps/app/app/**`, stories, and config files; `packages/watercolor`'s `./shaders` entry; and the property names below.

#### Scenario: Route file
- **WHEN** lint runs on `apps/app/app/_layout.tsx`
- **THEN** its name and default export pass

#### Scenario: Column name in a query
- **WHEN** a repository in `packages/database` inserts `{ amount_minor: 500 }`
- **THEN** lint passes

### Requirement: Property names
Object property names SHALL be camelCase, PascalCase, or CONSTANT_CASE, and camelCase only in `@it/domain`. A name a library or the API requires in another form (such as `baseURL`, `__html`, or the CMS API's snake_case version fields) SHALL carry an inline suppression that gives the reason.

#### Scenario: Environment variable name in an env schema
- **WHEN** an `env.ts` schema has a property named `DATABASE_URL`
- **THEN** lint passes

#### Scenario: snake_case in a domain type
- **WHEN** a type in `@it/domain` has a snake_case property
- **THEN** lint fails

### Requirement: Naming judged in review
Review SHALL check the naming rules lint cannot: CONSTANT_CASE only for fixed module-level primitives and frozen lookups of them; a file named after its main export; boolean names starting with `is`, `has`, `can`, or `should`; table interfaces ending in `Table` where the type generator can name them so; schemas named `fooSchema` with the type `Foo` (and `FooInput` where the input differs); packages named `@it/<kebab>` with each export subpath named after its file.

#### Scenario: Object in CONSTANT_CASE
- **WHEN** a diff declares `const DEFAULT_OPTIONS = { … }` that is not a frozen lookup of primitives
- **THEN** review flags it

### Requirement: No hand-built API errors in handlers
Router handlers SHALL raise declared errors through the contract's error helpers. Constructing an oRPC error directly in a handler SHALL fail lint.

#### Scenario: Handler builds an error
- **WHEN** a handler writes `new ORPCError("BAD_REQUEST")`
- **THEN** lint fails

### Requirement: Generated files stay in step
Generated files (the essay modules and the database table types) SHALL be committed, never edited by hand, and checked: CI SHALL fail if regenerating them changes anything.

#### Scenario: Essay edited without rebuilding
- **WHEN** an essay's Markdown changes and its generated module is not rebuilt
- **THEN** CI fails and names the stale file

### Requirement: Python tools are linted and formatted
The Python tools in `tools/` SHALL be linted and formatted by one pinned tool, in the pre-commit hook and in CI beside the JavaScript checks.

#### Scenario: Unused import in a tool
- **WHEN** a Python file in `tools/pains` has an unused import
- **THEN** the pre-commit hook and CI fail

### Requirement: Where the checks run
The pre-commit hook SHALL run the formatter and general linter on staged files (fixing and restaging), and the type-aware lint on staged TypeScript files, in parallel with the typecheck and unit tests. CI SHALL run every check over the whole repo and is the gate. Every check SHALL start with no baseline: existing violations are fixed when it lands.

#### Scenario: Commit skipping hooks
- **WHEN** a contributor commits with `--no-verify`
- **THEN** CI still runs every check on the pull request
