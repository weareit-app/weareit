const path = require("node:path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Mermaid's optional ELK layout engine is EPL-2.0 with no GPL secondary
// license, so it is left out of the bundle; the diagram schema rejects
// diagrams that ask for it (docs/architecture/dependency-policy.md).
const resolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) =>
  moduleName === "elkjs" || moduleName.startsWith("elkjs/")
    ? { type: "empty" }
    : (resolveRequest ?? context.resolveRequest)(context, moduleName, platform);

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
