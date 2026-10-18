import { View } from "react-native";
import { GatherDot } from "./gather-dot";
import {
  INK,
  IT_TYPE_PATHS,
  WORDMARK_BOX,
  wordmarkLayout,
} from "./it-wordmark";

// "it" with the gathering loader as the dot of the i (web: the letters are an
// inline SVG, so no Skia runtime is loaded). The letters are drawn over the
// dot, as in the logo. Screen readers hear the label.
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
  const box = WORDMARK_BOX;
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
      <svg
        aria-hidden
        viewBox={`${box.x} ${box.y} ${box.right - box.x} ${box.bottom - box.y}`}
        width={layout.width}
        height={layout.height}
        style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
      >
        <g fill={color}>
          {IT_TYPE_PATHS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </svg>
    </View>
  );
}
