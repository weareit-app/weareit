import { sql } from "kysely";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  contentDomainSchema,
  contentFirstActionSchema,
  contentFixSchema,
  contentProvenanceSchema,
  contentRoadmapItemSchema,
  contentSourceSchema,
} from "@it/domain/content";
import {
  contributionStatusSchema,
  paymentEventProcessorSchema,
  paymentProcessorSchema,
  supportFrequencySchema,
  transactionStatusSchema,
} from "@it/domain/support";
import type { ItDatabase } from "../src/database";
import { migrateToLatest } from "../src/migrator";
import { createTestDatabase } from "./test-database";

// Runs against a disposable Postgres server, for example:
// docker run --rm -e POSTGRES_PASSWORD=it -p 54346:5432 postgres:17-alpine
// TEST_DATABASE_URL=postgres://postgres:it@localhost:54346/postgres pnpm test:unit
const connectionString = process.env.TEST_DATABASE_URL;

// The Zod enum each enum CHECK constraint must list exactly, by table.column.
// A new CHECK enum fails the test until it is added here.
const domainEnums: Record<string, readonly string[]> = {
  "content_domains.scope": contentDomainSchema.shape.scope.options,
  "content_first_actions.evidence":
    contentFirstActionSchema.shape.evidence.options,
  "content_fixes.kind": contentFixSchema.shape.kind.options,
  "content_fixes.feature_status":
    contentFixSchema.shape.featureStatus.unwrap().options,
  "content_fixes.evidence": contentFixSchema.shape.evidence.options,
  "roadmap_items.status": contentRoadmapItemSchema.shape.status.options,
  "content_sources.source_type": contentSourceSchema.shape.sourceType.options,
  "content_provenance.entity_type":
    contentProvenanceSchema.shape.entityType.options,
  "content_provenance.rights": contentProvenanceSchema.shape.rights.options,
  "content_provenance.review_status":
    contentProvenanceSchema.shape.reviewStatus.options,
  "support_contributions.processor": paymentProcessorSchema.options,
  "support_contributions.frequency": supportFrequencySchema.options,
  "support_contributions.status": contributionStatusSchema.options,
  "support_payment_events.processor": paymentEventProcessorSchema.options,
  "support_transactions.processor": paymentProcessorSchema.options,
  "support_transactions.status": transactionStatusSchema.options,
};

// Postgres stores `column in ('a', 'b')` as
// `column = ANY (ARRAY['a'::text, 'b'::text])` for a text column and as
// `(column)::text = ANY ((ARRAY['a'::character varying, …])::text[])` for a
// varchar one, also inside larger checks. A one-value list is stored as
// `column = 'a'::text`, which can't be told apart from other comparisons, so
// an enum CHECK needs at least two values to be found here.
const anyArray = /\(?\b(\w+)\)?(?:::\w+)? = ANY \(\(?ARRAY\[([^\]]*)\]/g;
const textLiteral = /'((?:[^']|'')*)'::(?:text|character varying)/g;

describe.skipIf(!connectionString)("CHECK enums in Postgres", () => {
  let db: ItDatabase;
  const sqlEnums = new Map<string, string[]>();
  // CHECK definitions with an `= ANY` list the pattern above can't read, and
  // columns that more than one CHECK lists values for.
  const unparsed: string[] = [];
  const repeated: string[] = [];

  beforeAll(async () => {
    ({ db } = await createTestDatabase(
      connectionString!,
      "it_test_check_enums",
    ));
    await migrateToLatest(db);
    const { rows } = await sql<{ table: string; definition: string }>`
      select conrelid::regclass::text as table,
             pg_get_constraintdef(oid) as definition
      from pg_constraint
      where contype = 'c' and connamespace = 'public'::regnamespace
        and conrelid <> 0
    `.execute(db);
    for (const { table, definition } of rows) {
      const lists = [...definition.matchAll(anyArray)];
      if (lists.length < definition.split(" = ANY (").length - 1)
        unparsed.push(`${table}: ${definition}`);
      for (const [, column, list] of lists) {
        const key = `${table}.${column}`;
        if (sqlEnums.has(key)) repeated.push(key);
        const values = [...list!.matchAll(textLiteral)].map(([, value]) =>
          value!.replaceAll("''", "'"),
        );
        sqlEnums.set(key, values);
      }
    }
  });

  afterAll(async () => {
    await db?.destroy();
  });

  it("reads every enum list, each column from one CHECK constraint", () => {
    expect(unparsed, "CHECK constraints with an unread ANY list").toEqual([]);
    expect(repeated, "columns listed by more than one CHECK").toEqual([]);
  });

  it("finds a Zod enum for every enum CHECK constraint", () => {
    const unmatched = [...sqlEnums.keys()].filter(
      (column) => !(column in domainEnums),
    );
    expect(unmatched, "enum CHECK columns with no Zod enum").toEqual([]);
  });

  it.each(Object.keys(domainEnums))(
    "%s lists exactly its Zod enum's values",
    (column) => {
      const sqlValues = sqlEnums.get(column);
      expect(sqlValues, `${column} has no enum CHECK constraint`).toBeDefined();
      const zodValues = domainEnums[column]!;
      const missingFromCheck = zodValues.filter(
        (value) => !sqlValues!.includes(value),
      );
      const missingFromZod = sqlValues!.filter(
        (value) => !zodValues.includes(value),
      );
      expect(
        { missingFromCheck, missingFromZod },
        `${column}: CHECK and Zod enum differ`,
      ).toEqual({ missingFromCheck: [], missingFromZod: [] });
    },
  );
});
