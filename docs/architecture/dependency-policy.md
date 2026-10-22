# Dependency versions

Dependencies are pinned so contributors install the same workspace. Refresh them against the owning framework's compatibility data; do not assume the registry's newest version is compatible with Expo.

## Expo and native packages

The app is on Expo SDK 58.0.16 (expo-router 58.0.24; upgraded from SDK 57.0.30 with `expo install --fix` on 2026-10-20). SDK 58.0.0 was published on 2026-09-29 and 58.0.16 on 2026-10-19 (npm registry release dates, `npm view expo time`, checked 2026-10-20). `expo install --fix` selected the SDK-compatible Expo Router and native package versions, and `expo install --check` reports the app dependencies are up to date. Keep React 19.3.0 and React Native 0.88.0 aligned with SDK 58. Do not independently upgrade them to newer registry releases; move them with an Expo SDK update.

SDK 58 changes that matter here (each checked 2026-10-20):

- Async routes: Expo's docs say that "in SDK 58 and later, async routes on web are stable and enabled by default in development and production" (docs.expo.dev/router/web/async-routes). `apps/app/app.json` limits them to web production builds (`asyncRoutes: { web: "production", default: false }`), so each route gets its own chunk in the exported site. The measurements are in weareit-app/weareit#75. In development, async routes made the dev server compile each route the first time a page asked for it. That pushed the web end-to-end tests past their timeout in CI (run 39482818478).
- Ref types: React Native 0.88's types declare `View` and `ScrollView` as functions, not classes (`react-native@0.88.0`, `types_generated/Libraries/Components/View/View.d.ts`), so `useRef<View>` no longer types the instance. Type refs with the exported `ViewInstance` and `ScrollViewInstance`.
- tsconfig: the `exports` map in `expo@58.0.16`'s `package.json` has no `tsconfig.base` entry. `apps/app/tsconfig.json` extends the file by path so Vitest's resolver finds it.
- Xcode bundle script: `expo prebuild` with SDK 58.0.16 already quotes the path to React Native's Xcode bundle script (the generated `project.pbxproj` wraps it as `` "`…react-native-xcode.sh…`" ``). So the app's own quoting config plugin (`with-quoted-rn-xcode-script`) was removed.
- Babel and Hermes: `@orpc/client` 1.15.6 ships `async (...[input, options = {}]) =>`, which SDK 58's Hermes rejects ("invalid destructuring target" in the iOS dev build).
  - `babel-preset-expo` 57.0.16 rewrote such async arrows with its `fix-hermes-v1-async-arrow-non-simple-params` plugin, a workaround for facebook/hermes#1761. 58.0.18 no longer has that plugin (both read from the published packages).
  - `apps/app/babel.config.js` applies `@babel/plugin-transform-parameters` 7.29.7 (already in the tree, now pinned directly) to `@orpc` only. Without it the iOS build fails, and with it the build runs (both tried).
  - `babel-preset-expo` is a direct dependency because pnpm's isolated `node_modules` doesn't make it resolvable from `apps/app` otherwise.
- Asset registry: `react-native@0.88.0` no longer depends on `@react-native/assets-registry` (0.86.3 did; `npm view react-native@<version> dependencies`). `react-native-svg` 15.16.0's web code still imports `@react-native/assets-registry/registry` (`lib/module/lib/resolveAssetUri.web.js`). Metro resolves it for the app. Storybook's Vite config (`apps/app/.storybook/main.ts`) aliases it to react-native-web's asset registry, which has the same `getAssetByID`.
- Jest 30 install scripts: Jest 30 (with `jest-expo` 58) brings `@parcel/watcher` 2.6.0 and `unrs-resolver` 1.12.2. Each lists prebuilt platform binaries as optional dependencies. Their install scripts are fallbacks: `@parcel/watcher` builds from source, and `unrs-resolver` runs `napi-postinstall` to fetch a binding. Both are denied in `pnpm-workspace.yaml` `allowBuilds` (`npm view <package>@<version> scripts`).

