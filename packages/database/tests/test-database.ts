import { sql, type Migrator } from "kysely";
import { createDatabase, type ItDatabase } from "../src/database";
import { createMigrator } from "../src/migrator";

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
