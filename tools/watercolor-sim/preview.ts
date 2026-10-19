// Color a painted dot's frames with a palette and write a contact sheet, so
// the simulation can be judged by eye while tuning.
//
//   node --experimental-strip-types tools/watercolor-sim/preview.ts --seed 1729 --palette it-orb --out /tmp/orb.png
import { writeFileSync } from "node:fs";
import { mix } from "../../packages/watercolor/src/mix.ts";
import {
  PALETTES,
  paletteOptics,
  type PaletteId,
} from "../../packages/watercolor/src/palettes.ts";
import {
  hexToLinear,
  linearToSrgb,
} from "../../packages/watercolor/src/pigment.ts";
import { captureSteps } from "./paint.ts";
import { encodeRgbPng } from "./png.ts";
import { DEFAULT_SETTINGS, simulate } from "./sim.ts";

function arg(name: string, fallback: string): string {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1]! : fallback;
}

const seed = Number(arg("seed", "1729"));
const palette = PALETTES[arg("palette", "it-orb") as PaletteId];
const frameCount = Number(arg("frames", "20"));
const columns = Number(arg("columns", "5"));
const settings = { ...DEFAULT_SETTINGS };
const size = settings.size;
const frames = simulate(
  seed,
  settings,
  captureSteps(settings.steps, frameCount),
);
const optics = paletteOptics(palette).slice(0, settings.pigments);
const paper = hexToLinear(palette.paper);
const rows = Math.ceil(frameCount / columns);
const width = size * columns;
const rgb = new Uint8Array(width * size * rows * 3);
const cells = size * size;
frames.forEach((frame, f) => {
  const ox = (f % columns) * size;
  const oy = Math.floor(f / columns) * size;
  for (let i = 0; i < cells; i += 1) {
    const d = optics.map((_, k) => Math.min(frame.density[k * cells + i]!, 2));
    const c = mix(optics, d, paper);
    const p = ((oy + Math.floor(i / size)) * width + ox + (i % size)) * 3;
    for (let k = 0; k < 3; k += 1)
      rgb[p + k] = Math.round(linearToSrgb(c[k]!) * 255);
  }
});
const out = arg("out", "preview.png");
writeFileSync(out, encodeRgbPng(width, size * rows, rgb));
console.log(`Wrote ${out}`);
