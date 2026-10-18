import {
  Canvas,
  FillType,
  Group,
  Path,
  Skia,
  type SkPath,
} from "@shopify/react-native-skia";
import { useMemo } from "react";
import { View } from "react-native";
import { GatherDot } from "./gather-dot";
import { INK, markLayout, type Mark } from "./marks";

function toSkia(mark: Mark): SkPath[] {
  return mark.paths.map(({ d, evenOdd }) => {
    const path = Skia.Path.MakeFromSVGString(d)!;
    if (evenOdd) path.setFillType(FillType.EvenOdd);
    return path;
  });
}

// matrix(s 0 0 s x y): scale, then offset. Skia applies the last listed
// transform first, as React Native does.
function placed({ place }: Mark["paths"][number]) {
  return place
    ? [{ translateX: place.x }, { translateY: place.y }, { scale: place.scale }]
    : [];
}

// A letter mark with the gathering loader as the dot of the i (iOS: Skia).
// The letters are drawn over the dot, as in the logo. It fits within
// `maxWidth` × `maxHeight`. Screen readers hear the label.
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
  const paths = useMemo(() => toSkia(mark), [mark]);
  const layout = markLayout(mark, maxWidth, maxHeight);
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
            { translateX: -layout.box.x },
            { translateY: -layout.box.y },
          ]}
        >
          {paths.map((p, i) => (
            <Group key={i} transform={placed(mark.paths[i]!)}>
              <Path path={p} color={color} />
            </Group>
          ))}
        </Group>
      </Canvas>
    </View>
  );
}
