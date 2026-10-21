# Linter options for an Expo and TypeScript pnpm monorepo

- **Ticket**: weareit-app/weareit#143 (map: #140)
- **Checked**: 2026-10-21. Every version and date below comes from the npm registry (`npm view <package> time`, `dist-tags`, `peerDependencies`) or the page named, read that day.
- **Question**: What are the linter options for this repo as of late 2026, and how do they compare on type-aware rules, React hooks and React Compiler rules, import and boundary rules, pre-commit speed, formatting, and maturity?
- **Scope**: facts and trade-offs only. The choice is made in the grilling ticket (#148).

## Summary

- **There are three real engines: ESLint, Biome, and Oxlint.** `expo lint` isn't a fourth. It installs ESLint with `eslint-config-expo` and runs it (Expo docs).
- **The Expo path holds ESLint back at v9, which is past end of life.** `eslint-config-expo` 58.0.4 pulls in `eslint-plugin-react` 7.37.5 and `eslint-plugin-import` 2.32.0, and both cap their ESLint peer at v9. ESLint 9 reached end of life on 2026-08-06. An Expo maintainer told a user hitting an ESLint 10 crash to "stay on eslint 9" (expo/expo#46717).
- **Type-aware rules depend on the TypeScript version.** typescript-eslint supports TypeScript `>=4.8.4 <6.1.0`, which fits this repo's 5.9.3. Oxlint's type-aware mode (tsgolint, stable since 2026-07-22) is built on TypeScript 7 and needs a TypeScript 7-compatible tsconfig. `dependency-policy.md` holds off TypeScript 7 for now. Biome infers types itself, without `tsc`, but covers less: its own launch post estimates `noFloatingPromises` catches about 75% of what typescript-eslint catches.
- **React Compiler rules ship in `eslint-plugin-react-hooks` 7.** That plugin's `recommended` preset now carries the compiler checks (`purity`, `refs`, `immutability`, and others), and `eslint-config-expo` uses it. Oxlint has native ports of several of these rules. Biome has the two classic hook rules but no compiler rules. The app doesn't turn on React Compiler yet (`apps/app/app.json` has no `experiments.reactCompiler`).
- **For boundaries, all three can block imports per folder.** Only ESLint has a mature dedicated plugin, `eslint-plugin-boundaries`. pnpm's isolated `node_modules` already stops a package from importing anything its `package.json` doesn't list. `dependency-cruiser` is a linter-neutral alternative.
- **Speed isn't the deciding factor here.** The repo has 254 tracked code files. Vendor benchmarks put Oxlint and Biome 10 to 50 times faster than ESLint, but at this size a staged-file ESLint run without type info is likely to stay small next to the existing `typecheck` job. That's an estimate; nothing was measured for this note.
- **On formatting, staying on Prettier is the zero-change option.** Biome's formatter is stable, with a short list of deliberate differences from Prettier. Oxfmt has been in beta since 2026-02-24 (0.74.0, not yet 1.0).

## What the repo has today

- Prettier 3.9.10 formats code only (`.prettierignore` allows `*.ts`, `*.tsx`, `*.mts`, `*.cts`, `*.js`, `*.jsx`, `*.mjs`, and `*.cjs`).
- `pnpm run lint` is `prettier --check .` plus the essay check. There is no linter.
- `lefthook.yml` runs three jobs in parallel before each commit: Prettier on staged files (`stage_fixed: true`), the full Turborepo `typecheck`, and the Vitest unit tests.
- Expo SDK 58.0.16, React 19.3.0, React Native 0.88.0, and TypeScript 5.9.3, on pnpm 11.25.0 and Node 24.
- `apps/app/tsconfig.json` sets `baseUrl: "."` with a `paths` alias (`@/*`). Every other package uses `moduleResolution: "Bundler"`.
- `dependency-policy.md` pins each tool to the newest release at least two weeks old. On 2026-10-21 that means published on or before 2026-10-07.

## The options

### ESLint with typescript-eslint, and `expo lint`

- **Versions**: ESLint 10.13.0 is latest (2026-10-16), and 9.39.5 is the last v9 (2026-07-10). ESLint's version page says v9 "reached end-of-life on 2026-08-06 and is no longer maintained" (eslint.org/version-support). typescript-eslint 8.72.0 (2026-10-19) supports ESLint `^8.57.0 || ^9.0.0 || ^10.0.0` and TypeScript `>=4.8.4 <6.1.0` (typescript-eslint.io/users/dependency-versions).
- **`expo lint`**: on first run it writes an `eslint.config.js` that extends `eslint-config-expo/flat`, in flat config since SDK 53 (docs.expo.dev/guides/using-eslint). `eslint-config-expo` 58.0.4 (2026-09-29) depends on `eslint-plugin-react` ^7.37.3, `eslint-plugin-react-hooks` ^7.0.0, `eslint-plugin-import` ^2.30.0, `eslint-plugin-expo`, the typescript-eslint parser and plugin ^8.59.0, and `eslint-import-resolver-typescript` ^3.6.3 (published `package.json`).
- **ESLint 10 blocker**: `eslint-plugin-react` 7.37.5 (its latest, 2025-04-03) declares ESLint up to `^9.7`, and `eslint-plugin-import` 2.32.0 (2025-06-20) up to `^9`. With ESLint 10, `expo lint` crashed loading `react/display-name` (expo/expo#46717, closed 2026-06-10 with the advice to stay on ESLint 9). The upstream issue, jsx-eslint/eslint-plugin-react#3977, is still open. The repo sets `strictPeerDependencies: false`, so pnpm would install ESLint 10 anyway, but the crash is at run time.
- **Type-aware rules**: the Expo config doesn't turn them on (its published flat config has no `projectService` or `project` setting). Adding typescript-eslint's `recommendedTypeChecked` or `strictTypeChecked` gives the full set, including `no-floating-promises` and `no-misused-promises`. It works with TypeScript 5.9.3 today.
- **React rules**: `eslint-plugin-react-hooks` 7.1.1 is latest (2026-04-17). Its `recommended` preset lists `rules-of-hooks`, `exhaustive-deps`, and the React Compiler checks: `purity`, `refs`, `immutability`, `set-state-in-effect`, `set-state-in-render`, `static-components`, `preserve-manual-memoization`, `incompatible-library`, and others (react.dev/reference/eslint-plugin-react-hooks). Expo's React Compiler guide says "React Compiler lint rules are included by default with `eslint-config-expo` in SDK 55 and later", and that the separate `eslint-plugin-react-compiler` can be removed (docs.expo.dev/guides/react-compiler).
- **Imports and boundaries**: `eslint-plugin-import` (bundled by Expo) or `eslint-plugin-import-x` 4.17.1 (2026-06-28; supports ESLint 10) give `no-cycle` and `no-restricted-paths`. `eslint-plugin-boundaries` 7.2.0 (2026-08-09) defines element types (for example `domain`, `content`, and `app`) and which may import which. Core `no-restricted-imports` with `files` overrides can block `expo`, `react-native`, and provider packages in the domain and content folders.
- **Formatting**: Expo's guide pairs it with Prettier through `eslint-config-prettier` (10.1.8) and `eslint-plugin-prettier`. The current split (Prettier as its own job) also works: `eslint-config-prettier` only turns off rules that would clash.
- **Speed**: ESLint runs in Node, one process per invocation. Type-aware rules build a TypeScript program, which costs the most. Oxc's benchmark puts ESLint with typescript-eslint at 12.3 s on Vue core and 83.2 s on VS Code (oxc.rs/blog/2026-07-22-type-aware-linting-stable, an Apple M4 Pro). This repo is far smaller.
- **Maturity**: the most mature by far. The weak point is the Expo plugin stack lagging a major version behind ESLint.

### Biome

- **Versions**: `@biomejs/biome` 2.5.15 is latest (2026-09-30). v2.0.0 came out on 2025-06-17 and 2.5.0 on 2026-06-12. It ships as one native binary per platform (optional dependencies; no install script).
- **Scope**: one tool for linting and formatting. Its linter page lists 568 rules (biomejs.dev/linter).
- **Type-aware rules**: Biome v2 has "type-aware linting rules that doesn't rely on the TypeScript compiler" (biomejs.dev/blog/biome-v2). `noFloatingPromises` and `noMisusedPromises` are in the `types` domain and are still **nursery** rules: opt-in, and outside semantic versioning (biomejs.dev/linter/domains and the rule page). The v2 post estimates `noFloatingPromises` catches about 75% of the cases typescript-eslint does. It doesn't depend on the TypeScript version, so it works with 5.9.3.
- **React rules**: the `react` domain has `useHookAtTopLevel` and `useExhaustiveDependencies`, both recommended and not nursery. There are no React Compiler rules.
- **Imports and boundaries**: `noRestrictedImports` takes gitignore-style `patterns` since v2.2.0, plus `importNames`. It matches the imported path, not the importing file, so per-package bans go in `overrides` or a nested `biome.json` (biomejs.dev/linter/rules/no-restricted-imports). The `project` domain adds `noImportCycles`, `noPrivateImports`, and `noUnresolvedImports`. That domain turns on a project scanner. Biome's own figures put a 2,000-file lint at about 0.8 s without the scanner and 2 s with it (biomejs.dev/linter).
- **Monorepo**: a root `biome.json`, plus nested configs that set `"root": false` or `"extends": "//"` (biome-v2 post).
- **Plugins**: GritQL plugins can match code and report problems only. They can't run ESLint plugins, so `eslint-plugin-boundaries` and `eslint-plugin-react-hooks` aren't available.
- **Formatting**: stable. It aims to match Prettier and lists its deliberate differences, such as unquoting all valid ES2015 property names and stricter handling of invalid syntax (biomejs.dev/formatter/differences-with-prettier). Moving would reformat a few lines and swap `.prettierignore` for Biome's `files.includes`.
- **Maturity**: stable since v2 (2025-06). The rules this repo would lean on most for promises are nursery.

### Oxlint (and Oxfmt)

- **Versions**: `oxlint` 1.89.0 is latest (2026-10-19). 1.0.0 came out on 2025-06-10, and minors arrive about weekly. The type-aware engine `oxlint-tsgolint` is at 7.0.2004 (2026-10-10). Its version follows TypeScript: 7.0.2 is the TypeScript release, and the last digits count tsgolint patches. `oxlint` 1.87 to 1.89 declare `oxlint-tsgolint >=7.0.2003` as a peer.
- **Scope**: 871 rules on its rules page, from ESLint core, typescript, react, import, jsx-a11y, unicorn, jest, vitest, and others (oxc.rs/docs/guide/usage/linter/rules).
- **Type-aware rules**: stable since 2026-07-22, covering 59 of typescript-eslint's 61 type-aware rules (oxc.rs/blog/2026-07-22-type-aware-linting-stable). Run with `--type-aware`. `--type-check` also reports TypeScript errors and, per the docs, can replace a separate `tsc --noEmit` step. **Requirements**: "TypeScript 7.0 or later", and legacy tsconfig options such as `baseUrl` are not supported (oxc.rs/docs/guide/usage/linter/type-aware). That clashes with this repo in two places: TypeScript is held at 5.9.3, and `apps/app/tsconfig.json` uses `baseUrl`. TypeScript 7.0.2 is npm's `latest` (2026-07-08), but Expo and workspace compatibility hasn't been checked. Without `--type-aware`, Oxlint lints TypeScript 5.9 code fine; only the type-aware rules are lost.
- **React rules**: native `react/rules-of-hooks` and `react/exhaustive-deps`, plus native rules named after the React Compiler checks (`purity`, `refs`, `immutability`, `preserve-manual-memoization`, `incompatible-library`, `set-state-in-effect`, and others; several marked as added in v1.79.0). The rules page doesn't say they match the compiler's own diagnostics, so treat parity as unverified.
- **Imports and boundaries**: `import/no-cycle` and core `no-restricted-imports` are native, and `overrides` can set them per folder. There's no native `eslint-plugin-boundaries`. JS plugins (ESLint-compatible plugins run inside Oxlint) are "currently in alpha", can't use type information, and list `eslint-plugin-react-hooks` among tested plugins but not `eslint-plugin-boundaries` (oxc.rs/docs/guide/usage/linter/js-plugins).
- **Running next to ESLint**: `eslint-plugin-oxlint` 1.89.0 turns off ESLint rules that Oxlint already covers, so the two can run side by side (a common migration path).
- **Speed**: tsgolint's stable post reports 12 to 18 times faster than ESLint with typescript-eslint (for example Vue core 12.3 s to 0.95 s). The type-aware docs warn of high memory use on very large codebases.
- **Oxfmt**: beta since 2026-02-24 (oxc.rs/blog/2026-02-24-oxfmt-beta). It uses Prettier's output as its baseline, with listed divergences, and has built-in Tailwind class sorting. Latest is 0.74.0 (2026-10-19), still before 1.0.
- **Maturity**: the linter core has been 1.x since 2025-06 and moves fast. Type-aware mode is stable but tied to TypeScript 7. JS plugins and Oxfmt are pre-stable.

### Boundary checks that don't depend on the linter

- **pnpm isolation**: with pnpm's default isolated `node_modules`, a workspace package can import only what its own `package.json` lists. Keeping `expo` and `react-native` out of `@it/domain` and `@it/content` dependencies already stops most of those imports at resolution, though not type-only or relative-path reaches into another package.
- **dependency-cruiser** 18.7.0 (2026-10-19) checks the import graph against rules ("`packages/domain` may not depend on `expo`", no cycles) with any linter or none. It's an extra tool and an extra CI step.

## Side by side

| | ESLint and typescript-eslint (Expo config) | Biome 2.5 | Oxlint 1.x |
| --- | --- | --- | --- |
| Type-aware rules | Full set; works with TypeScript 5.9 | Own inference, no `tsc`; promise rules nursery; about 75% of typescript-eslint on floating promises (vendor estimate) | 59 of 61; stable; needs TypeScript 7 and no `baseUrl` |
| Hooks and React Compiler rules | `eslint-plugin-react-hooks` 7, included by Expo | Hooks only | Hooks native; compiler-named rules native, parity unverified |
| Imports and boundaries | `no-restricted-imports`, `import/no-cycle`, `eslint-plugin-boundaries` | `noRestrictedImports` plus overrides, `noImportCycles`, `noPrivateImports` | `no-restricted-imports` plus overrides, `import/no-cycle`; boundaries only through alpha JS plugins |
| Expo support | Official (`expo lint`) | None from Expo | None from Expo |
| Formatter | Prettier (separate) | Built in, stable | Oxfmt, beta |
| Version caveat | Expo stack keeps ESLint on v9, past end of life | Promise rules nursery | Weekly minors; type-aware tied to TypeScript 7 |
| Speed (vendor figures) | Baseline | Fast; scanner adds time | 12 to 18 times faster than ESLint, type-aware |

## Pre-commit speed in this repo

- Lefthook already passes `{staged_files}` to Prettier. Any of the three linters can take the same list, and Biome and Oxlint can also fix and restage with `stage_fixed`.
- Type-aware linting needs the whole program even when only staged files are reported. typescript-eslint and tsgolint both build it; Biome's scanner scans the project. The `typecheck` job already does whole-program work, so a type-aware lint adds a second pass unless it replaces `tsc`. Oxlint's `--type-check` could do that once the repo is TypeScript 7-ready.
- No timings were measured for this note. A quick trial on the 254 files (each tool once, cold and warm) would settle the number before a choice is locked.

## Formatting: stay on Prettier or move

- **Stay on Prettier 3.9.10**: no churn, and it works with any of the three linters. Running two tools means two configs, but `.prettierignore` already defines the formatted set.
- **Biome formatter**: stable, one tool for lint and format. The listed differences from Prettier mean a one-time diff on some lines.
- **Oxfmt**: beta (0.74.0). It follows Prettier's output and has Tailwind class sorting, which this repo's NativeWind classes could use. It isn't 1.0 yet.
- Moving the formatter is separate from choosing the linter. Oxlint and ESLint both work with Prettier, and Biome's linter can run with its formatter turned off.

## What to pin (two-week rule, releases on or before 2026-10-07)

| Option | Packages and versions |
| --- | --- |
| ESLint via Expo | `eslint` 9.39.5 (ESLint 10.12.0 if `eslint-config-expo` is dropped), `eslint-config-expo` 58.0.4, `typescript-eslint` 8.71.1 (2026-10-05) |
| Biome | `@biomejs/biome` 2.5.15 (2026-09-30) |
| Oxlint | `oxlint` 1.87.0 (2026-10-05), `oxlint-tsgolint` 7.0.2003 (2026-09-24, only with TypeScript 7), `oxfmt` 0.72.0 (2026-10-05) if used |
| Boundary add-ons | `eslint-plugin-boundaries` 7.2.0, `dependency-cruiser` 18.5.0 (2026-09-30; 18.6.0 from 2026-10-11 is too new) |

## Open questions for the grilling ticket

- Is staying on ESLint 9 (end of life) acceptable until `eslint-plugin-react` supports v10, or should the Expo config be replaced with hand-picked plugins on ESLint 10?
- How much do type-aware rules matter, and is a move to TypeScript 7 on the roadmap? That decides whether Oxlint's type-aware mode is on the table.
- Should React Compiler be turned on? Its rules matter more once it is.
- Should boundaries live in the linter or in `dependency-cruiser`?
- Prettier, Biome's formatter, or Oxfmt?

## Sources (all checked 2026-10-21)

- npm registry metadata for `eslint`, `typescript-eslint`, `eslint-config-expo` (including its published flat config files), `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-import`, `eslint-plugin-import-x`, `eslint-plugin-boundaries`, `eslint-config-prettier`, `eslint-plugin-oxlint`, `@biomejs/biome`, `oxlint`, `oxlint-tsgolint`, `oxfmt`, `dependency-cruiser`, and `typescript`
- https://eslint.org/version-support/
- https://typescript-eslint.io/users/dependency-versions/
- https://docs.expo.dev/guides/using-eslint/
- https://docs.expo.dev/guides/react-compiler/
- https://github.com/expo/expo/issues/46717
- https://github.com/jsx-eslint/eslint-plugin-react/issues/3977
- https://react.dev/reference/eslint-plugin-react-hooks
- https://biomejs.dev/linter/
- https://biomejs.dev/linter/domains/
- https://biomejs.dev/linter/rules/no-floating-promises/
- https://biomejs.dev/linter/rules/no-restricted-imports/
- https://biomejs.dev/blog/biome-v2/
- https://biomejs.dev/formatter/differences-with-prettier/
- https://oxc.rs/docs/guide/usage/linter/rules.html
- https://oxc.rs/docs/guide/usage/linter/type-aware.html
- https://oxc.rs/docs/guide/usage/linter/js-plugins.html
- https://oxc.rs/blog/2026-07-22-type-aware-linting-stable
- https://oxc.rs/blog/2026-02-24-oxfmt-beta
- https://oxc.rs/docs/guide/usage/formatter.html
