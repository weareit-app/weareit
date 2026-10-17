import { paletteOptics, type Palette } from "../palettes.ts";
import { hexToLinear } from "../pigment.ts";

export { DOT_B_SKSL } from "./dot-b.ts";
export { DOT_E_SKSL } from "./dot-e.ts";
export { KM_SKSL, NOISE_SKSL } from "./km.ts";

type Vec3 = [number, number, number];

export interface PaletteUniforms {
  uK0: Vec3;
  uK1: Vec3;
  uK2: Vec3;
  uK3: Vec3;
  uS0: Vec3;
  uS1: Vec3;
  uS2: Vec3;
  uS3: Vec3;
  uPaper: Vec3;
  uGran: Vec3;
}

const ZERO: Vec3 = [0, 0, 0];

// Uniform values for KM_SKSL. Unused pigment slots are zero, so they add
// neither absorption nor scattering.
export function paletteUniforms(palette: Palette): PaletteUniforms {
  const optics = paletteOptics(palette);
  const k = (i: number): Vec3 => (optics[i] ? [...optics[i].k] : ZERO);
  const s = (i: number): Vec3 => (optics[i] ? [...optics[i].s] : ZERO);
  const g = (i: number) => palette.pigments[i]?.granulation ?? 0;
  return {
    uK0: k(0),
    uK1: k(1),
    uK2: k(2),
    uK3: k(3),
    uS0: s(0),
    uS1: s(1),
    uS2: s(2),
    uS3: s(3),
    uPaper: [...hexToLinear(palette.paper)],
    uGran: [g(0), g(1), g(2)],
  };
}
