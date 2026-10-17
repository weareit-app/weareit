import { z } from "zod";
import { mix } from "./mix.ts";
import {
  deriveKS,
  hexToLinear,
  luminance,
  pigmentSchema,
  type PigmentOptics,
} from "./pigment.ts";

export const PAPER = "#ffffff";

export const paletteSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  name: z.string().min(1),
  pigments: z.array(pigmentSchema).min(2).max(4),
  paper: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .default(PAPER),
});

export type Palette = z.infer<typeof paletteSchema>;
export type PaletteInput = z.input<typeof paletteSchema>;

// A pigment at this density must stand out from the paper by at least
// MIN_LUMINANCE_DIFFERENCE, or the dot could disappear (FR-018).
export const VISIBILITY_DENSITY = 0.5;
export const MIN_LUMINANCE_DIFFERENCE = 0.15;

export function paletteOptics(palette: Palette): PigmentOptics[] {
  return palette.pigments.map(deriveKS);
}

export function isVisible(palette: Palette): boolean {
  const paper = hexToLinear(palette.paper);
  const optics = paletteOptics(palette);
  return optics.every((p) => {
    const r = mix([p], [VISIBILITY_DENSITY], paper);
    return (
      Math.abs(luminance(paper) - luminance(r)) >= MIN_LUMINANCE_DIFFERENCE
    );
  });
}

// It's own palette, matched to the painted orb (reference-dot.png) by
// scripts/fit-orb-palette.ts: masstone = median of the darkest 5% of each hue
// family's pixels, tint = median of the lightest 20%.
const itOrb = paletteSchema.parse({
  id: "it-orb",
  name: "It orb",
  pigments: [
    {
      id: "teal-blue",
      name: "Teal blue",
      masstone: "#006382",
      tint: "#00b7cf",
      granulation: 0.6,
    },
    {
      id: "cyan-green",
      name: "Cyan green",
      masstone: "#018164",
      tint: "#15d7a4",
      granulation: 0.3,
    },
    {
      id: "warm-yellow",
      name: "Warm yellow",
      masstone: "#ccce46",
      tint: "#cfda7e",
      granulation: 0.1,
    },
  ],
} satisfies PaletteInput);

const roseViolet = paletteSchema.parse({
  id: "rose-violet",
  name: "Rose and violet",
  pigments: [
    {
      id: "rose",
      name: "Rose",
      masstone: "#c0283c",
      tint: "#f6c1c4",
      granulation: 0.2,
    },
    {
      id: "violet",
      name: "Violet",
      masstone: "#3d1a78",
      tint: "#c9b6ea",
      granulation: 0.7,
    },
  ],
} satisfies PaletteInput);

export const PALETTES = { "it-orb": itOrb, "rose-violet": roseViolet } as const;
export type PaletteId = keyof typeof PALETTES;
export const DEFAULT_PALETTE_ID: PaletteId = "it-orb";
