import type { Migrator } from "kysely";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ItDatabase } from "./database";
import {
  initializeContentIfEmpty,
  readDraftContent,
  saveDraftContent,
} from "./content-repository";
import { checkDatabaseReadiness } from "./readiness";
import { buildTier1ContentGraph } from "@it/content/tier-1-graph";
import {
  createTestDatabase,
  testDatabaseUrl,
} from "./test-database.test-support";

describe("database readiness", () => {
  it("reports a local database nobody is listening for", async () => {
    expect(
      await checkDatabaseReadiness("postgres://it:it@localhost:1/it_dev"),
    ).toEqual({
      ready: false,
      problem: "unreachable",
      message:
        "Can't reach Postgres at localhost:1: nothing is accepting connections. Run `pnpm dev` to start it, or set DATABASE_URL to a database that's running.",
    });
  });

  it("doesn't suggest `pnpm dev` for a database on another host", async () => {
    expect(
      await checkDatabaseReadiness("postgres://it:it@db.example.invalid/it"),
    ).toEqual({
      ready: false,
      problem: "unreachable",
      message:
        "Can't reach Postgres at db.example.invalid: getaddrinfo ENOTFOUND db.example.invalid. Check DATABASE_URL, and check that the database is running.",
    });
  });
});

// Runs against a disposable Postgres server, for example:
// docker run --rm -e POSTGRES_PASSWORD=it -p 54346:5432 postgres:17-alpine
// TEST_DATABASE_URL=postgres://postgres:it@localhost:54346/postgres pnpm test:unit
const connectionString = testDatabaseUrl();

describe.skipIf(!connectionString)("database readiness in Postgres", () => {
  const name = "it_test_readiness";
  let databaseUrl: string;
  let db: ItDatabase;
  let migrator: Migrator;

  beforeAll(async () => {
    ({ db, migrator, databaseUrl } = await createTestDatabase(
      connectionString!,
      name,
    ));
  });

  afterAll(async () => {
    await db?.destroy();
  });

  it("tells a rejected login apart from an unreachable database", async () => {
    const wrongPassword = new URL(databaseUrl);
    wrongPassword.password = "not-the-password";
    const host = wrongPassword.host;

    expect(await checkDatabaseReadiness(wrongPassword.toString())).toEqual({
      ready: false,
      problem: "login-rejected",
      message: `Postgres at ${host} rejected the login: password authentication failed for user "postgres". Check the user, password, and database name in DATABASE_URL.`,
    });
  });

  it("asks for migrations on a new, empty database", async () => {
    expect(await checkDatabaseReadiness(databaseUrl)).toEqual({
      ready: false,
      problem: "migrations-pending",
      message:
        "The database is missing 8 migrations, starting with 001_initial_content. Run `pnpm db:migrate`.",
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
    const editedTitle = draft.content.pains[1]!.title;
    const edited = {
      ...draft.content,
      pains: draft.content.pains.map((pain, index) =>
        index === 0 ? { ...pain, title: editedTitle } : pain,
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
      editedTitle,
    );
  });

  it("points to the CMS when content exists but none is published", async () => {
    await db.deleteFrom("published_content_versions").execute();

    expect(await checkDatabaseReadiness(databaseUrl)).toEqual({
      ready: false,
      problem: "no-published-content",
      message:
        "Onboarding content exists but none is published. Publish it from /cms in the web app.",
    });
  });
});
