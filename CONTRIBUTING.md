# Contributing

Thanks for helping build It. The project is early, so small, focused contributions are easiest to review.

## Setup

Use Node.js 24 LTS and pnpm 11. You can install them with Corepack, mise, or another tool you prefer. `mise` is optional and only documents the maintainer's local versions.

```sh
corepack enable
pnpm install
pnpm dev
```

The app targets iOS and responsive web through Expo Router. Use the Expo Go app for the first native iteration; we will add a development build only when a feature requires native code outside Expo Go.

## Checks and tests

Run the complete test suite with:

```sh
pnpm test
```

This runs Vitest tests for shared domain and content logic, Jest with `jest-expo` for native components, and Playwright flows against the Expo web app. Install Playwright's browser once on a new machine with `pnpm exec playwright install chromium`. The browser tests start their own app server on port 4173 and fail if that port is taken; set `E2E_PORT` to use another, for example `E2E_PORT=4174 pnpm test:e2e` when another worktree is running its tests.

Run the TypeScript and formatting checks with:

```sh
pnpm run typecheck
pnpm run lint
```

`pnpm install` also installs a git pre-commit hook ([Lefthook](https://lefthook.dev), configured in `lefthook.yml`). The hook formats the staged JavaScript and TypeScript files with Prettier and restages them, then, when the commit includes code, runs the typecheck and the Vitest unit tests. `.prettierignore` decides which files Prettier formats, both in the hook and in `pnpm run lint` (which CI runs); docs are not Prettier-formatted. To skip it once, use `git commit --no-verify`.

## Project boundaries

- `apps/app` owns routes and platform presentation.
- `packages/content` owns the versioned, provenance-aware public MVP content.
- `packages/domain` owns product rules and transformations without React or provider dependencies.
- Server-only packages own database and API integrations; client packages must never import them.
- Keep pre-signup personal choices on device. Do not add analytics or remote persistence for those choices without updating the privacy decision and UI copy.
- Keep standalone packages independent of the AGPL application. In particular, an Apache-2.0 package must not import AGPL code.

## Licensing and contribution terms

Working license decisions are recorded in `docs/architecture/licensing.md`. The exact App Store exception and DCO-versus-CLA policy are still being prepared. Until those are published, do not accept outside contributions into the codebase.

## Pull requests

Explain the user problem, the change, and any privacy or content implications. Include screenshots for UI changes. Run checks relevant to the changed package and report what you ran. Do not add tests for unrelated code.
