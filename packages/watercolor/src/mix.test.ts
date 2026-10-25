import { describe, expect, it } from "vitest";
import { mix } from "./mix.ts";
import {
  deriveKS,
  hexToLinear,
  layerReflectance,
  luminance,
  TINT_DENSITY,
  type Pigment,
  type Rgb,
} from "./pigment.ts";

const blue: Pigment = {
  id: "blue",
  name: "Blue",
  masstone: "#0b2d8a",
  tint: "#a9bff0",
  granulation: 0,
};
const yellow: Pigment = {
  id: "yellow",
  name: "Yellow",
  masstone: "#e0b000",
  tint: "#f8eaa0",
  granulation: 0,
};
const paper = hexToLinear("#ffffff");

function hue([r, g, b]: readonly number[]): number {
  const max = Math.max(r!, g!, b!);
  const min = Math.min(r!, g!, b!);
  const d = max - min;
  if (d === 0) return 0;
  const h =
    max === r
      ? ((g! - b!) / d) % 6
      : max === g
        ? (b! - r!) / d + 2
        : (r! - g!) / d + 4;
  return (h * 60 + 360) % 360;
}

describe("Kubelka-Munk pigments", () => {
  it("derives K and S that match the tint's lightness at TINT_DENSITY", () => {
    const { k, s } = deriveKS(blue);
    const wash = [0, 1, 2].map((c) =>
      layerReflectance(k[c]!, s[c]!, TINT_DENSITY, 1),
    ) as unknown as Rgb;
    expect(luminance(wash)).toBeCloseTo(luminance(hexToLinear(blue.tint)), 3);
  });

  it("returns the paper color when no pigment is present", () => {
    expect(mix([deriveKS(blue)], [0], paper)).toEqual(paper);
  });

  it("mixes blue and yellow into a green, darker than either tint (FR-015)", () => {
    const b = deriveKS(blue);
    const y = deriveKS(yellow);
    const green = mix([b, y], [0.6, 0.6], paper);
    const h = hue(green);
    expect(h).toBeGreaterThan(70);
    expect(h).toBeLessThan(170);
    expect(luminance(green)).toBeLessThan(luminance(hexToLinear(blue.tint)));
    expect(luminance(green)).toBeLessThan(luminance(hexToLinear(yellow.tint)));
  });

  it("gets darker as density rises", () => {
    const b = deriveKS(blue);
    expect(luminance(mix([b], [1], paper))).toBeLessThan(
      luminance(mix([b], [0.2], paper)),
    );
  });
});
