import { View } from "react-native";
import { GatherDot } from "./gather-dot";
import { MarkView } from "./mark-view";
import { LOADER_DOT_FILL, type Mark } from "./marks";

// A letter mark with the gathering loader as the dot of the i. It fits
// within `maxWidth` × `maxHeight`. Screen readers hear the label.
export function MarkLoader({
  mark,
  maxWidth,
  maxHeight,
  color,
  label = "Loading…",
}: {
  mark: Mark;
  maxWidth: number;
  maxHeight: number;
  color?: string;
  label?: string;
}) {
  return (
    <View accessible role="progressbar" aria-label={label}>
      <MarkView
        mark={mark}
        maxWidth={maxWidth}
        maxHeight={maxHeight}
        dotFill={LOADER_DOT_FILL}
        dot={(size) => <GatherDot size={size} />}
        {...(color !== undefined && { color })}
      />
    </View>
  );
}
