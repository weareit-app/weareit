import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { initializeContentIfEmpty } from "../src/content-repository";
import { createDatabase } from "../src/database";
import { migrateToLatest } from "../src/migrator";
import { checkDatabaseReadiness, isLocalDatabase } from "../src/readiness";
import { buildTier1ContentGraph } from "@it/content/tier-1-graph";
import { createLog } from "@it/log";

// Runs before `pnpm dev`: brings the local database to the point where the
// API starts, or stops with one message saying what to do. A database that
// is already reachable (an OrbStack container, a Neon branch) is used as is.
const log = createLog({ level: "info" });
const connectionString = process.env.DATABASE_URL;
if (!connectionString)
  fail("Set DATABASE_URL in .env first (copy .env.example to start).");

let readiness = await checkDatabaseReadiness(connectionString);

if (!readiness.ready && readiness.problem === "unreachable") {
  if (!isLocalDatabase(connectionString)) fail(readiness.message);
  if (!dockerIsRunning())
    fail(
      `Nothing is running Postgres at ${new URL(connectionString).host}, and neither OrbStack nor Docker is running to start it. Start one and run \`pnpm dev\` again, or set DATABASE_URL in .env to any running Postgres, such as a Neon branch.`,
    );
  log.info("postgres_starting", { with: "docker compose" });
  const started = spawnSync(
    "docker",
    ["compose", "up", "--detach", "--wait", "postgres"],
    {
      cwd: fileURLToPath(new URL("../../../", import.meta.url)),
      stdio: "inherit",
    },
  );
  if (started.status !== 0)
    fail(
      "docker compose couldn't start Postgres; its output is above. Fix that, or set DATABASE_URL in .env to a database that's running.",
    );
  readiness = await checkDatabaseReadiness(connectionString);
}

if (!readiness.ready && readiness.problem === "migrations-pending") {
  await withDatabase(async (db) => {
    for (const name of await migrateToLatest(db))
      log.info("migrated", { migration: name });
  });
  readiness = await checkDatabaseReadiness(connectionString);
}

if (!readiness.ready && readiness.problem === "no-published-content") {
  await withDatabase(async (db) => {
    const result = await initializeContentIfEmpty(db, buildTier1ContentGraph());
    if (result.seeded) log.info("content_seeded", { published: true });
  });
  readiness = await checkDatabaseReadiness(connectionString);
}

if (!readiness.ready) fail(readiness.message);
log.info("database_ready");

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

function dockerIsRunning() {
  return spawnSync("docker", ["info"], { stdio: "ignore" }).status === 0;
}

function fail(message: string): never {
  log.error("database_not_ready", { message });
  process.exit(1);
}