`@shopify/react-native-skia` 2.14.0 was selected by `expo install` for SDK 58 on 2026-10-20 (2.6.2 for SDK 57 on 2026-10-17), for the watercolor dot (spec 007; approved in `decisions.md`).
- Its prebuilt libraries come in the `react-native-skia-*` packages.
- 2.14.0 publishes no install or postinstall script (2.6.2 ran `node scripts/install-libs.js`; `npm view @shopify/react-native-skia@<version> scripts`, checked 2026-10-20). pnpm still asks about it, so it is denied in `pnpm-workspace.yaml` `allowBuilds`.
- It is used on iOS only in v0.1; web loads it solely inside the development lab route.
- In 2.14.0's types an `SkPath` has no `setFillType` (`lib/typescript/src/skia/types/Path/Path.d.ts`). `apps/app/src/watercolor/sk-path.ts` builds even-odd paths through `Skia.PathBuilder`.

NativeWind 5.0.0-rc.0 and react-native-css 3.1.0-rc.0 are an intentional prerelease pair. Keep their exact versions together. Tailwind and its PostCSS plugin are kept on the same current 4.x version. `lightningcss` remains pinned at 1.30.1 as a compatibility override for this NativeWind/react-native-css setup; change that pin only after validating the styling pipeline on web and iOS.

`expo-font` was added with `expo install`. The `@expo-google-fonts/bitter` and `@expo-google-fonts/inter` font packages are pinned at 0.4.2; changing them changes the font files the app ships, so check the type on web and iOS after a refresh (see `docs/architecture/typography.md`).

`vega` 6.4.0, `vega-lite` 6.4.3 and `vega-embed` 7.3.0 draw essay charts on the web (public-pages, design decision 3; reviewed 2026-10-20). Each is the newest release at least two weeks old (vega-lite 6.5.0, 2026-10-08, was too new). The tree adds 73 packages: the `vega-*` modules (BSD-3-Clause), d3 modules, `internmap`, `delaunator` and `topojson-client` (ISC), `robust-predicates` (Unlicense), `rw` (BSD-3-Clause), and `fast-json-patch`, `json-stringify-pretty-compact` and vega-lite's CLI-only `yargs` chain (MIT/ISC). None has an install script. They load no fonts (charts use the page's system fonts) and fetch nothing when the spec and its data are passed inline; the only outside address is the Vega editor link in vega-embed's actions menu, which the chart block turns off. They are imported lazily, only when a chart renders on the web, so the explorer's bundle does not include them. `expo install --check` passes with them. `@types/react-dom` (dev, selected by `expo install`) types the block tests, which render essays with `react-dom/server`.

## Other toolchain pins

- Prettier 3.9.10 and Turborepo 2.11.8 are current releases within their existing major versions.
- Zod 4.6.7 and Zustand 5.0.15 are current releases within their existing major versions.
- TypeScript remains at 5.9.3, the latest 5.x release. Do not adopt TypeScript 7 as a major toolchain change until Expo and workspace tooling compatibility is established.
- Lefthook 2.1.17 runs the git pre-commit hook (`lefthook.yml`; chosen 2026-10-20 as the newest release at least two weeks old). Its postinstall only runs `lefthook install` (skipped when `CI` is set), so it is allowed in `pnpm-workspace.yaml` `allowBuilds`. It is one Go binary with staged-file filtering and restaging built in, so no lint-staged is needed.
- pnpm remains pinned to 11.25.0 for reproducible contributor installs. A pnpm major upgrade should include a lockfile review.

The Expo CLI's dependency resolver owns SDK-specific package versions. Re-run `expo install --check` after dependency changes. `pnpm outdated` is useful for finding candidates, but its `Latest` column is not an Expo compatibility guarantee. For SDK 57, pnpm needed exact-version entries in `minimumReleaseAgeExclude` for Expo packages selected by the CLI, because those releases were newer than pnpm's release-age window at install time. The SDK 58 install on 2026-10-20 needed none, so those entries were removed. If `expo install` picks a release that is too new, pnpm refuses it; add an exact-version entry for that release.

## API docs (local development only)

