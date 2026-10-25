// A print look for the group icons (founder's choice "Print", 2026-10-18; the
// other presets stay in /lab/riso). grain: 0 to 1, how much paper shows
// through the ink; frequency: noise per grid unit (icons are 48 units
// across); offset: how far, in grid units, spot inks sit off the ink.
export interface RisoLook {
  grain: number;
  frequency: number;
  offset: number;
}

export const printLook: RisoLook = { grain: 0.55, frequency: 2.6, offset: 0.3 };

export const risoPresets: { name: string; look: RisoLook | undefined }[] = [
  { name: "Clean", look: undefined },
  { name: "Subtle", look: { grain: 0.3, frequency: 3.2, offset: 0.4 } },
  { name: "Print", look: printLook },
  { name: "Heavy", look: { grain: 0.85, frequency: 2, offset: 1 } },
];

/** A fixed direction per spot ink, as if each drum sat slightly off the ink. */
export function drift(tone: string, amount: number) {
  let hash = 0;
  for (const char of tone) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  const angle = ((hash >>> 0) % 360) * (Math.PI / 180);
  return { x: Math.cos(angle) * amount, y: Math.sin(angle) * amount };
}

/** Noise below this level shows the paper. Black ink prints denser. */
export function grainThreshold(look: RisoLook, spot: boolean) {
  return (0.12 + look.grain * 0.26) * (spot ? 1 : 0.6);
}

/** Each inked layer gets its own noise, so the drums don't line up. */
export const grainSeed = (layer: number) => layer * 7 + 3;

/** A color matrix turning noise into a sharp alpha mask at `threshold`. */
export function grainMatrix(threshold: number) {
  return [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    16,
    0,
    0,
    0,
    -16 * threshold,
  ];
}
