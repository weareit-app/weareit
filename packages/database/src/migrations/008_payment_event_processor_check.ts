import { sql, type Kysely } from "kysely";

// Limits support_payment_events.processor to the webhooks that write it, the
// values of @it/domain's payment event processor enum.
export async function up(db: Kysely<unknown>) {
  await db.schema
    .alterTable("support_payment_events")
    .addCheckConstraint(
      "support_payment_events_processor_check",
      sql`processor in ('stripe', 'revenuecat')`,
    )
    .execute();
}

export async function down(db: Kysely<unknown>) {
  await db.schema
    .alterTable("support_payment_events")
    .dropConstraint("support_payment_events_processor_check")
    .execute();
}
