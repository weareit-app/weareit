import { createDatabase } from "../src/database";
import { initializeContent } from "../src/content-repository";
import { buildTier1ContentGraph } from "@it/content/tier-1-graph";

const connectionString = process.env.DATABASE_URL;
if (!connectionString)
  throw new Error("Set DATABASE_URL before seeding the content database.");
const db = createDatabase(connectionString);
try {
  const graph = buildTier1ContentGraph();
  const result = await initializeContent(db, graph);
  console.log(
    `Imported ${graph.pains.length} pains, ${graph.dreams.length} dreams, ${graph.fixes.length} ways forward, and ${graph.firstActions.length} first actions; published version 1 (revision ${result.revision}).`,
  );
} finally {
  await db.destroy();
}
