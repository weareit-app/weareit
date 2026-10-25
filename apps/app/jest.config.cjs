// jest-expo's universal preset runs every component test on web, Node (server
// rendering), iOS, and Android, one Jest project per platform. Each project
// below is the preset's own, with this app's additions.
const universal = require("jest-expo/universal/jest-preset");

// oRPC (behind @it/api-contract/client) ships only ES modules, as .mjs files (checked
// 2026-10-21 against @orpc/client 1.15.6's package.json "exports"). jest-expo's
// presets run Babel only on .js/.jsx/.ts/.tsx and ignore node_modules packages
// missing from their allowlist (checked 2026-10-21 against jest-expo 58.0.11's
// jest-preset and web/jest-preset). So each project lets @orpc through and
// compiles .mjs with its own Babel options.
function letOrpcThrough([nodeModules, ...rest]) {
  const patched = nodeModules.replace("(?!(", "(?!(@orpc|");
  if (patched === nodeModules)
    throw new Error("jest-expo's transformIgnorePatterns changed shape");
  return [patched, ...rest];
}

// Component tests are `*.test.tsx`; a test for one platform adds that
// platform, as in `table.test.web.tsx`, which jest-expo's preset matches as
// `**/?(*.)+(spec|test).web.[jt]s?(x)` (checked 2026-10-25 against jest-expo
// 58.0.11's config/getPlatformPreset.js; its README's "Extensions" section
// names the platforms). The Node project would also match `.web.` tests;
// it's left out so web-only tests, such as the essay blocks, run on web only.
function testMatch({ platforms }) {
  const own = platforms[0] === "node" ? ["node"] : platforms;
  return ["", ...own].map(
    (platform) => `<rootDir>/**/*.test${platform && `.${platform}`}.tsx`,
  );
}

function withApp(project) {
  const platform = project.haste.platforms[0];
  const [babelJest, babelOptions] = project.transform["\\.[jt]sx?$"];
  const babel = [
    babelJest,
    {
      ...babelOptions,
      plugins: ["./dynamic-import-to-require.test-support.cjs"],
    },
  ];
  return {
    ...project,
    rootDir: __dirname,
    clearMocks: true,
    testMatch: testMatch(project.haste),
    transform: { ...project.transform, "\\.[jt]sx?$": babel, "\\.mjs$": babel },
    transformIgnorePatterns: letOrpcThrough(project.transformIgnorePatterns),
    moduleNameMapper: {
      ...project.moduleNameMapper,
      // Lucide's react-native export is an .mjs file jest-expo doesn't
      // transform; tests use its CommonJS build.
      "^lucide-react-native$":
        "<rootDir>/node_modules/lucide-react-native/dist/cjs/lucide-react-native.js",
    },
    setupFiles:
      platform === "web"
        ? [...project.setupFiles, "<rootDir>/web-streams.test-support.cjs"]
        : project.setupFiles,
  };
}

module.exports = {
  ...universal,
  projects: universal.projects.map(withApp),
};
