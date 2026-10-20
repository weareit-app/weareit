// Hermes in SDK 58 can't parse a rest parameter destructured with a default,
// `async (...[input, options = {}]) =>`, which @orpc/client ships. SDK 57's
// preset rewrote it; SDK 58's leaves it, so rewrite those parameters here.
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
