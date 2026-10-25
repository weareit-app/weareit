import { fileURLToPath } from "node:url";
import { sql } from "kysely";
import { Cli } from "kysely-codegen";
import { createDatabase } from "../src/database";
import { migrateToLatest } from "../src/migrator";
import { testEnv } from "../src/test-env";

// Regenerates src/db.ts from a scratch database, migrated to latest on the
// disposable server named by TEST_DATABASE_URL, so the output never depends on
// the state of a developer's own database. With --verify it writes nothing and
// fails if the committed file differs. Options: kysely-codegen 0.20.0 README,
// "--overrides", "--custom-imports", and "Configuration file" (checked
// 2026-10-22); docs/architecture/dependency-policy.md has the pin.

const verify = process.argv.includes("--verify");
const serverUrl = testEnv.databaseUrl;
if (!serverUrl)
  throw new Error(
    "Set TEST_DATABASE_URL to a disposable Postgres server before generating table types.",
  );

const scratchName = "it_codegen";
const server = createDatabase(serverUrl);
await sql`drop database if exists ${sql.id(scratchName)} with (force)`.execute(
  server,
);
await sql`create database ${sql.id(scratchName)}`.execute(server);
const scratchUrl = new URL(serverUrl);
scratchUrl.pathname = `/${scratchName}`;
const scratch = createDatabase(scratchUrl.toString());

// Columns whose values a CHECK constraint or a schema narrows are typed with
// the @it/domain type that owns them. An override replaces the whole column
// type, so a nullable column says `| null` itself.
const content = "ContentGraph";
const overrides = {
  columns: {
    "content_domains.scope": `${content}["domains"][number]["scope"]`,
    "content_first_actions.evidence": `${content}["firstActions"][number]["evidence"]`,
    "content_fixes.kind": "FixKind",
    "content_fixes.feature_status": "FeatureStatus | null",
    "content_fixes.evidence": "EvidenceLevel",
    "roadmap_items.status": "FeatureStatus",
    "content_sources.source_type": `${content}["sources"][number]["sourceType"]`,
    "content_provenance.entity_type": `${content}["provenance"][number]["entityType"]`,
    "content_provenance.rights": `${content}["provenance"][number]["rights"]`,
    "content_provenance.review_status": `${content}["provenance"][number]["reviewStatus"]`,
    "support_contributions.processor": "PaymentProcessor",
    "support_contributions.frequency": "SupportFrequency",
    "support_contributions.status": "ContributionStatus",
    "support_transactions.processor": "PaymentProcessor",
    "support_transactions.status": "TransactionStatus",
    "support_payment_events.processor": "PaymentEventProcessor",
    // The singleton row (CHECK id = 1).
    "content_draft_state.id": "1",
    "content_revisions.content":
      "JSONColumnType<ContentGraph, ContentGraph, ContentGraph>",
    "published_content_versions.content":
      "JSONColumnType<ContentGraph, ContentGraph, ContentGraph>",
    // Read as stored: drafts saved before paths existed have none.
    "user_onboarding_drafts.draft":
      "JSONColumnType<OnboardingDraftInput, OnboardingDraft, OnboardingDraft>",
    // Calendar dates, read as YYYY-MM-DD text (see content-repository).
    "content_fixes.status_changed_on":
      "ColumnType<Date | null, string | null, string | null>",
    "roadmap_items.status_changed_on":
      "ColumnType<Date | null, string | null, string | null>",
  },
};

try {
  await migrateToLatest(scratch);
  await new Cli().generate({
    url: scratchUrl.toString(),
    dialect: "postgres",
    excludePattern: "public.kysely_migration*",
    outFile: fileURLToPath(new URL("../src/db.ts", import.meta.url)),
    customImports: {
      ContentGraph: "@it/domain/content",
      EvidenceLevel: "@it/domain/content",
      FeatureStatus: "@it/domain/content",
      FixKind: "@it/domain/content",
      OnboardingDraft: "@it/domain/onboarding",
      OnboardingDraftInput: "@it/domain/onboarding",
      ContributionStatus: "@it/domain/support",
      PaymentEventProcessor: "@it/domain/support",
      PaymentProcessor: "@it/domain/support",
      SupportFrequency: "@it/domain/support",
      TransactionStatus: "@it/domain/support",
    },
    overrides,
    // Appends "_table" to each table's interface name (an empty match keeps
    // the rest of the name's case), so content_pains is ContentPainsTable.
    singularize: { "/$/": "_table" },
    verify,
  });
} finally {
  // The scratch database stays until the next run drops it: dropping it here
  // races the pools' closing connections and fails the run.
  await scratch.destroy();
  await server.destroy();
}
