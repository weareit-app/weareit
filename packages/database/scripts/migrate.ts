import { createDatabase } from "../src/database";
import { migrateToLatest } from "../src/migrator";

const connectionString = process.env.DATABASE_URL;
if (!connectionString)
  throw new Error("Set DATABASE_URL before running migrations.");
const db = createDatabase(connectionString);

try {
  await migrateToLatest(db);
} finally {
  await db.destroy();
}
