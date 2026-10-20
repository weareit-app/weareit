# Dependency versions

Dependencies are pinned so contributors install the same workspace. Refresh them against the owning framework's compatibility data; do not assume the registry's newest version is compatible with Expo.

## Expo and native packages

The app is on Expo SDK 58.0.16 (expo-router 58.0.24; upgraded from SDK 57.0.30 with `expo install --fix` on 2026-10-20). SDK 58.0.0 was released on 2026-09-29. `expo install --fix` selected the SDK-compatible Expo Router and native package versions, and `expo install --check` reports the app dependencies are up to date. Keep React 19.3.0 and React Native 0.88.0 aligned with SDK 58. Do not independently upgrade them to newer registry releases; move them with an Expo SDK update.

SDK 58 changes that matter here:

- Expo Router async routes are on by default for web, in development and production. `apps/app/app.json` limits them to web production builds (`asyncRoutes: { web: "production", default: false }`), so each route gets its own chunk in the exported site (see public-pages design, Open Questions). In development they made the dev server compile each route the first time a page asked for it, which pushed the web end-to-end tests past their timeout in CI.
- React Native 0.88's types make `View` and `ScrollView` components, not classes. Type refs with `ViewInstance` and `ScrollViewInstance`.
- `expo`'s package exports no longer list its `tsconfig.base`. `apps/app/tsconfig.json` extends it by file path so Vitest's resolver finds it.
- The prebuild template now quotes the path to React Native's Xcode bundle script, so the app's own quoting config plugin (`with-quoted-rn-xcode-script`) was removed.
- Hermes can't parse a rest parameter destructured with a default (`async (...[input, options = {}]) =>`), which `@orpc/client` ships, and SDK 58's Babel preset no longer rewrites it. `apps/app/babel.config.js` applies `@babel/plugin-transform-parameters` 7.29.7 (already in the tree, now pinned directly) to `@orpc` only, and `babel-preset-expo` is a direct dependency, as Expo asks when a project has its own Babel config.
- React Native 0.88 no longer installs `@react-native/assets-registry`, which react-native-svg's web code still imports. Metro maps it for the app; Storybook's Vite config (`apps/app/.storybook/main.ts`) aliases it to react-native-web's asset registry.
- Jest 30 (with `jest-expo` 58) brings `@parcel/watcher` and `unrs-resolver`. Both ship prebuilt platform binaries, so their source-build install scripts are denied in `pnpm-workspace.yaml` `allowBuilds`.

