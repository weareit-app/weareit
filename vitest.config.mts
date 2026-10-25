import { defineConfig } from "vitest/config";

// Vitest runs every `*.test.ts` in these globs, so a test in a new folder runs
// without a config change. The app's `*.test.tsx` component tests belong to
// jest-expo (apps/app/jest.config.cjs) and its `e2e/*.spec.ts` to Playwright.
const logic = (name: string, include: string) => ({
  extends: true,
  test: { name, include: [include] },
});

export default defineConfig({
  test: {
    environment: "node",
    projects: [
      logic("packages", "packages/*/**/*.test.ts"),
      logic("api-server", "apps/api-server/**/*.test.ts"),
      logic("tools", "tools/*/**/*.test.ts"),
      logic("app", "apps/app/**/*.test.ts"),
    ],
  },
});
