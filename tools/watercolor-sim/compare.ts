// Render the painted orb, Option B and Option E side by side, in It's palette
// and the proof palette, with the same shaders the app uses (via CanvasKit).
//
//   node --experimental-strip-types tools/watercolor-sim/compare.ts --out /tmp/compare.png [--dot orb-01] [--frame last]
import CanvasKitInit from "canvaskit-wasm";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { manifestSchema } from "@it/watercolor/manifest";
import { PALETTES, type PaletteId } from "@it/watercolor/palettes";
import {
  DOT_B_SKSL,
  DOT_E_SKSL,
  paletteUniforms,
} from "@it/watercolor/shaders";

function arg(name: string, fallback: string): string {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1]! : fallback;
}

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "../..");
const dotId = arg("dot", "orb-01");
const dotDir = join(root, "apps/app/assets/watercolor", dotId);
const manifest = manifestSchema.parse(
  JSON.parse(readFileSync(join(dotDir, "manifest.json"), "utf8")),
);
const frameArg = arg("frame", "last");
const frame = frameArg === "last" ? manifest.frames - 1 : Number(frameArg);

const CK = await CanvasKitInit();
const CELL = 320;
const DOT = 280;
const palettes: PaletteId[] = ["it-orb", "rose-violet"];
const surface = CK.MakeSurface(CELL * 3, CELL * palettes.length)!;
const canvas = surface.getCanvas();
canvas.clear(CK.WHITE);

const reference = CK.MakeImageFromEncoded(
  readFileSync(join(root, "apps/app/assets/brand/watercolor-orb.jpg")),
)!;
const atlas = CK.MakeImageFromEncoded(readFileSync(join(dotDir, "atlas.png")))!;
const effectB = CK.RuntimeEffect.Make(DOT_B_SKSL)!;
const effectE = CK.RuntimeEffect.Make(DOT_E_SKSL)!;

function uniforms(
  effect: NonNullable<typeof effectB>,
  values: Record<string, number[]>,
): number[] {
  return Array.from({ length: effect.getUniformCount() }, (_, i) => {
    const name = effect.getUniformName(i);
    const v = values[name];
    if (!v) throw new Error(`Missing uniform ${name}`);
    return v;
  }).flat();
}

palettes.forEach((id, row) => {
  const pal = paletteUniforms(PALETTES[id]);
  const y = row * CELL + (CELL - DOT) / 2;
  const x0 = (CELL - DOT) / 2;

  // Reference: the painted orb, cropped to its dot (never re-colored).
  const paint = new CK.Paint();
  canvas.drawImageRect(
    reference,
    CK.XYWHRect(420, 0, 270, 270),
    CK.XYWHRect(x0, y, DOT, DOT),
    paint,
  );

  // Option B: look-alike shader, settled state.
  canvas.save();
  canvas.translate(CELL + x0, y);
  const pb = new CK.Paint();
  pb.setShader(
    effectB.makeShader(
      uniforms(effectB, {
        ...pal,
        uSize: [DOT, DOT],
        uTime: [0],
        uBloom: [1],
        uDry: [1],
        uBreathe: [0],
        uSeed: [3],
        uOpacity: [1],
      }),
    ),
  );
  canvas.drawRect(CK.XYWHRect(0, 0, DOT, DOT), pb);
  canvas.restore();

  // Option E: physics-painted atlas, colored live.
  canvas.save();
  canvas.translate(2 * CELL + x0, y);
  const pe = new CK.Paint();
  const child = atlas.makeShaderOptions(
    CK.TileMode.Clamp,
    CK.TileMode.Clamp,
    CK.FilterMode.Linear,
    CK.MipmapMode.None,
  );
  pe.setShader(
    effectE.makeShaderWithChildren(
      uniforms(effectE, {
        ...pal,
        uSize: [DOT, DOT],
        uFrame: [frame],
        uFrames: [manifest.frames],
        uColumns: [manifest.columns],
        uFrameSize: [manifest.size],
        uDensityScale: [manifest.densityScale],
      }),
      [child],
    ),
  );
  canvas.drawRect(CK.XYWHRect(0, 0, DOT, DOT), pe);
  canvas.restore();
});

const out = arg("out", "compare.png");
writeFileSync(out, surface.makeImageSnapshot().encodeToBytes()!);
console.log(
  `Wrote ${out} (columns: painted orb, B look-alike, E physics-painted; rows: ${palettes.join(", ")})`,
);
