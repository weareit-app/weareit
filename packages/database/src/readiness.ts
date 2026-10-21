import { sql } from "kysely";
import { createDatabase } from "./database";
import { createMigrator } from "./migrator";

export type DatabaseReadiness =
  | { ready: true }
  | {
      ready: false;
      problem: "unreachable" | "migrations-pending" | "no-published-content";
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
      return {
        ready: false,
        problem: "unreachable",
        message: `Can't reach Postgres at ${url.host}. ${describe(error)} Run \`pnpm dev\` to start the local database, or set DATABASE_URL to a running one.`,
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

function describe(error: unknown) {
  if (!(error instanceof Error)) return String(error);
  // pg reports a refused localhost connection (IPv4 and IPv6 both tried) as
  // an AggregateError with an empty message, seen with Node 24 and pg 8.
  if ((error as { code?: string }).code === "ECONNREFUSED")
    return "Nothing is accepting connections there.";
  return error.message;
}
