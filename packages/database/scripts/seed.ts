import { createDatabase } from "../src/database";
import { initializeContent } from "../src/content-repository";
import { buildTier1ContentGraph } from "@it/content/tier-1-graph";
import { createLog } from "@it/log/log";
import { readEnv } from "./env";

const env = readEnv();
const log = createLog({ level: "info" });
const db = createDatabase(env.DATABASE_URL);
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
