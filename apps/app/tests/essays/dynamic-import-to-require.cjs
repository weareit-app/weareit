// Jest only: turns `import("x")` into `Promise.resolve().then(() =>
// require("x"))`. Metro splits `import()` into its own bundle, but Node
// refuses it inside Jest's module sandbox.
module.exports = ({ types: t }) => ({
  visitor: {
    CallExpression(path) {
      if (!t.isImport(path.node.callee)) return;
      const required = t.callExpression(
        t.identifier("require"),
        path.node.arguments,
      );
      path.replaceWith(
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
          [t.arrowFunctionExpression([], required)],
        ),
      );
    },
  },
});
