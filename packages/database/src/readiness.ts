import { sql } from "kysely";
import { DatabaseError } from "pg";
import { createDatabase } from "./database";
import { createMigrator } from "./migrator";

export type DatabaseReadiness =
  | { ready: true }
  | {
      ready: false;
      problem:
        | "unreachable"
        | "login-rejected"
        | "migrations-pending"
        | "no-published-content";
      message: string;
    };

// What stands between this database and a working API, checked before the
// API listens so a missing database fails once and clearly instead of on
// every request.
export async function checkDatabaseReadiness(
  connectionString: string,
): Promise<DatabaseReadiness> {
  const url = new URL(connectionString);
  const db = createDatabase(connectionString);
  try {
    try {
      await sql`select 1`.execute(db);
    } catch (error) {
      // A DatabaseError comes from the server, so Postgres is running and
      // turned this login or database name down.
      if (error instanceof DatabaseError)
        return {
          ready: false,
          problem: "login-rejected",
          message: `Postgres at ${url.host} rejected the login: ${error.message}. Check the user, password, and database name in DATABASE_URL.`,
        };
      return {
        ready: false,
        problem: "unreachable",
        message: `Can't reach Postgres at ${url.host}: ${describeConnectionError(error)}. ${
          isLocalDatabase(connectionString)
            ? "Run `pnpm dev` to start it, or set DATABASE_URL to a database that's running."
            : "Check DATABASE_URL, and check that the database is running."
        }`,
      };
    }
    const pending = (await createMigrator(db).getMigrations()).filter(
      (migration) => !migration.executedAt,
    );
    if (pending.length)
      return {
        ready: false,
        problem: "migrations-pending",
        message: `The database is missing ${pending.length} migration${pending.length === 1 ? "" : "s"}, starting with ${pending[0]!.name}. Run \`pnpm db:migrate\`.`,
      };
    const published = await db
      .selectFrom("published_content_versions")
      .select("version")
      .limit(1)
      .executeTakeFirst();
    if (!published) {
      // The seed only fills an empty database; content that is already
      // there gets published from the CMS instead.
      const drafted = await db
        .selectFrom("content_draft_state")
        .select("id")
        .executeTakeFirst();
      return {
        ready: false,
        problem: "no-published-content",
        message: drafted
          ? "Onboarding content exists but none is published. Publish it from /cms in the web app."
          : "No onboarding content is published yet. Run `pnpm db:seed`.",
      };
    }
    return { ready: true };
  } finally {
    await db.destroy();
  }
}

export function isLocalDatabase(connectionString: string) {
  return ["localhost", "127.0.0.1", "[::1]"].includes(
    new URL(connectionString).hostname,
  );
}

function describeConnectionError(error: unknown) {
  if (!(error instanceof Error)) return String(error);
  // Node tries each address localhost resolves to (IPv6, then IPv4) and,
  // when every attempt fails, raises one AggregateError (checked 2026-10-21
  // against the Node.js net docs, "autoSelectFamily"). pg passes it on with
  // an empty message and the code ECONNREFUSED (seen with Node 24 and pg 8).
  if ((error as { code?: string }).code === "ECONNREFUSED")
    return "nothing is accepting connections";
  return error.message;
}
