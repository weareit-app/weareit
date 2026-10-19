import type { LucideIcon } from "lucide-react-native";
import type { RefObject } from "react";
import { Image, Pressable, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import type { ContentFix } from "@it/content/graph-schema";
import type { PersonalPath } from "@it/domain/onboarding";
import { rankWays } from "@it/domain/onboarding";
import { dreamStageArt, painStageArt } from "../../content/illustrations";
import { Text } from "../text";
import { CheckCircle, Chevron } from "./marks";
import { useTokenColor } from "../../theme/use-token-color";
import { joinFutureLines } from "./future-sentence";
import { kindCopy, statusCopy, WayRow, type WayChip } from "./way-row";

type Copy = { id: string; title: string; description: string };

export type PainRowProps = {
  pain: Copy;
  dreams: Copy[];
  selected: boolean;
  open: boolean;
  path: PersonalPath | undefined;
  fixes: Map<string, ContentFix>;
  fixDreamLinks: { fixId: string; dreamId: string }[];
  fixOrder: string[];
  focusDreamId: string | undefined;
  flashDreamId: string | null;
  openChip: { fixId: string; chip: WayChip } | null;
  rowRef: RefObject<View | null>;
  dreamRef: (dreamId: string) => (view: View | null) => void;
  onCheck: () => void;
  onRowPress: () => void;
  onToggleDream: (dreamId: string) => void;
  onToggleFix: (fixId: string) => void;
  onChip: (fixId: string, chip: WayChip) => void;
  onGoToDream: (dreamId: string) => void;
  onClose: () => void;
};

// The future whose art the stage shows: the one in focus if it has art,
// else the first chosen future that does.
function stageFuture(chosen: string[], focus: string | undefined) {
  if (focus && chosen.includes(focus) && dreamStageArt[focus]) return focus;
  return chosen.find((id) => dreamStageArt[id]);
}

export function PainRow(props: PainRowProps) {
  const { pain, dreams, selected, open, path } = props;
  const chosen = path?.dreamIds ?? [];
  const pickedFixes = path?.fixIds ?? [];
  const summary = !open && chosen.length > 0;
  const future = stageFuture(chosen, props.focusDreamId);
  const thumb = future ? dreamStageArt[future] : painStageArt[pain.id];
  const titleOf = (id: string) => dreams.find((d) => d.id === id)?.title ?? "";
  const sentence = joinFutureLines(
    dreams.filter((d) => chosen.includes(d.id)).map((d) => d.description),
  );
  // Tasks, habits and group efforts are things you can do now; features
  // aren't built yet, so they are things you'd use, never things you'll do.
  const picked = pickedFixes
    .map((id) => props.fixes.get(id))
    .filter((fix): fix is ContentFix => fix !== undefined);
  const plan = picked.filter((fix) => fix.kind !== "feature");
  const wanted = picked.filter((fix) => fix.kind === "feature");
  const softInk = useTokenColor("--color-ink-soft", "#606162");
  const summaryLabel = [
    `${pain.title}: ${sentence}`,
    plan.length ? `I could: ${plan.map((fix) => fix.title).join(", ")}.` : "",
    wanted.length
      ? `I could use: ${wanted.map((fix) => fix.title).join(", ")}.`
      : "",
    picked.length ? "" : "No plan for this yet.",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <View
      ref={props.rowRef}
      className={
        open
          ? "rounded-2xl border border-rule bg-paper-raised"
          : summary
            ? "rounded-xl border border-rule bg-paper-raised"
            : "rounded-xl border border-transparent"
      }
    >
      <View className="min-h-[52px] flex-row items-start">
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: selected }}
          aria-checked={selected}
          accessibilityLabel={pain.title}
          onPress={props.onCheck}
          className="h-[52px] w-[46px] items-center justify-center"
        >
          <CheckCircle checked={selected} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: open }}
          aria-expanded={open}
          accessibilityLabel={
            summary ? summaryLabel : `${pain.title}: ${pain.description}`
          }
          onPress={props.onRowPress}
          className={`min-h-[52px] flex-1 flex-row gap-3 pr-3 ${summary ? "items-start py-3" : "items-center py-2"}`}
        >
          {!open && thumb ? (
            <Image
              source={thumb}
              resizeMode="contain"
              className="rounded-md bg-white"
              style={{ width: 40, height: 40 }}
              accessibilityIgnoresInvertColors
            />
          ) : null}
          <View className="flex-1 gap-1">
            {summary ? (
              <>
                <Text className="font-ui-bold text-[11px] uppercase tracking-[1.2px] text-ink-soft">
                  {pain.title}
                </Text>
                <Text className="font-heading text-[17px] leading-[23px] text-ink">
                  {sentence}
                </Text>
                {plan.length ? (
                  <View className="mt-3.5 gap-1">
                    <Text className="text-[13px] text-ink-soft">I could:</Text>
                    {plan.map((fix) => (
                      <PlanLine
                        key={fix.id}
                        icon={kindCopy[fix.kind].icon}
                        color={softInk}
                        title={fix.title}
                      />
                    ))}
                  </View>
                ) : null}
                {wanted.length ? (
                  <View
                    className={`${plan.length ? "mt-2.5" : "mt-3.5"} gap-1`}
                  >
                    <Text className="text-[13px] text-ink-soft">
                      I could use:
                    </Text>
                    {wanted.map((fix) => (
                      <PlanLine
                        key={fix.id}
                        icon={kindCopy.feature.icon}
                        color={softInk}
                        title={fix.title}
                        note={
                          fix.featureStatus
                            ? statusCopy[fix.featureStatus].label
                            : undefined
                        }
                      />
                    ))}
                  </View>
                ) : null}
                {picked.length ? null : (
                  <View className="mt-1.5 self-start rounded-full bg-sun-wash px-2.5 py-0.5">
                    <Text className="font-ui-bold text-xs text-sun-deep">
                      No plan for this yet
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <>
                <Text className="font-ui-bold text-base leading-5 text-ink">
                  {pain.title}
                </Text>
                <Text className="text-sm leading-5 text-ink-soft">
                  {pain.description}
                </Text>
              </>
            )}
          </View>
          <Chevron open={open} className="border-ink-faint" />
        </Pressable>
      </View>

      {open ? (
        <OpenPain
          {...props}
          chosen={chosen}
          future={future}
          titleOf={titleOf}
        />
      ) : null}
    </View>
  );
}

