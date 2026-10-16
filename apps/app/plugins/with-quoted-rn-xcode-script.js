const { withXcodeProject } = require("expo/config-plugins");

const quote = '\\"';
const reactNativeScriptExpression =
  "require('path').dirname(require.resolve('react-native/package.json')) + '/scripts/react-native-xcode.sh'";
const unquotedInvocation =
  "`" +
  quote +
  "$NODE_BINARY" +
  quote +
  " --print " +
  quote +
  reactNativeScriptExpression +
  quote +
  "`";
const quotedInvocation =
  "RN_XCODE_SCRIPT=$(" +
  quote +
  "$NODE_BINARY" +
  quote +
  " --print " +
  quote +
  reactNativeScriptExpression +
  quote +
  ")\\n" +
  quote +
  "$RN_XCODE_SCRIPT" +
  quote;

module.exports = function withQuotedReactNativeXcodeScript(config) {
  return withXcodeProject(config, (config) => {
    const phases =
      config.modResults.hash.project.objects.PBXShellScriptBuildPhase;
    let updated = false;

    for (const phase of Object.values(phases)) {
      if (
        phase.isa !== "PBXShellScriptBuildPhase" ||
        !phase.shellScript?.includes("react-native-xcode.sh")
      )
        continue;

      if (phase.shellScript.includes("RN_XCODE_SCRIPT=$(")) {
        updated = true;
        continue;
      }

      if (!phase.shellScript.includes(unquotedInvocation))
        throw new Error(
          "React Native's Xcode bundle invocation changed; review the path quoting config plugin.",
        );

      phase.shellScript = phase.shellScript.replace(
        unquotedInvocation,
        quotedInvocation,
      );
      updated = true;
    }

    if (!updated)
      throw new Error(
        "Could not find React Native's Xcode bundle phase to quote its script path.",
      );

    return config;
  });
};
