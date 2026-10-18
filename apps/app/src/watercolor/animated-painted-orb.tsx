import { BLOOM_MS, LOOP_MS, dotMotionAt } from "@it/watercolor/motion";
import { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { PaintedOrb } from "./painted-orb";
import type { DotMotion } from "./types";

// The painted orb, moved with the same timeline as the generated dot
// (packages/watercolor/src/motion.ts): blooming into place, once or in a
// loop. It stands in wherever a generated dot cannot be drawn. Still with
// reduced motion.
export function AnimatedPaintedOrb({
  size,
  motion,
}: {
  size: number;
  motion: DotMotion;
}) {
  const reduce = useReducedMotion();
  const elapsed = useSharedValue(LOOP_MS * 10);
  const animated = motion === "bloom-once" || motion === "bloom-loop";

  useEffect(() => {
    if (reduce || !animated) {
      elapsed.value = LOOP_MS * 10;
      return;
    }
    elapsed.value = 0;
    elapsed.value =
      motion === "bloom-loop"
        ? withRepeat(
            withTiming(LOOP_MS, { duration: LOOP_MS, easing: Easing.linear }),
            -1,
            false,
          )
        : withTiming(BLOOM_MS, { duration: BLOOM_MS, easing: Easing.linear });
  }, [motion, reduce, animated, elapsed]);

  const style = useAnimatedStyle(() => {
    const m = dotMotionAt(
      reduce || !animated ? "still" : motion,
      elapsed.value,
    );
    return {
      opacity: m.opacity,
      transform: [{ scale: 0.85 + 0.15 * m.bloom }],
    };
  });

  return (
    <Animated.View style={style}>
      <PaintedOrb size={size} />
    </Animated.View>
  );
}
