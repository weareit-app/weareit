import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  // CI uploads this folder when a test fails (.github/workflows/ci.yml).
  outputDir: "./test-results",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    browserName: "chromium",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "pnpm exec expo start --web --port 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: { EXPO_PUBLIC_API_URL: "http://localhost:3001/rpc" },
  },
});
