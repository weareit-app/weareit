import { describe, expect, it } from "vitest";
import { atlasSize, manifestSchema } from "./manifest.ts";

const sample = {
  schema: 1,
  id: "orb-01",
  size: 256,
  frames: 20,
  columns: 5,
  pigmentSlots: 3,
  densityScale: 2,
  fps: 12,
  breathe: { from: 16, to: 19, periodSeconds: 6 },
  provenance: {
    seed: 1729,
    simVersion: "0.1.0",
    settings: { steps: 900 },
    pigmentsUsed: ["teal-blue", "cyan-green", "warm-yellow"],
    createdAt: "2026-10-20",
    license: "CC0-1.0",
    method:
      "Curtis et al. 1997 shallow-water watercolor model, implemented in tools/watercolor-sim",
  },
};

describe("painted dot manifest", () => {
  it("accepts the contract sample", () => {
    const m = manifestSchema.parse(sample);
    expect(atlasSize(m)).toEqual({ width: 1280, height: 1024 });
  });

  it.each([
    ["no frames", { ...sample, frames: 0 }],
    ["four pigment slots", { ...sample, pigmentSlots: 4 }],
    [
      "missing seed",
      { ...sample, provenance: { ...sample.provenance, seed: undefined } },
    ],
    [
      "wrong license",
      { ...sample, provenance: { ...sample.provenance, license: "MIT" } },
    ],
    [
      "breathe past the end",
      { ...sample, breathe: { from: 16, to: 20, periodSeconds: 6 } },
    ],
  ])("rejects %s", (_name, value) => {
    expect(manifestSchema.safeParse(value).success).toBe(false);
  });
});
