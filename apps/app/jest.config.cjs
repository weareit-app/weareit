const shared = {
  rootDir: __dirname,
  clearMocks: true,
  // Lucide's react-native export is an .mjs file jest-expo doesn't transform;
  // tests use its CommonJS build.
  moduleNameMapper: {
    "^lucide-react-native$":
      "<rootDir>/node_modules/lucide-react-native/dist/cjs/lucide-react-native.js",
  },
};

// jest-expo's web preset assumes a babel.config.js; this app has none, so it
// borrows the default preset's Babel options with the web platform.
const [babelJest, babelOptions] = require("jest-expo/jest-preset").transform[
  "\\.[jt]sx?$"
];
const webPreset = require("jest-expo/web/jest-preset");

// oRPC (behind @it/api/client) ships only ES modules, as .mjs files (checked
// 2026-10-21 against @orpc/client 1.15.6's package.json "exports"). Both
// jest-expo presets run Babel only on .js/.jsx/.ts/.tsx and ignore node_modules
// packages missing from their allowlist (checked 2026-10-21 against jest-expo
// 58.0.11's jest-preset and web/jest-preset). So each project below lets
// @orpc through and compiles .mjs with its own Babel options.
function letOrpcThrough([nodeModules, ...rest]) {
  const patched = nodeModules.replace("(?!(", "(?!(@orpc|");
  if (patched === nodeModules)
    throw new Error("jest-expo's transformIgnorePatterns changed shape");
  return [patched, ...rest];
}

const webBabel = [
  babelJest,
  {
    ...babelOptions,
    caller: { ...babelOptions.caller, platform: "web" },
    plugins: ["./tests/essays/dynamic-import-to-require.cjs"],
  },
];

module.exports = {
  projects: [
    {
      ...shared,
      displayName: "app",
      preset: "jest-expo",
      transform: { "\\.mjs$": [babelJest, babelOptions] },
      transformIgnorePatterns: letOrpcThrough(
        require("jest-expo/jest-preset").transformIgnorePatterns,
      ),
      testMatch: ["<rootDir>/tests/**/*.test.[jt]s?(x)"],
      testPathIgnorePatterns: ["<rootDir>/tests/essays/"],
    },
    {
      // Essays are web-only, so their blocks are tested as web pages.
      ...shared,
      displayName: "essays (web)",
      preset: "jest-expo/web",
      transform: {
        ...webPreset.transform,
        "\\.[jt]sx?$": webBabel,
        "\\.mjs$": webBabel,
      },
      transformIgnorePatterns: letOrpcThrough(
        webPreset.transformIgnorePatterns,
      ),
      setupFiles: [
        ...webPreset.setupFiles,
        "<rootDir>/tests/essays/web-streams.cjs",
      ],
      testMatch: ["<rootDir>/tests/essays/**/*.test.[jt]s?(x)"],
    },
  ],
};
