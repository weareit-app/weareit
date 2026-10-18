import { describe, expect, it } from "vitest";
import {
  DEFAULT_PALETTE_ID,
  isVisible,
  LOADER_PALETTES,
  PALETTES,
  paletteSchema,
} from "../src/palettes.ts";
import { pigmentSchema } from "../src/pigment.ts";
import {
  blendPaletteUniforms,
  cyclePaletteUniforms,
  paletteUniforms,
} from "../src/shaders/index.ts";

const pigment = (id: string, masstone: string, tint: string) => ({
  id,
  name: id,
  masstone,
  tint,
  granulation: 0,
});

describe("palettes", () => {
  it("defaults to It's orb palette (FR-016)", () => {
    expect(DEFAULT_PALETTE_ID).toBe("it-orb");
  });

  it.each(Object.values(PALETTES))(
    "$id is visible on paper (FR-018)",
    (palette) => {
      expect(isVisible(palette)).toBe(true);
    },
  );

  it("flags a near-white pigment as invisible", () => {
    const pale = paletteSchema.parse({
      id: "pale",
      name: "Pale",
      pigments: [
        pigment("ghost", "#f2f2f2", "#fbfbfb"),
        pigment("blue", "#0b2d8a", "#a9bff0"),
      ],
    });
    expect(isVisible(pale)).toBe(false);
  });

  it("accepts two to four pigments only (FR-014)", () => {
    const blue = pigment("blue", "#0b2d8a", "#a9bff0");
    const base = { id: "x", name: "X" };
    expect(paletteSchema.safeParse({ ...base, pigments: [blue] }).success).toBe(
      false,
    );
    expect(
      paletteSchema.safeParse({
        ...base,
        pigments: [blue, blue, blue, blue, blue],
      }).success,
    ).toBe(false);
    expect(
      paletteSchema.safeParse({ ...base, pigments: [blue, blue] }).success,
    ).toBe(true);
  });

  it("rejects a tint darker than its masstone", () => {
    expect(
      pigmentSchema.safeParse(pigment("odd", "#a9bff0", "#0b2d8a")).success,
    ).toBe(false);
  });

  it("zeroes unused pigment slots in shader uniforms", () => {
    const u = paletteUniforms(PALETTES["rose-violet"]);
    expect(u.uK2).toEqual([0, 0, 0]);
    expect(u.uS3).toEqual([0, 0, 0]);
    expect(u.uK0.every((v) => v > 0)).toBe(true);
  });

  it("loader cycle starts with It's own palette and uses only visible palettes", () => {
    expect(LOADER_PALETTES[0]).toBe("it-orb");
    expect(LOADER_PALETTES.length).toBeGreaterThan(1);
    for (const id of LOADER_PALETTES)
      expect(isVisible(PALETTES[id])).toBe(true);
  });

  it("blends palettes smoothly and wraps around the cycle", () => {
    const a = paletteUniforms(PALETTES["it-orb"]);
    const b = paletteUniforms(PALETTES.sunrise);
    expect(blendPaletteUniforms(a, b, 0)).toEqual(a);
    expect(blendPaletteUniforms(a, b, 1).uK0[0]).toBeCloseTo(b.uK0[0]);
    const half = blendPaletteUniforms(a, b, 0.5).uK1[1];
    expect(half).toBeCloseTo((a.uK1[1] + b.uK1[1]) / 2);
    const cycle = [a, b];
    expect(cyclePaletteUniforms(cycle, 2)).toEqual(a);
    expect(cyclePaletteUniforms(cycle, 1.5).uS2[2]).toBeCloseTo(
      (b.uS2[2] + a.uS2[2]) / 2,
    );
  });
});
