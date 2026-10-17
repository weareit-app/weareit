import { paletteOptics, type Palette } from "../palettes.ts";
import { hexToLinear } from "../pigment.ts";

export { DOT_B_SKSL } from "./dot-b.ts";
export { DOT_E_SKSL } from "./dot-e.ts";
export { GATHER_SKSL } from "./gather.ts";
export { DOT_B_GLSL, FULLSCREEN_VERTEX_GLSL, skslToGlsl } from "./glsl.ts";
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

// Paint-like blend between two palettes: absorption and scattering are mixed,
// so the colors change the way pigment would. Runs as a worklet too.
export function blendPaletteUniforms(
  a: PaletteUniforms,
  b: PaletteUniforms,
  f: number,
): PaletteUniforms {
  "worklet";
  const l = (x: Vec3, y: Vec3): Vec3 => [
    x[0] + (y[0] - x[0]) * f,
    x[1] + (y[1] - x[1]) * f,
    x[2] + (y[2] - x[2]) * f,
  ];
  return {
    uK0: l(a.uK0, b.uK0),
    uK1: l(a.uK1, b.uK1),
    uK2: l(a.uK2, b.uK2),
    uK3: l(a.uK3, b.uK3),
    uS0: l(a.uS0, b.uS0),
    uS1: l(a.uS1, b.uS1),
    uS2: l(a.uS2, b.uS2),
    uS3: l(a.uS3, b.uS3),
    uPaper: l(a.uPaper, b.uPaper),
    uGran: l(a.uGran, b.uGran),
  };
}

// Uniforms for a point along a cycle of palettes: position 1.5 is halfway
// from the second palette to the third. Wraps around.
export function cyclePaletteUniforms(
  cycle: readonly PaletteUniforms[],
  position: number,
): PaletteUniforms {
  "worklet";
  const n = cycle.length;
  const i = ((Math.floor(position) % n) + n) % n;
  const f = position - Math.floor(position);
  return blendPaletteUniforms(cycle[i]!, cycle[(i + 1) % n]!, f);
}

// Uniforms for the gathering loader: It's palette in slots 0–2 and a guest
// palette in slots 3–5, plus the drops from gather.ts.
export function gatherUniforms(
  it: PaletteUniforms,
  guest: PaletteUniforms,
  drops: readonly number[],
) {
  "worklet";
  const u: Record<string, number[]> = {
    uK0: it.uK0,
    uK1: it.uK1,
    uK2: it.uK2,
    uS0: it.uS0,
    uS1: it.uS1,
    uS2: it.uS2,
    uK3: guest.uK0,
    uK4: guest.uK1,
    uK5: guest.uK2,
    uS3: guest.uS0,
    uS4: guest.uS1,
    uS5: guest.uS2,
    uPaper: it.uPaper,
    uGran: it.uGran,
  };
  for (let i = 0; i < 10; i += 1) {
    const o = i * 8;
    u[`uDropA${i}`] = [drops[o]!, drops[o + 1]!, drops[o + 2]!, drops[o + 3]!];
    u[`uDropB${i}`] = [
      drops[o + 4]!,
      drops[o + 5]!,
      drops[o + 6]!,
      drops[o + 7]!,
    ];
  }
  return u;
}
