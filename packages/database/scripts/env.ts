import { z } from "zod";

// The database scripts' environment (docs/architecture/decisions.md, #171).
// Each script calls `readEnv` once at its start; no other script file reads
// `process.env`. They share the root `.env` with the API server, because both
// read DATABASE_URL. Errors name the variable and rule, never the value.

export const databaseEnvSchema = z.object({
  DATABASE_URL: z.url({
    protocol: /^postgres(ql)?$/,
    error: (issue) =>
      issue.input === undefined ? "is required" : "must be a postgres:// URL",
  }),
});

export type DatabaseEnv = z.output<typeof databaseEnvSchema>;

export class InvalidEnvError extends Error {
  constructor(error: z.ZodError) {
    super(
      `Invalid environment variables (set them in the root .env; .env.example lists them):\n${z.prettifyError(error)}`,
    );
    this.name = "InvalidEnvError";
  }
}

// An empty string counts as unset, so `KEY=` in a `.env` file is the same as
// leaving the line out.
export function parseEnv(
  source: Record<string, string | undefined>,
): DatabaseEnv {
  const result = databaseEnvSchema.safeParse(
    Object.fromEntries(
      Object.entries(source).filter(([, value]) => value !== ""),
    ),
  );
  if (!result.success) throw new InvalidEnvError(result.error);
  return result.data;
}

// Stops the script with just the list of problems: no stack trace, and
// nothing that could hold a value.
export function readEnv(): DatabaseEnv {
  try {
    return parseEnv(process.env);
  } catch (error) {
    if (!(error instanceof InvalidEnvError)) throw error;
    console.error(error.message);
    process.exit(1);
  }
}
