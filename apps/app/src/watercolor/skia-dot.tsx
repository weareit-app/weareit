import {
  Canvas,
  Group,
  ImageShader,
  Rect,
  Shader,
  Skia,
  useClock,
  useImage,
  type SkImage,
} from "@shopify/react-native-skia";
import { PALETTES, type PaletteId } from "@it/watercolor/palettes";
import {
  DOT_B_SKSL,
  DOT_E_SKSL,
  paletteUniforms,
} from "@it/watercolor/shaders";
import { useEffect, useMemo, useState } from "react";
import { AppState, View } from "react-native";
import { dotMotionAt } from "@it/watercolor/motion";
import {
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";
import type { WatercolorApproach } from "./approach";
import { PaintedOrb } from "./painted-orb";
import { DOT_TEST_ID, dotAccessibility, type DotMotion } from "./types";

export type { DotMotion };
import { DEFAULT_DOT_ID, PAINTED_DOTS } from "./painted-dots";

export interface SkiaDotProps {
  size: number;
  approach: WatercolorApproach;
  palette?: PaletteId;
  dot?: string;
  motion?: DotMotion;
  seed?: number;
  accessibilityLabel?: string;
}

// Compiled once per app run; null if the device cannot compile them, in which
// case the painted orb is shown instead.
const EFFECTS = {
  B: Skia.RuntimeEffect.Make(DOT_B_SKSL),
  E: Skia.RuntimeEffect.Make(DOT_E_SKSL),
};

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

// Shared state for one canvas of dots: how they move (still when reduced
// motion is on or the app is in the background), the clock and when the
// motion started, and the atlas.
function useDotCanvas(
  approach: WatercolorApproach,
  dot: string,
  motion: DotMotion,
) {
  const reduceMotion = useReducedMotion();
  const active = useAppActive();
  const moving = motion !== "still" && !reduceMotion && active;
  const painted = PAINTED_DOTS[dot];
  const atlas = useImage(approach === "E" ? (painted?.atlas ?? null) : null);
  const effect = EFFECTS[approach];
  const ready =
    effect !== null &&
    (approach === "B" || (painted !== undefined && atlas !== null));
  const clock = useClock();
  const start = useSharedValue(0);
  useEffect(() => {
    start.value = clock.value;
  }, [motion, moving, start, clock]);
  return {
    ready,
    atlas,
    clock,
    start,
    motion: moving ? motion : ("still" as const),
  };
}

interface DotShapeProps {
  x: number;
  y: number;
  size: number;
  approach: WatercolorApproach;
  palette: PaletteId;
  dot: string;
  seed: number;
  atlas: SkImage | null;
  clock: SharedValue<number>;
  start: SharedValue<number>;
  motion: DotMotion;
}

// One dot inside a Skia canvas. Many can share a canvas, which matters: each
// canvas is its own GPU surface, and browsers allow only a handful.
function DotShape({
  x,
  y,
  size,
  approach,
  palette,
  dot,
  seed,
  atlas,
  clock,
  start,
  motion,
}: DotShapeProps) {
  // Rendered only once the canvas is ready, which needs the effect.
  const effect = EFFECTS[approach];
  if (!effect) throw new Error(`The ${approach} dot effect didn't compile`);
  const pal = useMemo(() => paletteUniforms(PALETTES[palette]), [palette]);
  const m = PAINTED_DOTS[dot]?.manifest;

  const uniforms = useDerivedValue(() => {
    const st = dotMotionAt(motion, clock.value - start.value);
    // Offset each dot's clock so a field of dots doesn't move in lockstep.
    const t = motion === "still" ? 0 : clock.value / 1000 + seed * 1.37;
    if (approach === "B") {
      return {
        ...pal,
        uSize: [size, size],
        uTime: t,
        uBloom: st.bloom,
        uDry: st.dry,
        uBreathe: st.breathe,
        uOpacity: st.opacity,
        uSeed: seed,
      };
    }
    const frames = m?.frames ?? 1;
    let frame = st.bloom * (frames - 1);
    if (st.breathe > 0 && m?.breathe) {
      // Back and forth through the last frames of drying: a seamless loop.
      const phase = (t / m.breathe.periodSeconds) % 1;
      const pingPong = phase < 0.5 ? phase * 2 : 2 - phase * 2;
      frame = m.breathe.from + pingPong * (m.breathe.to - m.breathe.from);
    }
    return {
      ...pal,
      uSize: [size, size],
      uFrame: frame,
      uFrames: frames,
      uColumns: m?.columns ?? 1,
      uFrameSize: m?.size ?? 1,
      uDensityScale: m?.densityScale ?? 1,
    };
  });

  return (
    <Group transform={[{ translateX: x }, { translateY: y }]}>
      <Rect x={0} y={0} width={size} height={size}>
        <Shader source={effect} uniforms={uniforms}>
          {approach === "E" && atlas ? (
            <ImageShader
              image={atlas}
              fit="none"
              rect={{
                x: 0,
                y: 0,
                width: atlas.width(),
                height: atlas.height(),
              }}
              tx="clamp"
              ty="clamp"
            />
          ) : null}
        </Shader>
      </Rect>
    </Group>
  );
}

// A generated watercolor dot drawn with Skia (contract: WatercolorDot in
// specs/007-watercolor-dot/contracts/watercolor-components.md). The painted
// orb is shown until the dot is ready, and stays if it fails.
export function SkiaDot({
  size,
  approach,
  palette = "it-orb",
  dot = DEFAULT_DOT_ID,
  motion = "still",
  seed = 0,
  accessibilityLabel,
}: SkiaDotProps) {
  const c = useDotCanvas(approach, dot, motion);
  return (
    <View
      style={{ width: size, height: size }}
      pointerEvents="none"
      testID={DOT_TEST_ID}
      {...dotAccessibility(accessibilityLabel)}
    >
      {!c.ready ? (
        <PaintedOrb size={size} />
      ) : (
        <Canvas style={{ width: size, height: size }}>
          <DotShape
            x={0}
            y={0}
            size={size}
            approach={approach}
            palette={palette}
            dot={dot}
            seed={seed}
            atlas={c.atlas}
            clock={c.clock}
            start={c.start}
            motion={c.motion}
          />
        </Canvas>
      )}
    </View>
  );
}

export interface SkiaDotFieldProps {
  columns: number;
  rows: number;
  dotSize: number;
  gap: number;
  approach: WatercolorApproach;
  palette?: PaletteId;
  dot?: string;
  motion?: DotMotion;
}

// Many dots in one canvas. Decorative.
export function SkiaDotField({
  columns,
  rows,
  dotSize,
  gap,
  approach,
  palette = "it-orb",
  dot = DEFAULT_DOT_ID,
  motion = "still",
}: SkiaDotFieldProps) {
  const c = useDotCanvas(approach, dot, motion);
  const width = columns * dotSize + (columns - 1) * gap;
  const height = rows * dotSize + (rows - 1) * gap;
  return (
    <View
      style={{ width, height }}
      pointerEvents="none"
      {...dotAccessibility()}
    >
      {c.ready ? (
        <Canvas style={{ width, height }}>
          {Array.from({ length: columns * rows }, (_, i) => (
            <DotShape
              // biome-ignore lint/suspicious/noArrayIndexKey: a cell's index is its place in the grid, which is what identifies it.
              key={i}
              x={(i % columns) * (dotSize + gap)}
              y={Math.floor(i / columns) * (dotSize + gap)}
              size={dotSize}
              approach={approach}
              palette={palette}
              dot={dot}
              seed={i}
              atlas={c.atlas}
              clock={c.clock}
              start={c.start}
              motion={c.motion}
            />
          ))}
        </Canvas>
      ) : null}
    </View>
  );
}
