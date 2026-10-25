// Fit It's orb palette (teal blue, cyan green, warm yellow) from the painted
// reference: for each hue family, the masstone is the median of its darkest
// pixels and the tint the median of its lightest.
//
// No longer feeds the it-orb palette: since 2026-10-18 it uses It's brand inks
// (docs/brand/colors.md). Kept for fitting a palette to a painted reference.
//
//   node --experimental-strip-types packages/watercolor/scripts/fit-orb-palette.ts [png]
import { readFileSync } from "node:fs";
import { inflateSync } from "node:zlib";

const file = process.argv[2] ?? "docs/research/watercolor/reference-dot.png";

// Indexes in this script are in range by construction; this says so loudly if
// one isn't.
function at<T>(list: ArrayLike<T>, i: number): T {
  const value = list[i];
  if (value === undefined) throw new Error(`Index ${i} is out of range`);
  return value;
}

function decodeRgbaPng(buf: Buffer): {
  width: number;
  height: number;
  data: Uint8Array;
} {
  let pos = 8;
  let width = 0;
  let height = 0;
  const idat: Buffer[] = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString("ascii", pos + 4, pos + 8);
    const body = buf.subarray(pos + 8, pos + 8 + len);
    if (type === "IHDR") {
      width = body.readUInt32BE(0);
      height = body.readUInt32BE(4);
      if (body[8] !== 8 || body[9] !== 6 || body[12] !== 0) {
        throw new Error("Expected 8-bit RGBA, non-interlaced PNG");
      }
    } else if (type === "IDAT") idat.push(body);
    pos += 12 + len;
  }
  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * 4;
  const data = new Uint8Array(height * stride);
  for (let y = 0; y < height; y += 1) {
    const filter = at(raw, y * (stride + 1));
    const row = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x += 1) {
      const a = x >= 4 ? at(data, y * stride + x - 4) : 0;
      const b = y > 0 ? at(data, (y - 1) * stride + x) : 0;
      const c = x >= 4 && y > 0 ? at(data, (y - 1) * stride + x - 4) : 0;
      let v = at(row, x);
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      data[y * stride + x] = v & 255;
    }
  }
  return { width, height, data };
}

function hsl(r: number, g: number, b: number): [number, number, number] {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  const h =
    max === r
      ? ((g - b) / d) % 6
      : max === g
        ? (b - r) / d + 2
        : (r - g) / d + 4;
  return [(h * 60 + 360) % 360, s, l];
}

const families = [
  { id: "teal-blue", hue: [185, 215] },
  { id: "cyan-green", hue: [140, 175] },
  { id: "warm-yellow", hue: [40, 95] },
] as const;

const { data } = decodeRgbaPng(readFileSync(file));
const groups = new Map<
  string,
  { l: number; rgb: [number, number, number] }[]
>();
for (let i = 0; i < data.length; i += 4) {
  if (at(data, i + 3) < 200) continue;
  const rgb: [number, number, number] = [
    at(data, i),
    at(data, i + 1),
    at(data, i + 2),
  ];
  const [h, s, l] = hsl(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);
  if (s < 0.2 || l > 0.97) continue;
  const fam = families.find((f) => h >= f.hue[0] && h <= f.hue[1]);
  if (!fam) continue;
  const list = groups.get(fam.id) ?? [];
  list.push({ l, rgb });
  groups.set(fam.id, list);
}

const toHex = (rgb: readonly number[]) =>
  `#${rgb.map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`;
function median(px: { rgb: [number, number, number] }[]): number[] {
  return ([0, 1, 2] as const).map((c) => {
    const v = px.map((p) => p.rgb[c]).sort((a, b) => a - b);
    return at(v, Math.floor(v.length / 2));
  });
}

for (const fam of families) {
  const px = (groups.get(fam.id) ?? []).sort((a, b) => a.l - b.l);
  if (px.length < 50) {
    console.log(`${fam.id}: too few pixels (${px.length})`);
    continue;
  }
  const n = Math.max(20, Math.floor(px.length * 0.05));
  const dark = median(px.slice(0, n));
  const light = median(px.slice(-Math.max(20, Math.floor(px.length * 0.2))));
  console.log(
    `${fam.id}: masstone ${toHex(dark)} tint ${toHex(light)} (${px.length} px)`,
  );
}
