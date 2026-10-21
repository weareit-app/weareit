import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { initializeContentIfEmpty } from "../src/content-repository";
import { createDatabase } from "../src/database";
import { createMigrator } from "../src/migrator";
import { checkDatabaseReadiness } from "../src/readiness";
import { buildTier1ContentGraph } from "../src/tier1-import";

// Runs before `pnpm dev`: brings the local database to the point where the
// API starts, or stops with one message saying what to do. A database that
// is already reachable (an OrbStack container, a Neon branch) is used as is.
const connectionString = process.env.DATABASE_URL;
if (!connectionString)
  fail("Set DATABASE_URL in .env first (copy .env.example to start).");

let readiness = await checkDatabaseReadiness(connectionString);

if (!readiness.ready && readiness.problem === "unreachable") {
  if (!isLocal(connectionString)) fail(readiness.message);
  if (!dockerIsRunning())
    fail(
      `${readiness.message}\nStart OrbStack or Docker and run \`pnpm dev\` again, or set DATABASE_URL in .env to any running Postgres, such as a free Neon branch.`,
    );
  console.log("Starting Postgres with docker compose…");
  const started = spawnSync(
    "docker",
    ["compose", "up", "--detach", "--wait", "postgres"],
    {
      cwd: fileURLToPath(new URL("../../../", import.meta.url)),
      stdio: "inherit",
    },
  );
  if (started.status !== 0) fail(readiness.message);
  readiness = await checkDatabaseReadiness(connectionString);
}

if (!readiness.ready && readiness.problem === "migrations-pending") {
  await withDatabase(async (db) => {
    const { error, results } = await createMigrator(db).migrateToLatest();
    for (const result of results ?? [])
      console.log(`${result.status}: ${result.migrationName}`);
    if (error) throw error;
  });
  readiness = await checkDatabaseReadiness(connectionString);
}

if (!readiness.ready && readiness.problem === "no-published-content") {
  await withDatabase(async (db) => {
    const result = await initializeContentIfEmpty(db, buildTier1ContentGraph());
    if (result.seeded) console.log("Imported and published the seed content.");
  });
  readiness = await checkDatabaseReadiness(connectionString);
}

if (!readiness.ready) fail(readiness.message);
console.log("The database is ready.");

async function withDatabase(
  work: (db: ReturnType<typeof createDatabase>) => Promise<void>,
) {
  const db = createDatabase(connectionString!);
  try {
    await work(db);
  } finally {
    await db.destroy();
  }
}

function isLocal(url: string) {
  return ["localhost", "127.0.0.1", "[::1]"].includes(new URL(url).hostname);
}

function dockerIsRunning() {
  return spawnSync("docker", ["info"], { stdio: "ignore" }).status === 0;
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}
