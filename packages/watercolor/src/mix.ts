import { layerReflectance, type PigmentOptics, type Rgb } from "./pigment.ts";

// Mix pigments the way paint mixes: absorption and scattering add, weighted by
// how much of each pigment is present, and the combined layer is lit over the
// paper. Densities are in pigment units (TINT_DENSITY is a thin wash).
export function mix(
  pigments: readonly PigmentOptics[],
  densities: readonly number[],
  paper: Rgb,
): Rgb {
  let total = 0;
  for (const d of densities) total += Math.max(d, 0);
  const channel = (c: 0 | 1 | 2): number => {
    if (total <= 0) return paper[c];
    let k = 0;
    let s = 0;
    pigments.forEach((p, i) => {
      const d = Math.max(densities[i] ?? 0, 0);
      k += d * p.k[c];
      s += d * p.s[c];
    });
    // Thickness is folded into the summed K and S, so x = 1.
    return layerReflectance(k, s, 1, paper[c]);
  };
  return [channel(0), channel(1), channel(2)];
}
