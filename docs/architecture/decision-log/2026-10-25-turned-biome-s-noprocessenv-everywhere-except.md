# 2026-10-25

Turned on Biome's `noProcessEnv` everywhere except the `env.ts` files and `test-env.ts` (weareit-app/weareit#171, task 7.5 of `repo-conventions`). The Playwright run got its own `apps/app/e2e/env.ts`, the API client reads the platform from `Platform.OS`, and the table types script reads `TEST_DATABASE_URL` through `test-env.ts`.
