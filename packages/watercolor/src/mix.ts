import { layerReflectance, type PigmentOptics, type Rgb } from "./pigment.ts";

// Mix pigments the way paint mixes: absorption and scattering add, weighted by
// how much of each pigment is present, and the combined layer is lit over the
// paper. Densities are in pigment units (TINT_DENSITY is a thin wash).
export function mix(
  pigments: readonly PigmentOptics[],
  densities: readonly number[],
  paper: Rgb,
): Rgb {
  const out: number[] = [0, 0, 0];
  let total = 0;
  for (const d of densities) total += Math.max(d, 0);
  for (let c = 0; c < 3; c += 1) {
    if (total <= 0) {
      out[c] = paper[c]!;
      continue;
    }
    let k = 0;
    let s = 0;
    pigments.forEach((p, i) => {
      const d = Math.max(densities[i] ?? 0, 0);
      k += d * p.k[c]!;
      s += d * p.s[c]!;
    });
    // Thickness is folded into the summed K and S, so x = 1.
    out[c] = layerReflectance(k, s, 1, paper[c]!);
  }
  return [out[0]!, out[1]!, out[2]!];
}
