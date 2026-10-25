import { FillType, Skia, type SkPath } from "@shopify/react-native-skia";

// An SVG path as a Skia path. Skia 2.14's SkPath can't change its fill type
// (no setFillType in its Path.d.ts, read 2026-10-20), so an even-odd path is
// rebuilt through a PathBuilder. Native only: Skia isn't loaded on web.
export function toSkPath(d: string, evenOdd = false): SkPath {
  const path = Skia.Path.MakeFromSVGString(d);
  if (!path) throw new Error(`Not an SVG path: ${d}`);
  if (!evenOdd) return path;
  return Skia.PathBuilder.MakeFromPath(path)
    .setFillType(FillType.EvenOdd)
    .detach();
}
