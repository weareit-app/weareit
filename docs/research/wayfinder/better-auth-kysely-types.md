# Why the app's typecheck includes kysely, and what could change that

**Question:** `repo-conventions` task 4.2 (PR #193) verifies that `cd apps/app && npx tsc --noEmit --listFiles` lists no file from `@it/database`, `kysely`, or `pg`. After #193, 251 `kysely` files remain. Why does the app's type graph reach them, and what are the options for removing them without changing how sign-in works?

**Measured on:** branch `research/better-auth-kysely`, cut from `origin/claude/api-contract-package` (PR #193) on 2026-10-22. Installed versions: `better-auth` 1.7.8, `@better-auth/core` 1.7.8, `@better-auth/expo` 1.7.8, `kysely` 0.28.17, and TypeScript 5.9.3. Every source below was checked on 2026-10-22.

## Short answer

The app never imports `kysely`, and nothing in It's own packages does. Every Better Auth client entry point the app uses imports `@better-auth/core`'s root types. Those include the server options type, `BetterAuthOptions`, which names Kysely's `Dialect`, `Kysely`, and pool types for the `database` option. TypeScript follows every import in a declaration file, so all 251 `kysely` declaration files join the program. The cost is about 47 MB of compiler memory and no measurable time. The client's runtime JavaScript doesn't import `kysely`, so the app bundle isn't affected.

## The import chain

From `tsc --noEmit --explainFiles` in `apps/app`:

```text
apps/app/src/auth/auth-client.native.ts
  imports "@better-auth/expo/client"   -> @better-auth/expo/dist/client.d.ts
  imports "@better-auth/core"          -> @better-auth/core/dist/index.d.mts
  imports "./types/plugin.mjs"         -> @better-auth/core/dist/types/plugin.d.mts
  imports "kysely"                     -> kysely/dist/esm/index.d.ts  (+250 more kysely files)
```

`kysely/dist/esm/index.d.ts` is imported by exactly two files, both in `@better-auth/core`:

- `dist/types/plugin.d.mts`, line 8: `import { Migration } from "kysely";` (used by the server plugin type, `BetterAuthPlugin`).
- `dist/types/init-options.d.mts`, line 18: `import { Dialect, Kysely, MysqlPool, PostgresPool, SqliteDatabase } from "kysely";` (used by `BetterAuthOptions["database"]`).

The app reaches those files through all three Better Auth imports, not only the Expo one:

| Import in the app | Files in `@better-auth/core` | `kysely` files |
| --- | --- | --- |
| `createAuthClient` from `better-auth/react` | 94 | 251 |
| `createAuthClient` from `better-auth/client` (not used today; tested as an alternative) | 94 | 251 |
| `emailOTPClient` from `better-auth/client/plugins` | 103 | 251 |
| `expoClient` from `@better-auth/expo/client` | 95 | 251 |
| A file importing nothing (baseline) | 0 | 0 |

Each row is a one-file probe that extends `apps/app/tsconfig.json`. So removing any one import doesn't help; all three pull the same files in.

App files that reach `kysely`: `src/auth/auth-client.ts`, `src/auth/auth-client.native.ts`, and the three files that import them (`app/_layout.tsx`, `app/save-progress.tsx`, and `src/navigation/signed-in-provider.tsx`).

## Why client types reference server types

- `better-auth/dist/client/react/index.d.mts` imports `BetterAuthClientOptions` from `@better-auth/core`. That is the package root, whose `dist/index.d.mts` imports and re-exports both client and server types, including `BetterAuthPlugin` (`types/plugin.mjs`) and `BetterAuthOptions` (`types/init-options.mjs`).
- Even a narrower path wouldn't avoid it. `@better-auth/core/dist/types/plugin-client.d.mts`, which defines `BetterAuthClientOptions`, itself imports `BetterAuthOptions` from `./init-options.mjs`, because the client options carry a type-only field, `$InferAuth?: BetterAuthOptions | undefined` (line 74). The client uses the server options type to infer what the server supports, so the server's `database` option, and with it Kysely's types, comes along.
- Better Auth documents this kind of inference: the TypeScript page shows `inferAdditionalFields<typeof auth>()`, importing the server auth instance as a type, and says separate client and server projects must list fields by hand instead ([Better Auth, TypeScript](https://www.better-auth.com/docs/concepts/typescript)).
- `kysely` is a required peer dependency of `@better-auth/core` 1.7.8 (`"kysely": "^0.28.5 || ^0.29.0"`, not listed in `peerDependenciesMeta` as optional; installed `package.json`). pnpm installs it for the app even though the app doesn't declare it.

## Entry points, conditions, type parameters, and plugin import styles

None of these avoids the server types in 1.7.8:

- **Entry points.** `better-auth` exports `./client`, `./client/plugins`, and `./react` for client use; all three reach `@better-auth/core`'s root (table above). There is no client-only types entry. `better-auth/minimal`, which Better Auth's performance guide recommends for leaving out Kysely, is a server entry for `betterAuth()`, and the guide describes it as a bundle-size measure ([Better Auth, Optimizing for performance](https://www.better-auth.com/docs/guides/optimizing-for-performance)).
- **Export conditions.** The `better-auth` and `@better-auth/expo` export maps have only `dev-source`, `types`, and `default` conditions (installed `package.json` files). The `dev-source` condition points at `./src/*.ts` paths that aren't in the published package, so no condition selects lighter declarations. The app's `customConditions: ["react-native"]` (from `expo/tsconfig.base.json`) changes nothing here.
- **Plugin import styles.** There's no per-plugin client subpath for email OTP (`better-auth/plugins/email-otp` is the server plugin). `better-auth/client/plugins` is a barrel of every client plugin, which is why it adds nine more `@better-auth/core` files, but the `kysely` count is the same.
- **Type parameters.** `createAuthClient<Option extends BetterAuthClientOptions>` is constrained by the core type, so the import happens whatever argument is passed.

## Do tsconfig settings change what `--listFiles` includes?

Each setting was tested on the `better-auth/react` probe:

| Setting | `kysely` files | Notes |
| --- | --- | --- |
| Current (`skipLibCheck: true`, `moduleResolution: "bundler"`, `types: ["jest"]`) | 251 | |
| `skipLibCheck: false` | 251 | Adds three errors in Better Auth's declarations (`bun:sqlite`, `node:sqlite`, and a `better-fetch` constraint). |
| `types: []` | 251 | Removes the `@types/jest` globals (816 → 615 total files) but not imports. |
| `moduleResolution: "node16"` | 251 | Also errors, because the app's files become CommonJS. |
| `moduleResolution: "node10"` (with `customConditions` unset) | 251 | |
| `paths: { "kysely": [stub.d.ts] }` | 0 | The stub replaces the 251 files with one file (see option 3). |

- `skipLibCheck` controls checking, not inclusion. TypeScript's reference says it will "Skip type checking of declaration files" ([TSConfig, skipLibCheck](https://www.typescriptlang.org/tsconfig/skipLibCheck.html)). The files are still parsed, bound, and listed.
- `types` only limits which `@types` packages are added to the global scope, and "does not affect how `@types/*` are included in your application code" ([TSConfig, types](https://www.typescriptlang.org/tsconfig/#types)).
- TypeScript adds every file that an `import` in the program resolves to ([TSConfig, noResolve](https://www.typescriptlang.org/tsconfig/#noResolve)). `noResolve` would stop that for the whole program, which breaks every package import, so it isn't a real option.
- `paths` re-maps an import specifier to another file ([TSConfig, paths](https://www.typescriptlang.org/tsconfig/#paths)). Mapping `kysely` to a stub that exports `any` for the six names Better Auth uses removes the 251 files. The full app typecheck passed with no errors this way (tested with a temporary `tsconfig`, not committed).

## Upstream tracking

- **Issue #6183, "make kysely optional"** (open, opened 2025-11-22, labels `core` and `database`; [link](https://github.com/better-auth/better-auth/issues/6183)). Asks to move Kysely to an adapter or make it an optional peer. Comments as late as 2026-09-26, including one from a Kysely co-lead, confirm it is still required.
- **PR #9934, "feat(db)!: make Kysely an optional dependency"** (open draft, last updated 2026-06-08; [link](https://github.com/better-auth/better-auth/pull/9934)). Its description says core would vendor "the small structural database-handle types" so that its published types "no longer import from `kysely`". That would remove these 251 files. The PR is marked breaking (a bare Kysely `Dialect` would need `{ dialect, type }`, and `better-auth/minimal` would be removed) and has had no update for four and a half months.
- **Issue #11143, "Better Auth declarations fail with `skipLibCheck: false`"** (open, opened 2026-09-03; [link](https://github.com/better-auth/better-auth/issues/11143)), with **PR #11141** (merged 2026-09-03; [link](https://github.com/better-auth/better-auth/pull/11141)) adding a skipped end-to-end test. The issue's proposed design moves runtime-specific database types behind explicit adapters (`database: nodeSqlite(db)`), which is the same direction as #9934. The PR says a patch-level fix is hard because structural copies of upstream types weaken the public contract.

No issue or PR found specifically about client or Expo type graphs including server types (searches for "kysely client types", "client bundle server types", and "expo kysely" returned nothing on 2026-10-22).

## What the Expo plugin does that a hand-written client would need to replace

The app uses four client calls: `authClient.useSession` (`src/navigation/signed-in-provider.tsx`), `authClient.emailOtp.sendVerificationOtp` and `authClient.signIn.emailOtp` (`app/save-progress.tsx`), and `authClient.getCookie` (`src/auth/auth-client.native.ts`). The web build also relies on `fetchOptions: { credentials: "include" }`.

From `@better-auth/expo/dist/client.js` (734 lines) and the Expo integration docs ([Better Auth, Expo](https://www.better-auth.com/docs/integrations/expo)), `expoClient` on native:

- stores the session cookies in the storage passed in (the app passes `expo-secure-store`), split into chunks under a byte budget per item because some native stores reject large values, with recoverable writes and serialized async access;
- reads `Set-Cookie` from responses, respects `expires` and `max-age`, drops expired cookies, and only reacts to cookies with Better Auth's prefix, so third-party cookies don't trigger refetch loops;
- sends the stored cookie as a `cookie` header with `credentials: "omit"`, plus an `expo-origin` header built from the app scheme (which the server's `@better-auth/expo` plugin checks against trusted origins);
- caches session data in secure storage so a reloaded app can show the signed-in state before the network answers, and clears it on sign-out;
- refetches the session when the app returns to the foreground (`AppState`) or the network comes back (`expo-network`);
- turns relative `callbackURL` values into deep links, and runs social sign-in through `expo-web-browser` (It doesn't use social sign-in today).

A hand-written It-owned client would need the first five for email OTP alone, plus `useSession` state (Better Auth uses nanostores atoms and a `$sessionSignal` to refetch after sign-in). That is a few hundred lines of security-sensitive code that would also have to track the server's cookie names and endpoint shapes on every Better Auth upgrade.

## Practical cost of leaving it

Measured with `tsc --noEmit --extendedDiagnostics` in `apps/app`, three runs each, on 2026-10-22:

| | Files | Lines of definitions | Memory | Total time |
| --- | --- | --- | --- | --- |
| As is | 3,436 | 508,814 | 762–764 MB | 2.08–2.30 s |
| With `kysely` mapped to a stub | 3,186 | 484,770 | 715–716 MB | 2.08–2.11 s |

- **Time:** no measurable difference (check time is 0.99–1.02 s in both).
- **Memory:** about 47 MB less with the stub, roughly 6%.
- **Runtime and bundle:** none found. Bundling the app's three Better Auth imports with esbuild 0.28.2 (with `react-native` conditions, `react`, `react-native`, and `expo-*` external) took in 88 modules, none from `kysely`. In the installed `better-auth` and `@better-auth/core` JavaScript, only `dist/db/get-migration.mjs` and `dist/test-utils/test-instance.mjs` import `kysely`, and neither is reachable from the client entries. Metro wasn't run, so this is an approximation of the Expo bundle.
- **Install:** `kysely` stays in `node_modules` either way, because `@better-auth/core` requires it as a peer and `apps/api-server` and `packages/database` depend on it directly.

## Options

| Option | What changes | Cost | Risk |
| --- | --- | --- | --- |
| 1. Narrow the check | Task 4.2's Verify step becomes "no file reached through It's own packages (`@it/*`) is from `@it/database`, `kysely`, or `pg`", checked with `--explainFiles` instead of a plain `--listFiles` grep. | A short script or `grep` over `--explainFiles` output; a wording change to the spec scenario. | Low. The check still catches the boundary leak #193 fixed. The 251 files stay, at about 47 MB and no measurable time. |
| 2. Wait for upstream | Nothing now. If PR #9934 or similar ships, the check passes as written after an upgrade. | None now; a Better Auth upgrade later, possibly a breaking one. | The PR is a draft with no update since 2026-06-08, so there's no date. The check stays failing until then unless option 1 is also taken. |
| 3. Stub `kysely` in the app's tsconfig | `apps/app/tsconfig.json` maps `kysely` through `paths` to a one-file `.d.ts` that exports `any` for `Migration`, `Dialect`, `Kysely`, `MysqlPool`, `PostgresPool`, and `SqliteDatabase`. | One small file and one tsconfig line. Full app typecheck passed. | Sign-in code is unchanged. Any app code that imported `kysely` would silently get `any`. If Better Auth starts using other Kysely names, the stub needs updating, and with `skipLibCheck: true` a missing name in Better Auth's declarations wouldn't be reported. The check passes only because of the stub, which reviewers may read as hiding the problem. |
| 4. It-owned type boundary around the Better Auth client | Move the auth client into its own TypeScript project or workspace package whose exported types are It-owned interfaces for the four calls the app uses. The app imports its `.d.ts` output ([TypeScript, project references](https://www.typescriptlang.org/docs/handbook/project-references.html)), so the app's program no longer reaches Better Auth's types. | A `composite` project or package, a build or `tsc -b` step before the app's typecheck, and hand-kept interfaces for `useSession`, `emailOtp.sendVerificationOtp`, `signIn.emailOtp`, and `getCookie`. | Runtime behavior is unchanged because the same Better Auth code runs. The It-owned types can drift from Better Auth's on upgrades. The auth project's own typecheck still includes the 251 files, so the total work doesn't shrink. |
| 5. Hand-written It-owned auth client | Replace `better-auth/react`, `emailOTPClient`, and `expoClient` with It code that calls the two email OTP endpoints and `get-session`, and stores the cookie in `expo-secure-store`. | A few hundred lines: chunked secure storage, `Set-Cookie` parsing and expiry, the `expo-origin` header, session caching, refetch on focus and reconnect, and session state for React. | Highest. Sign-in behavior could change in subtle ways (cookie handling, trusted-origin checks, session refresh), and It takes on security-sensitive code that must track the server's cookie names and endpoints on every Better Auth upgrade. |
