import {
  Canvas,
  Fill,
  Shader,
  Skia,
  useClock,
} from "@shopify/react-native-skia";
import { gatherAt } from "@it/watercolor/gather";
import { PALETTES } from "@it/watercolor/palettes";
import {
  GATHER_SKSL,
  cyclePaletteUniforms,
  gatherUniforms,
  paletteUniforms,
} from "@it/watercolor/shaders";
import { useEffect, useMemo, useState } from "react";
import { AppState, View } from "react-native";
import {
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
} from "react-native-reanimated";
import { AnimatedPaintedOrb } from "./animated-painted-orb";
import { DOT_TEST_ID, dotAccessibility } from "./types";

// Compiled once per app run; null if the device cannot compile it, in which
// case the painted orb stands in.
const EFFECT = Skia.RuntimeEffect.Make(GATHER_SKSL);
// With reduced motion, or in the background: the gathered dot, still.
const STILL_AT_MS = 3600;

export interface GatherDotProps {
  size: number;
  // Without a label the dot is decorative and hidden from assistive tech.
  accessibilityLabel?: string;
}

function useAppActive() {
  const [active, setActive] = useState(AppState.currentState === "active");
  useEffect(() => {
    const sub = AppState.addEventListener("change", (s) =>
      setActive(s === "active"),
    );
    return () => sub.remove();
  }, []);
  return active;
}

// The gathering loader on iOS, drawn with Skia: drops of It's colors gather
// into one dot, then new drops keep arriving with sunrise and dusk colors
// (packages/watercolor/src/gather.ts).
export function GatherDot({ size, accessibilityLabel }: GatherDotProps) {
  const reduce = useReducedMotion();
  const active = useAppActive();
  const moving = !reduce && active;
  const clock = useClock();
  const start = useSharedValue(0);
  useEffect(() => {
    start.value = clock.value;
    // Restart only when mounted; pausing keeps the clock running.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const palettes = useMemo(
    () => ({
      it: paletteUniforms(PALETTES["it-orb"]),
      guests: [
        paletteUniforms(PALETTES.sunrise),
        paletteUniforms(PALETTES.dusk),
      ],
    }),
    [],
  );

  const uniforms = useDerivedValue(() => {
    const elapsed = moving ? clock.value - start.value : STILL_AT_MS;
    const g = gatherAt(elapsed);
    return {
      ...gatherUniforms(
        palettes.it,
        cyclePaletteUniforms(palettes.guests, g.guest),
        g.drops,
      ),
      uSize: [size, size],
      uTime: elapsed / 1000,
      uBody: g.body,
      uOpacity: Math.min(elapsed / 300, 1),
    };
  });

  return (
    <View
      style={{ width: size, height: size }}
      pointerEvents="none"
      testID={DOT_TEST_ID}
      {...dotAccessibility(accessibilityLabel)}
    >
      {EFFECT ? (
        <Canvas style={{ width: size, height: size }}>
          <Fill>
            <Shader source={EFFECT} uniforms={uniforms} />
          </Fill>
        </Canvas>
      ) : (
        <AnimatedPaintedOrb size={size} motion="bloom-once" />
      )}
    </View>
  );
}