The local developer docs (`docs/architecture/decisions.md`, 2026-10-21) add `@orpc/openapi` and `@orpc/zod`, pinned exactly at 1.15.6, the version the other oRPC packages resolve to (their ranges are `^1.15.6`). When oRPC is upgraded, move these two with the others so every oRPC package resolves to the same release. The Scalar page uses `@scalar/api-reference` 1.75.1 (MIT), a dev dependency of `@it/api-server`. The founder chose 1.75.1, published 2026-10-20, over 1.73.0 (published 2026-10-05), the newest release at least two weeks old (`npm view @scalar/api-reference time license`, checked 2026-10-21). So its own release and ten `@scalar/*` dependencies have exact-version entries in `minimumReleaseAgeExclude`; remove those entries once they are older than the release-age window. The tree adds about 200 packages: 179 MIT, 13 Apache-2.0, 3 BSD-3-Clause, 2 BSD-2-Clause, 2 ISC, and 1 AFL-2.1 or BSD-3-Clause (from each added package's `package.json` in the lockfile diff, checked 2026-10-21). The only install script among them is `vue-demi`'s `postinstall` (same check; `npm view vue-demi@0.14.10 scripts`), which is turned off in `allowBuilds`: the page serves Scalar's prebuilt browser bundle (`dist/browser/standalone.js`). Scalar turns telemetry and hosted fonts on by default (the `telemetry` and `withDefaultFonts` options in that bundle, which also names `fonts.scalar.com`; checked 2026-10-21). The page turns them off, along with the AI agent and the developer toolbar. With those settings the page made requests only to the local server (browser network panel on `/docs`, including a "Try it" request, checked 2026-10-21). After an upgrade, run the API docs tests (`apps/api-server/tests/api-docs.test.ts`) and open `/docs` with `pnpm --filter @it/api-server dev`: the network panel should show only local requests.

## Storybook

Storybook 10.6.1 (`storybook` and `@storybook/react-native-web-vite`, pinned exactly) with Vite 7.3.6: each the newest release at least two weeks old on 2026-10-20, from the npm registry's release dates (`npm view <package> time`, checked 2026-10-20). Storybook 10.6.1 came out 2026-09-29 (10.6.2, 2026-10-12, was too new); Vite 7.3.6 came out 2026-06-25 (7.3.7, 2026-10-06, was too new). Vite 7 is within the framework's supported Vite range (`^5 || ^6 || ^7 || ^8`, its peer dependencies, checked the same day). Both are dev dependencies of `@it/app` only. Telemetry is off in `apps/app/.storybook/main.ts`. Keep `storybook` and its framework package on the same version. After an upgrade, or a NativeWind, react-native-css, Tailwind or Expo update, run `pnpm storybook:review --no-base` and look at the report: styling, fonts and dark mode must still match the app. See `docs/architecture/storybook.md`.

## Continuous integration

`.github/workflows/ci.yml` runs on every pull request and on pushes to `master`, so a commit made with `git commit --no-verify` is still checked. A `changes` job runs first and decides whether a pull request is docs-only: every changed file is Markdown, and none is under `apps/`, `packages/`, `tools/`, or `.github/`, where tests and tools read Markdown as input. Pushes to `master` are never docs-only. Then three jobs run in parallel:

- `check`: typecheck, the typecheck coverage check, the story coverage check, lint, the Vitest unit tests, and the jest-expo tests. The job starts a Postgres service container and sets `TEST_DATABASE_URL`, so the repository tests in `packages/database/tests` run there rather than skip; the image pin is in `docs/architecture/ci-actions.md`. The coverage check (`tools/typecheck-coverage/`) fails when a tracked TypeScript file is in no project a `typecheck` script runs, since `tsc` skips files outside a tsconfig's `include` without saying so. Root files and the repo tools without a package of their own are in the root `tsconfig.json`, checked by `pnpm run typecheck:root`. The story coverage check (`tools/story-coverage/`) fails when a UI component has no `*.stories.tsx` beside it and no entry in its allowlist; see `docs/architecture/storybook.md`.
- `e2e`: the Playwright web tests. It downloads Chromium and starts the Expo web server, so it takes about two minutes and is the job most likely to fail for reasons unrelated to the code. It is a separate job so it does not hold up `check`. On failure it uploads `apps/app/test-results/` (kept 7 days).
- `stories`: `pnpm storybook:review --no-base`, which builds Storybook and screenshots every story in light and dark with Playwright's Chromium, failing when a story doesn't render. On failure it uploads the report and screenshots (kept 7 days). See `docs/architecture/storybook.md`.

On a docs-only pull request, `e2e` and `stories` are skipped, and `check` runs only the action pins check, lint (Prettier and the essay check), and the Python tool tests. The jobs skip with a job-level `if:` rather than a `paths-ignore` filter on the workflow: the `master` ruleset requires "Typecheck, lint and unit tests" and "Web end-to-end tests", a workflow that never starts leaves those checks waiting and blocks the merge, and a job skipped by `if:` counts as passing. For the same reason, if the `changes` job fails, the other jobs run in full rather than skip. `check` still starts its Postgres service on a docs-only pull request, since a service can't be skipped by a step condition.

The shared install steps (pnpm, Node, `pnpm install`) live in `.github/actions/setup/action.yml`, so each pin and the Node version appear once. Node is pinned to the version in `mise.toml`; update both together.

Cost (checked 2026-10-20 against GitHub's Actions billing docs): GitHub Actions is free for public repositories on standard GitHub-hosted runners, so this workflow costs nothing while `weareit-app/weareit` stays public. Larger runners are billed even on public repositories. If the repository becomes private, the organization's free plan includes 2,000 minutes and 500 MB of artifact storage a month. To keep CI free:

- Use `ubuntu-latest` only. Do not add larger runners. The billing docs do not say whether standard macOS runners are free for public repositories, so check them before adding a macOS job (for example an iOS build).
- Keep `timeout-minutes` on every job and keep artifacts short-lived.
- Keep the organization's Actions budget at $0, so usage that would be billed is blocked rather than charged.

Action pins and their review notes: `docs/architecture/ci-actions.md`.

## Essay build (build time only)

The essay build script (`packages/content/scripts/build-essays.ts`, public-pages task 2.2) parses Markdown with the micromark/mdast packages from the unified collective. They are `devDependencies` of `@it/content`, imported only by `packages/content/essay-build/` and its script, never by the package's runtime exports or the app, so no Markdown parser ships. Chosen 2026-10-20 as the newest releases at least two weeks old; all MIT except `yaml` (ISC), with no install scripts:

- `mdast-util-from-markdown` 2.1.0 (the parser) and `@types/mdast` 4.0.4
- `micromark-extension-directive` 4.0.0 and `mdast-util-directive` 3.1.1 (`::block{…}`, `:::expandable`, `:status[…]`)
- `micromark-extension-gfm-table` 2.1.2 and `mdast-util-gfm-table` 2.0.0 (Markdown tables)
- `micromark-extension-gfm-footnote` 2.1.0 and `mdast-util-gfm-footnote` 2.1.0 (`[^source]` references)
- `micromark-extension-math` 3.1.0 and `mdast-util-math` 3.0.0 (inline `$…$`)
- `yaml` 2.9.1 (front matter and block data files; no dependencies)

The script runs with `tsx` (the range the database package already uses) and formats its output with the workspace's Prettier. To update, pick newer releases at least two weeks old, read their changelogs, and run the essay fixture tests.

## Generator pages

- Lucide 0.469.0 (ISC), loaded from `https://cdn.jsdelivr.net/npm/lucide@0.469.0/dist/umd/lucide.min.js` by the calibration page (`tools/possibilities/config/calibration-page.template.html`, since 2026-10-19) and the fix review page (`fix-review-page.template.html`, since 2026-10-20). It was published on 2024-12-20 (`npm view lucide time`, checked 2026-10-20). It draws the icons for fix kinds and statuses named in `docs/style/copy-style-guide.md`. The icons are decorative: both pages always show the kind or status as text, so a page that can't reach the CDN still works. Keep both pages on the same version. Before an upgrade, check that every icon name in the copy guide's "Kinds of fixes" table still exists.

## Spec and agent tooling

- OpenSpec CLI 1.14.1 (`npm install -g @fission-ai/openspec@1.14.1`; chosen 2026-10-19 as the newest release at least two weeks old). Telemetry off (`openspec config set telemetry.enabled false`). Generated files: `openspec/`, `.claude/skills/openspec-*`, `.claude/commands/opsx/`, `.agents/skills/openspec-*`. Refresh with `openspec update` after upgrading the CLI, and review the diff.
- Matt Pocock's skills (MIT), vendored from `github.com/mattpocock/skills` at commit `5beb35b040e3de97e54fa9e386d7e42d15c295c2` (2026-10-19), copied unmodified into `.claude/skills/` and `.agents/skills/`: every skill in the repo's published engineering and productivity catalogs (27), including `to-spec`, `triage`, `wayfinder`, `implement-spec`, `prototype`, `diagnosing-bugs`, `pr`, `wizard`, `teach` and the rest (all 27 added on 2026-10-19; the first 12 earlier the same day). Not vendored: the repo's `misc/` and `in-progress/` folders (git guardrails, pre-commit setup, shoehorn migration, exercise scaffolding, and unfinished skills). Two contain shell templates that run only when invoked: `diagnosing-bugs/scripts/hitl-loop.template.sh` (prompts the founder through reproduction steps) and `wizard/template.sh` (a setup guide that can write `.env` values and GitHub secrets). To update, check out a newer reviewed commit, read the diff of these folders, and copy them again.

## Essay blocks: diagrams and math

Reviewed 2026-10-20 for the public-pages change (design decision 3, task 4.1). Both load lazily, only when an essay shows that block, and only on the web. `expo install --check` passes with both.

- **KaTeX 0.19.0** (MIT; released 2026-10-01, the newest release at least two weeks old). Its only dependency, `commander`, is for the command line and is not bundled. 0.19's breaking change only affects warnings in `strict` mode. The math block uses `htmlAndMathml` output, so screen readers get MathML. KaTeX's stylesheet and its 20 woff2 fonts (MIT, under KaTeX's license) are copied into `apps/app/public/katex` and served from the site. After changing the version, run `pnpm --filter @it/app katex:web`; a unit test fails while the copies differ from the installed package.
- **Mermaid 12.1.0** (MIT; released 2026-10-02; 12.2.0 is under two weeks old). The tree is large: about 117 packages, including d3, cytoscape, dagre-d3-es, chevrotain, DOMPurify and a nested KaTeX 0.16.47 for math inside diagrams (unused: the diagram schema rejects `$$` math, since that KaTeX's stylesheet is not loaded). Licenses: mostly MIT and ISC, plus Apache-2.0, BSD-3-Clause, DOMPurify (MPL-2.0 or Apache-2.0), `robust-predicates` (Unlicense) and `elkjs` (EPL-2.0).
  - `elkjs` is EPL-2.0 without the notice that makes it available under the GPL, so it is left out of the bundle. `apps/app/metro.config.js` resolves `elkjs` to an empty module. Mermaid 12 makes ELK its default layout, so the diagram block sets `dagre`. The diagram schema rejects `flowchart-elk`, `%%{init}%%` directives and front matter.
  - Expo's web export moves any module shared by two lazy chunks into `__common.js`, which every page loads. Mermaid splits itself into about 60 chunks with `import()`, which grew `__common.js` from 60 KB to 3.1 MB. `apps/app/babel.config.js` turns Mermaid's own `import()` calls into requires, so all of Mermaid is one lazy chunk, and `__common.js` and the entry bundle stay the same size.
  - Weight: the diagram chunk is about 5.0 MB minified (about 1.2 MB gzipped), fetched only on an essay with a diagram. This is heavy for a few diagrams. The design's fallback (pre-render diagrams to SVG at build time, behind the same block schema) would remove it from readers' downloads and drop the ELK and bundling workarounds. This needs a headless browser in the build, because Mermaid measures text in a DOM.
