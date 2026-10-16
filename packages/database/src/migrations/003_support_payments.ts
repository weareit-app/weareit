import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<unknown>) {
  await db.schema
    .createTable("support_contributions")
    .addColumn("id", "text", (column) => column.primaryKey())
    .addColumn("user_id", "text", (column) =>
      column.references("user.id").onDelete("set null"),
    )
    .addColumn("processor", "text", (column) => column.notNull())
    .addColumn("frequency", "text", (column) => column.notNull())
    .addColumn("amount_minor", "integer", (column) => column.notNull())
    .addColumn("currency", "text", (column) => column.notNull())
    .addColumn("status", "text", (column) => column.notNull())
    .addColumn("stripe_customer_id", "text")
    .addColumn("stripe_checkout_session_id", "text")
    .addColumn("stripe_subscription_id", "text")
    .addColumn("stripe_payment_intent_id", "text")
    .addColumn("store_original_transaction_id", "text")
    .addColumn("store_transaction_id", "text")
    .addColumn("store_product_id", "text")
    .addColumn("revenuecat_app_user_id", "text")
    .addColumn("created_at", "timestamptz", (column) =>
      column.notNull().defaultTo(db.fn("now", [])),
    )
    .addColumn("updated_at", "timestamptz", (column) =>
      column.notNull().defaultTo(db.fn("now", [])),
    )
    .addCheckConstraint(
      "support_contributions_processor_check",
      sql`processor in ('stripe', 'app_store', 'play_store')`,
    )
    .addCheckConstraint(
      "support_contributions_frequency_check",
      sql`frequency in ('once', 'monthly')`,
    )
    .addCheckConstraint(
      "support_contributions_amount_check",
      sql`amount_minor between 100 and 100000`,
    )
    .addCheckConstraint(
      "support_contributions_currency_check",
      sql`currency ~ '^[a-z]{3}$'`,
    )
    .addCheckConstraint(
      "support_contributions_status_check",
      sql`status in ('pending', 'active', 'succeeded', 'past_due', 'cancel_scheduled', 'canceled', 'expired', 'failed', 'refunded')`,
    )
    .execute();

  await db.schema
    .createIndex("support_contributions_stripe_checkout_unique")
    .unique()
    .on("support_contributions")
    .column("stripe_checkout_session_id")
    .execute();
  await db.schema
    .createIndex("support_contributions_stripe_subscription_unique")
    .unique()
    .on("support_contributions")
    .column("stripe_subscription_id")
    .execute();
  await db.schema
    .createIndex("support_contributions_store_transaction_unique")
    .unique()
    .on("support_contributions")
    .columns(["processor", "store_original_transaction_id"])
    .execute();

  await db.schema
    .createTable("support_payment_events")
    .addColumn("processor", "text", (column) => column.notNull())
    .addColumn("event_id", "text", (column) => column.notNull())
    .addColumn("body_sha256", "text", (column) => column.notNull())
    .addColumn("received_at", "timestamptz", (column) =>
      column.notNull().defaultTo(db.fn("now", [])),
    )
    .addPrimaryKeyConstraint("support_payment_events_pk", [
      "processor",
      "event_id",
    ])
    .execute();

  await db.schema
    .createTable("support_transactions")
    .addColumn("id", "text", (column) => column.primaryKey())
    .addColumn("contribution_id", "text", (column) =>
      column
        .notNull()
        .references("support_contributions.id")
        .onDelete("restrict"),
    )
    .addColumn("processor", "text", (column) => column.notNull())
    .addColumn("provider_transaction_id", "text", (column) => column.notNull())
    .addColumn("amount_minor", "integer", (column) => column.notNull())
    .addColumn("currency", "text", (column) => column.notNull())
    .addColumn("status", "text", (column) => column.notNull())
    .addColumn("occurred_at", "timestamptz", (column) => column.notNull())
    .addColumn("recorded_at", "timestamptz", (column) =>
      column.notNull().defaultTo(db.fn("now", [])),
    )
    .addCheckConstraint(
      "support_transactions_processor_check",
      sql`processor in ('stripe', 'app_store', 'play_store')`,
    )
    .addCheckConstraint(
      "support_transactions_amount_check",
      sql`amount_minor >= 0`,
    )
    .addCheckConstraint(
      "support_transactions_status_check",
      sql`status in ('succeeded', 'failed', 'refunded', 'partially_refunded')`,
    )
    .addUniqueConstraint("support_transactions_provider_id_unique", [
      "processor",
      "provider_transaction_id",
    ])
    .execute();
}

export async function down(db: Kysely<unknown>) {
  await db.schema.dropTable("support_transactions").ifExists().execute();
  await db.schema.dropTable("support_payment_events").ifExists().execute();
  await db.schema.dropTable("support_contributions").ifExists().execute();
}
