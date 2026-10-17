// A small watercolor simulation after Curtis, Anderson, Seims, Fleischer &
// Salesin, "Computer-Generated Watercolor" (SIGGRAPH 1997): a shallow water
// layer that flows over textured paper, pigment carried in the water and
// settling onto the paper, and evaporation that is strongest at the edge of
// the wet area, which pulls pigment outward into a darker rim.
//
// Written from the paper's description for It, simplified: water moves
// between neighboring cells from a higher surface (water + paper relief) to a
// lower one, carrying its share of suspended pigment. That keeps water and
// pigment conserved, so pigment really piles up where the flow takes it. It
// runs on the CPU with Float32Arrays so the same seed and settings always
// paint the same dot.

export interface Rewet {
  step: number;
  x: number; // center, fraction of size from the middle
  y: number;
  radius: number; // fraction of size
  water: number;
}

export interface SimSettings {
  size: number; // grid cells per side
  steps: number; // total simulation steps
  pigments: number; // 2–3 pigment slots
  dropRadius: number; // initial wet radius, fraction of size
  maxRadius: number; // furthest the wet area may spread, fraction of size
  water: number; // initial water depth
  pigmentLoad: number; // initial suspended pigment
  flow: number; // share of a surface difference that flows per step (≤ 0.2)
  paperRelief: number; // paper height's share of the surface
  evaporation: number; // water lost per step everywhere wet
  edgeEvaporation: number; // extra loss at the wet edge (edge darkening)
  edgeReach: number; // cells over which the edge counts as "edge"
  spreadDepth: number; // water depth needed to wet a dry neighbor
  spreadSteps: number; // after this the edge is pinned (it no longer grows)
  absorption: number; // water drawn into the paper per step
  settle: number; // pigment deposition rate as the film thins
  granulation: readonly number[]; // per pigment, 0–1
  diffusion: number; // suspended pigment diffusion per step
  dryAt: number; // mean water depth below which the wash finally dries
  // Clean water dropped into the still-wet dot (wet-in-wet). It pushes
  // pigment outward and leaves a darker, ragged bloom line.
  rewets: readonly Rewet[];
}

export const DEFAULT_SETTINGS: SimSettings = {
  size: 256,
  steps: 1200,
  pigments: 3,
  dropRadius: 0.34,
  maxRadius: 0.48,
  water: 1,
  pigmentLoad: 0.4,
  flow: 0.24,
  paperRelief: 0.08,
  evaporation: 0.0004,
  edgeEvaporation: 0.009,
  edgeReach: 3,
  spreadDepth: 0.06,
  spreadSteps: 420,
  absorption: 0.0002,
  settle: 0.05,
  granulation: [0.6, 0.3, 0.1],
  diffusion: 0.02,
  dryAt: 0.015,
  rewets: [{ step: 520, x: 0.07, y: 0.04, radius: 0.17, water: 1.1 }],
};

export interface SimFrame {
  step: number;
  // pigments × size² densities: deposited plus suspended (what you would see)
  density: Float32Array;
}

// mulberry32: tiny seeded PRNG so painting is reproducible.
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Seeded value noise on a lattice, summed over octaves, roughly 0–1.
function makeNoise(random: () => number) {
  const n = 256;
  const table = new Float32Array(n * n);
  for (let i = 0; i < table.length; i += 1) table[i] = random();
  const at = (x: number, y: number) =>
    table[(((y % n) + n) % n) * n + (((x % n) + n) % n)]!;
  const value = (x: number, y: number) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const fx = x - xi;
    const fy = y - yi;
    const u = fx * fx * (3 - 2 * fx);
    const v = fy * fy * (3 - 2 * fy);
    const a = at(xi, yi) + (at(xi + 1, yi) - at(xi, yi)) * u;
    const b = at(xi, yi + 1) + (at(xi + 1, yi + 1) - at(xi, yi + 1)) * u;
    return a + (b - a) * v;
  };
  return (x: number, y: number, octaves = 4) => {
    let sum = 0;
    let amp = 0.5;
    let f = 1;
    for (let o = 0; o < octaves; o += 1) {
      sum += amp * value(x * f + o * 17.3, y * f + o * 9.1);
      f *= 2;
      amp *= 0.5;
    }
    return sum / (1 - 0.5 ** octaves);
  };
}

function smooth(e0: number, e1: number, x: number): number {
  const t = Math.min(Math.max((x - e0) / (e1 - e0), 0), 1);
  return t * t * (3 - 2 * t);
}

