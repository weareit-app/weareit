import { Canvas, Group, Path, type SkPath } from "@shopify/react-native-skia";
import { useMemo, type ReactNode } from "react";
import { View } from "react-native";
import { useNativeVariable as useNativeVariableTyped } from "react-native-css";
import { INK, markLayout, type Mark } from "@it/watercolor/marks";
import { toSkPath } from "./sk-path";

// The package's types describe its web build (no arguments); this file runs
// only on native (mark-view.web.tsx covers web), where it takes a variable name.
const useNativeVariable = useNativeVariableTyped as unknown as (
  name: string,
) => unknown;

function toSkia(mark: Mark): SkPath[] {
  return mark.paths.map(({ d, evenOdd }) => toSkPath(d, evenOdd));
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
  color,
}: MarkViewProps) {
  const ink = useNativeVariable("--color-ink");
  const fill = color ?? (typeof ink === "string" ? ink : INK);
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
              <Path path={p} color={fill} />
            </Group>
          ))}
        </Group>
      </Canvas>
    </View>
  );
}
