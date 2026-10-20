# Dependency versions

Dependencies are pinned so contributors install the same workspace. Refresh them against the owning framework's compatibility data; do not assume the registry's newest version is compatible with Expo.

## Expo and native packages

The app is on Expo SDK 57.0.30 (expo-router 57.0.28; updated with `expo install --fix` on 2026-10-17). SDK 57 is the current stable line; SDK 58 is in beta. `expo install --fix` selected the SDK-compatible Expo Router and native package versions, and `expo install --check` reports the app dependencies are up to date. Keep React 19.2.3 and React Native 0.86.3 aligned with SDK 57. Do not independently upgrade them to newer registry releases; move them with an Expo SDK update.

`@shopify/react-native-skia` 2.6.2 was selected by `expo install` for SDK 57 (2026-10-17) for the watercolor dot (spec 007; approved in `decisions.md`). Its postinstall only copies the prebuilt Skia libraries from the `react-native-skia-*` packages, so it is allowed in `pnpm-workspace.yaml` `allowBuilds`. It is used on iOS only in v0.1; web loads it solely inside the development lab route.

NativeWind 5.0.0-rc.0 and react-native-css 3.1.0-rc.0 are an intentional prerelease pair. Keep their exact versions together. Tailwind and its PostCSS plugin are kept on the same current 4.x version. `lightningcss` remains pinned at 1.30.1 as a compatibility override for this NativeWind/react-native-css setup; change that pin only after validating the styling pipeline on web and iOS.

`expo-font` was added with `expo install`. The `@expo-google-fonts/bitter` and `@expo-google-fonts/inter` font packages are pinned at 0.4.2; changing them changes the font files the app ships, so check the type on web and iOS after a refresh (see `docs/architecture/typography.md`).

`vega` 6.4.0, `vega-lite` 6.4.3 and `vega-embed` 7.3.0 draw essay charts on the web (public-pages, design decision 3; reviewed 2026-10-20). Each is the newest release at least two weeks old (vega-lite 6.5.0, 2026-10-08, was too new). The tree adds 73 packages: the `vega-*` modules (BSD-3-Clause), d3 modules, `internmap`, `delaunator` and `topojson-client` (ISC), `robust-predicates` (Unlicense), `rw` (BSD-3-Clause), and `fast-json-patch`, `json-stringify-pretty-compact` and vega-lite's CLI-only `yargs` chain (MIT/ISC). None has an install script. They load no fonts (charts use the page's system fonts) and fetch nothing when the spec and its data are passed inline; the only outside address is the Vega editor link in vega-embed's actions menu, which the chart block turns off. They are imported lazily, only when a chart renders on the web, so the explorer's bundle does not include them. `expo install --check` passes with them. `@types/react-dom` (dev, selected by `expo install`) types the block tests, which render essays with `react-dom/server`.

## Other toolchain pins

- Prettier 3.9.10 and Turborepo 2.11.8 are current releases within their existing major versions.
- Zod 4.6.7 and Zustand 5.0.15 are current releases within their existing major versions.
- TypeScript remains at 5.9.3, the latest 5.x release. Do not adopt TypeScript 7 as a major toolchain change until Expo and workspace tooling compatibility is established.
- pnpm remains pinned to 11.25.0 for reproducible contributor installs. A pnpm major upgrade should include a lockfile review.

The Expo CLI's dependency resolver owns SDK-specific package versions. Re-run `expo install --check` after dependency changes. `pnpm outdated` is useful for finding candidates, but its `Latest` column is not an Expo compatibility guarantee. pnpm added exact-version entries to `minimumReleaseAgeExclude` for Expo packages selected by the CLI because those releases were newer than pnpm's release-age window at install time.

## Essay build (build time only)

The essay build script (`packages/content/scripts/build-essays.ts`, public-pages task 2.2) parses Markdown with the micromark/mdast packages from the unified collective. They are `devDependencies` of `@it/content`, imported only by `packages/content/essay-build/` and its script, never by the package's runtime exports or the app, so no Markdown parser ships. Chosen 2026-10-20 as the newest releases at least two weeks old; all MIT except `yaml` (ISC), with no install scripts:

- `mdast-util-from-markdown` 2.1.0 (the parser) and `@types/mdast` 4.0.4
- `micromark-extension-directive` 4.0.0 and `mdast-util-directive` 3.1.1 (`::block{…}`, `:::expandable`, `:status[…]`)
- `micromark-extension-gfm-table` 2.1.2 and `mdast-util-gfm-table` 2.0.0 (Markdown tables)
- `micromark-extension-gfm-footnote` 2.1.0 and `mdast-util-gfm-footnote` 2.1.0 (`[^source]` references)
- `micromark-extension-math` 3.1.0 and `mdast-util-math` 3.0.0 (inline `$…$`)
- `yaml` 2.9.1 (front matter and block data files; no dependencies)

The script runs with `tsx` (the range the database package already uses) and formats its output with the workspace's Prettier. To update, pick newer releases at least two weeks old, read their changelogs, and run the essay fixture tests.

## Spec and agent tooling

- OpenSpec CLI 1.14.1 (`npm install -g @fission-ai/openspec@1.14.1`; chosen 2026-10-19 as the newest release at least two weeks old). Telemetry off (`openspec config set telemetry.enabled false`). Generated files: `openspec/`, `.claude/skills/openspec-*`, `.claude/commands/opsx/`, `.agents/skills/openspec-*`. Refresh with `openspec update` after upgrading the CLI, and review the diff.
- Matt Pocock's skills (MIT), vendored from `github.com/mattpocock/skills` at commit `5beb35b040e3de97e54fa9e386d7e42d15c295c2` (2026-10-19), copied unmodified into `.claude/skills/` and `.agents/skills/`: every skill in the repo's published engineering and productivity catalogs (27), including `to-spec`, `triage`, `wayfinder`, `implement-spec`, `prototype`, `diagnosing-bugs`, `pr`, `wizard`, `teach` and the rest (all 27 added on 2026-10-19; the first 12 earlier the same day). Not vendored: the repo's `misc/` and `in-progress/` folders (git guardrails, pre-commit setup, shoehorn migration, exercise scaffolding, and unfinished skills). Two contain shell templates that run only when invoked: `diagnosing-bugs/scripts/hitl-loop.template.sh` (prompts the founder through reproduction steps) and `wizard/template.sh` (a setup guide that can write `.env` values and GitHub secrets). To update, check out a newer reviewed commit, read the diff of these folders, and copy them again.
