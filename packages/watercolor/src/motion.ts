// How a watercolor dot moves over time, shared by every renderer (Skia on
// iOS, WebGL on web, the painted-orb fallback) so they all keep one rhythm.
// Runs as a Reanimated worklet too, hence the directives. Helpers come before
// dotMotionAt: as worklets, functions are captured when they are defined, so
// a helper declared later is not yet there.

export type DotMotion = "still" | "bloom-once" | "bloom-loop" | "breathe";

export interface DotMotionState {
  bloom: number; // 0 → 1: the drop spreading to full size
  dry: number; // 0 → 1: rim and bloom line forming
  opacity: number; // 0 → 1
  breathe: number; // 0 or 1: slow pigment drift for "breathe"
}

export const BLOOM_MS = 2400; // blooming into place
export const LOOP_HOLD_MS = 1000; // resting, bloomed
export const LOOP_FADE_MS = 800; // fading before the next bloom
export const LOOP_MS = BLOOM_MS + LOOP_HOLD_MS + LOOP_FADE_MS;
const FADE_IN_MS = 500;

export const SETTLED: DotMotionState = {
  bloom: 1,
  dry: 1,
  opacity: 1,
  breathe: 0,
};

const clamp01 = (x: number) => {
  "worklet";
  return Math.min(Math.max(x, 0), 1);
};

export function dotMotionAt(
  motion: DotMotion,
  elapsedMs: number,
): DotMotionState {
  "worklet";
  if (motion === "still") return SETTLED;
  if (motion === "breathe") return { ...SETTLED, breathe: 1 };
  const t = motion === "bloom-loop" ? elapsedMs % LOOP_MS : elapsedMs;
  // Blooming: spreads fast, then settles.
  const eased = 1 - (1 - clamp01(t / BLOOM_MS)) ** 3;
  let opacity = clamp01(t / FADE_IN_MS);
  if (motion === "bloom-loop" && t > BLOOM_MS + LOOP_HOLD_MS) {
    opacity = 1 - clamp01((t - BLOOM_MS - LOOP_HOLD_MS) / LOOP_FADE_MS);
  }
  return { bloom: eased, dry: eased, opacity, breathe: 0 };
}
