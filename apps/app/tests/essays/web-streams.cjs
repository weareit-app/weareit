// jsdom has no web streams globals (seen 2026-10-21 under jest-expo 58.0.11's
// web preset: "TransformStream is not defined"), and oRPC creates a
// TransformStream when it loads. Node's own implementation stands in.
const streams = require("node:stream/web");

for (const name of ["ReadableStream", "TransformStream", "WritableStream"])
  globalThis[name] ??= streams[name];
