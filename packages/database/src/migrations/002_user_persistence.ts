import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<unknown>) {
  await db.schema
    .createTable("user")
    .addColumn("id", "text", (column) => column.primaryKey())
    .addColumn("name", "text", (column) => column.notNull())
    .addColumn("email", "text", (column) => column.notNull().unique())
    .addColumn("emailVerified", "boolean", (column) =>
      column.notNull().defaultTo(false),
    )
    .addColumn("image", "text")
    .addColumn("createdAt", "timestamp", (column) =>
      column.notNull().defaultTo(db.fn("now", [])),
    )
    .addColumn("updatedAt", "timestamp", (column) =>
      column.notNull().defaultTo(db.fn("now", [])),
    )
    .execute();

  await db.schema
    .createTable("session")
    .addColumn("id", "text", (column) => column.primaryKey())
    .addColumn("expiresAt", "timestamp", (column) => column.notNull())
    .addColumn("token", "text", (column) => column.notNull().unique())
    .addColumn("createdAt", "timestamp", (column) =>
      column.notNull().defaultTo(db.fn("now", [])),
    )
    .addColumn("updatedAt", "timestamp", (column) =>
      column.notNull().defaultTo(db.fn("now", [])),
    )
    .addColumn("ipAddress", "text")
    .addColumn("userAgent", "text")
    .addColumn("userId", "text", (column) =>
      column.notNull().references("user.id").onDelete("cascade"),
    )
    .execute();
  await db.schema
    .createIndex("session_userId_index")
    .on("session")
    .column("userId")
    .execute();

  await db.schema
    .createTable("account")
    .addColumn("id", "text", (column) => column.primaryKey())
    .addColumn("accountId", "text", (column) => column.notNull())
    .addColumn("providerId", "text", (column) => column.notNull())
    .addColumn("userId", "text", (column) =>
      column.notNull().references("user.id").onDelete("cascade"),
    )
    .addColumn("accessToken", "text")
    .addColumn("refreshToken", "text")
    .addColumn("idToken", "text")
    .addColumn("accessTokenExpiresAt", "timestamp")
    .addColumn("refreshTokenExpiresAt", "timestamp")
    .addColumn("scope", "text")
    .addColumn("password", "text")
    .addColumn("createdAt", "timestamp", (column) =>
      column.notNull().defaultTo(db.fn("now", [])),
    )
    .addColumn("updatedAt", "timestamp", (column) =>
      column.notNull().defaultTo(db.fn("now", [])),
    )
    .execute();
  await db.schema
    .createIndex("account_userId_index")
    .on("account")
    .column("userId")
    .execute();

  await db.schema
    .createTable("verification")
    .addColumn("id", "text", (column) => column.primaryKey())
    .addColumn("identifier", "text", (column) => column.notNull())
    .addColumn("value", "text", (column) => column.notNull())
    .addColumn("expiresAt", "timestamp", (column) => column.notNull())
    .addColumn("createdAt", "timestamp", (column) =>
      column.notNull().defaultTo(db.fn("now", [])),
    )
    .addColumn("updatedAt", "timestamp", (column) =>
      column.notNull().defaultTo(db.fn("now", [])),
    )
    .execute();
  await db.schema
    .createIndex("verification_identifier_index")
    .on("verification")
    .column("identifier")
    .execute();

  await db.schema
    .createTable("user_onboarding_drafts")
    .addColumn("id", "serial", (column) => column.primaryKey())
    .addColumn("user_id", "text", (column) =>
      column.notNull().unique().references("user.id").onDelete("cascade"),
    )
    .addColumn("content_version", "integer", (column) =>
      column.notNull().references("published_content_versions.version"),
    )
    .addColumn("draft", "jsonb", (column) => column.notNull())
    .addColumn("saved_at", "timestamptz", (column) =>
      column.notNull().defaultTo(db.fn("now", [])),
    )
    .addCheckConstraint(
      "user_onboarding_drafts_payload_object_check",
      sql`jsonb_typeof(draft) = 'object'`,
    )
    .execute();
}

export async function down(db: Kysely<unknown>) {
  await db.schema.dropTable("user_onboarding_drafts").ifExists().execute();
  await db.schema.dropTable("verification").ifExists().execute();
  await db.schema.dropTable("account").ifExists().execute();
  await db.schema.dropTable("session").ifExists().execute();
  await db.schema.dropTable("user").ifExists().execute();
}
