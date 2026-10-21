# Schema and contract layering with oRPC, Zod, and Kysely

Research for wayfinder ticket #145 (map #140). Checked 2026-10-21. This file sets out facts and trade-offs; the grilling ticket (#147) makes the decision.

## Question

How should schemas, types, and API contracts be layered in this monorepo, given oRPC, Zod, and Kysely? Specifically:

1. Can a contract-first oRPC client be typed from the contract alone, without importing the router?
2. What is current Zod 4 practice for inferring types, branding, and strict objects?
3. Should Kysely table types be generated (for example with kysely-codegen) or written by hand, and how do they relate to the Zod schemas?
4. What does a dedicated `schemas` package buy over per-domain ownership, with real monorepo examples?

## Short answer

- **Yes, the client can be typed from the contract alone.** `@orpc/contract` ships a client type built from a contract router. In the installed 1.15.6 it is `ContractRouterClient<typeof contract>`; on oRPC's `main` branch (2.0 beta) it is renamed `RouterContractClient`. Swapping `client.ts` to it removes the type-only import of `./router`, and with it `@it/database` and `pg`, from the app's type graph. Nothing about runtime behavior changes, because `import type` is already erased at build time.
- **Zod 4 has new spellings for what this repo already does.** `.strict()` is legacy (still works, "will not be removed"); `z.strictObject()` is the current form. String format methods such as `.url()`, `.uuid()`, and `.datetime()` are deprecated in favor of `z.url()`, `z.uuid()`, and `z.iso.datetime()`. `.brand()` brands the output type only by default, and Zod 4.2+ adds an `"in" | "out" | "inout"` direction. The repo mixes both object spellings and uses no brands.
- **Kysely's own docs say hand-written types are "good enough" in many cases, and recommend generation for production apps.** kysely-codegen introspects a live database. In this repo it would emit `string` for the many text columns constrained by `CHECK`, and an untyped JSON type for the `jsonb` columns, so it would need overrides to match what `types.ts` says today. Kysely types are compile-time only and do not validate; the Zod schema stays the runtime check, applied when JSON is read back.
- **A dedicated schemas package mostly buys a single place with a single dependency rule** (Zod only, no runtime). `@it/content` already plays this role. Real monorepos split both ways: create-t3-turbo ships an almost empty `validators` package and derives schemas from the database layer instead; oRPC's own playground keeps `schemas/` next to `contracts/`; Documenso colocates one `*.types.ts` file per procedure.

## Where the repo stands

Read from `origin/master` at `13f9ab3`.

Installed versions (from `pnpm-lock.yaml`): `zod` 4.6.7 in every workspace package (a transitive `zod` 3.25.76 also exists, pulled in by an Expo dependency), `@orpc/client`, `@orpc/contract`, and `@orpc/server` 1.15.6, and `kysely` 0.28.17. Latest on npm on 2026-10-21: `zod` 4.6.7, `@orpc/contract` 1.15.7 (`beta` tag 2.0.0-beta.44), `kysely` 0.29.7, and `kysely-codegen` 0.20.0.

Layers as they exist:

| Layer | Where | What it holds |
| --- | --- | --- |
| Content schemas | `@it/content` (`schema.ts`, `graph-schema.ts`, `essay-schema.ts`) | Zod schemas and `z.infer` types for the content graph and essays. Also content data and the essay build. |
| Domain schemas | `@it/domain/onboarding` | `onboardingDraftSchema` and `OnboardingDraft`. |
| API contract | `@it/api/contract` | `oc` procedures; inline Zod for request and response shapes; imports the two packages above. |
| API router | `@it/api/router` | `implement(apiContract)`; imports `@it/database` at runtime. |
| API client | `@it/api/client` | `createORPCClient<RouterClient<ApiRouter>>`, with `import type { ApiRouter } from "./router"`. |
| Table types | `@it/database/types` | Hand-written Kysely interfaces; imports `ContentGraph` and `FeatureStatus` from `@it/content/graph-schema`. |

Facts that bear on the decision:

