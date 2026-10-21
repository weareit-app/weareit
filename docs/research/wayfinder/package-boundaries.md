# Ways to enforce package boundaries

- **Ticket:** weareit-app/weareit#144, part of the map #140 (repo conventions that enforce themselves)
- **Checked:** 2026-10-21. Tool versions come from `npm view <package> version` on that date.
- **Scope:** facts and trade-offs only. A grilling ticket makes the decision.

## The question

What tools can enforce package boundaries in this pnpm and Turborepo monorepo, and what does each catch? The candidates are Turborepo boundaries, dependency-cruiser, lint import or boundary rules, `exports`-map discipline, knip (unused exports and dependencies), and syncpack (consistent versions). For each: what it catches, what it misses, setup cost, and CI cost.

## What the repo looks like today

These facts come from the repo at `origin/master` (13f9ab3).

- **Workspace:** `pnpm-workspace.yaml` lists `apps/*`, `packages/*`, and `tools/*`. That gives eight packages: `@it/app`, `@it/api-server`, `@it/api`, `@it/content`, `@it/database`, `@it/domain`, `@it/watercolor`, and `@it/watercolor-sim`. There is no `nodeLinker` setting, so pnpm uses its default isolated layout.
- **Turborepo:** `turbo` 2.11.8 is pinned at the root. There is one root `turbo.json` and no per-package `turbo.json` files.
- **Exports:** every library package (`api`, `content`, `database`, `domain`, `watercolor`) has an `exports` map of named subpaths that point at TypeScript source (for example `"./client": "./src/client.ts"`). None has a `"."` root export, so `import "@it/content"` alone doesn't resolve. Apps have no `exports`.
- **Module resolution:** package tsconfigs use `"moduleResolution": "Bundler"`. The app extends `expo/tsconfig.base.json`, which also uses bundler resolution with a `react-native` custom condition (expo/expo `packages/expo/tsconfig.base.json` on `main`, checked 2026-10-21).
- **Declared dependency graph** (workspace packages only):

  | Package | Depends on |
  | --- | --- |
  | `@it/domain` | none (only `zod`) |
  | `@it/content` | none (only `zod`) |
  | `@it/watercolor` | none (only `zod`) |
  | `@it/database` | `@it/content`, plus `kysely` and `pg` |
  | `@it/api` | `@it/content`, `@it/database`, `@it/domain`, plus oRPC |
  | `@it/api-server` | `@it/api`, `@it/database` |
  | `@it/app` | `@it/api`, `@it/content`, `@it/domain`, `@it/watercolor` |
  | `@it/watercolor-sim` | `@it/watercolor` |

- **Linting:** none. `pnpm run lint` is `prettier --check .` plus the essay check. CI (`.github/workflows/ci.yml`) runs typecheck, lint, unit, Expo, tools, end-to-end, and Storybook jobs, plus three repo checks in `tools/` (action pins, typecheck coverage, and story coverage).
- **Versions:** a scan of every `package.json` found no dependency listed at two different versions. Range styles are mixed: some exact (`zod` 4.6.7), some caret (`kysely` ^0.28.17), and some tilde (`expo` ~58.0.16). No pnpm catalog is in use.

### Boundary problems a tool would flag today

