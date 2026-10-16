import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FileMigrationProvider, Migrator } from "kysely";
import { createDatabase } from "../src/database";

const connectionString = process.env.DATABASE_URL;
if (!connectionString)
  throw new Error("Set DATABASE_URL before running migrations.");
const db = createDatabase(connectionString);
const migrationFolder = fileURLToPath(
  new URL("../src/migrations", import.meta.url),
);

try {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({ fs, path, migrationFolder }),
  });
  const { error, results } = await migrator.migrateToLatest();
  for (const result of results ?? [])
    console.log(`${result.status}: ${result.migrationName}`);
  if (error) throw error;
} finally {
  await db.destroy();
}
