// SDK 58's Hermes rejects an async arrow with a destructured rest parameter,
// `async (...[input, options = {}]) =>`, which @orpc/client 1.15.6 ships ("invalid
// destructuring target" in the iOS dev build, 2026-10-20). babel-preset-expo
// 57.0.16 rewrote these with fix-hermes-v1-async-arrow-non-simple-params
// (facebook/hermes#1761); 58.0.18 no longer has that plugin. So rewrite @orpc's
// parameters here.
module.exports = function (api) {
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
    ],
  };
};