1. **Reaching into another package's folder.** `apps/app/e2e/onboarding.spec.ts` and `apps/app/e2e/watercolor.spec.ts` import `../../../packages/database/src/tier1-import`. `@it/app` doesn't declare `@it/database`. A relative path skips both the `exports` map and pnpm's isolation, so typecheck passes.
2. **Server code behind the client entry point.** `packages/api/src/client.ts` takes its types from `./router` in the same package, and `router.ts` pulls in `@it/database` (map #140 survey). This is a rule about files inside one package, so package-level tools can't see it.
3. **An unwritten rule.** `AGENTS.md` says domain and content packages stay free of Expo, React Native, UI, and provider imports. Today that holds only because those packages declare nothing but `zod`. Nothing stops someone adding `expo` to `@it/content`'s dependencies and importing it.

## What each tool catches

### `exports` maps, TypeScript, and pnpm isolation (already in place)

- **Catches:** an import of an unlisted subpath through the package name, such as `@it/database/src/tier1-import`. TypeScript with `node16`, `nodenext`, or `bundler` resolution follows `exports`, and "the presence of `"exports"` prevents any subpaths not explicitly listed or matched by a pattern in `"exports"` from being resolved" (TypeScript modules reference, typescriptlang.org/docs/handbook/modules/reference.html, checked 2026-10-21). Node.js throws `ERR_PACKAGE_PATH_NOT_EXPORTED` in the same case (nodejs.org/api/packages.html, checked 2026-10-21).
- **Also catches, in practice:** most imports of an undeclared workspace package. pnpm's default `nodeLinker` is `isolated`. Hoisting goes to `node_modules/.pnpm/node_modules` (`hoistPattern` `['*']`), while `publicHoistPattern` is `[]`, so nothing extra lands where app code can find it (pnpm.io/settings/node-modules, checked 2026-10-21). This is an inference from those defaults; a quick test in the repo would confirm it. Expo says isolated installs are supported from SDK 54 and that they enforce "that packages may only access their explicitly declared dependencies" (docs.expo.dev/guides/monorepos, checked 2026-10-21).
- **Misses:** relative-path imports into another package (problem 1 above); any rule about which package may depend on which (problem 3); and rules between files in one package (problem 2). Metro is lenient: for an unexported subpath it will "log a warning and fall back to file-based resolution" rather than fail (metrobundler.dev/docs/package-exports, checked 2026-10-21; on by default since Metro 0.82 or React Native 0.79). So on the app side only `tsc` enforces `exports`.
- **Setup cost:** none; it's in place. Keeping it means a convention: every public entry point is listed in `exports`, and nothing outside it is imported.
- **CI cost:** none beyond the existing typecheck.

### Turborepo boundaries (`turbo boundaries`)

- **Status:** marked **Experimental** in the docs, with feedback asked for on the Boundaries RFC (turborepo.dev/docs/reference/boundaries, checked 2026-10-21). Introduced in Turborepo 2.4 as "an early iteration" (turborepo.dev/blog/turbo-2-4, checked 2026-10-21). The latest release is 2.11.10 (npm, 2026-10-21); the 2.11.9 release notes include boundaries performance work, and none mark it stable (github.com/vercel/turborepo/releases, checked 2026-10-21).
- **Catches:** "Importing a file outside of the package's directory" and "Importing a package that is not specified in dependencies" (blog and reference). That covers problem 1 directly.
- **Tags:** packages get tags in their own `turbo.json` (`"tags": ["internal"]`). Rules in the root `turbo.json` under `boundaries.tags` allow or deny `dependencies` and `dependents` by tag, and package names work in place of tags. Tag rules are transitive: if A imports B and B imports a denied package, A gets a violation (reference page). This could encode the dependency table above, for example "packages tagged `pure` may depend only on `pure`".
- **Misses:** rules between files inside a package (problem 2). The docs don't say whether third-party packages such as `expo` can appear in allow or deny lists, so problem 3 may still need another tool. The docs also don't document ignore comments, exit codes, or CI behavior.
- **Setup cost:** low. `turbo` is already pinned. Tags need a small `turbo.json` in each tagged package (there are none today) and a `boundaries` block in the root one. Fixing problem 1 means moving the e2e helper behind a declared dependency or an export.
- **CI cost:** one more command in the existing job. No new dependency. Being experimental, its config and output may change between Turborepo releases.

### dependency-cruiser

- **Version:** 18.7.0 (npm, 2026-10-21).
- **Catches:** whatever its rules say, at file level. Rules come in three kinds: `forbidden`, `allowed` (an allowlist; anything else is reported), and `required`. Conditions include `path` and `pathNot` regular expressions with capture groups reused in `to` (so "a file in `packages/X/` may import only from `packages/X/`" is one rule), `circular`, `orphan`, `reachable`, `moreUnstable`, and `dependencyTypes` such as `npm-no-pkg` (an npm package missing from `package.json`) (github.com/sverweij/dependency-cruiser `doc/rules-reference.md`, checked 2026-10-21). That reaches all three problems above: relative imports across packages, `client.ts` importing `router.ts`, and `expo` imported from `@it/content`.
- **Monorepo and TypeScript:** by default it reads "the closest `package.json`" to each file, which fits independent workspace packages. It can read a tsconfig (following `extends`), resolve `exports` through `enhancedResolveOptions.exportsFields` and `conditionNames`, and, with `tsPreCompilationDeps`, count type-only imports. The `"specify"` setting lets a rule treat type-only and runtime imports differently (`doc/options-reference.md` and `doc/faq.md`, checked 2026-10-21). That matters for problem 2, where a type-only import of the router may be acceptable and a runtime import may not.
- **Misses:** it's not an editor plugin, so feedback comes from a command, not as you type. It doesn't check versions or unused exports.
- **Setup cost:** medium. One `.dependency-cruiser.cjs` with regex rules. Regexes are flexible but easy to get subtly wrong, and the config has many options. Its `--init` writes a starter config.
- **CI cost:** one more dev dependency and one command. It parses every file it's pointed at; a `--cache` option (since 11.14.0) skips unchanged work between runs.

### Lint rules

These run per file, in the editor and in CI. Which ones apply depends on the linter ticket in map #140.

- **ESLint** (10.13.0, npm, 2026-10-21):
  - Core `no-restricted-imports` bans named modules or patterns. Scoped per folder through flat-config `files` blocks, it can say "no `expo` or `react-native` in `packages/content/**`" (problem 3).
  - `eslint-plugin-import-x` (4.17.1) `no-restricted-paths` takes `zones` of `target`, `from`, and `except` paths, for example `{ "target": "./client", "from": "./server" }` (github.com/un-ts/eslint-plugin-import-x `docs/rules/no-restricted-paths.md`, checked 2026-10-21). That fits problem 2 and, with zones per package, problem 1. The same plugin's `no-extraneous-dependencies` flags undeclared packages. Both need an import resolver configured for TypeScript.
  - `eslint-plugin-boundaries` (7.2.0) defines "elements" by path pattern and restricts which element types may depend on which through its `boundaries/dependencies` rule. The README says it "works with monorepos" (github.com/javierbrea/eslint-plugin-boundaries, checked 2026-10-21). This research didn't confirm the full v7 rule list or its monorepo setup; the rules reference is on the project's docs site.
- **Biome** (2.5.15):
  - `noRestrictedImports` bans paths or gitignore-style patterns, and can ban or allow named imports (biomejs.dev/linter/rules/no-restricted-imports, checked 2026-10-21).
  - `noUndeclaredDependencies` flags packages missing from the closest `package.json`. It is not in the recommended set, and it turns on Biome's project scanner (biomejs.dev/linter/rules/no-undeclared-dependencies, checked 2026-10-21).
  - The rule pages don't say how to scope a rule to one folder; Biome's configuration has `overrides` for that, which this research didn't test.
- **oxlint** (1.89.0): has `no-restricted-imports`, `import/no-cycle`, and `import/no-relative-parent-imports`. Its rules list has no `no-extraneous-dependencies`, `no-restricted-paths`, or boundaries rule (oxc.rs/docs/guide/usage/linter/rules.html, checked 2026-10-21). It lists JS plugins, which this research didn't evaluate.
- **Trade-off across lint rules:** fast feedback in the editor and one tool for style and boundaries. Rules are written file by file, though, so a whole-graph rule ("domain packages may depend only on other domain packages") is clumsier than in Turborepo tags or dependency-cruiser. None of these checks versions.

### knip (unused code and dependencies)

- **Version:** 6.42.1 (npm, 2026-10-21).
- **Catches:** unused files, unused dependencies and devDependencies, **unlisted dependencies** ("used but missing from package.json"), unresolved imports, unused exports and exported types, duplicate exports, unused catalog entries, and, when turned on, circular dependencies (knip.dev/reference/issue-types, checked 2026-10-21). It reads workspaces from `pnpm-workspace.yaml` and takes per-workspace `entry`, `project`, and `includeEntryExports` settings (knip.dev/features/monorepos-and-workspaces, checked 2026-10-21).
- **Relevance here:** unused exports and dependencies keep each package's surface small, which makes `exports` maps honest. Unlisted dependencies overlap with Turborepo boundaries and Biome's `noUndeclaredDependencies`.
- **Misses:** direction. Knip doesn't know which package may depend on which, and it doesn't check versions.
- **Setup cost:** medium at first. Expo Router, Storybook, Playwright, Jest, Vitest, and the generated essay files all create entry points that knip must be told about, or it reports false positives. Expect a first pass of tuning `knip.json`.
- **CI cost:** one more dev dependency and one command over the whole repo.

### syncpack, sherif, and pnpm catalogs (consistent versions)

- **syncpack** (15.3.3): `lint`, `fix`, `list`, `update`, and `format`. Version groups enforce one version per dependency or set separate policies for parts of the repo. Semver groups set range styles (exact, `^`, or `~`) per dependency type. It can pin local packages to `workspace:*`, ban dependencies, and migrate to pnpm catalogs (syncpack.dev, checked 2026-10-21).
- **sherif** (1.13.0): zero-config, written in Rust, and needs no `node_modules`. Its rules include `multiple-dependency-versions`, `unsync-similar-dependencies` (react and react-dom kept together), `root-package-dependencies`, `types-in-dependencies`, and `unordered-dependencies`. `--fix` handles most of them and is disabled when `$CI` is set (github.com/QuiiBz/sherif, checked 2026-10-21).
- **pnpm catalogs:** shared version ranges defined once in `pnpm-workspace.yaml` and referenced as `"zod": "catalog:"`. `catalogMode: strict` (since pnpm 10.12.1) makes adding a version outside the catalog an error (pnpm.io/catalogs, checked 2026-10-21). This is built in, with no extra tool.
- **Relevance here:** none of these enforce boundaries; they keep versions aligned. Today there's no version mismatch to fix, so the gain is preventing drift, plus a range-style policy if one is wanted. Expo pins many versions itself (`npx expo install` picks them), so a version-group policy would need to leave Expo-managed packages alone.
- **Setup and CI cost:** sherif is the lowest (no config, one command). syncpack needs a config to say anything beyond "same version everywhere". Catalogs mean moving shared versions into `pnpm-workspace.yaml` once.

## Side by side

| Option | Cross-package file reach (problem 1) | Undeclared package | Allowed package graph | File rules inside a package (problem 2) | Banned third-party imports (problem 3) | Unused exports and deps | Versions | Editor feedback | New dependency |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `exports` + TS + pnpm | No | Mostly (by inference) | No | No | No | No | No | Yes (tsc) | No |
| Turborepo boundaries | Yes | Yes | Yes (tags, transitive) | No | Not documented | No | No | No | No (experimental) |
| dependency-cruiser | Yes | Yes (`npm-no-pkg`) | Yes (regex) | Yes | Yes | Orphans only | No | No | Yes |
| ESLint + import-x or boundaries | Yes | Yes | Clumsy | Yes | Yes | No | No | Yes | Yes (plus resolver) |
| Biome rules | Partly (patterns) | Yes | Clumsy | Partly | Yes | No | No | Yes | Depends on linter ticket |
| oxlint rules | Partly | No | No | Partly | Yes | No | No | Yes | Depends on linter ticket |
| knip | No | Yes | No | No | No | Yes | No | No | Yes |
| syncpack, sherif, catalogs | No | No | No | No | No | No | Yes | No | Yes, except catalogs |

## Trade-offs to weigh

- **Overlap.** "Undeclared package" is caught by pnpm isolation, Turborepo boundaries, dependency-cruiser, knip, ESLint, and Biome. A stack that picks one owner per kind of check stays small.
- **Package graph vs. file rules.** Turborepo tags fit "which package may depend on which". Problem 2 (`client.ts` to `router.ts`) is file-level and needs dependency-cruiser or a lint rule, unless the schema-layering ticket moves the contract so the problem goes away.
- **Experimental vs. extra dependency.** Turborepo boundaries costs no new dependency but is experimental. dependency-cruiser is mature and covers the most ground, but it's one more config and tool.
- **Linter coupling.** Lint-based boundaries make sense only once the linter ticket picks a linter. ESLint has the richest boundary plugins; Biome and oxlint cover banned imports but not path zones.
- **Budget.** Map #140 sets a light budget, and the founder prefers free tools. Every option here is free and open source.

## Gaps

- Whether `turbo boundaries` accepts third-party package names in tag rules, and how it reports in CI, isn't documented; a trial run would answer it.
- The claim that pnpm isolation already blocks undeclared workspace imports is inferred from defaults, not tested in this repo.
- The full rule list for `eslint-plugin-boundaries` 7 wasn't confirmed.
- How much knip tuning Expo Router and the generated essay files need is unknown until it runs.
