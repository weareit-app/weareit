import type { Kysely } from "kysely";

export async function up(db: Kysely<unknown>) {
  await db.schema
    .alterTable("support_contributions")
    .addColumn("last_payment_event_at", "timestamptz")
    .execute();
}

export async function down(db: Kysely<unknown>) {
  await db.schema
    .alterTable("support_contributions")
    .dropColumn("last_payment_event_at")
    .execute();
}
