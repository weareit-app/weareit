import { createDatabase } from "../src/database";
import { initializeContent } from "../src/content-repository";
import { buildTier1ContentGraph } from "@it/content/tier-1-graph";
import { createLog } from "@it/log/log";

const log = createLog({ level: "info" });

const connectionString = process.env.DATABASE_URL;
if (!connectionString)
  throw new Error("Set DATABASE_URL before seeding the content database.");
const db = createDatabase(connectionString);
try {
  const graph = buildTier1ContentGraph();
  const result = await initializeContent(db, graph);
  log.info("content_seeded", {
    pains: graph.pains.length,
    dreams: graph.dreams.length,
    waysForward: graph.fixes.length,
    firstActions: graph.firstActions.length,
    publishedVersion: 1,
    revision: result.revision,
  });
} finally {
  await db.destroy();
}
