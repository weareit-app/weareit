import { createDatabase } from "../src/database";
import { createMigrator } from "../src/migrator";

const connectionString = process.env.DATABASE_URL;
if (!connectionString)
  throw new Error("Set DATABASE_URL before running migrations.");
const db = createDatabase(connectionString);

try {
  const { error, results } = await createMigrator(db).migrateToLatest();
  for (const result of results ?? [])
    console.log(`${result.status}: ${result.migrationName}`);
  if (error) throw error;
} finally {
  await db.destroy();
}
