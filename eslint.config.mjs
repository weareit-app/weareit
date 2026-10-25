// The type-aware lint pass (weareit-app/weareit#148): only what Biome can't
// check. Biome lints every file; ESLint adds the React hooks and React
// Compiler rules, reasons on suppressions, and two syntax bans. Every rule is
// an error or off.
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

// Zod 4 style (#147): object schemas through z.strictObject and z.looseObject,
// string formats through their top-level functions.
const zodStyle = [
  {
    selector:
      "CallExpression[callee.property.name='strict'][arguments.length=0]:has(MemberExpression[object.name='z'])",
    message: "Write z.strictObject({ … }) instead of .strict().",
  },
  {
    selector:
      "CallExpression[callee.property.name='passthrough'][arguments.length=0]:has(MemberExpression[object.name='z'])",
    message: "Write z.looseObject({ … }) instead of .passthrough().",
  },
  {
    selector:
      "CallExpression[callee.property.name=/^(email|url|jwt|emoji|guid|uuid|uuidv4|uuidv6|uuidv7|nanoid|cuid|cuid2|ulid|xid|ksuid|base64|base64url|ip|ipv4|ipv6|cidrv4|cidrv6|e164|datetime|date|time|duration)$/]:has(CallExpression[callee.object.name='z'][callee.property.name='string'])",
    message:
      "This z.string() format method is deprecated: write the top-level function, such as z.url(), z.uuid(), or z.iso.datetime().",
  },
];

// Router handlers raise the contract's declared errors (#170).
const noHandBuiltApiErrors = {
  selector: "NewExpression[callee.name='ORPCError']",
  message:
    "Raise a declared error through the contract's `errors` helpers instead of constructing ORPCError.",
};

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
      "no-restricted-syntax": ["error", ...zodStyle],
    },
  },
  {
    // The router and its handlers; one rule setting replaces another, so this
    // repeats the Zod bans.
    files: ["apps/api-server/src/**/*.ts"],
    ignores: ["**/*.test.ts"],
    rules: {
      "no-restricted-syntax": ["error", ...zodStyle, noHandBuiltApiErrors],
    },
  },
);
