import { describe, expect, it } from "vitest";
import {
  ARRIVAL_TRAVEL_MS,
  ARRIVE_EVERY_MS,
  BODY_FORM_MS,
  FIRST_ARRIVAL_MS,
  GATHER_DROPS,
  GATHER_STRIDE,
  gatherAt,
} from "../src/gather.ts";

interface Drop {
  x: number;
  y: number;
  radius: number;
  merged: number;
  slot: number;
  seed: number;
  distinct: number;
  active: number;
}

function drops(t: number): Drop[] {
  const d = gatherAt(t).drops;
  return Array.from({ length: GATHER_DROPS }, (_, i) => {
    const o = i * GATHER_STRIDE;
    return {
      x: d[o]!,
      y: d[o + 1]!,
      radius: d[o + 2]!,
      merged: d[o + 3]!,
      slot: d[o + 4]!,
      seed: d[o + 5]!,
      distinct: d[o + 6]!,
      active: d[o + 7]!,
    };
  });
}

const dist = (d: Drop) => Math.hypot(d.x, d.y);
const arrivals = (t: number) =>
  drops(t)
    .slice(4)
    .filter((d) => d.active > 0);

describe("gathering loader timeline", () => {
  it("starts with four drops apart and gathers them into one dot", () => {
    const start = drops(0).slice(0, 4);
    for (const d of start) expect(dist(d)).toBeGreaterThan(0.6);
    expect(new Set(start.map((d) => d.radius)).size).toBe(4); // varied sizes
    const formed = gatherAt(BODY_FORM_MS);
    expect(formed.body).toBe(1);
    for (const d of drops(BODY_FORM_MS).slice(0, 4)) {
      expect(d.merged).toBe(1);
      expect(dist(d)).toBeLessThan(0.35);
    }
  });

  it("keeps new drops arriving after the dot forms", () => {
    expect(arrivals(FIRST_ARRIVAL_MS - 1)).toHaveLength(0);
    expect(arrivals(FIRST_ARRIVAL_MS + ARRIVE_EVERY_MS * 2 + 100).length).toBe(
      3,
    );
  });

  it("starts each arrival outside the frame and ends it inside the dot", () => {
    for (let k = 0; k < 12; k += 1) {
      const landed = FIRST_ARRIVAL_MS + k * ARRIVE_EVERY_MS;
      const newest = drops(landed)[4]!;
      expect(dist(newest) - newest.radius).toBeGreaterThan(1);
      // Follow the same drop (by its seed) until it has run in.
      const done = drops(landed + ARRIVAL_TRAVEL_MS + 1000).find(
        (d) => d.seed === newest.seed,
      )!;
      expect(dist(done)).toBeLessThan(0.32);
    }
  });

  it("brings arrivals in varied sizes and other palettes' pigments", () => {
    const sizes = new Set<number>();
    const slots = new Set<number>();
    for (let k = 0; k < 12; k += 1) {
      const d = drops(FIRST_ARRIVAL_MS + k * ARRIVE_EVERY_MS)[4]!;
      sizes.add(Math.round(d.radius * 100));
      slots.add(d.slot);
    }
    expect(sizes.size).toBeGreaterThanOrEqual(5);
    expect([...slots].some((s) => s >= 3)).toBe(true);
  });

  it("never changes a drop's presence or color strength all at once", () => {
    // Follow each drop by its seed from frame to frame (10 ms apart); entering
    // or leaving the list must happen at zero, and nothing may jump.
    // The first four are there from the start (the loader itself fades in).
    let previous = new Map(
      drops(0)
        .filter((d) => d.active > 0)
        .map((d) => [d.seed, d]),
    );
    for (let t = 10; t < 30000; t += 10) {
      const current = new Map(
        drops(t)
          .filter((d) => d.active > 0)
          .map((d) => [d.seed, d]),
      );
      for (const [seed, d] of current) {
        const p = previous.get(seed);
        const before = p ? p.active : 0;
        expect(Math.abs(d.active - before)).toBeLessThan(0.05);
        if (p) expect(Math.abs(d.distinct - p.distinct)).toBeLessThan(0.05);
      }
      for (const [seed, p] of previous) {
        if (!current.has(seed)) expect(p.active).toBeLessThan(0.05);
      }
      previous = current;
    }
  });
});
