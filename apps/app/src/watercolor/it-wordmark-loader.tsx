import { Canvas, Group, Path, Skia } from "@shopify/react-native-skia";
import { View } from "react-native";
import { GatherDot } from "./gather-dot";
import {
  INK,
  IT_TYPE_PATHS,
  WORDMARK_BOX,
  wordmarkLayout,
} from "./it-wordmark";

const PATHS = IT_TYPE_PATHS.map((d) => Skia.Path.MakeFromSVGString(d)!);

// "it" with the gathering loader as the dot of the i (iOS: Skia). The letters
// are drawn over the dot, as in the logo. Screen readers hear the label.
export function ItWordmarkLoader({
  height = 200,
  color = INK,
  label = "Loading…",
}: {
  height?: number;
  color?: string;
  label?: string;
}) {
  const layout = wordmarkLayout(height);
  return (
    <View
      accessible
      role="progressbar"
      aria-label={label}
      style={{ width: layout.width, height: layout.height }}
    >
      <View
        style={{
          position: "absolute",
          left: layout.dot.left,
          top: layout.dot.top,
        }}
      >
        <GatherDot size={layout.dot.size} />
      </View>
      <Canvas
        pointerEvents="none"
        style={{
          position: "absolute",
          width: layout.width,
          height: layout.height,
        }}
      >
        <Group
          transform={[
            { scale: layout.scale },
            { translateX: -WORDMARK_BOX.x },
            { translateY: -WORDMARK_BOX.y },
          ]}
        >
          {PATHS.map((p, i) => (
            <Path key={i} path={p} color={color} />
          ))}
        </Group>
      </Canvas>
    </View>
  );
}
