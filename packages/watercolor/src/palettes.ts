import { z } from "zod";
import { mix } from "./mix.ts";
import {
  deriveKs,
  hexToLinear,
  luminance,
  pigmentSchema,
  type PigmentOptics,
} from "./pigment.ts";

// It's off-white paper (docs/brand/colors.md).
export const PAPER = "#fffdf7";

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
  return palette.pigments.map(deriveKs);
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

// It's own palette, painted with It's brand inks (tide-led palette,
// docs/brand/colors.md, chosen 2026-10-18): masstone = the ink, tint = the
// wash. Tide's wash is its deeper step-8 value; the paler step reads green.
const itOrb = paletteSchema.parse({
  id: "it-orb",
  name: "It orb",
  pigments: [
    {
      id: "tide",
      name: "Tide",
      masstone: "#087e9f",
      tint: "#61b0ce",
      granulation: 0.6,
    },
    {
      id: "sprout",
      name: "Sprout",
      masstone: "#00a95c",
      tint: "#a5ddb6",
      granulation: 0.3,
    },
    {
      id: "sun",
      name: "Sun",
      masstone: "#ffb511",
      tint: "#ffcb71",
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

// Palettes the loader travels through (founder, 2026-10-17: "other pigments,
// too, not just the brand"). Three pigments each, one per slot of dot B, all
// from It's brand inks.
const sunrise = paletteSchema.parse({
  id: "sunrise",
  name: "Sunrise",
  pigments: [
    {
      id: "poppy",
      name: "Poppy",
      masstone: "#f15060",
      tint: "#f8bbbb",
      granulation: 0.2,
    },
    {
      id: "ember",
      name: "Ember",
      masstone: "#ff6c2f",
      tint: "#ffb595",
      granulation: 0.3,
    },
    {
      id: "sun",
      name: "Sun",
      masstone: "#ffb511",
      tint: "#ffcb71",
      granulation: 0.1,
    },
  ],
} satisfies PaletteInput);

const dusk = paletteSchema.parse({
  id: "dusk",
  name: "Dusk",
  pigments: [
    {
      id: "dusk",
      name: "Dusk",
      masstone: "#765ba7",
      tint: "#d3c8ed",
      granulation: 0.7,
    },
    {
      id: "harbor",
      name: "Harbor",
      masstone: "#3d5588",
      tint: "#c3d3f3",
      granulation: 0.6,
    },
    {
      id: "bloom",
      name: "Bloom",
      masstone: "#ff48b0",
      tint: "#f2bad3",
      granulation: 0.2,
    },
  ],
} satisfies PaletteInput);

export const PALETTES = {
  "it-orb": itOrb,
  "rose-violet": roseViolet,
  sunrise,
  dusk,
} as const;
export type PaletteId = keyof typeof PALETTES;
export const DEFAULT_PALETTE_ID: PaletteId = "it-orb";

// The order the loader's colors travel in, returning to It's own.
export const LOADER_PALETTES: readonly PaletteId[] = [
  "it-orb",
  "sunrise",
  "dusk",
];
