// SDK 58's Hermes rejects an async arrow with a destructured rest parameter,
// `async (...[input, options = {}]) =>`, which @orpc/client 1.15.6 ships ("invalid
// destructuring target" in the iOS dev build, 2026-10-20). babel-preset-expo
// 57.0.16 rewrote these with fix-hermes-v1-async-arrow-non-simple-params
// (facebook/hermes#1761); 58.0.18 no longer has that plugin. So rewrite @orpc's
// parameters here.
//
// Mermaid splits itself into dozens of chunks with import(); Expo's web export
// moves any module two lazy chunks share into a common chunk that every page
// loads. Turning Mermaid's own import() calls into requires keeps all of it in
// the one lazy chunk the diagram block loads, so other pages don't grow.
const mermaidDist =
  /[\\/]node_modules[\\/](?:mermaid[\\/]dist|@mermaid-js[\\/]parser[\\/]dist)[\\/]/;

function inlineDynamicImports({ types: t }) {
  return {
    visitor: {
      CallExpression(callPath) {
        if (callPath.node.callee.type !== "Import") return;
        const interop = this.file.addHelper("interopRequireWildcard");
        callPath.replaceWith(
          t.callExpression(
            t.memberExpression(
              t.callExpression(
                t.memberExpression(
                  t.identifier("Promise"),
                  t.identifier("resolve"),
                ),
                [],
              ),
              t.identifier("then"),
            ),
            [
              t.arrowFunctionExpression(
                [],
                t.callExpression(interop, [
                  t.callExpression(
                    t.identifier("require"),
                    callPath.node.arguments,
                  ),
                ]),
              ),
            ],
          ),
        );
      },
    },
  };
}

module.exports = (api) => {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    overrides: [
      {
        // A function, not a RegExp: Metro first loads this without a filename.
        test: (filename) =>
          filename != null && /[\\/]node_modules[\\/].*@orpc/.test(filename),
        plugins: ["@babel/plugin-transform-parameters"],
      },
      {
        test: (filename) => Boolean(filename && mermaidDist.test(filename)),
        plugins: [inlineDynamicImports],
      },
    ],
  };
};
