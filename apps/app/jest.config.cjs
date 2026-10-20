const shared = {
  rootDir: __dirname,
  clearMocks: true,
  setupFiles: ["<rootDir>/jest.setup.cjs"],
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

module.exports = {
  projects: [
    {
      ...shared,
      displayName: "app",
      preset: "jest-expo",
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
