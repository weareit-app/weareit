import type { BlockType } from "@it/domain/essays";
import { View } from "react-native";
import { Text } from "../../components/text";

const names: Record<BlockType, string> = {
  chart: "chart",
  diagram: "diagram",
  math: "formula",
  evidence: "evidence card",
  timeline: "timeline",
  "status-board": "status board",
  table: "table",
  expandable: "section",
};

// What a block shows until its real component is built (public-pages
// group 4).
export function BlockFallback({ type }: { type: BlockType }) {
  return (
    <View className="rounded-md border border-rule bg-paper-sunk px-4 py-3">
      <Text className="text-base text-ink-soft">
        This {names[type]} can't be shown yet.
      </Text>
    </View>
  );
}
