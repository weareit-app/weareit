// Gathering loader (spec 007, exploration): where every drop is at a given
// moment. Four drops of It's pigments, of different sizes, drift in from
// around the edge and run together into one dot; then, while loading goes on,
// a new drop arrives every few seconds and runs into it, bringing pigments
// from other palettes. Framework-free and worklet-safe; renderers turn the
// state into shader uniforms.

export const GATHER_DROPS = 10; // drops drawn at once: 4 first + 6 latest
export const GATHER_STRIDE = 8; // x, y, radius, merged, slot, seed, distinct, active

export const FIRST_TRAVEL_MS = 2200; // the first four drifting in
export const BODY_FORM_MS = 3400; // by now they have run together into one dot
export const FIRST_ARRIVAL_MS = 4200;
export const ARRIVE_EVERY_MS = 1500;
export const ARRIVAL_TRAVEL_MS = 3400; // drifting in slowly
export const ARRIVAL_MERGE_MS = 1800; // running in
// How long an arrival's color stands apart before marbling into the dot.
export const DISTINCT_MS = 12000;
// How far a drop's paint spreads into the dot as it runs in.
const SPREAD = 1.2;
// The guest palette (slots 3–5) drifts from one palette to the next this fast.
export const GUEST_DRIFT_MS = 16000;

export interface GatherState {
  body: number; // 0 → 1: the gathered dot forming
  drops: readonly number[]; // GATHER_DROPS × GATHER_STRIDE
  guest: number; // position along the guest palette cycle
}

const clamp01 = (x: number) => {
  "worklet";
  return Math.min(Math.max(x, 0), 1);
};

const easeOut = (x: number) => {
  "worklet";
  return 1 - (1 - clamp01(x)) ** 3;
};

const hash = (k: number) => {
  "worklet";
  const s = Math.sin(k * 12.9898 + 78.233) * 43758.5453;
  return s - Math.floor(s);
};

export function gatherAt(elapsedMs: number): GatherState {
  "worklet";
  const out: number[] = [];

  // The first four: It's three pigments and one mix, different sizes, from
  // evenly spread directions with a little jitter.
  for (let i = 0; i < 4; i += 1) {
    const stagger = 220 * hash(i + 11);
    const travel = easeOut((elapsedMs - stagger) / FIRST_TRAVEL_MS);
    const angle = i * (Math.PI / 2) + 0.5 + 0.4 * (hash(i + 3) - 0.5);
    const startR = 0.72 + 0.1 * hash(i + 7);
    const endR = 0.12 + 0.18 * hash(i + 19);
    const endAngle = angle + 0.6;
    const x =
      Math.cos(angle) * startR * (1 - travel) +
      Math.cos(endAngle) * endR * travel;
    const y =
      Math.sin(angle) * startR * (1 - travel) +
      Math.sin(endAngle) * endR * travel;
    const size = [0.2, 0.13, 0.17, 0.1][i]!;
    const radius = size * (1 + 0.8 * travel);
    const merged = clamp01(
      (elapsedMs - FIRST_TRAVEL_MS * 0.7) /
        (BODY_FORM_MS - FIRST_TRAVEL_MS * 0.7),
    );
    // Once the dot has formed, the first drops' colors relax into it, so
    // later drops can show.
    const settled = Math.max(elapsedMs - BODY_FORM_MS, 0);
    const distinct = 0.25 + 0.45 * Math.exp(-settled / 5000);
    out.push(x, y, radius, merged, i % 3, i * 1.7, distinct, 1);
  }

  // Arrivals: the six most recent, newest first.
  const latest = Math.floor((elapsedMs - FIRST_ARRIVAL_MS) / ARRIVE_EVERY_MS);
  for (let j = 0; j < 6; j += 1) {
    const k = latest - j;
    if (k < 0) {
      out.push(0, 0, 0, 0, 0, 0, 0, 0);
      continue;
    }
    const landed = FIRST_ARRIVAL_MS + k * ARRIVE_EVERY_MS;
    const age = elapsedMs - landed;
    const travel = easeOut(age / ARRIVAL_TRAVEL_MS);
    const angle = hash(k + 101) * Math.PI * 2;
    // Ends well inside the gathered dot, so nothing is left bulging out when
    // the drop has run in.
    const size = 0.07 + 0.15 * hash(k + 171) ** 1.5;
    // Starts just outside the frame, so it slides in rather than appearing.
    const startR = 1.02 + size;
    const endR = 0.08 + 0.22 * hash(k + 131);
    const endAngle = angle + 0.4 * (hash(k + 151) - 0.5);
    const x =
      Math.cos(angle) * startR * (1 - travel) +
      Math.cos(endAngle) * endR * travel;
    const y =
      Math.sin(angle) * startR * (1 - travel) +
      Math.sin(endAngle) * endR * travel;
    // Varied sizes: some small specks, some generous drops.
    const merged = clamp01((age - ARRIVAL_TRAVEL_MS * 0.6) / ARRIVAL_MERGE_MS);
    // Running in, the drop's paint spreads out into the dot.
    const radius = size * (1 + 0.6 * travel) * (1 + SPREAD * merged);
    // Mostly guest pigments (slots 3–5); every third an It pigment.
    const slot = k % 3 === 2 ? Math.floor(k / 3) % 3 : 3 + (k % 3);
    // A drop's own color fades out smoothly by its age (gone by 7.5 s, well
    // before it leaves the list of six at 9 s). Fading by list position made
    // colors jump each time a new drop arrived and the list shifted.
    const fadeX = clamp01((age - 5000) / 2500);
    const retiring = 1 - fadeX * fadeX * (3 - 2 * fadeX);
    const distinct =
      retiring * Math.exp(-Math.max(age - ARRIVAL_TRAVEL_MS, 0) / DISTINCT_MS);
    // `active` fades with age too, so the drop's whole claim on the color is
    // gone before it leaves the list.
    // And fades in over its first half second.
    const appear = clamp01(age / 500);
    out.push(
      x,
      y,
      radius,
      merged,
      slot,
      10 + k * 2.3,
      distinct,
      retiring * appear,
    );
  }

  return {
    body: clamp01(
      (elapsedMs - FIRST_TRAVEL_MS * 0.8) /
        (BODY_FORM_MS - FIRST_TRAVEL_MS * 0.8),
    ),
    drops: out,
    guest: Math.max(elapsedMs - FIRST_ARRIVAL_MS, 0) / GUEST_DRIFT_MS,
  };
}
