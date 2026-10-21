import { useEffect, useState, type DependencyList } from "react";

/**
 * Draws a block with a library that loads only on the web, after the first
 * render, so the pre-rendered page keeps the block's fallback. Returns the
 * drawn HTML or SVG, or null: before it's ready, on iOS (`load` is null), or
 * when loading or drawing fails, which leaves the fallback in place.
 *
 * Callers write `Platform.OS === "web" ? () => import("…") : null` at the
 * top of their own module, so production builds fold the import away on iOS.
 */
export function useWebDrawing<Library>(
  load: (() => Promise<Library>) | null,
  draw: (library: Library) => string | Promise<string>,
  deps: DependencyList,
) {
  const [drawing, setDrawing] = useState<string | null>(null);
  useEffect(() => {
    if (!load) return;
    let current = true;
    load()
      .then(draw)
      .then((result) => {
        if (current) setDrawing(result);
      })
      .catch(() => undefined);
    return () => {
      current = false;
    };
    // The caller's deps cover everything `draw` reads.
  }, deps);
  return drawing;
}
