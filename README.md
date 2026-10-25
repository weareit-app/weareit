# It

It is a shared path from the lives people want to the practical work that can make those lives possible. This repository is the open source MVP for the universal web and iOS app.

## Current MVP slice

The first build starts with an exploratory onboarding: people can explore personal and societal pains, choose possible futures, and see ways to help It or support its work. Before the persistence gate, selections stay on the device. Email verification is requested only when someone chooses to save their progress.

The product is not a generic goal tracker, a crisis service, or a paid membership. Support is optional and presented as **Support It**.

## Development

Requirements: Node.js 24 LTS and pnpm 11. The repository uses pnpm workspaces. `mise` is an optional convenience; it is used for the project owner's local setup but is not required for contributors.

```sh
corepack enable
pnpm install
cp .env.example .env
cp apps/app/.env.example apps/app/.env
pnpm dev
```

`pnpm dev` gets the database ready before it starts the API and the app. If Postgres is already reachable at `DATABASE_URL`, it uses that one. Otherwise, for a local `DATABASE_URL`, it starts the Postgres in `compose.yaml` with OrbStack or Docker. Then it runs any pending migrations and seeds an empty database. If something is still missing, it stops with one line saying what to do. The API runs the same check when it starts on its own, so a missing database fails once and clearly instead of on every request.

For your OrbStack setup, create/start a PostgreSQL 17 container in the OrbStack app with port `5432` forwarded to the Mac, a persistent volume mounted at `/var/lib/postgresql/data`, and these values: database `it_dev`, user `it`, password `it`. Set `DATABASE_URL=postgres://it:it@localhost:5432/it_dev` in `.env`. The API and app run directly on your Mac with `pnpm dev`.

Contributors who prefer Docker can let `pnpm dev` start the same PostgreSQL configuration from `compose.yaml`, or start it themselves with `pnpm db:up:docker`. `compose.yaml` names the project `weareit`, which Compose uses instead of the folder name (checked 2026-10-21 against Docker's [project name docs](https://docs.docker.com/compose/how-tos/project-name/)), so every checkout and worktree shares that one container and its data. Stop it with `pnpm db:down:docker`. Neither database option runs the API in a container. Set a long random `CMS_ADMIN_TOKEN` in `.env`, then open `/cms` in the web app to edit, validate, preview, publish, and roll back onboarding content. The app calls the API at `EXPO_PUBLIC_API_URL` in `apps/app/.env`; change that value to a reachable host address when using a physical iPhone. For Neon, put its pooled PostgreSQL connection URL in `DATABASE_URL`.

The seed command is intentionally one-time: it imports the sourced Tier 1 corpus and publishes version 1 only when the content database is empty. Later runs of `pnpm db:seed` fail instead of overwriting CMS edits, and `pnpm dev` skips the seed once content exists. Use the CMS for subsequent changes.

The database table types in `packages/database/src/db.ts` are generated, not written by hand. After adding a migration, run `pnpm db:types` with `TEST_DATABASE_URL` pointing at a Postgres server you can create databases on (the Docker one from `compose.yaml` works: `postgres://it:it@localhost:5432/postgres`); it migrates a scratch database named `it_codegen` there and regenerates the file. CI fails when the committed file differs.

The app lives in `apps/app`; shared product content and behavior live in packages under `packages/`. See [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/architecture/decisions.md](docs/architecture/decisions.md) for current project conventions and choices.

## Status

The CMS and published-content API are now scaffolded. Email OTP and persistence of a person's onboarding draft, payment processing, and deployment are still open. CMS access currently uses a server-side bootstrap token; replace it with role-based authentication before inviting outside editors. See [docs/roadmap/mvp.md](docs/roadmap/mvp.md) for the remaining sequence.
