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

## Continuous integration

`.github/workflows/ci.yml` runs on every pull request and on pushes to `master`, so a commit made with `git commit --no-verify` is still checked. It has two jobs that run in parallel:

- `check`: typecheck, lint, the Vitest unit tests and the jest-expo tests (about 8 seconds of test time).
- `e2e`: the Playwright web tests. It downloads Chromium and starts the Expo web server, so it takes about two minutes and is the job most likely to fail for reasons unrelated to the code. It is a separate job so it does not hold up `check`. On failure it uploads `apps/app/test-results/` (kept 7 days).

The shared install steps (pnpm, Node, `pnpm install`) live in `.github/actions/setup/action.yml`, so each pin and the Node version appear once. Node is pinned to the version in `mise.toml`; update both together.

Cost (checked 2026-10-20 against GitHub's Actions billing docs): GitHub Actions is free for public repositories on standard GitHub-hosted runners, so this workflow costs nothing while `weareit-app/weareit` stays public. Larger runners are billed even on public repositories. If the repository becomes private, the organization's free plan includes 2,000 minutes and 500 MB of artifact storage a month. To keep CI free:

- Use `ubuntu-latest` only. Do not add larger runners. The billing docs do not say whether standard macOS runners are free for public repositories, so check them before adding a macOS job (for example an iOS build).
- Keep `timeout-minutes` on every job and keep artifacts short-lived.
- Keep the organization's Actions budget at $0, so usage that would be billed is blocked rather than charged.

Review an action before you pin it: read its `action.yml` and its source at the commit you pin, and record here whether the bundled `dist/` that actually runs was compared with that source. CI enforces the pin and the record, not the review: `tools/action-pins/check-action-pins.mjs` fails when a `uses:` line in `.github/workflows/` or `.github/actions/` isn't `owner/repo@<40-character SHA> # vX.Y.Z` (local `./` actions are exempt), or when its SHA is missing from this section.

Each third-party action is pinned to a full commit SHA, with the version in a comment. Each is the newest release at least two weeks old on 2026-10-20:

- `actions/checkout` v7.0.1, `3d3c42e5aac5ba805825da76410c181273ba90b1` (released 2026-07-20).
- `actions/setup-node` v7.0.0, `820762786026740c76f36085b0efc47a31fe5020` (2026-07-14). v7.1.0 (2026-10-08) was too new.
- `actions/upload-artifact` v7.0.1, `043fb46d1a93c77aae656e7c1c64a875d1fc6a0a` (2026-04-10). v7.0.2 (2026-10-07) was too new.
- `pnpm/action-setup` v6.1.0, `ea17c68df8912ef543352723c149a84f56e3d413` (2026-09-05), the only action not published by GitHub. It reads pnpm 11.25.0 from `packageManager`. Its `action.yml` and TypeScript `src/` at this commit were read on 2026-10-20: it installs pnpm with `npm ci` from a lockfile committed in the action, which carries the package's integrity hash. Our pnpm version matches that lockfile, so the action runs no self-update. The only network hosts in its bundled `dist/index.js` are the npm registry and GitHub's own services (Actions cache and Azure storage); the 1.4 MB bundle was not otherwise compared with the source.

To update a pin, pick a newer release at least two weeks old, read its changes, resolve the tag to its commit SHA (`gh api repos/<owner>/<repo>/commits/<tag> --jq .sha`), and update both the workflow (or `.github/actions/setup/action.yml`) and this list.

## Spec and agent tooling

- OpenSpec CLI 1.14.1 (`npm install -g @fission-ai/openspec@1.14.1`; chosen 2026-10-19 as the newest release at least two weeks old). Telemetry off (`openspec config set telemetry.enabled false`). Generated files: `openspec/`, `.claude/skills/openspec-*`, `.claude/commands/opsx/`, `.agents/skills/openspec-*`. Refresh with `openspec update` after upgrading the CLI, and review the diff.
- Matt Pocock's skills (MIT), vendored from `github.com/mattpocock/skills` at commit `5beb35b040e3de97e54fa9e386d7e42d15c295c2` (2026-10-19), copied unmodified into `.claude/skills/` and `.agents/skills/`: every skill in the repo's published engineering and productivity catalogs (27), including `to-spec`, `triage`, `wayfinder`, `implement-spec`, `prototype`, `diagnosing-bugs`, `pr`, `wizard`, `teach` and the rest (all 27 added on 2026-10-19; the first 12 earlier the same day). Not vendored: the repo's `misc/` and `in-progress/` folders (git guardrails, pre-commit setup, shoehorn migration, exercise scaffolding, and unfinished skills). Two contain shell templates that run only when invoked: `diagnosing-bugs/scripts/hitl-loop.template.sh` (prompts the founder through reproduction steps) and `wizard/template.sh` (a setup guide that can write `.env` values and GitHub secrets). To update, check out a newer reviewed commit, read the diff of these folders, and copy them again.
