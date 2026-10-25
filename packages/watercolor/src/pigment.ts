import { z } from "zod";

// A pigment is authored as two colors a designer can pick: its masstone
// (full strength) and its tint (a thin wash over white paper). Kubelka-Munk
// absorption (K) and scattering (S) are derived from those, so palettes stay
// data and mixes behave like paint. The masstone sets the hue; the tint sets
// how strong a thin wash is.

export type Rgb = readonly [number, number, number];

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Expected #rrggbb");

export const pigmentSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Expected kebab-case"),
    name: z.string().min(1),
    masstone: hex,
    tint: hex,
    granulation: z.number().min(0).max(1),
  })
  .refine(
    (p) => luminance(hexToLinear(p.tint)) > luminance(hexToLinear(p.masstone)),
    {
      message: "tint must be lighter than masstone",
      path: ["tint"],
    },
  );

export type Pigment = z.infer<typeof pigmentSchema>;

export interface PigmentOptics {
  readonly k: Rgb;
  readonly s: Rgb;
}

// Density at which a pigment shows its `tint` over white paper.
export const TINT_DENSITY = 0.2;

export function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function linearToSrgb(c: number): number {
  const v = Math.min(Math.max(c, 0), 1);
  return v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055;
}

export function hexToLinear(value: string): Rgb {
  const n = Number.parseInt(value.slice(1), 16);
  return [
    srgbToLinear(((n >> 16) & 255) / 255),
    srgbToLinear(((n >> 8) & 255) / 255),
    srgbToLinear((n & 255) / 255),
  ];
}

export function linearToHex(rgb: Rgb): string {
  return `#${rgb
    .map((c) =>
      Math.round(linearToSrgb(c) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

export function luminance(rgb: Rgb): number {
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

// Kubelka-Munk reflectance of a layer with absorption k, scattering s and
// thickness x over a ground of reflectance rg (one channel, linear light).
export function layerReflectance(
  k: number,
  s: number,
  x: number,
  rg: number,
): number {
  if (k <= 0 && s <= 0) return rg;
  const sx = Math.max(s, 1e-6);
  const a = 1 + k / sx;
  const b = Math.sqrt(Math.max(a * a - 1, 1e-12));
  const bsx = Math.min(b * sx * x, 30);
  const coth = 1 / Math.tanh(Math.max(bsx, 1e-6));
  return (1 - rg * (a - b * coth)) / (a - rg + b * coth);
}

const MIN_R = 0.001;
const MAX_R = 0.999;

// Watercolor pigments are mostly transparent: they color by absorbing light
// and let the paper do most of the reflecting. So each pigment gets one gray
// scattering value, its absorption per channel follows the masstone's K/S
// ratio, and the scattering is scaled so a thin wash matches the tint's
// lightness. (Fitting S per channel let bright channels of one pigment
// overpower another's absorption, so blue + yellow came out orange.)
export function deriveKS(pigment: Pigment): PigmentOptics {
  const m = hexToLinear(pigment.masstone);
  const ratio = m.map((c) => {
    const r = Math.min(Math.max(c, MIN_R), MAX_R);
    return (1 - r) ** 2 / (2 * r);
  }) as unknown as Rgb;
  const target = luminance(hexToLinear(pigment.tint));
  const lumAt = (s: number) =>
    luminance(
      ([0, 1, 2] as const).map((c) =>
        layerReflectance(ratio[c] * s, s, TINT_DENSITY, 1),
      ) as unknown as Rgb,
    );
  let lo = Math.log(1e-4);
  let hi = Math.log(1e4);
  for (let i = 0; i < 80; i += 1) {
    const mid = (lo + hi) / 2;
    if (lumAt(Math.exp(mid)) > target) lo = mid;
    else hi = mid;
  }
  const s = Math.exp((lo + hi) / 2);
  return { k: [ratio[0] * s, ratio[1] * s, ratio[2] * s], s: [s, s, s] };
}
