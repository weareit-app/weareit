# 2026-10-30

Renamed `pnpm verify` to `pnpm check` (and `tools/verify/` to `tools/check/`), with what it runs unchanged. The founder agreed that every It JavaScript and TypeScript project uses the same pnpm conventions and that the one command to run everything is `pnpm check`, named after the CI job it mirrors and following this repo's implementation; that cross-project decision is recorded in the It workspace's decisions log.