- **The client type reaches the router.** The app depends on `@it/api` and imports only `@it/api/client`, but `client.ts` types itself from `./router`, which imports `@it/database`, which depends on `pg`. Because the import is `import type`, no server code is bundled. The cost is that the app's type check resolves the server's type graph, and the `AGENTS.md` rule ("schemas and contracts are shared without importing server runtime code") is met only by convention.
- **Hand-written table types have already drifted.** `types.ts` declares its own `UserOnboardingDraft` for the `user_onboarding_drafts.draft` column with six fields. `onboardingDraftSchema` in `@it/domain` now also has `worldPaths` and `personalPaths`. Nothing links the two, so the type check did not catch it.
- **Status unions are written three times.** The support status union (`"pending" | "active" | ...`) appears in `contract.ts` (Zod enum), `router.ts` (the `ApiContext` interface), and `types.ts` (the table interface), with a `CHECK` constraint in migration `003`.
- **JSON columns are re-validated on read.** `content-repository.ts` calls `contentGraphSchema.parse(row.content)` on data read back from `jsonb` columns, so the Zod schema is already the runtime guard at the database boundary.
- **Zod style is mixed.** 39 `.strict()` calls across 6 files, 27 `z.strictObject` calls (all in `essay-schema.ts`), at least 6 deprecated string-format methods (`z.string().datetime()`, `.url()`, `.uuid()` in `contract.ts`), and no brands.
- **Postgres enums are not used.** Allowed values are `text` columns with `CHECK` constraints (migrations `002` and `003`), and the `jsonb` draft column only checks `jsonb_typeof(draft) = 'object'`.

## 1. Contract-first oRPC and client typing

What the sources say:

- A contract is built with `oc` from `@orpc/contract`, and `.input()` and `.output()` accept any Standard Schema library, Zod included. The define-contract page notes that without `.output()` "the output type will be `unknown`" on the client. (orpc.dev, "Define contract", checked 2026-10-21.)
- `implement(contract)` "turns a contract into an implementer" on the server, so handlers are type-checked against the contract. (orpc.dev, "Implement contract", checked 2026-10-21.)
- The client docs give two ways to type a client: from the contract (`RouterContractClient<typeof contract>` in the current docs) or from the router (`RouterClient<typeof router>`). The tip on that page: "You can export `RouterClient<typeof router>` or `RouterContractClient<typeof contract>` from the server to avoid importing the contract or router in the client." (orpc.dev, "Client-side clients", and its source `apps/content/docs/client/client-side.mdx` on `dinwwwh/orpc` `main`, checked 2026-10-21.)
- **Name depends on version.** In the installed `@orpc/contract` 1.15.6 the type is `ContractRouterClient<TRouter, TClientContext>` (read from its `dist/*.d.ts`). On `main`, which publishes as 2.0.0-beta.44, `packages/contract/src/router-client.ts` defines `RouterContractClient` with the doc comment "Useful for typing a client without importing the server router." The docs site follows `main`, so its examples use the 2.0 name. Inference helpers in 1.15.6 are `InferContractRouterInputs`, `InferContractRouterOutputs`, `InferContractRouterErrorMap`, and `InferContractRouterMeta`.
- oRPC's own NestJS playground types its client this way: `JsonifiedClient<RouterContractClient<typeof contract>>`, built with `OpenAPILink(contract, ...)`, with no router import (`playgrounds/nest/src/lib/orpc.ts`, `dinwwwh/orpc` `main`, checked 2026-10-21).
- Going the other way, a router can serve as a contract only if it has no lazy routers, and oRPC warns that importing a router into a client "can be heavy and may expose internal logic". Its remedy is `minifyRouterContract` plus a JSON export, which loses schema types and needs a manual cast. (orpc.dev, "Router to contract", checked 2026-10-21.) This repo already has a hand-written contract, so it does not need this path.

How it fits this repo:

