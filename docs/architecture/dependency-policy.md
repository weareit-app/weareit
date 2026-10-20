# Dependency versions

Dependencies are pinned so contributors install the same workspace. Refresh them against the owning framework's compatibility data; do not assume the registry's newest version is compatible with Expo.

## Expo and native packages

The app is on Expo SDK 57.0.30 (expo-router 57.0.28; updated with `expo install --fix` on 2026-10-17). SDK 57 is the current stable line; SDK 58 is in beta. `expo install --fix` selected the SDK-compatible Expo Router and native package versions, and `expo install --check` reports the app dependencies are up to date. Keep React 19.2.3 and React Native 0.86.3 aligned with SDK 57. Do not independently upgrade them to newer registry releases; move them with an Expo SDK update.

`@shopify/react-native-skia` 2.6.2 was selected by `expo install` for SDK 57 (2026-10-17) for the watercolor dot (spec 007; approved in `decisions.md`). Its postinstall only copies the prebuilt Skia libraries from the `react-native-skia-*` packages, so it is allowed in `pnpm-workspace.yaml` `allowBuilds`. It is used on iOS only in v0.1; web loads it solely inside the development lab route.

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

Storybook 10.6.1 (`storybook` and `@storybook/react-native-web-vite`, pinned exactly; chosen 2026-10-20 as the newest release at least two weeks old) with Vite 7.3.6, dev dependencies of `@it/app` only. Telemetry is off in `apps/app/.storybook/main.ts`. Keep `storybook` and its framework package on the same version. After an upgrade, or a NativeWind, react-native-css, Tailwind or Expo update, run `pnpm storybook:review --no-base` and look at the report: styling, fonts and dark mode must still match the app. See `docs/architecture/storybook.md`.

## GitHub Actions

CI (`.github/workflows/ci.yml`) pins each third-party action to a full commit SHA, with the version in a comment. Each is the newest release at least two weeks old on 2026-10-20:

- `actions/checkout` v7.0.1, `3d3c42e5aac5ba805825da76410c181273ba90b1` (released 2026-07-20).
- `actions/setup-node` v7.0.0, `820762786026740c76f36085b0efc47a31fe5020` (2026-07-14). v7.1.0 (2026-10-08) was too new.
- `pnpm/action-setup` v6.1.0, `ea17c68df8912ef543352723c149a84f56e3d413` (2026-09-05). It reads pnpm 11.25.0 from `packageManager`. Its TypeScript source at this commit was read on 2026-10-20: it installs pnpm with `npm ci` from a lockfile committed in the action, which carries the package's integrity hash. Our pnpm version matches that lockfile, so the action runs no self-update. The bundled `dist/index.js` that actually runs was not compared with the source.

CI runs typecheck, lint, the Vitest unit tests and the jest-expo tests (about 8 seconds). It leaves out the Playwright end-to-end tests: they download a browser and start the Expo web server (up to two minutes) on every run, which is slow and the step most likely to fail for reasons unrelated to the code. To update a pin, pick a newer release at least two weeks old, read its changes, resolve the tag to its commit SHA (`gh api repos/<owner>/<repo>/commits/<tag> --jq .sha`), and update both the workflow and this list.

## Spec and agent tooling

- OpenSpec CLI 1.14.1 (`npm install -g @fission-ai/openspec@1.14.1`; chosen 2026-10-19 as the newest release at least two weeks old). Telemetry off (`openspec config set telemetry.enabled false`). Generated files: `openspec/`, `.claude/skills/openspec-*`, `.claude/commands/opsx/`, `.agents/skills/openspec-*`. Refresh with `openspec update` after upgrading the CLI, and review the diff.
- Matt Pocock's skills (MIT), vendored from `github.com/mattpocock/skills` at commit `5beb35b040e3de97e54fa9e386d7e42d15c295c2` (2026-10-19), copied unmodified into `.claude/skills/` and `.agents/skills/`: every skill in the repo's published engineering and productivity catalogs (27), including `to-spec`, `triage`, `wayfinder`, `implement-spec`, `prototype`, `diagnosing-bugs`, `pr`, `wizard`, `teach` and the rest (all 27 added on 2026-10-19; the first 12 earlier the same day). Not vendored: the repo's `misc/` and `in-progress/` folders (git guardrails, pre-commit setup, shoehorn migration, exercise scaffolding, and unfinished skills). Two contain shell templates that run only when invoked: `diagnosing-bugs/scripts/hitl-loop.template.sh` (prompts the founder through reproduction steps) and `wizard/template.sh` (a setup guide that can write `.env` values and GitHub secrets). To update, check out a newer reviewed commit, read the diff of these folders, and copy them again.
