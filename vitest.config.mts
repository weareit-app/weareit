import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: [
      "packages/domain/tests/**/*.test.ts",
      "packages/content/tests/**/*.test.ts",
      "packages/database/tests/**/*.test.ts",
      "apps/api-server/tests/**/*.test.ts",
      "apps/app/src/payments/**/*.test.ts",
    ],
    environment: "node",
  },
});
