import CanvasKitInit from "canvaskit-wasm";
import { beforeAll, describe, expect, it } from "vitest";
import { PALETTES } from "../src/palettes.ts";
import {
  DOT_B_SKSL,
  DOT_E_SKSL,
  paletteUniforms,
} from "../src/shaders/index.ts";

type CanvasKit = Awaited<ReturnType<typeof CanvasKitInit>>;
let CK: CanvasKit;

beforeAll(async () => {
  CK = await CanvasKitInit();
});

function compile(source: string) {
  const errors: string[] = [];
  const effect = CK.RuntimeEffect.Make(source, (e) => errors.push(e));
  return { effect, errors };
}

describe("SkSL shaders", () => {
  it.each([
    ["Option B", DOT_B_SKSL],
    ["Option E", DOT_E_SKSL],
  ])("%s compiles", (_name, source) => {
    const { effect, errors } = compile(source);
    expect(errors).toEqual([]);
    expect(effect).not.toBeNull();
  });

  it("Option B draws a colored dot on transparent surroundings", () => {
    const { effect } = compile(DOT_B_SKSL);
    const u = paletteUniforms(PALETTES["it-orb"]);
    const values: Record<string, number[]> = {
      uSize: [64, 64],
      uTime: [0],
      uBloom: [1],
      uDry: [1],
      uBreathe: [0],
      uSeed: [1],
      uOpacity: [1],
      uGran: u.uGran,
      uK0: u.uK0,
      uK1: u.uK1,
      uK2: u.uK2,
      uK3: u.uK3,
      uS0: u.uS0,
      uS1: u.uS1,
      uS2: u.uS2,
      uS3: u.uS3,
      uPaper: u.uPaper,
    };
    const order = Array.from({ length: effect!.getUniformCount() }, (_, i) =>
      effect!.getUniformName(i),
    );
    const shader = effect!.makeShader(order.flatMap((n) => values[n]!));
    const surface = CK.MakeSurface(64, 64)!;
    const paint = new CK.Paint();
    paint.setShader(shader);
    surface.getCanvas().drawRect(CK.XYWHRect(0, 0, 64, 64), paint);
    const px = surface.makeImageSnapshot().readPixels(0, 0, {
      width: 64,
      height: 64,
      colorType: CK.ColorType.RGBA_8888,
      alphaType: CK.AlphaType.Unpremul,
      colorSpace: CK.ColorSpace.SRGB,
    }) as Uint8Array;
    const at = (x: number, y: number) =>
      Array.from(px.slice((y * 64 + x) * 4, (y * 64 + x) * 4 + 4));
    expect(at(1, 1)[3]).toBe(0); // corner: outside the dot
    const center = at(32, 32);
    expect(center[3]).toBe(255);
    expect(center[2]! + center[1]!).toBeGreaterThan(center[0]! * 2); // blue-green, not gray or red
  });
});
