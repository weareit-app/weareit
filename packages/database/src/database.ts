import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { DB } from "./db";

export function createDatabase(connectionString: string) {
  return new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({ connectionString, max: 10 }),
    }),
  });
}

export type ItDatabase = ReturnType<typeof createDatabase>;
