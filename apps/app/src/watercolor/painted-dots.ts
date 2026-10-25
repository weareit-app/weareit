import {
  manifestSchema,
  type PaintedDotManifest,
} from "@it/watercolor/manifest";

// Dots painted ahead of time by tools/watercolor-sim (Option E). A manifest
// that fails validation is left out, so its dot falls back to the painted orb.
export interface PaintedDot {
  manifest: PaintedDotManifest;
  atlas: number; // Metro asset id
}

function entry(manifest: unknown, atlas: number): PaintedDot | undefined {
  const parsed = manifestSchema.safeParse(manifest);
  return parsed.success ? { manifest: parsed.data, atlas } : undefined;
}

export const PAINTED_DOTS: Record<string, PaintedDot | undefined> = {
  "orb-01": entry(
    require("../../assets/watercolor/orb-01/manifest.json"),
    require("../../assets/watercolor/orb-01/atlas.png") as number,
  ),
};

export const DEFAULT_DOT_ID = "orb-01";
