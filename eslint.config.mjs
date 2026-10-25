// The type-aware lint pass (weareit-app/weareit#148): only what Biome can't
// check. Biome lints every file; ESLint adds the React hooks and React
// Compiler rules and reasons on suppressions. Every rule is an error or off.
import eslintComments from "@eslint-community/eslint-plugin-eslint-comments";
import { defineConfig } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

// The hooks plugin's recommended set, with its warnings raised to errors.
const hooksRules = Object.fromEntries(
  Object.entries(reactHooks.configs.flat.recommended.rules).map(
    ([name, setting]) => [name, asError(setting)],
  ),
);

function asError(setting) {
  if (setting === "off" || setting === 0) return "off";
  return Array.isArray(setting) ? ["error", ...setting.slice(1)] : "error";
}

export default defineConfig(
  {
    // Matches what Biome skips (biome.jsonc `files.includes`) plus .gitignore.
    ignores: [
      ".claude/",
      ".agents/",
      "**/.expo/",
      "**/dist/",
      "**/web-build/",
      "**/coverage/",
      "**/ios/",
      "**/android/",
      "**/.turbo/",
      "**/storybook-static/",
      "**/storybook-review/",
      "apps/app/expo-env.d.ts",
      "packages/database/src/db.ts",
    ],
  },
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { projectService: true },
    },
    linterOptions: { reportUnusedDisableDirectives: "error" },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "react-hooks": reactHooks,
      "@eslint-community/eslint-comments": eslintComments,
    },
    rules: {
      ...hooksRules,
      "@eslint-community/eslint-comments/require-description": "error",
    },
  },
);
