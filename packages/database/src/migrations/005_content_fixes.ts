import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<unknown>) {
  await db.schema
    .createTable("content_fixes")
    .addColumn("id", "text", (column) => column.primaryKey())
    .addColumn("title", "text", (column) => column.notNull())
    .addColumn("description", "text", (column) => column.notNull())
    .addColumn("kind", "text", (column) => column.notNull())
    .addColumn("feature_status", "text")
    .addColumn("evidence", "text", (column) => column.notNull())
    .addColumn("evidence_note", "text", (column) => column.notNull())
    .addColumn("sort_order", "integer", (column) => column.notNull())
    .addColumn("updated_at", "timestamptz", (column) =>
      column.notNull().defaultTo(db.fn("now", [])),
    )
    .addCheckConstraint(
      "content_fixes_kind_check",
      sql`kind in ('once', 'habit', 'group', 'feature')`,
    )
    .addCheckConstraint(
      "content_fixes_feature_status_check",
      sql`(kind = 'feature') = (feature_status in ('planned', 'idea'))`,
    )
    .addCheckConstraint(
      "content_fixes_evidence_check",
      sql`evidence in ('strong', 'some', 'limited', 'untested')`,
    )
    .execute();

  await db.schema
    .createTable("fix_dream_links")
    .addColumn("fix_id", "text", (column) =>
      column.notNull().references("content_fixes.id").onDelete("cascade"),
    )
    .addColumn("dream_id", "text", (column) =>
      column.notNull().references("content_dreams.id").onDelete("cascade"),
    )
    .addPrimaryKeyConstraint("fix_dream_links_pk", ["fix_id", "dream_id"])
    .execute();

  await db.schema
    .alterTable("content_provenance")
    .dropConstraint("content_provenance_entity_type_check")
    .execute();
  await db.schema
    .alterTable("content_provenance")
    .addCheckConstraint(
      "content_provenance_entity_type_check",
      sql`entity_type in ('domain', 'pain', 'dream', 'first_action', 'fix')`,
    )
    .execute();
}

export async function down(db: Kysely<unknown>) {
  await db
    .deleteFrom("content_provenance" as never)
    .where(sql`entity_type`, "=", "fix")
    .execute();
  await db.schema
    .alterTable("content_provenance")
    .dropConstraint("content_provenance_entity_type_check")
    .execute();
  await db.schema
    .alterTable("content_provenance")
    .addCheckConstraint(
      "content_provenance_entity_type_check",
      sql`entity_type in ('domain', 'pain', 'dream', 'first_action')`,
    )
    .execute();
  await db.schema.dropTable("fix_dream_links").ifExists().execute();
  await db.schema.dropTable("content_fixes").ifExists().execute();
}