`@shopify/react-native-skia` 2.14.0 was selected by `expo install` for SDK 58 (2026-10-20; 2.6.2 for SDK 57 on 2026-10-17) for the watercolor dot (spec 007; approved in `decisions.md`). Its prebuilt libraries come in the `react-native-skia-*` packages. 2.14 has no install script, but pnpm still asks about it, so it is denied in `pnpm-workspace.yaml` `allowBuilds` (2.6.2's postinstall, which copied those libraries, was allowed). It is used on iOS only in v0.1; web loads it solely inside the development lab route. In 2.14 an `SkPath` has no `setFillType`: set an even-odd fill with `Skia.PathBuilder.MakeFromPath(path).setFillType(…).detach()`.

NativeWind 5.0.0-rc.0 and react-native-css 3.1.0-rc.0 are an intentional prerelease pair. Keep their exact versions together. Tailwind and its PostCSS plugin are kept on the same current 4.x version. `lightningcss` remains pinned at 1.30.1 as a compatibility override for this NativeWind/react-native-css setup; change that pin only after validating the styling pipeline on web and iOS.

`expo-font` was added with `expo install`. The `@expo-google-fonts/bitter` and `@expo-google-fonts/inter` font packages are pinned at 0.4.2; changing them changes the font files the app ships, so check the type on web and iOS after a refresh (see `docs/architecture/typography.md`).

## Other toolchain pins

- Prettier 3.9.10 and Turborepo 2.11.8 are current releases within their existing major versions.
- Zod 4.6.7 and Zustand 5.0.15 are current releases within their existing major versions.
- TypeScript remains at 5.9.3, the latest 5.x release. Do not adopt TypeScript 7 as a major toolchain change until Expo and workspace tooling compatibility is established.
- Lefthook 2.1.17 runs the git pre-commit hook (`lefthook.yml`; chosen 2026-10-20 as the newest release at least two weeks old). Its postinstall only runs `lefthook install` (skipped when `CI` is set), so it is allowed in `pnpm-workspace.yaml` `allowBuilds`. It is one Go binary with staged-file filtering and restaging built in, so no lint-staged is needed.
- pnpm remains pinned to 11.25.0 for reproducible contributor installs. A pnpm major upgrade should include a lockfile review.

The Expo CLI's dependency resolver owns SDK-specific package versions. Re-run `expo install --check` after dependency changes. `pnpm outdated` is useful for finding candidates, but its `Latest` column is not an Expo compatibility guarantee. pnpm added exact-version entries to `minimumReleaseAgeExclude` for Expo packages selected by the CLI because those releases were newer than pnpm's release-age window at install time.

## Storybook

Storybook 10.6.1 (`storybook` and `@storybook/react-native-web-vite`, pinned exactly) with Vite 7.3.6: each the newest release at least two weeks old on 2026-10-20, from the npm registry's release dates (`npm view <package> time`, checked 2026-10-20). Storybook 10.6.1 came out 2026-09-29 (10.6.2, 2026-10-12, was too new); Vite 7.3.6 came out 2026-06-25 (7.3.7, 2026-10-06, was too new). Vite 7 is within the framework's supported Vite range (`^5 || ^6 || ^7 || ^8`, its peer dependencies, checked the same day). Both are dev dependencies of `@it/app` only. Telemetry is off in `apps/app/.storybook/main.ts`. Keep `storybook` and its framework package on the same version. After an upgrade, or a NativeWind, react-native-css, Tailwind or Expo update, run `pnpm storybook:review --no-base` and look at the report: styling, fonts and dark mode must still match the app. See `docs/architecture/storybook.md`.

## Continuous integration

`.github/workflows/ci.yml` runs on every pull request and on pushes to `master`, so a commit made with `git commit --no-verify` is still checked. It has two jobs that run in parallel:

- `check`: typecheck, lint, the Vitest unit tests and the jest-expo tests (about 8 seconds of test time).
- `e2e`: the Playwright web tests. It downloads Chromium and starts the Expo web server, so it takes about two minutes and is the job most likely to fail for reasons unrelated to the code. It is a separate job so it does not hold up `check`. On failure it uploads `apps/app/test-results/` (kept 7 days).

The shared install steps (pnpm, Node, `pnpm install`) live in `.github/actions/setup/action.yml`, so each pin and the Node version appear once. Node is pinned to the version in `mise.toml`; update both together.

Cost (checked 2026-10-20 against GitHub's Actions billing docs): GitHub Actions is free for public repositories on standard GitHub-hosted runners, so this workflow costs nothing while `weareit-app/weareit` stays public. Larger runners are billed even on public repositories. If the repository becomes private, the organization's free plan includes 2,000 minutes and 500 MB of artifact storage a month. To keep CI free:

- Use `ubuntu-latest` only. Do not add larger runners. The billing docs do not say whether standard macOS runners are free for public repositories, so check them before adding a macOS job (for example an iOS build).
- Keep `timeout-minutes` on every job and keep artifacts short-lived.
- Keep the organization's Actions budget at $0, so usage that would be billed is blocked rather than charged.

Action pins and their review notes: `docs/architecture/ci-actions.md`.

## Spec and agent tooling

- OpenSpec CLI 1.14.1 (`npm install -g @fission-ai/openspec@1.14.1`; chosen 2026-10-19 as the newest release at least two weeks old). Telemetry off (`openspec config set telemetry.enabled false`). Generated files: `openspec/`, `.claude/skills/openspec-*`, `.claude/commands/opsx/`, `.agents/skills/openspec-*`. Refresh with `openspec update` after upgrading the CLI, and review the diff.
- Matt Pocock's skills (MIT), vendored from `github.com/mattpocock/skills` at commit `5beb35b040e3de97e54fa9e386d7e42d15c295c2` (2026-10-19), copied unmodified into `.claude/skills/` and `.agents/skills/`: every skill in the repo's published engineering and productivity catalogs (27), including `to-spec`, `triage`, `wayfinder`, `implement-spec`, `prototype`, `diagnosing-bugs`, `pr`, `wizard`, `teach` and the rest (all 27 added on 2026-10-19; the first 12 earlier the same day). Not vendored: the repo's `misc/` and `in-progress/` folders (git guardrails, pre-commit setup, shoehorn migration, exercise scaffolding, and unfinished skills). Two contain shell templates that run only when invoked: `diagnosing-bugs/scripts/hitl-loop.template.sh` (prompts the founder through reproduction steps) and `wizard/template.sh` (a setup guide that can write `.env` values and GitHub secrets). To update, check out a newer reviewed commit, read the diff of these folders, and copy them again.
