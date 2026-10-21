import type { Migrator } from "kysely";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ItDatabase } from "../src/database";
import {
  initializeContentIfEmpty,
  readDraftContent,
  saveDraftContent,
} from "../src/content-repository";
import { checkDatabaseReadiness } from "../src/readiness";
import { buildTier1ContentGraph } from "../src/tier1-import";
import { createTestDatabase } from "./test-database";

describe("database readiness", () => {
  it("reports a database nobody is listening for", async () => {
    expect(
      await checkDatabaseReadiness("postgres://it:it@localhost:1/it_dev"),
    ).toEqual({
      ready: false,
      problem: "unreachable",
      message:
        "Can't reach Postgres at localhost:1. Nothing is accepting connections there.",
    });
  });
});

// Runs against a disposable Postgres server, for example:
// docker run --rm -e POSTGRES_PASSWORD=it -p 54346:5432 postgres:17-alpine
// TEST_DATABASE_URL=postgres://postgres:it@localhost:54346/postgres pnpm test:unit
const connectionString = process.env.TEST_DATABASE_URL;

describe.skipIf(!connectionString)("database readiness in Postgres", () => {
  const name = "it_test_readiness";
  let databaseUrl: string;
  let db: ItDatabase;
  let migrator: Migrator;

  beforeAll(async () => {
    ({ db, migrator } = await createTestDatabase(connectionString!, name));
    const url = new URL(connectionString!);
    url.pathname = `/${name}`;
    databaseUrl = url.toString();
  });

  afterAll(async () => {
    await db?.destroy();
  });

  it("asks for migrations on a new, empty database", async () => {
    expect(await checkDatabaseReadiness(databaseUrl)).toEqual({
      ready: false,
      problem: "migrations-pending",
      message:
        "The database is missing 7 migrations, starting with 001_initial_content. Run `pnpm db:migrate`.",
    });
  });

  it("asks for the seed once every migration has run", async () => {
    const { error } = await migrator.migrateToLatest();
    if (error) throw error;

    expect(await checkDatabaseReadiness(databaseUrl)).toEqual({
      ready: false,
      problem: "no-published-content",
      message: "No onboarding content is published yet. Run `pnpm db:seed`.",
    });
  });

  it("is ready once the seed has run", async () => {
    expect(
      await initializeContentIfEmpty(db, buildTier1ContentGraph()),
    ).toEqual({ seeded: true, revision: 1 });

    expect(await checkDatabaseReadiness(databaseUrl)).toEqual({ ready: true });
  });

  it("leaves CMS edits alone when seeding a database that has content", async () => {
    const draft = await readDraftContent(db);
    const edited = {
      ...draft.content,
      pains: draft.content.pains.map((pain, index) =>
        index === 0 ? { ...pain, title: "Edited in the CMS" } : pain,
      ),
    };
    await saveDraftContent(db, edited, {
      expectedRevision: draft.revision,
      actor: "test",
      changeNote: "Edit before a second seed",
    });

    expect(
      await initializeContentIfEmpty(db, buildTier1ContentGraph()),
    ).toEqual({ seeded: false });
    expect((await readDraftContent(db)).content.pains[0]!.title).toBe(
      "Edited in the CMS",
    );
  });
});
