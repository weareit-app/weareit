import type { LucideIcon } from "lucide-react-native";
import type { RefObject } from "react";
import { Pressable, useWindowDimensions, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import type { ContentFix } from "@it/content/graph-schema";
import type { PersonalPath } from "@it/domain/onboarding";
import { rankWays } from "@it/domain/onboarding";
import { dreamStageArt, painStageArt } from "../../content/illustrations";
import { Text } from "../text";
import { GroupIcon } from "./group-icon";
import { CheckCircle, Chevron } from "./marks";
import { printLook } from "./riso";
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

// The future whose art the row shows: the one in focus if it has art,
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

  const summaryBody = (
    <>
      <Text className="font-heading text-[17px] leading-[23px] text-ink">
        {sentence}
      </Text>
      {picked.length ? null : (
        <View className="mt-1.5 self-start rounded-full bg-sun-wash px-2.5 py-0.5">
          <Text className="font-ui-bold text-xs text-sun-deep">
            No plan for this yet
          </Text>
        </View>
      )}
    </>
  );
  // The picked ways: beside the art with the sentence on wider screens; on
  // narrow ones that column is too tight, so they get their own container
  // below the row.
  const wide = useWindowDimensions().width >= 480;
  const planBody = picked.length ? (
    <>
      {plan.length ? (
        <View className="gap-1">
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
        <View className="gap-1">
          <Text className="text-[13px] text-ink-soft">I could use:</Text>
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
    </>
  ) : null;

  // As large as a group icon, open or closed; a chosen future's art fades in
  // over the pain's.
  const art = thumb ? (
    <View className="h-[72px] w-[72px]">
      <Animated.View
        key={thumb}
        entering={FadeIn.duration(320)}
        exiting={FadeOut.duration(320)}
        className="absolute inset-0"
      >
        <GroupIcon id={thumb} size={72} riso={printLook} />
      </Animated.View>
    </View>
  ) : null;

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
      {/* Two containers in a row: the check with the art, then the text. On
          narrow screens the art moves to the right of the text, so the text
          lines up with rows that have no art. */}
      <View
        // The same top in every state, so the check and art never move.
        className={`flex-row items-start pr-3 pt-2 ${summary ? "pb-3" : "pb-2"}`}
      >
        <View
          // The check sits at the top of its container.
          className="flex-row items-start"
        >
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: selected }}
            aria-checked={selected}
            accessibilityLabel={pain.title}
            onPress={props.onCheck}
            className="h-11 w-[46px] items-center justify-center"
          >
            <CheckCircle checked={selected} />
          </Pressable>
          {thumb && wide ? (
            // Tapping the art opens the pain, like the text; it is
            // decorative, so assistive tech skips it.
            <Pressable
              onPress={props.onRowPress}
              aria-hidden
              focusable={false}
              importantForAccessibility="no-hide-descendants"
            >
              {art}
            </Pressable>
          ) : null}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: open }}
          aria-expanded={open}
          accessibilityLabel={
            summary ? summaryLabel : `${pain.title}: ${pain.description}`
          }
          onPress={props.onRowPress}
          className={`flex-1 flex-row items-start gap-3 ${thumb && wide ? "ml-3" : ""}`}
        >
          {/* Short text centres on the art; longer text runs on below it. */}
          <View
            className={`flex-1 justify-center gap-1 ${thumb ? "min-h-[72px]" : "min-h-9"}`}
          >
            {summary ? (
              <>
                <Text className="font-ui-bold text-[11px] uppercase tracking-[1.2px] text-ink-soft">
                  {pain.title}
                </Text>
                {summaryBody}
                {wide && planBody ? (
                  <View className="mt-2.5 gap-2.5">{planBody}</View>
                ) : null}
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
          {thumb && !wide ? <View aria-hidden>{art}</View> : null}
          <View className="self-center">
            <Chevron open={open} className="border-ink-faint" />
          </View>
        </Pressable>
      </View>
      {summary && planBody && !wide ? (
        // Opens the pain like the row; its text is in the row's label.
        <Pressable
          onPress={props.onRowPress}
          aria-hidden
          focusable={false}
          importantForAccessibility="no-hide-descendants"
          className="-mt-1 gap-2.5 pb-3 pl-[46px] pr-3"
        >
          {planBody}
        </Pressable>
      ) : null}
      {open ? <OpenPain {...props} chosen={chosen} titleOf={titleOf} /> : null}
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
  titleOf,
}: PainRowProps & {
  chosen: string[];
  titleOf: (id: string) => string;
}) {
  const ways = rankWays(chosen, fixDreamLinks, fixOrder).filter(({ fixId }) =>
    fixes.has(fixId),
  );
  const pickedFixes = path?.fixIds ?? [];
  return (
    <View className="gap-2 px-3.5 pb-3.5">
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
              {/* The same type picked or not, so nothing reflows on a tap. */}
              <Text className="font-ui-bold text-base leading-5 text-ink">
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
