import { describe, expect, it } from "vitest";
import {
  DEFAULT_PALETTE_ID,
  isVisible,
  PALETTES,
  paletteSchema,
} from "../src/palettes.ts";
import { pigmentSchema } from "../src/pigment.ts";
import { paletteUniforms } from "../src/shaders/index.ts";

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
});
