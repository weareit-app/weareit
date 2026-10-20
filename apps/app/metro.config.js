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

module.exports = withNativewind(config);
