import {
  Blocks,
  CircleDotDashed,
  Lightbulb,
  Milestone,
  Repeat,
  Users,
  type LucideIcon,
} from "lucide-react-native";
import { Pressable, View } from "react-native";
import { useTokenColor } from "../../theme/use-token-color";
import type { ContentFix } from "@it/content/graph-schema";
import { Text } from "../text";
import { CheckSquare } from "./marks";

export type WayChip = "type" | "status" | "evidence";

// Each type has a small icon before its label; the label carries the meaning.
export const kindCopy: Record<
  ContentFix["kind"],
  { label: string; detail: string; icon: LucideIcon }
> = {
  once: {
    label: "Task",
    detail: "A single step you could take today.",
    icon: CircleDotDashed,
  },
  habit: {
    label: "Habit",
    detail: "Works through repetition over time, not in one go.",
    icon: Repeat,
  },
  group: {
    label: "Takes a group",
    detail: "Needs several people or an organization to act together.",
    icon: Users,
  },
  feature: {
    label: "Feature",
    detail:
      "Something It would offer. It isn't available yet; choosing it tells us to build it.",
    icon: Blocks,
  },
};

// A feature's place on the roadmap, its own tag beside the type.
export const statusCopy: Record<
  NonNullable<ContentFix["featureStatus"]>,
  { label: string; detail: string; icon: LucideIcon }
> = {
  idea: {
    label: "Idea",
    detail: "An idea for It. Nothing is built or scheduled yet.",
    icon: Lightbulb,
  },
  planned: {
    label: "Planned",
    detail: "On It's roadmap, but not built yet.",
    icon: Milestone,
  },
};

const evidenceCopy: Record<
  ContentFix["evidence"],
  { label: string; bars: number }
> = {
  strong: { label: "Strong evidence", bars: 3 },
  some: { label: "Some evidence", bars: 2 },
  limited: { label: "Limited evidence", bars: 1 },
  untested: { label: "Not tested yet", bars: 0 },
};

function Chip({
  label,
  open,
  strong,
  onPress,
  children,
}: {
  label: string;
  open: boolean;
  strong?: boolean;
  onPress: () => void;
  children?: React.ReactNode;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      aria-expanded={open}
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={{ top: 8, bottom: 8 }}
      // Quiet text, not a pill: an icon and a label under the title. Open,
      // it reads in ink and underlined.
      className="min-h-7 flex-row items-center gap-1.5"
    >
      {children}
      <Text
        className={`text-xs ${strong || open ? "text-ink" : "text-ink-soft"} ${open ? "underline" : ""}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// One way it can be better, shown once per open pain however many of the
// chosen futures it may help with.
export function WayRow({
  fix,
  picked,
  onToggle,
  openChip,
  onChip,
  helpsWith,
}: {
  fix: ContentFix;
  picked: boolean;
  onToggle: () => void;
  openChip: WayChip | null;
  onChip: (chip: WayChip) => void;
  /** Chosen futures this way is for, as a last "For …" line; shown when two or more are chosen. */
  helpsWith: { id: string; title: string; onPress: () => void }[] | null;
}) {
  const evidence = evidenceCopy[fix.evidence];
  const type = kindCopy[fix.kind].label;
  const status =
    fix.kind === "feature" && fix.featureStatus
      ? statusCopy[fix.featureStatus]
      : null;
  const TypeIcon = kindCopy[fix.kind].icon;
  const strongInk = useTokenColor("--color-ink", "#1F2021");
  const softInk = useTokenColor("--color-ink-soft", "#606162");
  return (
    <View
      className={`flex-row items-start gap-1 rounded-xl ${picked ? "bg-paper-sunk" : ""}`}
    >
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: picked }}
        aria-checked={picked}
        accessibilityLabel={fix.title}
        onPress={onToggle}
        className="min-h-11 w-9 items-center pt-3"
      >
        <CheckSquare checked={picked} />
      </Pressable>
      <View className="flex-1 gap-1.5 py-1.5 pr-1.5">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${picked ? "Unpick" : "Pick"} ${fix.title}`}
          onPress={onToggle}
          className="gap-0.5"
        >
          <Text className="font-ui-bold text-[15px] leading-5 text-ink">
            {fix.title}
          </Text>
          <Text className="text-[13px] leading-[18px] text-ink-soft">
            {fix.description}
          </Text>
        </Pressable>
        <View className="-my-1 flex-row flex-wrap gap-x-3.5">
          <Chip
            label={type}
            strong={fix.kind === "feature"}
            open={openChip === "type"}
            onPress={() => onChip("type")}
          >
            <TypeIcon
              aria-hidden
              size={13}
              strokeWidth={2.4}
              color={fix.kind === "feature" ? strongInk : softInk}
            />
          </Chip>
          {status ? (
            <Chip
              label={status.label}
              open={openChip === "status"}
              onPress={() => onChip("status")}
            >
              <status.icon
                aria-hidden
                size={13}
                strokeWidth={2.4}
                color={softInk}
              />
            </Chip>
          ) : null}
          <Chip
            label={evidence.label}
            open={openChip === "evidence"}
            onPress={() => onChip("evidence")}
          >
            <View aria-hidden className="flex-row gap-0.5">
              {[1, 2, 3].map((bar) => (
                <View
                  key={bar}
                  className={`h-2.5 w-[3px] rounded-[1px] ${bar <= evidence.bars ? "bg-ink" : "bg-rule"}`}
                />
              ))}
            </View>
          </Chip>
        </View>
        {openChip ? (
          <View className="gap-1 rounded-lg bg-paper-sunk px-2.5 py-2">
            <Text className="text-[13px] leading-5 text-ink">
              {openChip === "type"
                ? kindCopy[fix.kind].detail
                : openChip === "status" && status
                  ? status.detail
                  : fix.evidenceNote}
            </Text>
            <Text className="text-[13px] text-ink-soft">
              {openChip === "evidence"
                ? "Sources aren't linked yet."
                : "Tap again to close."}
            </Text>
          </View>
        ) : null}
        {helpsWith ? (
          // One quiet line, last: which of the chosen futures this is for.
          <Text className="text-[13px] leading-5 text-ink-soft">
            For{" "}
            {helpsWith.map((dream, i) => (
              <Text key={dream.id}>
                {i > 0 ? ", " : null}
                <Text
                  accessibilityRole="link"
                  accessibilityHint="Scrolls to this future"
                  onPress={dream.onPress}
                  className="underline"
                >
                  {dream.title}
                </Text>
              </Text>
            ))}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
