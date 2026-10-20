const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Essay charts are drawn only in the browser, but the static render's server
// bundle still follows their lazy import. vega-canvas's Node build uses
// top-level await (for the optional `canvas` package), which Metro can't
// bundle, so every platform gets its browser build.
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
  return resolve(context, moduleName, platform);
};

module.exports = withNativewind(config);
