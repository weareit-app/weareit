import { z } from "zod";

// Contract: specs/007-watercolor-dot/contracts/painted-dot-manifest.md
export const manifestSchema = z
  .object({
    schema: z.literal(1),
    id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
    size: z.number().int().positive(),
    frames: z.number().int().min(1),
    columns: z.number().int().min(1),
    // RGB only: alpha would be premultiplied into the colour channels on decode.
    pigmentSlots: z.number().int().min(2).max(3),
    densityScale: z.number().positive(),
    fps: z.number().positive(),
    breathe: z
      .object({
        from: z.number().int().min(0),
        to: z.number().int().min(0),
        periodSeconds: z.number().positive(),
      })
      .optional(),
    provenance: z.object({
      seed: z.number().int(),
      simVersion: z.string().min(1),
      settings: z.record(z.string(), z.unknown()),
      pigmentsUsed: z.array(z.string()).min(1),
      createdAt: z.string().min(1),
      license: z.literal("CC0-1.0"),
      method: z.string().min(1),
    }),
  })
  .refine(
    (m) =>
      !m.breathe || (m.breathe.from < m.breathe.to && m.breathe.to < m.frames),
    {
      message: "breathe must satisfy from < to < frames",
      path: ["breathe"],
    },
  );

export type PaintedDotManifest = z.infer<typeof manifestSchema>;

export function atlasSize(m: PaintedDotManifest): {
  width: number;
  height: number;
} {
  return {
    width: m.size * m.columns,
    height: m.size * Math.ceil(m.frames / m.columns),
  };
}
