import type { ContentGraph } from "@it/domain/content";
import { View } from "react-native";
import { Text } from "./text";

type FirstAction = ContentGraph["firstActions"][number];

export function FirstActionCard({ action }: { action: FirstAction }) {
  return (
    <View className="gap-3 rounded-3xl border border-tide-tint bg-tide-wash p-5">
      <View className="flex-row flex-wrap items-center justify-between gap-2">
        <Text className="text-sm font-ui-semibold uppercase tracking-wide text-tide-deep">
          {action.evidence === "candidate"
            ? "An idea to explore"
            : "A small first step"}
        </Text>
        <Text className="text-sm text-ink-soft">
          About {action.effortMinutes} minutes
        </Text>
      </View>
      <Text className="font-heading text-xl text-ink">{action.title}</Text>
      <Text className="font-body leading-6 text-ink-soft">
        {action.description}
      </Text>
      <View className="gap-1 border-l-2 border-tide pl-3">
        <Text className="text-sm font-ui-semibold text-ink">
          Try this first
        </Text>
        <Text className="font-body leading-6 text-ink">{action.firstStep}</Text>
      </View>
      {action.safetyNote ? (
        <Text className="text-sm leading-5 text-ink-soft">
          {action.safetyNote}
        </Text>
      ) : null}
    </View>
  );
}
