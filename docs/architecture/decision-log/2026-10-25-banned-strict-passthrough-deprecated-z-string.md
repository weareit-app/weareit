# 2026-10-25

Banned `.strict()`, `.passthrough()`, and the deprecated `z.string()` format methods everywhere, and `new ORPCError` in `apps/api-server`, through ESLint's `no-restricted-syntax` (weareit-app/weareit#147 and #170, task 7.3 of `repo-conventions`, second of three PRs).
