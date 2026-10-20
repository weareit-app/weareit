import { sql, type Kysely } from "kysely";

const statuses = sql`('live', 'in-progress', 'planned', 'exploring', 'idea')`;

// Roadmap items, and each Feature fix's optional connection to one. A
// connected fix has no status, date or note of its own: it takes its item's.
export async function up(db: Kysely<unknown>) {
  await db.schema
    .createTable("roadmap_items")
    .addColumn("id", "text", (column) => column.primaryKey())
    .addColumn("title", "text", (column) => column.notNull())
    .addColumn("line", "text", (column) => column.notNull())
    .addColumn("status", "text", (column) => column.notNull())
    .addColumn("status_changed_on", "date")
    .addColumn("status_note", "text")
    .addColumn("sort_order", "integer", (column) => column.notNull())
    .addColumn("updated_at", "timestamptz", (column) =>
      column.notNull().defaultTo(db.fn("now", [])),
    )
    .addCheckConstraint(
      "roadmap_items_status_check",
      sql`status in ${statuses}`,
    )
    .execute();

  await db.schema
    .alterTable("content_fixes")
    .addColumn("roadmap_item_id", "text", (column) =>
      column.references("roadmap_items.id").onDelete("restrict"),
    )
    .execute();
  for (const constraint of [
    "content_fixes_status_detail_check",
    "content_fixes_feature_status_check",
  ])
    await db.schema
      .alterTable("content_fixes")
      .dropConstraint(constraint)
      .execute();
  await db.schema
    .alterTable("content_fixes")
    .addCheckConstraint(
      "content_fixes_feature_status_check",
      sql`case when kind = 'feature'
        then (roadmap_item_id is null) = (feature_status is not null)
          and coalesce(feature_status in ${statuses}, true)
        else feature_status is null and roadmap_item_id is null end`,
    )
    .execute();
  await db.schema
    .alterTable("content_fixes")
    .addCheckConstraint(
      "content_fixes_status_detail_check",
      sql`(kind = 'feature' and roadmap_item_id is null) or (status_changed_on is null and status_note is null)`,
    )
    .execute();
}

// Fails while any fix is connected; disconnect them (or roll the content back
// to a version without roadmap items) first.
export async function down(db: Kysely<unknown>) {
  for (const constraint of [
    "content_fixes_status_detail_check",
    "content_fixes_feature_status_check",
  ])
    await db.schema
      .alterTable("content_fixes")
      .dropConstraint(constraint)
      .execute();
  await db.schema
    .alterTable("content_fixes")
    .addCheckConstraint(
      "content_fixes_feature_status_check",
      sql`(kind = 'feature') = (feature_status in ${statuses})`,
    )
    .execute();
  await db.schema
    .alterTable("content_fixes")
    .addCheckConstraint(
      "content_fixes_status_detail_check",
      sql`kind = 'feature' or (status_changed_on is null and status_note is null)`,
    )
    .execute();
  await db.schema
    .alterTable("content_fixes")
    .dropColumn("roadmap_item_id")
    .execute();
  await db.schema.dropTable("roadmap_items").execute();
}
