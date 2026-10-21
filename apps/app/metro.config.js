const path = require("node:path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Essay charts are drawn only in the browser, but the static render's server
// bundle still follows their lazy import. vega-canvas's Node build uses
// top-level await (for the optional `canvas` package), which Metro can't
// bundle, so every platform gets its browser build.
//
// Mermaid imports d3 as one package, and Vega imports the same d3-* modules
// one by one. Expo's web export moves modules that two lazy chunks share
// into the common chunk every page loads, so Mermaid gets d3's
// self-contained build instead (its `umd` export) and shares nothing.
//
// Mermaid's optional ELK layout engine is EPL-2.0 with no GPL secondary
// license, so it is left out of the bundle; the diagram schema rejects
// diagrams that ask for it (docs/architecture/dependency-policy.md).
const resolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const resolve = resolveRequest ?? context.resolveRequest;
  if (moduleName === "vega-canvas") {
    return resolve(
      { ...context, unstable_conditionNames: ["browser", "import", "default"] },
      moduleName,
      platform,
    );
  }
  if (moduleName === "d3") {
    return resolve(
      { ...context, unstable_conditionNames: ["umd"] },
      moduleName,
      platform,
    );
  }
  if (moduleName === "elkjs" || moduleName.startsWith("elkjs/")) {
    return { type: "empty" };
  }
  return resolve(context, moduleName, platform);
};

// Playwright writes traces and screenshots into test-results while tests run
// (playwright.config.ts). If Metro watched that folder, each write would
// reload the dev server in the middle of a server render ("Requiring unknown
// module").
const testResults = path.join(__dirname, "test-results");
config.resolver.blockList = [
  ...[config.resolver.blockList ?? []].flat(),
  new RegExp(`^${testResults.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\/]`),
];

module.exports = withNativewind(config);
