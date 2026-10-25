# CI actions

Every third-party action used in `.github/workflows/` and `.github/actions/` is pinned and reviewed here, and so is every container image a workflow runs (under "Images"). `tools/action-pins/check-action-pins.mjs` reads this file in CI. What CI runs and what it costs: the "Continuous integration" section of `dependency-policy.md`.

## Reviewing an action

Review an action before you pin it: read its `action.yml` and its source at the commit you pin, and check whether the bundled `dist/` that actually runs was compared with that source. Record it as one list item under "Pins": the action, version, full commit SHA, release date, and a note starting `Reviewed YYYY-MM-DD:` that says what you read, what the action does with the runner, and whether `dist/` was compared.

CI fails when a `uses:` line isn't `owner/repo@<40-character SHA> # vX.Y.Z` (local `./` actions are exempt), when its SHA isn't in this file, or when the SHA's list item has no `Reviewed YYYY-MM-DD:` note that mentions `dist/`. Whether the review was done well is for the code reviewer. The image rule is under "Images".

To update a pin, pick a newer release at least two weeks old, read its changes, resolve the tag to its commit SHA (`gh api repos/<owner>/<repo>/commits/<tag> --jq .sha`), review it, and update both the workflow (or `.github/actions/setup/action.yml`) and its list item.

## Pins

Each is the newest release at least two weeks old on 2026-10-20.

- `actions/checkout` v7.0.1, `3d3c42e5aac5ba805825da76410c181273ba90b1` (released 2026-07-20). Reviewed 2026-10-20: read `action.yml` and `src/` (`main.ts`, `git-source-provider.ts`, `git-auth-helper.ts`, `unsafe-pr-checkout-helper.ts`). It runs `git` to fetch the repository with the job's token. With `persist-credentials: false`, as CI sets it, it removes the token from the git config when the checkout finishes. It refuses to check out fork pull request code from a `pull_request_target` or `workflow_run` workflow unless `allow-unsafe-pr-checkout` is set. The 1.4 MB `dist/index.js` was not compared with the source.
- `actions/setup-node` v7.0.0, `820762786026740c76f36085b0efc47a31fe5020` (2026-07-14). v7.1.0 (2026-10-08) was too new. Reviewed 2026-10-20: read `action.yml` and `src/` (`main.ts`, `distributions/official_builds/official_builds.ts`, `distributions/base-distribution.ts`, `cache-utils.ts`, `authutil.ts`). It resolves the Node version from a manifest in `actions/node-versions` at its `main` branch, not a pinned commit, and downloads Node from that manifest or from nodejs.org. With `cache: pnpm` it runs `pnpm store path` and caches that folder. It writes an npm auth token only when `registry-url` is set, which CI doesn't set. The 3.5 MB `dist/setup/index.js` and 3.3 MB `dist/cache-save/index.js` were not compared with the source.
- `actions/upload-artifact` v7.0.1, `043fb46d1a93c77aae656e7c1c64a875d1fc6a0a` (2026-04-10). v7.0.2 (2026-10-07) was too new. Reviewed 2026-10-20: read `action.yml`, `src/upload/` and `src/shared/`. It finds the files matching `path` with `@actions/glob`, following symbolic links, and uploads them to GitHub's artifact storage through `@actions/artifact`. With `overwrite` it first deletes an artifact of the same name. CI uses it only when the `e2e` job fails. The 4.4 MB `dist/upload/index.js` was not compared with the source.
- `pnpm/action-setup` v6.1.0, `ea17c68df8912ef543352723c149a84f56e3d413` (2026-09-05), the only action not published by GitHub. It reads pnpm 11.25.0 from `packageManager`. Reviewed 2026-10-20: read `action.yml` and TypeScript `src/`. It installs pnpm with `npm ci` from a lockfile committed in the action, which carries the package's integrity hash. Our pnpm version matches that lockfile, so the action runs no self-update. The only network hosts in its bundled `dist/index.js` are the npm registry and GitHub's own services (Actions cache and Azure storage); the 1.4 MB bundle was not otherwise compared with the source.

## Images

Every `image:` (or single-image `container:`) in `.github/workflows/`, `.github/actions/` and `compose.yaml` is pinned by tag and digest, `name:<version tag>@sha256:<digest>`, using a release at least two weeks old. Resolve the digest from the registry, not a mirror, and record it here. `check-action-pins.mjs` fails when the tag has no `major.minor` version, when the digest isn't in a list item below, or when that item has no `Checked YYYY-MM-DD` note.

- `postgres` 17.11-alpine, `sha256:b0f9560a2de083e2cc7382e75f808c7381a32852a7ec49117deedb300e552b24` (pushed 2026-09-21), the multi-platform image index that Docker Hub's `library/postgres` returned for `17.11-alpine`. Checked 2026-10-21 against the Docker Hub tags API and the registry's manifest endpoint, which agreed. It is the major version `compose.yaml` runs locally. The "Typecheck, lint and unit tests" job runs it as a service container, so the Postgres tests in `packages/database/src` run in CI, and `compose.yaml` runs it for local development. Its password is a fixed test value, since the server is disposable and holds only test data.
