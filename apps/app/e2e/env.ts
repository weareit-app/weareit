// The Playwright run's environment: the one file it reads `process.env` from.
// Set E2E_PORT to run beside something else on 4173, such as another
// worktree's tests or the brand-preview server in .claude/launch.json.
export const e2ePort = Number(process.env.E2E_PORT ?? 4173);
