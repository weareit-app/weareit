// What the generated dot costs to download on web, read from the browser's
// resource timings (transfer size, i.e. compressed). Lab only.
export interface WebDownload {
  items: { name: string; bytes: number }[];
  totalBytes: number;
  compressed: boolean;
  fitsBudget: boolean;
}

const WEB_BUDGET_BYTES = 1024 * 1024; // FR-011

export async function measureWebDownload(): Promise<WebDownload> {
  const perf = globalThis.performance;
  const entries = (perf?.getEntriesByType?.("resource") ??
    []) as PerformanceResourceTiming[];
  const pick = (name: string, test: (url: string) => boolean) => {
    const e = entries.find((x) => test(x.name));
    return e ? [{ name, bytes: e.transferSize || e.encodedBodySize }] : [];
  };
  const items = [
    ...pick(
      "Skia runtime (canvaskit.wasm)",
      (u) => u.includes("canvaskit") && u.endsWith(".wasm"),
    ),
    ...pick(
      "Painted dot atlas (orb-01)",
      (u) => u.includes("atlas") && u.includes(".png"),
    ),
  ];
  const totalBytes = items.reduce((s, i) => s + i.bytes, 0);
  // The dev server does not compress, so a transfer size equal to the body
  // size means these are uncompressed bytes; production gzip is smaller.
  const compressed = entries.some(
    (e) => e.transferSize > 0 && e.transferSize < e.decodedBodySize,
  );
  return {
    items,
    totalBytes,
    compressed,
    fitsBudget: totalBytes <= WEB_BUDGET_BYTES,
  };
}