function PlanLine({
  icon: Icon,
  color,
  title,
  note,
}: {
  icon: LucideIcon;
  color: string;
  title: string;
  note?: string | undefined;
}) {
  return (
    <View className="flex-row items-start gap-2">
      <View className="h-5 justify-center">
        <Icon aria-hidden size={14} strokeWidth={2.4} color={color} />
      </View>
      <Text className="flex-1 text-[14px] leading-5 text-ink">
        {title}
        {note ? <Text className="text-ink-soft"> · {note}</Text> : null}
      </Text>
    </View>
  );
}

function OpenPain({
  pain,
  dreams,
  path,
  fixes,
  fixDreamLinks,
  fixOrder,
  flashDreamId,
  openChip,
  dreamRef,
  onToggleDream,
  onToggleFix,
  onChip,
  onGoToDream,
  onClose,
  chosen,
  future,
  titleOf,
}: PainRowProps & {
  chosen: string[];
  future: string | undefined;
  titleOf: (id: string) => string;
}) {
  const painArt = painStageArt[pain.id];
  const ways = rankWays(chosen, fixDreamLinks, fixOrder).filter(({ fixId }) =>
    fixes.has(fixId),
  );
  const pickedFixes = path?.fixIds ?? [];
  return (
    <View className="gap-2 px-3.5 pb-3.5">
      {painArt ? (
        <View className="h-[132px] w-[132px] overflow-hidden rounded-xl bg-white">
          <Image
            source={painArt}
            resizeMode="contain"
            style={{ position: "absolute", width: 132, height: 132 }}
            accessibilityIgnoresInvertColors
          />
          {future ? (
            <Animated.View
              key={future}
              entering={FadeIn.duration(320)}
              className="absolute inset-0 bg-white"
            >
              <Image
                source={dreamStageArt[future]!}
                resizeMode="contain"
                style={{ width: 132, height: 132 }}
                accessibilityIgnoresInvertColors
              />
            </Animated.View>
          ) : null}
        </View>
      ) : null}

      {dreams.length ? (
        <>
          <Text
            accessibilityRole="header"
            className="font-ui-bold text-base leading-5 text-ink"
          >
            What would be better?
          </Text>
          <Text className="-mt-1 mb-0.5 text-[13px] text-ink-soft">
            Pick as many as fit.
          </Text>
        </>
      ) : (
        <Text className="text-[15px] leading-5 text-ink-soft">
          Futures for this aren't written yet. It stays picked, and you can come
          back to it.
        </Text>
      )}

      {dreams.map((dream) => {
        const on = chosen.includes(dream.id);
        return (
          <View
            key={dream.id}
            ref={dreamRef(dream.id)}
            className={`flex-row items-center rounded-xl border ${on ? "border-transparent" : "border-rule"} ${flashDreamId === dream.id ? "bg-paper-sunk" : "bg-paper-raised"}`}
          >
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on }}
              aria-checked={on}
              accessibilityLabel={dream.title}
              onPress={() => onToggleDream(dream.id)}
              className="min-h-12 w-11 items-center justify-center"
            >
              <CheckCircle checked={on} size={on ? 24 : 22} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${on ? "Unpick" : "Pick"} ${dream.title}`}
              onPress={() => onToggleDream(dream.id)}
              className="min-h-12 flex-1 justify-center py-1.5 pr-3"
            >
              <Text
                className={
                  on
                    ? "font-heading text-[19px] leading-6 text-ink"
                    : "font-ui-bold text-base leading-5 text-ink"
                }
              >
                {dream.title}
              </Text>
              <Text className="text-sm leading-5 text-ink-soft">
                {dream.description}
              </Text>
            </Pressable>
          </View>
        );
      })}

      {chosen.length ? (
        <View
          aria-live="polite"
          accessibilityLiveRegion="polite"
          className="mt-2.5 gap-1 border-t border-rule pt-3.5"
        >
          {ways.length ? (
            <>
              <Text
                accessibilityRole="header"
                className="mb-1 font-ui-bold text-base leading-5 text-ink"
              >
                Ways it can be better
              </Text>
              {ways.map(({ fixId, dreamIds }) => (
                <WayRow
                  key={fixId}
                  fix={fixes.get(fixId)!}
                  picked={pickedFixes.includes(fixId)}
                  onToggle={() => onToggleFix(fixId)}
                  openChip={openChip?.fixId === fixId ? openChip.chip : null}
                  onChip={(chip) => onChip(fixId, chip)}
                  helpsWith={
                    chosen.length > 1
                      ? dreamIds.map((id) => ({
                          id,
                          title: titleOf(id),
                          onPress: () => onGoToDream(id),
                        }))
                      : null
                  }
                />
              ))}
            </>
          ) : (
            <Text className="text-[13px] text-ink-soft">
              Ways toward these aren't written yet.
            </Text>
          )}
        </View>
      ) : null}

      <View className="mt-1.5 flex-row justify-end">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${pickedFixes.length ? "Done for now" : "Close"}: ${pain.title}`}
          onPress={onClose}
          className="min-h-11 flex-row items-center gap-2 rounded-full border border-ink bg-paper-raised px-4"
        >
          <Text className="font-ui-bold text-sm text-ink">
            {pickedFixes.length ? "Done for now" : "Close"}
          </Text>
          <Chevron open size={7} />
        </Pressable>
      </View>
    </View>
  );
}