- `apiContract` already defines `.output()` on every procedure, so a contract-typed client gets the same input and output types the router-typed one does. The router throws plain `ORPCError`s and the contract declares no `.errors()`, so neither client type has typed errors today; typed errors would come from adding `.errors()` to the contract.
- Options for where the contract lives:
  - **Keep one `@it/api` package, change the client type.** `client.ts` imports `type { ApiContract } from "./contract"` and uses `ContractRouterClient<ApiContract>`. Smallest change; the server code stays one subpath export away, so only a lint rule or review stops someone importing `@it/api/router` from the app.
  - **Split the package.** For example `@it/api-contract` (depends on `@orpc/contract`, `zod`, `@it/content`, `@it/domain`) and keep the router with the server (`@it/api` or inside `apps/api-server`). The app's `package.json` then cannot reach the router at all, which makes the `AGENTS.md` rule structural. Costs one more package.
- The rename to `RouterContractClient` in 2.0 means the type name is a pinning concern: whichever option is chosen, an upgrade to 2.0 touches that line.

## 2. Zod 4 practice

All from zod.dev, checked 2026-10-21, against the installed 4.6.7.

- **Strict objects.** "To define a strict schema that throws an error when unknown keys are found" use `z.strictObject({...})`; `z.looseObject({...})` passes unknown keys through; plain `z.object` strips them, which is the default. The changelog marks `.strict()` and `.passthrough()` as deprecated: they "will not be removed" and are "considered legacy". `.strip()` is deprecated too. To relax a strict schema, the changelog suggests `z.object(A.shape)`. (zod.dev/api, zod.dev/v4/changelog.)
- **String formats.** `.email()`, `.url()`, `.uuid()`, and the other format methods moved to top-level functions (`z.email()`, `z.url()`, `z.uuid()`); the method forms still work but are deprecated, and the top-level forms are "less verbose and more tree-shakable". `z.uuid()` is now stricter about RFC 9562/4122 variant bits; `z.guid()` is the looser check. ISO formats live under `z.iso`: `z.iso.datetime()` rejects offsets unless `{ offset: true }`. (zod.dev/v4/changelog, zod.dev/api.) The repo already uses `z.iso.date()` in `graph-schema.ts` but `z.string().datetime()` in `contract.ts`.
- **Inference.** `z.infer<typeof S>` is the output type and is what the repo uses throughout. `z.input<typeof S>` differs where a schema transforms, coerces, or defaults: in Zod 4, coerced schemas have input type `unknown`, and defaults "must now match the output type". This matters here because `onboardingDraftSchema` uses `.default([])` on `worldPaths` and `personalPaths`, so its input type has those keys optional and its output type has them required. A table type or client type built from `z.infer` describes the parsed value, not what a caller may send. (zod.dev/v4/changelog, zod.dev/api.)
- **Brands.** `.brand<"Name">()` attaches a static-only brand; brands "do not affect the runtime result of `.parse`". By default only the output type is branded, so `z.input` stays plain. Zod 4.2+ takes a direction: `.brand<"Cat", "in" | "out" | "inout">()`. `ZodBranded` is gone in Zod 4; the brand now modifies the inferred type directly. (zod.dev/api, zod.dev/v4/changelog.) Candidate uses here are IDs that are easy to mix up (pain, dream, and fix IDs are all `idSchema` strings) and the support `reference`. A brand on IDs means every literal ID in tests and content data has to come through a parse or a cast.

These are mechanical choices, so whichever is picked can be enforced by a lint rule (for example banning `.strict()` and the deprecated string methods) rather than by `CODING_STANDARDS.md`.

## 3. Kysely table types: generated or hand-written

What the sources say:

- Kysely's "Generating types" page: "In many cases, defining your database schema definitions manually is good enough." For production applications it says it is "best to stay aligned with the database schema, by automatically generating the database schema type definitions." It lists kysely-codegen, kysely-typegen, prisma-kysely, kanel-kysely, and kysely-schema-generator. (kysely.dev/docs/generating-types, checked 2026-10-21.)
- **kysely-codegen** (0.20.0, last published 2026-02-16 per npm) connects to a live database (`--url`, default `env(DATABASE_URL)`) and writes one interface per table plus a `DB` interface. Postgres is supported. Relevant flags: `--out-file` (default is inside `node_modules`, so a committed file needs this set), `--verify` ("Verify that the generated types are up-to-date"), `--overrides` (per-column types, for example `{"columns":{"table.column":"..."}}`), `--custom-imports` (import the types an override names), `--type-only-imports` (default on), `--camel-case`, and `--runtime-enums`. Config can live in `.kysely-codegenrc.*` or `package.json`. It depends on `zod` ^4.3.6 itself but does not emit Zod schemas. (github.com/RobinBlomberg/kysely-codegen README; npm, checked 2026-10-21.)
- **kanel-kysely** extends Kanel, which the Kysely docs describe as a mature PostgreSQL-only generator; Kanel also has a `kanel-zod` extension (4.0.1 on npm) that emits Zod schemas from the database. (kysely.dev; npm, checked 2026-10-21.)
- **kysely-typegen** introspects through a `Kysely` instance, so it works with in-process databases such as PGlite. (kysely.dev, checked 2026-10-21.)

How it fits this repo:

- **Allowed values would come out as `string`.** Codegen derives unions from Postgres enum types. This repo uses `text` plus `CHECK` constraints, so `status`, `processor`, `frequency`, `kind`, `evidence`, `scope`, and the rest would become `string` unless each is overridden, or the migrations switch to Postgres enums.
- **JSON columns would come out untyped.** `content_revisions.content`, `published_content_versions.content`, and `user_onboarding_drafts.draft` would need overrides pointing at `ContentGraph` and `OnboardingDraft` through `--custom-imports`, which reintroduces a hand-maintained mapping (smaller than today's, but not zero).
- **Generation needs a database in CI.** `--verify` against a database built from the migrations would catch drift between migrations and committed types. That means a Postgres service in CI, or a programmatic run against PGlite with kysely-typegen. Today there is no such check.
- **Neither approach validates.** Kysely types are compile-time only. The runtime guard at the database boundary is the Zod parse already done on read in `content-repository.ts`. The drift found above (`UserOnboardingDraft` missing two fields) is the kind codegen would not catch, because the database sees only `jsonb`; it is caught by deriving the column type from the Zod schema (`JSONColumnType<OnboardingDraft>`) instead of restating it.
- **Ways to relate the two, in increasing coupling:**
  - Hand-written table types that import their JSON and union types from the Zod-owning package (the pattern `types.ts` already follows for `ContentGraph` and `FeatureStatus`, extended to every shared union and JSON shape).
  - Generated table types, with overrides that import the same Zod-inferred types.
  - Zod generated from the database (`kanel-zod`), which inverts the direction: the database becomes the source of truth for API shapes. That conflicts with the contract-first direction and with `AGENTS.md` keeping domain and content packages free of provider imports, so it is listed for completeness.

## 4. A dedicated schemas package or per-domain ownership

Real monorepos, checked 2026-10-21:

- **create-t3-turbo** (`t3-oss/create-t3-turbo`, last commit 2025-12-12): packages `api`, `auth`, `db`, `ui`, and `validators`. The `validators` package holds one placeholder schema whose description says it "is currently not used as we use drizzle-zod for simple schemas", and that "as your application grows and you need other validators to share with back and frontend, you can put them in here". Real schemas live in `packages/db/src/schema.ts`, derived from the Drizzle tables with `createInsertSchema`. So the template's shared package exists for client-and-server schemas that are not table-shaped.
- **oRPC NestJS playground** (`dinwwwh/orpc`, `playgrounds/nest/src`): `schemas/` (for example `PlanetSchema`, `CreatingPlanetSchema`) and `contracts/` (one file per resource, importing from `schemas/`) as sibling folders, and a client typed from `contracts/` alone.
- **Documenso** (`documenso/documenso`, pushed 2026-10-21): no schemas package. Each tRPC procedure has a colocated `*.types.ts` file (for example `packages/trpc/server/document-router/attachment/create-attachment.types.ts`), shared types sit in `packages/lib/types/`, and the public v1 API has its own `packages/api/v1/contract.ts`.
- **This repo**: `@it/content` already acts as the shared schemas package (the survey on #140 counts 22 app imports of `graph-schema` and `essay-schema`), but it also holds content data, generated essays, and the essay build script with its markdown dev dependencies.

What a dedicated package buys:

- One dependency rule that is easy to check: the package may import `zod` and nothing else in the workspace. A lint rule or a `package.json` check enforces it.
- One obvious home for shapes shared by the contract, the database types, and the app (the support status union, ID schemas, brands), so they stop being restated.
- A natural place for the contract itself if the API is split as in section 1.

What per-domain ownership buys:

- Schemas sit next to the code that changes them (`@it/domain/onboarding` owns the draft shape, `@it/content` owns the graph). A change to a domain's rules touches one package.
- No package whose name says "schemas" but whose contents drift into helpers and data.
- Fits the existing layout with no move. The rule then becomes: domain and content packages own their schemas, and every other layer (contract, table types, app) imports and derives from them rather than restating them.

A middle option seen in the examples is to keep per-domain ownership but split what is not a schema out of `@it/content` (data, generated essays, the build script), so the schema subpaths have Zod as their only dependency.

## Options for the grilling ticket

| Question | Options | Main trade-off |
| --- | --- | --- |
| Client typing | A. `ContractRouterClient<ApiContract>` in the same package. B. Split `@it/api-contract` from the router. | A is one line; B makes the boundary structural. Both pin to the 1.x type name. |
| Zod object style | A. `z.strictObject` everywhere, lint bans `.strict()`. B. Keep `.strict()` until touched. | A matches current docs; B avoids churn. Both are lintable. |
| Brands | A. Brand IDs and references. B. No brands for now. | A catches mixed-up IDs; B avoids casts in tests and content data. |
| Table types | A. Hand-written, deriving JSON and union types from Zod. B. kysely-codegen with overrides and `--verify` in CI. | A fixes the drift seen today with no new tooling; B catches migration drift but needs a CI database and many overrides because of `CHECK` constraints. |
| Schema home | A. Per-domain ownership, no restating. B. A dedicated `@it/schemas`. C. Per-domain, with non-schema parts moved out of `@it/content`. | B gives one rule and one home; A and C keep schemas next to their domain. |

## Sources

All checked 2026-10-21.

- oRPC, "Define contract": https://orpc.dev/docs/contract-first/define-contract
- oRPC, "Implement contract": https://orpc.dev/docs/contract-first/implement-contract
- oRPC, "Router to contract": https://orpc.dev/docs/contract-first/router-to-contract
- oRPC, "Client-side clients": https://orpc.dev/docs/client/client-side (source: `apps/content/docs/client/client-side.mdx` on https://github.com/dinwwwh/orpc)
- oRPC source, `packages/contract/src/router-client.ts` on `main` (2.0.0-beta.44): https://github.com/dinwwwh/orpc
- oRPC NestJS playground, `playgrounds/nest/src/lib/orpc.ts` and `src/contracts/planet.ts`: https://github.com/dinwwwh/orpc
- `@orpc/contract` 1.15.6 type declarations, as installed in this repo
- Zod 4 changelog: https://zod.dev/v4/changelog
- Zod API: https://zod.dev/api
- Kysely, "Generating types": https://kysely.dev/docs/generating-types
- kysely-codegen README: https://github.com/RobinBlomberg/kysely-codegen
- npm registry (`npm view`) for `zod`, `@orpc/contract`, `kysely`, `kysely-codegen`, `kanel`, and `kanel-zod`
- create-t3-turbo: https://github.com/t3-oss/create-t3-turbo (`packages/validators/src/index.ts`, `packages/db/src/schema.ts`)
- Documenso: https://github.com/documenso/documenso (`packages/trpc/server/document-router/`, `packages/api/v1/contract.ts`)
