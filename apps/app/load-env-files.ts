// Loads `apps/app/.env` (and `.env.local` and the mode files) the way the Expo
// CLI does, so tools that read the app config without the CLI, such as
// jest-expo and knip, see the same public variables. Under the CLI this adds
// nothing: `@expo/env` loads the files once per process.
import { load } from "@expo/env";

load(__dirname, { silent: true });
