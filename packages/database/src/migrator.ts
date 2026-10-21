import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FileMigrationProvider, Migrator } from "kysely";
import type { ItDatabase } from "./database";

export function createMigrator(db: ItDatabase) {
  return new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: fileURLToPath(new URL("./migrations", import.meta.url)),
    }),
  });
}
