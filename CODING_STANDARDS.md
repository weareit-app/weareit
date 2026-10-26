# Coding standards

Rules that `/code-review` applies to a diff. They are judgement calls that no automated check can make. Anything a script can enforce belongs in lint, the pre-commit hook (`lefthook.yml`) or CI (`.github/workflows/ci.yml`) instead.

## Vendor claims carry their source

Every claim in the diff about an outside vendor's price, limit, default, or behavior (GitHub, Expo, Stripe, Render, Neon, Resend, and so on) names its source and the date it was checked, for example "(checked 2026-10-20 against GitHub's Actions billing docs)". A claim with no source is a finding, and so is one that the cited source does not actually say. This includes claims passed on by another agent or reviewer: check them against the source before they go in. Check a claim against the section of its source that it cites; for a web page, ask WebFetch about that section by name.

## UI copy in stories, tests and fixtures is real

Text that people would read in the app, when it appears in a story, test or fixture, comes from the app or from `@it/content` (in stories, through `apps/app/src/stories/content.ts`). It is never invented for the occasion, so stories and tests show and check what people will actually read. Invented copy is a finding. Placeholder data that is not UI copy, such as an ID or a test email address, is fine.

## Boundaries and vendors

- **Validate untrusted input with Zod at the boundary.** Request bodies, webhook payloads, environment variables, stored drafts, and anything read from a file or another service are parsed with a Zod schema where they enter. Code past the boundary trusts the parsed type.
- **API operations are semantic.** An operation names what a person or the CMS does (`saveOnboarding`, `publishDraft`), not a table it touches. A generic create/read/update/delete endpoint shaped like the database is a finding.
- **Vendors stay behind It-owned boundaries.** Payments, auth, email, storage, and hosting are reached through an It-owned module, so a provider can be swapped without touching product code. Product code that imports a vendor SDK directly is a finding.

## Schemas and types

- **Each shape has exactly one owner, and every other layer imports or derives it.** A union of status strings, an object shape, or a pattern that a schema already defines and that a diff writes out again is a finding. Checks catch the cases they can (generated table types, the database enum test, derived types, unused exports); review catches the rest.
- **Schemas are named `fooSchema`, and their types are the PascalCase noun.** `const painSchema` goes with `type Pain = z.infer<typeof painSchema>`. Where the input before parsing differs, its type is `PainInput` (`z.input`).

## Naming

Mechanical naming rules (file names, acronyms, default exports) belong to lint. Review checks these:

- **CONSTANT_CASE is only for fixed module-level primitives** (strings, numbers, booleans) and frozen lookups of them. Objects, arrays of objects, functions, and anything computed are camelCase.
- **A file is named after its main export**, in kebab-case: `choice-card.tsx` exports `ChoiceCard`, and `use-draft.ts` exports `useDraft`. Helpers can share the file.
- **Boolean values and props start with `is`, `has`, `can`, or `should`.**
- **Database table interfaces end in `Table`** (`ContentPainsTable`) where the type generator can name them so. Generated names are otherwise kept as generated.
- **Packages are named `@it/<kebab>`,** and each export subpath is named after the file it points to (`./graph-schema` → `src/graph-schema.ts`). A library's `exports` lists named subpaths that point at source, with no root (`"."`) export.

## Errors

- **Expected failures are error classes, not message strings.** A repository or service that can fail in a way its caller acts on throws an `Error` subclass, defined in the package that throws it, with its details as fields. Matching on `error.message` is a finding.
- **The app writes the words people see for an API failure,** keyed by error code and following `docs/style/copy-style-guide.md`. Showing a server's `error.message` to a person is a finding; the server's message is for developers and logs.
- **API error codes name what happened in the domain** (`REVISION_CONFLICT`, `PAYMENTS_NOT_CONFIGURED`), not a generic HTTP name. `UNAUTHORIZED` and `NOT_FOUND` keep their names. A failure several operations share is declared once, on a contract base those operations build from.
- **Pure domain logic returns expected outcomes as values** (a list of issues, a `safeParse` result) and throws only when an invariant is broken.

## Logging

- **Log fields, never interpolated personal data.** A log call passes an event name and fields. Logs never hold secrets, passwords, sign-in codes, session tokens, payment details, or a person's onboarding answers, contributions, or free text, and they identify an account only by its ID after signup. Local development may log sign-in codes when no email server is configured.

## What each layer tests

A test covers what its layer owns:

- **Domain and content:** pure unit tests.
- **Database:** repository behavior on real Postgres. SQL is tested only here.
- **API:** routing, validation, and auth against fakes. A router test that connects to Postgres is a finding.
- **App:** component behavior through React Native Testing Library and the router test renderer (`renderRouter`).
- **End to end:** a few key journeys, such as onboarding to signup and Support It, not every screen.

Don't add tests for unrelated code.
