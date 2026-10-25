import { groupIconArt } from "./group-icon-art";

// Icons for the personal groups, traced from the founder's drawings on a
// 48 × 48 grid (tools/icon-trace). "ink"/"paper" follow the UI; "riso-*" are
// illustration tones, the drawing's ink and its own paper, which turns cream
// in dark mode; the rest are palette spot inks.

// Palette spots (docs/brand/colors.md). Literal values: the same in light and
// dark, and Tailwind drops theme variables no class uses.
export const spotInks = {
  tide: "#087E9F",
  sprout: "#00A95C",
  mint: "#82D8A7",
  meadow: "#67B346",
  sun: "#FFB511",
  lagoon: "#5EC8E5",
  poppy: "#F15060",
  ember: "#FF6C2F",
  bloom: "#FF48B0",
  stone: "#88898A",
  clay: "#925F52",
  dusk: "#765BA7",
  // Skin tones, not brand inks: fixed so skin doesn't change with the theme.
  "skin-1": "#F5D7C0",
  "skin-2": "#E4AE86",
  "skin-3": "#C68653",
  "skin-4": "#9A6038",
  "skin-5": "#704329",
} as const;

export type IconTone =
  | "ink"
  | "paper"
  | "riso-ink"
  | "riso-paper"
  | "riso-line"
  | keyof typeof spotInks;

export interface IconPart {
  d: string;
  evenOdd?: boolean;
  fill?: IconTone;
  stroke?: IconTone;
  strokeWidth?: number;
}

export const groupIcons: Record<string, IconPart[]> = groupIconArt;
