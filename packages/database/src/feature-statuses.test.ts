import { sql, type Migrator } from "kysely";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ItDatabase } from "./database";
import {
  initializeContent,
  readDraftContent,
  RevisionConflictError,
  saveDraftContent,
} from "./content-repository";
import {
  createTestDatabase,
  testDatabaseUrl,
} from "./test-database.test-support";
import { buildTier1ContentGraph } from "@it/content/tier-1-graph";

// Runs against a disposable Postgres server, for example:
// docker run --rm -e POSTGRES_PASSWORD=it -p 54346:5432 postgres:17-alpine
// TEST_DATABASE_URL=postgres://postgres:it@localhost:54346/postgres pnpm test:unit
const connectionString = testDatabaseUrl();

describe.skipIf(!connectionString)("five feature statuses in Postgres", () => {
  let db: ItDatabase;
  let migrator: Migrator;

  beforeAll(async () => {
    ({ db, migrator } = await createTestDatabase(
      connectionString!,
      "it_test_feature_statuses",
    ));
    const { error } = await migrator.migrateTo("005_content_fixes");
    expect(error).toBeUndefined();
  });

  afterAll(async () => {
    await db?.destroy();
  });

  it("keeps planned and idea fixes unchanged through the migration", async () => {
    const legacy = ["planned", "idea"].map((status, sortOrder) => ({
      id: `legacy-${status}`,
      title: `A ${status} feature`,
      description: "From before five statuses.",
      kind: "feature",
      feature_status: status,
      evidence: "untested",
      evidence_note: "Not tested yet.",
      sort_order: sortOrder,
    }));
    await db
      .insertInto("content_fixes")
      .values(legacy as never)
      .execute();

    const { error } = await migrator.migrateToLatest();
    expect(error).toBeUndefined();

    const after = await db
      .selectFrom("content_fixes")
      .select(["id", "feature_status", "status_changed_on", "status_note"])
      .orderBy("sort_order")
      .execute();
    expect(after).toEqual([
      {
        id: "legacy-planned",
        feature_status: "planned",
        status_changed_on: null,
        status_note: null,
      },
      {
        id: "legacy-idea",
        feature_status: "idea",
        status_changed_on: null,
        status_note: null,
      },
    ]);
  });

  it("imports existing content and reads it back unchanged", async () => {
    await db.deleteFrom("content_fixes").execute();
    const graph = buildTier1ContentGraph();
    await initializeContent(db, graph);

    expect((await readDraftContent(db)).content.fixes).toEqual(graph.fixes);
  });

  it.each(["someday", "shipped"])(
    "refuses %s, which is not one of the five",
    async (status) => {
      await expect(
        db
          .updateTable("content_fixes")
          .set({ feature_status: status as never })
          .where("kind", "=", "feature")
          .execute(),
      ).rejects.toThrow(/content_fixes_feature_status_check/);
    },
  );

  it("saves a status change with its note and records the date", async () => {
    const draft = await readDraftContent(db);
    const feature = draft.content.fixes.find(({ kind }) => kind === "feature")!;
    const content = {
      ...draft.content,
      fixes: draft.content.fixes.map((fix) =>
        fix.id === feature.id
          ? {
              ...fix,
              featureStatus: "in-progress" as const,
              statusNote: "Building it now.",
            }
          : fix,
      ),
    };

    await saveDraftContent(db, content, {
      expectedRevision: draft.revision,
      actor: "test",
      changeNote: "Start building",
      today: "2026-10-20",
    });

    const saved = (await readDraftContent(db)).content.fixes.find(
      ({ id }) => id === feature.id,
    );
    expect(saved).toMatchObject({
      featureStatus: "in-progress",
      statusChangedOn: "2026-10-20",
      statusNote: "Building it now.",
    });
  });

  it("refuses a status change without a new note", async () => {
    const draft = await readDraftContent(db);
    const feature = draft.content.fixes.find(
      ({ featureStatus }) => featureStatus === "in-progress",
    )!;
    const content = {
      ...draft.content,
      fixes: draft.content.fixes.map((fix) =>
        fix.id === feature.id
          ? { ...fix, featureStatus: "live" as const }
          : fix,
      ),
    };

    await expect(
      saveDraftContent(db, content, {
        expectedRevision: draft.revision,
        actor: "test",
        changeNote: "Ship it",
      }),
    ).rejects.toThrow(/note saying what changed/);
    expect(
      (await readDraftContent(db)).content.fixes.find(
        ({ id }) => id === feature.id,
      )?.featureStatus,
    ).toBe("in-progress");
  });

  it("refuses a save against an old revision, naming both revisions", async () => {
    const draft = await readDraftContent(db);
    const save = saveDraftContent(db, draft.content, {
      expectedRevision: draft.revision - 1,
      actor: "test",
      changeNote: "From a stale tab",
    });

    await expect(save).rejects.toBeInstanceOf(RevisionConflictError);
    await expect(save).rejects.toMatchObject({
      expectedRevision: draft.revision - 1,
      actualRevision: draft.revision,
    });
  });

  it("rolls the migration back once only planned and idea remain", async () => {
    const draft = await readDraftContent(db);
    await db
      .updateTable("content_fixes")
      .set({ feature_status: "planned" })
      .where("feature_status", "=", "in-progress")
      .execute();
    expect(draft.revision).toBeGreaterThan(1);

    const { error } = await migrator.migrateTo("005_content_fixes");
    expect(error).toBeUndefined();

    const columns = await sql<{ column_name: string }>`
      select column_name from information_schema.columns
      where table_name = 'content_fixes'
    `.execute(db);
    expect(columns.rows.map(({ column_name }) => column_name)).not.toContain(
      "status_note",
    );
  });
});
