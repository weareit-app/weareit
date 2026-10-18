import { View } from "react-native";
import { INK, markLayout } from "./marks";
import type { MarkViewProps } from "./mark-view";

// A letter mark with a watercolor dot as the dot of the i (web: the letters
// are an inline SVG, so no Skia runtime is loaded). The letters are drawn
// over the dot, as in the logo. It fits within `maxWidth` × `maxHeight`.
// Accessibility is the caller's.
export function MarkView({
  mark,
  maxWidth,
  maxHeight,
  dotFill,
  dot,
  color = INK,
}: MarkViewProps) {
  const layout = markLayout(mark, maxWidth, maxHeight, dotFill);
  const { box } = layout;
  return (
    <View style={{ width: layout.width, height: layout.height }}>
      <View
        style={{
          position: "absolute",
          left: layout.dot.left,
          top: layout.dot.top,
        }}
      >
        {dot(layout.dot.size)}
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
