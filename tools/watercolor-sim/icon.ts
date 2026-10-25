// Render It's app icon: the "it" or "we are it" letters with Option B's settled
// watercolor dot as the dot of the i, on opaque paper (App Store icons have no alpha).
// From a session on 2026-10-17 (mac-cozy-sparrow); seed 1 has the cleanest
// bloom. The app icon is "it" (founder, 2026-10-17, after trying "we are it"
// on a phone):
//
//   node --experimental-strip-types tools/watercolor-sim/icon.ts --out apps/app/assets/icon.png
//   node --experimental-strip-types tools/watercolor-sim/icon.ts --variant we-are-it --out /tmp/we-are-it.png
//   node --experimental-strip-types tools/watercolor-sim/icon.ts --variant dot --out /tmp/dot.png
//   node --experimental-strip-types tools/watercolor-sim/icon.ts --sheet 1,2,3,4,5,6,7,8,9 --out /tmp/seeds.png
//
// Options: --seed N (1), --fill F (share of the icon the mark's longer side
// fills: 0.68 for "it", 0.8 for "we are it", so iOS's rounded corners
// don't clip it), --size PX (1024).
import CanvasKitInit, { type Canvas } from "canvaskit-wasm";
import { writeFileSync } from "node:fs";
import { IT_MARK, WE_ARE_IT_MARK } from "@it/watercolor/marks";
import { PALETTES } from "@it/watercolor/palettes";
import { DOT_B_SKSL, paletteUniforms } from "@it/watercolor/shaders";
import { encodeRgbPng } from "./png.ts";

function arg(name: string, fallback: string): string {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1]! : fallback;
}

// Each mark and its extent in the logo's coordinates, dot included.
const MARKS = {
  it: { mark: IT_MARK, x: 131, y: 19, w: 762, h: 984 },
  "we-are-it": { mark: WE_ARE_IT_MARK, x: 29, y: 241, w: 1949, h: 1201 },
};
// At uBloom = 1 the shader's dot reaches about 0.9 of its half-width.
const DOT_REACH = 0.9;
// The brand files' dark ink (it-type-dark.svg).
const INK = "#1f1f1f";

const CK = await CanvasKitInit();
const effect = CK.RuntimeEffect.Make(DOT_B_SKSL)!;
const palette = PALETTES["it-orb"];
const pal = paletteUniforms(palette);
const paperHex = arg("paper", palette.paper);

function uniforms(values: Record<string, number[]>): number[] {
  return Array.from({ length: effect.getUniformCount() }, (_, i) => {
    const name = effect.getUniformName(i);
    const v = values[name];
    if (!v) throw new Error(`Missing uniform ${name}`);
    return v;
  }).flat();
}

function drawDot(
  canvas: Canvas,
  cx: number,
  cy: number,
  r: number,
  seed: number,
) {
  const side = (2 * r) / DOT_REACH;
  canvas.save();
  canvas.translate(cx - side / 2, cy - side / 2);
  const paint = new CK.Paint();
  paint.setAntiAlias(true);
  paint.setShader(
    effect.makeShader(
      uniforms({
        ...pal,
        uSize: [side, side],
        uTime: [0],
        uBloom: [1],
        uDry: [1],
        uBreathe: [0],
        uSeed: [seed],
        uOpacity: [1],
      }),
    ),
  );
  canvas.drawRect(CK.XYWHRect(0, 0, side, side), paint);
  canvas.restore();
}

function drawIcon(
  canvas: Canvas,
  x: number,
  y: number,
  size: number,
  variant: string,
  seed: number,
) {
  const bg = new CK.Paint();
  bg.setColor(CK.parseColorString(paperHex));
  canvas.drawRect(CK.XYWHRect(x, y, size, size), bg);
  if (variant === "dot") {
    drawDot(canvas, x + size / 2, y + size / 2, size * 0.34, seed);
    return;
  }
  const { mark, ...MARK } = MARKS[variant as keyof typeof MARKS];
  const fill = Number(arg("fill", variant === "it" ? "0.68" : "0.8"));
  const scale = (size * fill) / Math.max(MARK.w, MARK.h);
  canvas.save();
  canvas.translate(
    x + (size - MARK.w * scale) / 2 - MARK.x * scale,
    y + (size - MARK.h * scale) / 2 - MARK.y * scale,
  );
  canvas.scale(scale, scale);
  const ink = new CK.Paint();
  ink.setAntiAlias(true);
  ink.setColor(CK.parseColorString(INK));
  for (const { d, place, evenOdd } of mark.paths) {
    const path = CK.Path.MakeFromSVGString(d)!;
    if (evenOdd) path.setFillType(CK.FillType.EvenOdd);
    canvas.save();
    if (place) {
      canvas.translate(place.x, place.y);
      canvas.scale(place.scale, place.scale);
    }
    canvas.drawPath(path, ink);
    canvas.restore();
  }
  drawDot(canvas, mark.dot.x, mark.dot.y, mark.dot.r, seed);
  canvas.restore();
}

const size = Number(arg("size", "1024"));
const variant = arg("variant", "it");
const sheet = arg("sheet", "");
const seeds = sheet ? sheet.split(",").map(Number) : [Number(arg("seed", "1"))];
const columns = Math.min(seeds.length, 3);
const rows = Math.ceil(seeds.length / columns);
const cell = sheet ? 400 : size;
const width = cell * columns;
const height = cell * rows;
const surface = CK.MakeSurface(width, height)!;
const canvas = surface.getCanvas();
for (const [i, seed] of seeds.entries()) {
  drawIcon(
    canvas,
    (i % columns) * cell,
    Math.floor(i / columns) * cell,
    cell,
    variant,
    seed,
  );
}

const rgba = canvas.readPixels(0, 0, {
  width,
  height,
  colorType: CK.ColorType.RGBA_8888,
  alphaType: CK.AlphaType.Unpremul,
  colorSpace: CK.ColorSpace.SRGB,
}) as Uint8Array;
const rgb = new Uint8Array(width * height * 3);
for (let i = 0; i < width * height; i += 1)
  for (let k = 0; k < 3; k += 1) rgb[i * 3 + k] = rgba[i * 4 + k]!;
const out = arg("out", "icon.png");
writeFileSync(out, encodeRgbPng(width, height, rgb));
console.log(`Wrote ${out} (${variant}, seeds ${seeds.join(",")})`);
