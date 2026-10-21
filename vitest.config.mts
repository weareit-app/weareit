import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: [
      "packages/domain/tests/**/*.test.ts",
      "packages/content/tests/**/*.test.ts",
      "packages/database/tests/**/*.test.ts",
      "packages/api/tests/**/*.test.ts",
      "apps/api-server/tests/**/*.test.ts",
      "apps/app/src/payments/**/*.test.ts",
      "apps/app/src/theme/**/*.test.ts",
      "apps/app/src/essays/**/*.test.ts",
      "packages/watercolor/tests/**/*.test.ts",
      "tools/watercolor-sim/tests/**/*.test.ts",
      "tools/action-pins/tests/**/*.test.ts",
      "tools/typecheck-coverage/tests/**/*.test.ts",
      "tools/story-coverage/tests/**/*.test.ts",
    ],
    environment: "node",
  },
});
