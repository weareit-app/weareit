import { readEnv } from "./env";
import { startApiServer } from "./server";

await startApiServer(readEnv());
