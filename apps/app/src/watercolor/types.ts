import type { PaletteId } from "@it/watercolor/palettes";

export type { DotMotion } from "@it/watercolor/motion";
import type { DotMotion } from "@it/watercolor/motion";

// Contract: WatercolorDot in
// specs/007-watercolor-dot/contracts/watercolor-components.md
export interface WatercolorDotProps {
  size: number;
  palette?: PaletteId;
  motion?: DotMotion;
  seed?: number;
  // Without a label the dot is decorative and hidden from assistive tech.
  accessibilityLabel?: string;
}

export const DOT_TEST_ID = "watercolor-dot";

export function dotAccessibility(accessibilityLabel?: string) {
  return accessibilityLabel
    ? {
        accessible: true,
        accessibilityRole: "image" as const,
        accessibilityLabel,
      }
    : {
        accessible: false,
        accessibilityElementsHidden: true,
        importantForAccessibility: "no-hide-descendants" as const,
        "aria-hidden": true,
      };
}
