import { sql, type Kysely } from "kysely";

// Five roadmap statuses, plus when a feature's status last changed and a note
// of what changed. Existing planned and idea fixes keep their meaning.
export async function up(db: Kysely<unknown>) {
  await db.schema
    .alterTable("content_fixes")
    .dropConstraint("content_fixes_feature_status_check")
    .execute();
  await db.schema
    .alterTable("content_fixes")
    .addColumn("status_changed_on", "date")
    .addColumn("status_note", "text")
    .execute();
  await db.schema
    .alterTable("content_fixes")
    .addCheckConstraint(
      "content_fixes_feature_status_check",
      sql`(kind = 'feature') = (feature_status in ('live', 'in-progress', 'planned', 'exploring', 'idea'))`,
    )
    .execute();
  await db.schema
    .alterTable("content_fixes")
    .addCheckConstraint(
      "content_fixes_status_detail_check",
      sql`kind = 'feature' or (status_changed_on is null and status_note is null)`,
    )
    .execute();
}

// Fails while any fix has one of the three new statuses; move those back to
// planned or idea first.
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
    .dropColumn("status_changed_on")
    .dropColumn("status_note")
    .execute();
  await db.schema
    .alterTable("content_fixes")
    .addCheckConstraint(
      "content_fixes_feature_status_check",
      sql`(kind = 'feature') = (feature_status in ('planned', 'idea'))`,
    )
    .execute();
}
