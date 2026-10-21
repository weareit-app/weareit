import { defineConfig } from "@playwright/test";

// Set E2E_PORT to run beside something else on 4173, such as another worktree's tests
// or the brand-preview server in .claude/launch.json.
const port = Number(process.env.E2E_PORT ?? 4173);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./e2e",
  // CI uploads this folder when a test fails (.github/workflows/ci.yml).
  outputDir: "./test-results",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL,
    browserName: "chromium",
    trace: "retain-on-failure",
  },
  webServer: {
    command: `pnpm exec expo start --web --port ${port}`,
    url: baseURL,
    // Always start this checkout's own server: a server already on the port may be
    // another worktree's, and the tests would silently run against its code.
    reuseExistingServer: false,
    timeout: 120_000,
    env: { EXPO_PUBLIC_API_URL: "http://localhost:3001/rpc" },
  },
});
