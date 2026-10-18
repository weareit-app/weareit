import { useCallback, useState } from "react";
import { View } from "react-native";
import { AnimatedPaintedOrb } from "./animated-painted-orb";
import { WATERCOLOR_APPROACH } from "./approach";
import {
  DOT_TEST_ID,
  dotAccessibility,
  type WatercolorDotProps,
} from "./types";
import { WebGLDot } from "./webgl-dot.web";

// It's watercolor dot on web: dot B drawn with WebGL (a few KB, within the
// 1 MB budget; Skia's web runtime is not loaded). If WebGL is unavailable, or
// no generated approach applies, the painted orb stands in.
export function WatercolorDot({
  size,
  palette = "it-orb",
  motion = "still",
  seed = 0,
  accessibilityLabel,
}: WatercolorDotProps) {
  const [failed, setFailed] = useState(false);
  const onFail = useCallback(() => setFailed(true), []);
  const generated = WATERCOLOR_APPROACH === "B" && !failed;
  return (
    <View
      style={{ width: size, height: size }}
      pointerEvents="none"
      testID={DOT_TEST_ID}
      {...dotAccessibility(accessibilityLabel)}
    >
      {generated ? (
        <WebGLDot
          size={size}
          palette={palette}
          motion={motion}
          seed={seed}
          onFail={onFail}
        />
      ) : (
        <AnimatedPaintedOrb size={size} motion={motion} />
      )}
    </View>
  );
}
