import { View } from "react-native";
import { GatherDot } from "./gather-dot";
import { INK, markLayout, type Mark } from "./marks";

// A letter mark with the gathering loader as the dot of the i (web: the
// letters are an inline SVG, so no Skia runtime is loaded). The letters are
// drawn over the dot, as in the logo. It fits within `maxWidth` ×
// `maxHeight`. Screen readers hear the label.
export function MarkLoader({
  mark,
  maxWidth,
  maxHeight,
  color = INK,
  label = "Loading…",
}: {
  mark: Mark;
  maxWidth: number;
  maxHeight: number;
  color?: string;
  label?: string;
}) {
  const layout = markLayout(mark, maxWidth, maxHeight);
  const { box } = layout;
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
        viewBox={`${box.x} ${box.y} ${box.width} ${box.height}`}
        width={layout.width}
        height={layout.height}
        style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
      >
        <g fill={color}>
          {mark.paths.map(({ d, place, evenOdd }, i) => (
            <path
              key={i}
              d={d}
              fillRule={evenOdd ? "evenodd" : undefined}
              transform={
                place
                  ? `matrix(${place.scale} 0 0 ${place.scale} ${place.x} ${place.y})`
                  : undefined
              }
            />
          ))}
        </g>
      </svg>
    </View>
  );
}