export function simulate(
  seed: number,
  settings: SimSettings,
  captureSteps: readonly number[],
): SimFrame[] {
  const N = settings.size;
  const P = settings.pigments;
  const cells = N * N;
  const random = rng(seed);
  const noise = makeNoise(random);
  const c = (N - 1) / 2;

  // Paper: height (tooth), how readily it drinks, and how far the wash may
  // reach in each direction.
  const paper = new Float32Array(cells);
  const thirst = new Float32Array(cells);
  const reach = new Float32Array(cells);
  for (let y = 0; y < N; y += 1) {
    for (let x = 0; x < N; x += 1) {
      const i = y * N + x;
      paper[i] =
        0.6 * noise(x / 2.5, y / 2.5, 3) + 0.4 * noise(x / 9, y / 9, 3);
      thirst[i] = 0.7 + 0.6 * noise(x / 40 + 50, y / 40 + 50, 3);
      const a = Math.atan2(y - c, x - c);
      reach[i] =
        settings.maxRadius *
        N *
        (1 +
          0.14 *
            (noise(Math.cos(a) * 1.6 + 70, Math.sin(a) * 1.6 + 70, 3) - 0.5));
    }
  }

  const wet = new Uint8Array(cells);
  const water = new Float32Array(cells);
  const sus = Array.from({ length: P }, () => new Float32Array(cells));
  const dep = Array.from({ length: P }, () => new Float32Array(cells));

  // The drop: an irregular circle of water carrying pigment, laid out like
  // the painted orb — one pigment on each side and one in the middle.
  for (let y = 0; y < N; y += 1) {
    for (let x = 0; x < N; x += 1) {
      const i = y * N + x;
      const dx = (x - c) / N;
      const dy = (y - c) / N;
      const r = Math.hypot(dx, dy);
      const a = Math.atan2(dy, dx);
      const edge =
        settings.dropRadius *
        (1 + 0.18 * (noise(Math.cos(a) * 2 + 9, Math.sin(a) * 2 + 9, 3) - 0.5));
      if (r > edge || x < 1 || y < 1 || x > N - 2 || y > N - 2) continue;
      wet[i] = 1;
      water[i] = settings.water * (0.85 + 0.3 * noise(x / 20 + 3, y / 20 + 3));
      const wx =
        dx / settings.dropRadius + 0.6 * (noise(x / 22 + 30, y / 22, 4) - 0.5);
      const wy =
        dy / settings.dropRadius + 0.4 * (noise(x / 22, y / 22 + 30, 4) - 0.5);
      const share = [
        smooth(0.9, -1.0, wx) * 1.1 + 0.15,
        smooth(-1.0, 0.0, wx) * smooth(1.1, 0.2, wx) * 0.9,
        smooth(0.45, 1.05, wx - 0.3 * wy) * 0.8,
      ];
      const load =
        settings.pigmentLoad *
        (0.2 + 1.6 * noise(x / 30 + 11, y / 30 + 7, 3) ** 2);
      for (let k = 0; k < P; k += 1) sus[k]![i] = load * share[k]!;
    }
  }

  const dWater = new Float32Array(cells);
  const dSus = Array.from({ length: P }, () => new Float32Array(cells));
  const edge = new Float32Array(cells);
  const frames: SimFrame[] = [];
  const capture = new Set(captureSteps);
  const R = settings.edgeReach;

  for (let step = 0; step <= settings.steps; step += 1) {
    if (capture.has(step))
      frames.push({ step, density: snapshot(sus, dep, cells) });
    if (step === settings.steps) break;

    for (const drop of settings.rewets) {
      if (drop.step !== step) continue;
      const rx = c + drop.x * N;
      const ry = c + drop.y * N;
      for (let y = 1; y < N - 1; y += 1) {
        for (let x = 1; x < N - 1; x += 1) {
          const i = y * N + x;
          if (!wet[i]) continue;
          const a = Math.atan2(y - ry, x - rx);
          const r =
            drop.radius *
            N *
            (1 +
              0.35 *
                (noise(Math.cos(a) * 2 + 40, Math.sin(a) * 2 + 40, 3) - 0.5));
          const d = Math.hypot(x - rx, y - ry);
          if (d < r) water[i] = water[i]! + drop.water * (1 - (d / r) ** 2);
        }
      }
    }

    // How "edge" each wet cell is: share of dry cells within R.
    for (let y = R; y < N - R; y += 1) {
      for (let x = R; x < N - R; x += 1) {
        const i = y * N + x;
        if (!wet[i]) {
          edge[i] = 0;
          continue;
        }
        let dry = 0;
        for (let oy = -R; oy <= R; oy += 1) {
          for (let ox = -R; ox <= R; ox += 1)
            if (!wet[i + oy * N + ox]) dry += 1;
        }
        edge[i] = Math.min((2 * dry) / ((2 * R + 1) * (2 * R + 1)), 1);
      }
    }

    // 1. Spreading: deep enough water wets a dry neighbor, unevenly,
    //    following the tooth. Afterwards the edge is pinned.
    if (step < settings.spreadSteps) {
      for (let y = 2; y < N - 2; y += 1) {
        for (let x = 2; x < N - 2; x += 1) {
          const i = y * N + x;
          if (wet[i] || Math.hypot(x - c, y - c) > reach[i]!) continue;
          const best = Math.max(
            water[i - 1]!,
            water[i + 1]!,
            water[i - N]!,
            water[i + N]!,
          );
          if (best > settings.spreadDepth * (0.7 + 0.8 * paper[i]!)) wet[i] = 2;
        }
      }
      for (let i = 0; i < cells; i += 1) if (wet[i] === 2) wet[i] = 1;
    }

    // 2. Flow: water runs from a higher surface to a lower neighbor,
    //    carrying its share of suspended pigment.
    dWater.fill(0);
    for (let k = 0; k < P; k += 1) dSus[k]!.fill(0);
    for (let y = 1; y < N - 1; y += 1) {
      for (let x = 1; x < N - 1; x += 1) {
        const i = y * N + x;
        if (!wet[i] || water[i]! <= 0) continue;
        const hi = water[i]! + settings.paperRelief * paper[i]!;
        let out = 0;
        const flows: [number, number][] = [];
        for (const j of [i + 1, i - 1, i + N, i - N]) {
          if (!wet[j]) continue;
          const dh = hi - (water[j]! + settings.paperRelief * paper[j]!);
          if (dh <= 0) continue;
          const f = settings.flow * dh * 0.5;
          flows.push([j, f]);
          out += f;
        }
        if (out <= 0) continue;
        const scale = Math.min(1, (water[i]! * 0.9) / out);
        for (const [j, f] of flows) {
          const moved = f * scale;
          const frac = moved / water[i]!;
          dWater[i] = dWater[i]! - moved;
          dWater[j] = dWater[j]! + moved;
          for (let k = 0; k < P; k += 1) {
            const m = sus[k]![i]! * frac;
            dSus[k]![i] = dSus[k]![i]! - m;
            dSus[k]![j] = dSus[k]![j]! + m;
          }
        }
      }
    }
    for (let i = 0; i < cells; i += 1) {
      water[i] = water[i]! + dWater[i]!;
      for (let k = 0; k < P; k += 1) sus[k]![i] = sus[k]![i]! + dSus[k]![i]!;
    }

    // 3. Pigment diffuses a little within the wash (soft inner edges).
    for (let k = 0; k < P; k += 1) {
      const s = sus[k]!;
      const d = dSus[k]!;
      d.fill(0);
      for (let y = 1; y < N - 1; y += 1) {
        for (let x = 1; x < N - 1; x += 1) {
          const i = y * N + x;
          if (!wet[i]) continue;
          for (const j of [i + 1, i + N]) {
            if (!wet[j]) continue;
            const m = settings.diffusion * (s[i]! - s[j]!) * 0.25;
            d[i] = d[i]! - m;
            d[j] = d[j]! + m;
          }
        }
      }
      for (let i = 0; i < cells; i += 1) s[i] = s[i]! + d[i]!;
    }

    // 4. Evaporation, fastest at the edge, and absorption into the paper.
    //    The edge's lower surface draws water — and pigment — outward.
    let wetCells = 0;
    let wetWater = 0;
    for (let i = 0; i < cells; i += 1) {
      if (!wet[i]) continue;
      // While the drop is still spreading its edge is not yet pinned, so the
      // extra drying at the rim only starts afterwards.
      const rim =
        step < settings.spreadSteps ? 0 : settings.edgeEvaporation * edge[i]!;
      const loss =
        settings.evaporation + rim + settings.absorption * thirst[i]!;
      water[i] = Math.max(water[i]! - loss, 0);
      wetCells += 1;
      wetWater += water[i]!;
    }
    // The edge stays pinned while the wash is still wet.
    const washDrying = wetCells === 0 || wetWater / wetCells < settings.dryAt;

    // 5. Pigment settles onto the paper as the film thins, and more in the
    //    paper's valleys (granulation). When the wash dries, whatever is
    //    still suspended is left where it is.
    for (let i = 0; i < cells; i += 1) {
      if (!wet[i]) continue;
      const thin = 1 - Math.min(water[i]! / (0.35 * settings.water), 1);
      for (let k = 0; k < P; k += 1) {
        const valley = Math.max(
          1 + (settings.granulation[k] ?? 0) * (0.5 - paper[i]!) * 5,
          0.05,
        );
        const down =
          sus[k]![i]! * Math.min(settings.settle * thin ** 3 * valley, 1);
        sus[k]![i] = sus[k]![i]! - down;
        dep[k]![i] = dep[k]![i]! + down;
      }
      if (washDrying) {
        for (let k = 0; k < P; k += 1) {
          dep[k]![i] = dep[k]![i]! + sus[k]![i]!;
          sus[k]![i] = 0;
        }
        wet[i] = 0;
        water[i] = 0;
      }
    }
  }
  return frames;
}

function snapshot(
  sus: Float32Array[],
  dep: Float32Array[],
  cells: number,
): Float32Array {
  const out = new Float32Array(sus.length * cells);
  for (let k = 0; k < sus.length; k += 1) {
    const s = sus[k]!;
    const d = dep[k]!;
    for (let i = 0; i < cells; i += 1) out[k * cells + i] = s[i]! + d[i]!;
  }
  return out;
}
