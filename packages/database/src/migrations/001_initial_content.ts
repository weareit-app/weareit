import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<unknown>) {
  await db.schema
    .createTable("content_domains")
    .addColumn("id", "text", (column) => column.primaryKey())
    .addColumn("scope", "text", (column) => column.notNull())
    .addColumn("title", "text", (column) => column.notNull())
    .addColumn("sort_order", "integer", (column) => column.notNull())
    .addColumn("updated_at", "timestamptz", (column) =>
      column.notNull().defaultTo(db.fn("now", [])),
    )
    .addCheckConstraint(
      "content_domains_scope_check",
      sql`scope in ('personal', 'world')`,
    )
    .execute();

  await db.schema
    .createTable("content_pains")
    .addColumn("id", "text", (column) => column.primaryKey())
    .addColumn("domain_id", "text", (column) =>
      column.notNull().references("content_domains.id").onDelete("cascade"),
    )
    .addColumn("title", "text", (column) => column.notNull())
    .addColumn("description", "text", (column) => column.notNull())
    .addColumn("sort_order", "integer", (column) => column.notNull())
    .addColumn("updated_at", "timestamptz", (column) =>
      column.notNull().defaultTo(db.fn("now", [])),
    )
    .execute();

  await db.schema
    .createTable("content_dreams")
    .addColumn("id", "text", (column) => column.primaryKey())
    .addColumn("title", "text", (column) => column.notNull())
    .addColumn("description", "text", (column) => column.notNull())
    .addColumn("sort_order", "integer", (column) => column.notNull())
    .addColumn("updated_at", "timestamptz", (column) =>
      column.notNull().defaultTo(db.fn("now", [])),
    )
    .execute();

  await db.schema
    .createTable("pain_dream_links")
    .addColumn("pain_id", "text", (column) =>
      column.notNull().references("content_pains.id").onDelete("cascade"),
    )
    .addColumn("dream_id", "text", (column) =>
      column.notNull().references("content_dreams.id").onDelete("cascade"),
    )
    .addPrimaryKeyConstraint("pain_dream_links_pk", ["pain_id", "dream_id"])
    .execute();

  await db.schema
    .createTable("content_first_actions")
    .addColumn("id", "text", (column) => column.primaryKey())
    .addColumn("title", "text", (column) => column.notNull())
    .addColumn("description", "text", (column) => column.notNull())
    .addColumn("first_step", "text", (column) => column.notNull())
    .addColumn("effort_minutes", "integer", (column) => column.notNull())
    .addColumn("evidence", "text", (column) => column.notNull())
    .addColumn("safety_note", "text")
    .addColumn("sort_order", "integer", (column) => column.notNull())
    .addColumn("updated_at", "timestamptz", (column) =>
      column.notNull().defaultTo(db.fn("now", [])),
    )
    .addCheckConstraint(
      "content_first_actions_evidence_check",
      sql`evidence in ('candidate', 'practical')`,
    )
    .addCheckConstraint(
      "content_first_actions_effort_check",
      sql`effort_minutes between 1 and 120`,
    )
    .execute();

  await db.schema
    .createTable("action_pain_links")
    .addColumn("action_id", "text", (column) =>
      column
        .notNull()
        .references("content_first_actions.id")
        .onDelete("cascade"),
    )
    .addColumn("pain_id", "text", (column) =>
      column.notNull().references("content_pains.id").onDelete("cascade"),
    )
    .addPrimaryKeyConstraint("action_pain_links_pk", ["action_id", "pain_id"])
    .execute();

  await db.schema
    .createTable("content_sources")
    .addColumn("id", "text", (column) => column.primaryKey())
    .addColumn("title", "text", (column) => column.notNull())
    .addColumn("document_path", "text", (column) => column.notNull())
    .addColumn("source_type", "text", (column) => column.notNull())
    .addColumn("rights", "text", (column) => column.notNull())
    .addColumn("updated_at", "timestamptz", (column) =>
      column.notNull().defaultTo(db.fn("now", [])),
    )
    .addCheckConstraint(
      "content_sources_type_check",
      sql`source_type in ('research_registry', 'content_spec', 'fix_corpus')`,
    )
    .execute();

  await db.schema
    .createTable("content_provenance")
    .addColumn("entity_type", "text", (column) => column.notNull())
    .addColumn("entity_id", "text", (column) => column.notNull())
    .addColumn("source_id", "text", (column) =>
      column.notNull().references("content_sources.id").onDelete("restrict"),
    )
    .addColumn("locator", "text", (column) => column.notNull())
    .addColumn("evidence_type", "text", (column) => column.notNull())
    .addColumn("rights", "text", (column) => column.notNull())
    .addColumn("review_status", "text", (column) => column.notNull())
    .addPrimaryKeyConstraint("content_provenance_pk", [
      "entity_type",
      "entity_id",
      "source_id",
      "locator",
    ])
    .addCheckConstraint(
      "content_provenance_entity_type_check",
      sql`entity_type in ('domain', 'pain', 'dream', 'first_action')`,
    )
    .addCheckConstraint(
      "content_provenance_rights_check",
      sql`rights in ('CC0-1.0', 'CC-BY-SA-4.0')`,
    )
    .addCheckConstraint(
      "content_provenance_review_status_check",
      sql`review_status in ('unreviewed', 'reviewed', 'approved')`,
    )
    .execute();

  await db.schema
    .createTable("content_draft_state")
    .addColumn("id", "integer", (column) => column.primaryKey())
    .addColumn("revision", "integer", (column) => column.notNull())
    .addColumn("updated_at", "timestamptz", (column) =>
      column.notNull().defaultTo(db.fn("now", [])),
    )
    .addCheckConstraint("content_draft_state_singleton_check", sql`id = 1`)
    .execute();

  await db.schema
    .createTable("content_revisions")
    .addColumn("revision", "integer", (column) => column.primaryKey())
    .addColumn("content", "jsonb", (column) => column.notNull())
    .addColumn("created_by", "text", (column) => column.notNull())
    .addColumn("change_note", "text", (column) => column.notNull())
    .addColumn("created_at", "timestamptz", (column) =>
      column.notNull().defaultTo(db.fn("now", [])),
    )
    .execute();

  await db.schema
    .createTable("published_content_versions")
    .addColumn("version", "serial", (column) => column.primaryKey())
    .addColumn("source_revision", "integer", (column) =>
      column.notNull().references("content_revisions.revision"),
    )
    .addColumn("content", "jsonb", (column) => column.notNull())
    .addColumn("checksum", "text", (column) => column.notNull())
    .addColumn("published_by", "text", (column) => column.notNull())
    .addColumn("rollback_from", "integer")
    .addColumn("published_at", "timestamptz", (column) =>
      column.notNull().defaultTo(db.fn("now", [])),
    )
    .execute();
}

export async function down(db: Kysely<unknown>) {
  await db.schema.dropTable("published_content_versions").ifExists().execute();
  await db.schema.dropTable("content_revisions").ifExists().execute();
  await db.schema.dropTable("content_draft_state").ifExists().execute();
  await db.schema.dropTable("content_provenance").ifExists().execute();
  await db.schema.dropTable("content_sources").ifExists().execute();
  await db.schema.dropTable("action_pain_links").ifExists().execute();
  await db.schema.dropTable("content_first_actions").ifExists().execute();
  await db.schema.dropTable("pain_dream_links").ifExists().execute();
  await db.schema.dropTable("content_dreams").ifExists().execute();
  await db.schema.dropTable("content_pains").ifExists().execute();
  await db.schema.dropTable("content_domains").ifExists().execute();
}
