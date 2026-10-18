import {
  Canvas,
  FillType,
  Group,
  Path,
  Skia,
  type SkPath,
} from "@shopify/react-native-skia";
import { useMemo, type ReactNode } from "react";
import { View } from "react-native";
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

export interface MarkViewProps {
  mark: Mark;
  maxWidth: number;
  maxHeight: number;
  // How much of its canvas the dot fills (marks.ts).
  dotFill: number;
  // Draws the dot of the i at the given canvas size.
  dot: (size: number) => ReactNode;
  color?: string;
}

// A letter mark with a watercolor dot as the dot of the i (iOS: the letters
// are drawn with Skia). The letters are drawn over the dot, as in the logo.
// It fits within `maxWidth` × `maxHeight`. Accessibility is the caller's.
export function MarkView({
  mark,
  maxWidth,
  maxHeight,
  dotFill,
  dot,
  color = INK,
}: MarkViewProps) {
  const paths = useMemo(() => toSkia(mark), [mark]);
  const layout = markLayout(mark, maxWidth, maxHeight, dotFill);
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
