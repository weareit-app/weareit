import { defineConfig } from "@playwright/test";
import { e2ePort as port } from "./e2e/env";
const baseUrl = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./e2e",
  // CI uploads this folder when a test fails (.github/workflows/ci.yml).
  outputDir: "./test-results",
  fullyParallel: true,
  reporter: "list",
  use: {
    // biome-ignore lint/style/useNamingConvention: Playwright names this option.
    baseURL: baseUrl,
    browserName: "chromium",
    trace: "retain-on-failure",
  },
  webServer: {
    command: `pnpm exec expo start --web --port ${port}`,
    url: baseUrl,
    // Always start this checkout's own server: a server already on the port may be
    // another worktree's, and the tests would silently run against its code.
    reuseExistingServer: false,
    timeout: 120_000,
    env: { EXPO_PUBLIC_API_URL: "http://localhost:3001/rpc" },
  },
});
