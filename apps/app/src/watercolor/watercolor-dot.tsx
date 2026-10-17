import { View } from "react-native";
import { AnimatedPaintedOrb } from "./animated-painted-orb";
import { WATERCOLOR_APPROACH } from "./approach";
import { SkiaDot } from "./skia-dot";
import {
  DOT_TEST_ID,
  dotAccessibility,
  type WatercolorDotProps,
} from "./types";

// It's watercolor dot on iOS: generated with the approach the founder chose,
// or the gently animated painted orb if none was chosen.
export function WatercolorDot({
  size,
  palette = "it-orb",
  motion = "still",
  seed = 0,
  accessibilityLabel,
}: WatercolorDotProps) {
  if (WATERCOLOR_APPROACH === null) {
    return (
      <View
        style={{ width: size, height: size }}
        pointerEvents="none"
        testID={DOT_TEST_ID}
        {...dotAccessibility(accessibilityLabel)}
      >
        <AnimatedPaintedOrb size={size} motion={motion} />
      </View>
    );
  }
  return (
    <SkiaDot
      size={size}
      approach={WATERCOLOR_APPROACH}
      palette={palette}
      motion={motion}
      seed={seed}
      {...(accessibilityLabel !== undefined && { accessibilityLabel })}
    />
  );
}
