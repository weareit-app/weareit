import { View } from "react-native";
import { MarkView } from "./mark-view";
import { STILL_DOT_FILL, WE_ARE_IT_MARK, type Mark } from "./marks";
import { WatercolorDot } from "./watercolor-dot";

// The seed of the dot's painted pattern; seed 1 has the cleanest bloom and
// matches the app icon (tools/watercolor-sim/icon.ts).
const ICON_SEED = 1;

// It's logo: the letters with the settled watercolor dot as the dot of the
// i, still (the welcome screen rests completely). It fits within
// `maxWidth` × `maxHeight`.
export function BrandMark({
  mark = WE_ARE_IT_MARK,
  maxWidth,
  maxHeight,
  color,
  label = "We are It",
}: {
  mark?: Mark;
  maxWidth: number;
  maxHeight: number;
  color?: string;
  label?: string;
}) {
  return (
    <View accessible role="img" aria-label={label}>
      <MarkView
        mark={mark}
        maxWidth={maxWidth}
        maxHeight={maxHeight}
        dotFill={STILL_DOT_FILL}
        dot={(size) => (
          <WatercolorDot size={size} motion="still" seed={ICON_SEED} />
        )}
        {...(color !== undefined && { color })}
      />
    </View>
  );
}
