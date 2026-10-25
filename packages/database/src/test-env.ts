// The one file tests read `process.env` from. Everything else gets its config
// passed in.
export const testEnv = {
  /** A disposable Postgres server the tests may create databases on. */
  databaseUrl: process.env.TEST_DATABASE_URL || undefined,
  /** Set by CI providers, GitHub Actions among them. */
  ci: Boolean(process.env.CI) && process.env.CI !== "false",
};
