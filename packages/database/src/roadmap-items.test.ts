import { sql, type Migrator } from "kysely";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { resolveFeatureStatuses, type ContentGraph } from "@it/domain/content";
import type { ItDatabase } from "./database";
import {
  initializeContent,
  publishDraftContent,
  readDraftContent,
  readPublishedContent,
  rollbackToVersion,
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

const spanish = {
  id: "use-it-in-spanish",
  title: "Use It in Spanish",
  line: "Every page and pain in Spanish.",
  status: "planned" as const,
  statusNote: "Decided to build it after launch.",
  sortOrder: 0,
};

// Connects every Feature fix in the graph to the Spanish item.
function connectFeatures(content: ContentGraph): ContentGraph {
  return {
    ...content,
    roadmapItems: [spanish],
    fixes: content.fixes.map((fix) => {
      if (fix.kind !== "feature") return fix;
      const {
        featureStatus: _status,
        statusChangedOn: _date,
        statusNote: _note,
        ...rest
      } = fix;
      return { ...rest, roadmapItemId: spanish.id };
    }),
  };
}

describe.skipIf(!connectionString)("roadmap items in Postgres", () => {
  let db: ItDatabase;
  let migrator: Migrator;
  let firstVersion: number;
  let featureIds: string[];

  beforeAll(async () => {
    ({ db, migrator } = await createTestDatabase(
      connectionString!,
      "it_test_roadmap_items",
    ));
    const { error } = await migrator.migrateToLatest();
    expect(error).toBeUndefined();
    const graph = buildTier1ContentGraph();
    featureIds = graph.fixes
      .filter(({ kind }) => kind === "feature")
      .map(({ id }) => id);
    expect(featureIds.length).toBeGreaterThan(1);
    await initializeContent(db, graph);
    firstVersion = (await readPublishedContent(db))!.version;
  });

  afterAll(async () => {
    await db?.destroy();
  });

  it("saves an item and its connected fixes and reads them back", async () => {
    const draft = await readDraftContent(db);
    expect(draft.content.roadmapItems).toEqual([]);

    await saveDraftContent(db, connectFeatures(draft.content), {
      expectedRevision: draft.revision,
      actor: "test",
      changeNote: "Add the Spanish item",
      today: "2026-10-20",
    });

    const saved = (await readDraftContent(db)).content;
    expect(saved.roadmapItems).toEqual([
      { ...spanish, statusChangedOn: "2026-10-20" },
    ]);
    expect(
      saved.fixes
        .filter(({ roadmapItemId }) => roadmapItemId === spanish.id)
        .map(({ id }) => id),
    ).toEqual(featureIds);
  });

  it("refuses a connected fix with its own status in the table", async () => {
    await expect(
      db
        .updateTable("content_fixes")
        .set({ feature_status: "planned" })
        .where("id", "=", featureIds[0]!)
        .execute(),
    ).rejects.toThrow(/content_fixes_feature_status_check/);
  });

  it("refuses an item status outside the five", async () => {
    await expect(
      db
        .updateTable("roadmap_items")
        .set({ status: "shipped" as never })
        .execute(),
    ).rejects.toThrow(/roadmap_items_status_check/);
  });

  it("refuses an item status change without a new note", async () => {
    const draft = await readDraftContent(db);
    const content = {
      ...draft.content,
      roadmapItems: draft.content.roadmapItems.map((item) => ({
        ...item,
        status: "in-progress" as const,
      })),
    };

    await expect(
      saveDraftContent(db, content, {
        expectedRevision: draft.revision,
        actor: "test",
        changeNote: "Start translating",
      }),
    ).rejects.toThrow(/note saying what changed/);
  });

  it("publishes an item status change to every connected fix", async () => {
    const draft = await readDraftContent(db);
    await saveDraftContent(
      db,
      {
        ...draft.content,
        roadmapItems: draft.content.roadmapItems.map((item) => ({
          ...item,
          status: "in-progress" as const,
          statusNote: "Translating now.",
        })),
      },
      {
        expectedRevision: draft.revision,
        actor: "test",
        changeNote: "Start translating",
        today: "2026-10-21",
      },
    );
    const result = await publishDraftContent(db, { actor: "test" });
    expect(result.published).toBe(true);

    const published = (await readPublishedContent(db))!.content;
    const shown = resolveFeatureStatuses(published).filter(({ id }) =>
      featureIds.includes(id),
    );
    expect(shown.map(({ featureStatus }) => featureStatus)).toEqual(
      featureIds.map(() => "in-progress"),
    );
    expect(shown[0]).toMatchObject({
      statusChangedOn: "2026-10-21",
      statusNote: "Translating now.",
    });
  });

  it("refuses to remove an item that fixes are connected to", async () => {
    await expect(
      db.deleteFrom("roadmap_items").where("id", "=", spanish.id).execute(),
    ).rejects.toThrow(/foreign key/);
  });

  it("rolls back to a version without roadmap items", async () => {
    await rollbackToVersion(db, firstVersion, "test");

    const draft = (await readDraftContent(db)).content;
    expect(draft.roadmapItems).toEqual([]);
    expect(
      draft.fixes.filter(({ roadmapItemId }) => roadmapItemId !== undefined),
    ).toEqual([]);
    expect((await readPublishedContent(db))!.content.roadmapItems).toEqual([]);
  });

  it("restores the items and connections of a later version", async () => {
    const withItems = (await readPublishedContent(db))!.version - 1;
    await rollbackToVersion(db, withItems, "test");

    const draft = (await readDraftContent(db)).content;
    expect(draft.roadmapItems.map(({ status }) => status)).toEqual([
      "in-progress",
    ]);
    expect(
      draft.fixes.filter(({ roadmapItemId }) => roadmapItemId === spanish.id),
    ).toHaveLength(featureIds.length);
  });

  it("saves a new item without a note, and disconnects from it", async () => {
    const groups = {
      id: "local-groups",
      title: "Local groups",
      line: "Meet people near you.",
      status: "exploring" as const,
      sortOrder: 1,
    };
    let draft = await readDraftContent(db);
    await saveDraftContent(
      db,
      {
        ...draft.content,
        roadmapItems: [...draft.content.roadmapItems, groups],
        fixes: draft.content.fixes.map((fix) =>
          fix.id === featureIds[0] ? { ...fix, roadmapItemId: groups.id } : fix,
        ),
      },
      {
        expectedRevision: draft.revision,
        actor: "test",
        changeNote: "Add local groups",
        today: "2026-10-22",
      },
    );

    draft = await readDraftContent(db);
    expect(
      draft.content.roadmapItems.find(({ id }) => id === groups.id),
    ).toEqual({ ...groups, statusChangedOn: "2026-10-22" });

    // The fix keeps the status it was showing, with the item's date and no note.
    await saveDraftContent(
      db,
      {
        ...draft.content,
        fixes: draft.content.fixes.map((fix) => {
          if (fix.id !== featureIds[0]) return fix;
          const { roadmapItemId: _item, ...rest } = fix;
          return {
            ...rest,
            featureStatus: "exploring" as const,
            statusChangedOn: "2026-10-22",
          };
        }),
      },
      {
        expectedRevision: draft.revision,
        actor: "test",
        changeNote: "Disconnect from local groups",
      },
    );

    expect(
      (await readDraftContent(db)).content.fixes.find(
        ({ id }) => id === featureIds[0],
      ),
    ).toMatchObject({
      featureStatus: "exploring",
      statusChangedOn: "2026-10-22",
    });
  });

  it("rolls the migration back once no fix is connected", async () => {
    await rollbackToVersion(db, firstVersion, "test");

    const { error } = await migrator.migrateTo("006_feature_statuses");
    expect(error).toBeUndefined();

    const tables = await sql<{ table_name: string }>`
      select table_name from information_schema.tables
      where table_schema = 'public'
    `.execute(db);
    expect(tables.rows.map(({ table_name }) => table_name)).not.toContain(
      "roadmap_items",
    );
  });
});
