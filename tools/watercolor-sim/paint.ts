// Paint a watercolor dot ahead of time and write it as an atlas of pigment
// densities plus a manifest with its provenance.
//
//   pnpm --filter @it/watercolor-sim paint -- --id orb-01 --seed 1729
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { encodeRgbPng } from "./png.ts";
import { DEFAULT_SETTINGS, simulate, type SimSettings } from "./sim.ts";

export const SIM_VERSION = "0.1.0";
export const DENSITY_SCALE = 2;

export interface PaintOptions {
  id: string;
  seed: number;
  frames: number;
  columns: number;
  settings: SimSettings;
  pigmentsUsed: readonly string[];
  createdAt: string;
}

// Frames are spaced to show the spreading drop in detail, then the slower
// drying; the last frame is the finished, dried dot.
export function captureSteps(steps: number, frames: number): number[] {
  return Array.from({ length: frames }, (_, i) =>
    Math.round(steps * (i / (frames - 1)) ** 1.6),
  );
}

export function paint(o: PaintOptions) {
  const { size, pigments } = o.settings;
  const frames = simulate(
    o.seed,
    o.settings,
    captureSteps(o.settings.steps, o.frames),
  );
  const rows = Math.ceil(o.frames / o.columns);
  const width = size * o.columns;
  const height = size * rows;
  const rgb = new Uint8Array(width * height * 3);
  const cells = size * size;
  frames.forEach((frame, f) => {
    const ox = (f % o.columns) * size;
    const oy = Math.floor(f / o.columns) * size;
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const p = ((oy + y) * width + ox + x) * 3;
        for (let k = 0; k < 3; k += 1) {
          const d = k < pigments ? frame.density[k * cells + y * size + x]! : 0;
          rgb[p + k] = Math.round(
            Math.min(Math.max(d / DENSITY_SCALE, 0), 1) * 255,
          );
        }
      }
    }
  });
  const manifest = {
    schema: 1,
    id: o.id,
    size,
    frames: o.frames,
    columns: o.columns,
    pigmentSlots: pigments,
    densityScale: DENSITY_SCALE,
    fps: 12,
    // Played back and forth, so the loop has no seam.
    ...(o.frames > 1 && {
      breathe: {
        from: Math.max(o.frames - 5, 0),
        to: o.frames - 1,
        periodSeconds: 6,
      },
    }),
    provenance: {
      seed: o.seed,
      simVersion: SIM_VERSION,
      settings: { ...o.settings, granulation: [...o.settings.granulation] },
      pigmentsUsed: [...o.pigmentsUsed],
      createdAt: o.createdAt,
      license: "CC0-1.0",
      method:
        "Curtis et al. 1997 shallow-water watercolor model, implemented in tools/watercolor-sim",
    },
  };
  return { atlas: encodeRgbPng(width, height, rgb), manifest };
}

function arg(name: string, fallback: string): string {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1]! : fallback;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const id = arg("id", "orb-01");
  const settings: SimSettings = {
    ...DEFAULT_SETTINGS,
    size: Number(arg("size", String(DEFAULT_SETTINGS.size))),
  };
  const { atlas, manifest } = paint({
    id,
    seed: Number(arg("seed", "1729")),
    frames: Number(arg("frames", "20")),
    columns: Number(arg("columns", "5")),
    settings,
    pigmentsUsed: arg("pigments", "teal-blue,cyan-green,warm-yellow").split(
      ",",
    ),
    createdAt: arg("date", new Date().toISOString().slice(0, 10)),
  });
  const here = dirname(fileURLToPath(import.meta.url));
  const out = join(here, "../../apps/app/assets/watercolor", id);
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, "atlas.png"), atlas);
  writeFileSync(
    join(out, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  console.log(`Painted ${id}: ${out} (${atlas.length} bytes)`);
}
