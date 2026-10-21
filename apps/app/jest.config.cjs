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

// oRPC (behind @it/api/client) ships only ES modules as .mjs files, which the
// preset neither transforms nor lets out of its node_modules ignore list.
// Babel compiles them like the app's own code.
const esmOnlyPackages = ["@orpc"];
const [presetIgnore, ...otherIgnores] =
  require("jest-expo/jest-preset").transformIgnorePatterns;
const transformIgnorePatterns = [
  presetIgnore.replace("(?!(", `(?!(${esmOnlyPackages.join("|")}|`),
  ...otherIgnores,
];
if (transformIgnorePatterns[0] === presetIgnore)
  throw new Error("jest-expo's transformIgnorePatterns changed shape");

module.exports = {
  projects: [
    {
      ...shared,
      displayName: "app",
      preset: "jest-expo",
      transform: { "\\.mjs$": [babelJest, babelOptions] },
      transformIgnorePatterns,
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
        "\\.[jt]sx?$": [
          babelJest,
          {
            ...babelOptions,
            caller: { ...babelOptions.caller, platform: "web" },
            plugins: ["./tests/essays/dynamic-import-to-require.cjs"],
          },
        ],
      },
      testMatch: ["<rootDir>/tests/essays/**/*.test.[jt]s?(x)"],
    },
  ],
};
