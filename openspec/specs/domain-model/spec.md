# domain-model Specification

## Purpose
Defines where It's schemas and types live and how a shape flows from its one definition to the database, the API wire format, and the app, so that no layer restates a shape another layer owns.

## Requirements

### Requirement: One home for domain schemas
Every domain schema SHALL live in `@it/domain`, which holds schemas and pure domain logic only. It SHALL have one module per domain: primitives, content, essays, onboarding, and support. `@it/content` SHALL hold only content data and the essay build, and SHALL import its schemas from `@it/domain`.

#### Scenario: A new content field
- **WHEN** a contributor adds a field to the pain schema
- **THEN** they change it in the content module of `@it/domain`, and `@it/content`, `@it/database`, and the app pick it up through imports

#### Scenario: Rendering schemas stay put
- **WHEN** a contributor looks for the watercolor manifest, palette, or pigment schema
- **THEN** it is in `@it/watercolor`, because no other layer restates it

### Requirement: Shared primitives written once
The slug ID, non-empty text, ISO date, and ISO datetime SHALL each be defined once, in the primitives module, and every schema in a package allowed to depend on `@it/domain` SHALL use that definition. `@it/watercolor` depends on nothing (see package-boundaries), so its rendering schemas keep their own patterns.

#### Scenario: Slug pattern
- **WHEN** a schema needs a slug ID
- **THEN** it uses the primitives module's slug ID schema instead of its own pattern

### Requirement: Support shapes written once
Support frequency, contribution status, processor, and transaction status SHALL each be defined once, in the support module.

#### Scenario: Frequency union
- **WHEN** the database, the contract, and the app need the support frequency values
- **THEN** each imports or derives them from the support module

### Requirement: Types come from schemas
A type that describes a value with a schema SHALL be derived from that schema (its parsed output, or its input where the value is read before parsing), never written by hand. Enum unions SHALL come from their schema. Hand-written types SHALL be used only where no schema exists, such as component props and internal state.

#### Scenario: Onboarding draft column
- **WHEN** the database stores the onboarding draft
- **THEN** its column type is the onboarding module's draft type, so a field added to the schema reaches the column type without another edit

### Requirement: Authoring schemas built from graph schemas
The tier-1 authoring schemas SHALL be built from the content graph schemas by picking and extending them. A rule shared by both, such as a feature status being required exactly when a way's kind is feature, SHALL live on the graph schema.

#### Scenario: Feature status rule
- **WHEN** a tier-1 way of kind feature has no feature status
- **THEN** the authoring schema rejects it through the rule it inherits from the graph schema

### Requirement: Generated table types
Database table types SHALL be generated from the migrated database. Enum columns constrained by `CHECK` and `jsonb` columns SHALL be typed with the `@it/domain` types. CI SHALL fail if the committed table types differ from what the migrated database generates.

#### Scenario: Migration without regenerating
- **WHEN** a migration adds a column and the table types are not regenerated
- **THEN** CI fails on the table types check

### Requirement: SQL enums match domain enums
A test against real Postgres SHALL assert that each enum `CHECK` constraint lists exactly the values of its domain enum.

#### Scenario: New status value
- **WHEN** a contributor adds a value to a domain enum but not to its `CHECK` constraint
- **THEN** the test fails and names the column and the missing value

### Requirement: A contract package apart from the server
The API contract, a client typed from the contract alone, and the OpenAPI document SHALL live in `@it/api-contract`. The router SHALL live in `apps/api-server`, and its service types SHALL be derived from the contract instead of restating it. The app's type graph SHALL NOT reach the database package or a database driver.

#### Scenario: App typecheck
- **WHEN** the app is typechecked
- **THEN** no file reached through It's own packages (`@it/*`) is from `@it/database`, `kysely`, or `pg`; `kysely`'s types still arrive through Better Auth's client until better-auth/better-auth#6183 makes them optional (founder, 2026-10-22)

#### Scenario: Client takes its address
- **WHEN** the app creates an API client
- **THEN** it passes the API URL in, and the contract package reads no environment variable

### Requirement: Wire shapes
Shapes that exist only on the wire (published content version, CMS draft, publish result) SHALL be owned by the contract package. Wire shapes SHALL use camelCase fields and send dates as ISO datetime strings; repository code SHALL map database rows into them.

#### Scenario: Published version timestamp
- **WHEN** the API returns a published content version
- **THEN** its publish time is an ISO datetime string in a camelCase field

### Requirement: One owner per shape
Each shape SHALL have exactly one owner, and every other layer SHALL import or derive it. Where a check can catch a restated shape (generated table types, the `CHECK` test, derived types, unused-export detection), it SHALL; otherwise review SHALL.

#### Scenario: Restated union in review
- **WHEN** a diff writes out a union of status strings that a schema already defines
- **THEN** review flags it under the one-owner rule

### Requirement: Moving shapes changes no data
Moving schemas between packages SHALL NOT change what is stored on the device before signup, what is sent, what is stored after signup, or what is public. Every schema SHALL accept and produce the same values before and after the move.

#### Scenario: Stored draft after the move
- **WHEN** a person who started onboarding before the move returns after it
- **THEN** their on-device draft parses unchanged
