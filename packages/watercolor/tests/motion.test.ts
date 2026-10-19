import { describe, expect, it } from "vitest";
import {
  BLOOM_MS,
  LOOP_HOLD_MS,
  LOOP_MS,
  SETTLED,
  dotMotionAt,
} from "../src/motion.ts";

describe("dot motion", () => {
  it("is settled and still when still", () => {
    expect(dotMotionAt("still", 1234)).toEqual(SETTLED);
  });

  it("blooms once, then stays settled", () => {
    const start = dotMotionAt("bloom-once", 0);
    expect(start.bloom).toBe(0);
    expect(start.opacity).toBe(0);
    expect(dotMotionAt("bloom-once", BLOOM_MS)).toEqual(SETTLED);
    expect(dotMotionAt("bloom-once", BLOOM_MS * 10)).toEqual(SETTLED);
  });

  it("blooms, rests, fades and blooms again in a loop", () => {
    expect(dotMotionAt("bloom-loop", BLOOM_MS / 2).bloom).toBeGreaterThan(0.5);
    expect(dotMotionAt("bloom-loop", BLOOM_MS + LOOP_HOLD_MS / 2)).toEqual(
      SETTLED,
    );
    const fading = dotMotionAt("bloom-loop", LOOP_MS - 100);
    expect(fading.opacity).toBeLessThan(0.2);
    expect(fading.bloom).toBe(1);
    expect(dotMotionAt("bloom-loop", LOOP_MS + 10)).toEqual(
      dotMotionAt("bloom-loop", 10),
    );
  });
});
