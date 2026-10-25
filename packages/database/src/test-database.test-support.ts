import { sql, type Migrator } from "kysely";
import { createDatabase, type ItDatabase } from "./database";
import { createMigrator } from "./migrator";
import { testEnv } from "./test-env";

// The Postgres tests skip without a server, so a laptop without Postgres can
// still run the unit tests. In CI a missing server fails the run instead, so
// the tests can't pass by skipping.
export function testDatabaseUrl(env = testEnv): string | undefined {
  if (env.ci && !env.databaseUrl)
    throw new Error(
      "TEST_DATABASE_URL is not set. CI must run the Postgres tests, so give it a disposable Postgres server.",
    );
  return env.databaseUrl;
}

// Each test file gets its own empty database on the disposable server named
// by TEST_DATABASE_URL, so files can run in parallel.
export async function createTestDatabase(
  connectionString: string,
  name: string,
): Promise<{ db: ItDatabase; migrator: Migrator; databaseUrl: string }> {
  const server = createDatabase(connectionString);
  await sql`drop database if exists ${sql.id(name)} with (force)`.execute(
    server,
  );
  await sql`create database ${sql.id(name)}`.execute(server);
  await server.destroy();
  const url = new URL(connectionString);
  url.pathname = `/${name}`;
  const databaseUrl = url.toString();
  const db = createDatabase(databaseUrl);
  const migrator = createMigrator(db);
  return { db, migrator, databaseUrl };
}
