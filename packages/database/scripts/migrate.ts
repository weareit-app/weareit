import { createDatabase } from "../src/database";
import { migrateToLatest } from "../src/migrator";
import { createLog } from "@it/log/log";
import { readEnv } from "./env";

const env = readEnv();
const log = createLog({ level: "info" });
const db = createDatabase(env.DATABASE_URL);

try {
  for (const name of await migrateToLatest(db))
    log.info("migrated", { migration: name });
} finally {
  await db.destroy();
}
