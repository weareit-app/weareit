import { createDatabase } from "../src/database";
import { migrateToLatest } from "../src/migrator";
import { createLog } from "@it/log";

const log = createLog({ level: "info" });

const connectionString = process.env.DATABASE_URL;
if (!connectionString)
  throw new Error("Set DATABASE_URL before running migrations.");
const db = createDatabase(connectionString);

try {
  for (const name of await migrateToLatest(db))
    log.info("migrated", { migration: name });
} finally {
  await db.destroy();
}
