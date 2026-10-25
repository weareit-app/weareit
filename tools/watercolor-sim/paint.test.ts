import { describe, expect, it } from "vitest";
import { manifestSchema } from "@it/watercolor/manifest";
import { paint } from "./paint.ts";
import { DEFAULT_SETTINGS } from "./sim.ts";

const options = {
  id: "test-dot",
  seed: 7,
  frames: 4,
  columns: 2,
  // Small and short so the test stays quick.
  settings: {
    ...DEFAULT_SETTINGS,
    size: 48,
    steps: 120,
    spreadSteps: 40,
    rewets: [],
  },
  pigmentsUsed: ["teal-blue", "cyan-green", "warm-yellow"],
  createdAt: "2026-10-17",
};

describe("paint", () => {
  it("paints the same atlas for the same seed and settings (FR-006)", () => {
    expect(paint(options).atlas.equals(paint(options).atlas)).toBe(true);
  });

  it("paints a different dot for a different seed", () => {
    expect(
      paint(options).atlas.equals(paint({ ...options, seed: 8 }).atlas),
    ).toBe(false);
  });

  it("writes a manifest that matches the contract", () => {
    const { manifest } = paint(options);
    expect(manifestSchema.safeParse(manifest).success).toBe(true);
    expect(manifest.provenance.license).toBe("CC0-1.0");
  });
});
