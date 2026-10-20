import { Link, type Href } from "expo-router";
import { CornerLeftDown } from "lucide-react-native";
import { useMemo, useRef, useState, type ReactNode } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useReducedMotion } from "react-native-reanimated";
import { resolveFeatureStatuses } from "@it/content/graph-schema";
import { Text } from "../text";
import { ClearDraftControl } from "../clear-draft-control";
import { ContentQueryState } from "../content-query-state";
import { GroupIcon } from "./group-icon";
import { printLook } from "./riso";
import { joinFutureLines } from "./future-sentence";
import { Chevron } from "./marks";
import { PainRow } from "./pain-row";
import type { WayChip } from "./way-row";
import {
  useOnboardingStore,
  type PainScope,
} from "../../state/onboarding-store";
import { usePublishedContent } from "../../content/use-published-content";
import { useTokenColor } from "../../theme/use-token-color";
import { groupIcons } from "../../content/group-icons";

// A page of pains grouped under collapsible headings: a pain opens in place
// into futures, and chosen futures into ways it can be better (spec 001;
// onboarding prototype, 2026-10-18). The personal page and the societal page
// both use it. Choices live on this device; what is open is
// screen state only.
export function PainExplorer({
  scope,
  header,
  next,
  footer,
}: {
  scope: PainScope;
  /** Everything above the groups; `interacted` once anything is picked. */
  header: (interacted: boolean) => ReactNode;
  /** Where Skip / Continue goes. */
  next: Href;
  footer?: ReactNode;
}) {
  const softInk = useTokenColor("--color-ink-soft", "#606162");
  const selected = useOnboardingStore((state) =>
    scope === "personal" ? state.personalPainIds : state.worldPainIds,
  );
  const paths = useOnboardingStore((state) =>
    scope === "personal" ? state.personalPaths : state.worldPaths,
  );
  const ready = useOnboardingStore((state) => state.ready);
  const select = useOnboardingStore((state) => state.selectPain);
  const unselect = useOnboardingStore((state) => state.unselectPain);
  const toggleDreamIn = useOnboardingStore((state) => state.toggleDream);
  const toggleFixIn = useOnboardingStore((state) => state.toggleFix);
  const selectPain = (painId: string) => select(scope, painId);
  const unselectPain = (painId: string) => unselect(scope, painId);
  const toggleDream = (
    painId: string,
    dreamId: string,
    links: { fixId: string; dreamId: string }[],
  ) => toggleDreamIn(scope, painId, dreamId, links);
  const toggleFix = (painId: string, fixId: string) =>
    toggleFixIn(scope, painId, fixId);
  const contentQuery = usePublishedContent();
  const reduceMotion = useReducedMotion();

  // Every group starts collapsed.
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [openPain, setOpenPain] = useState<string | null>(null);
  const [openChip, setOpenChip] = useState<{
    fixId: string;
    chip: WayChip;
  } | null>(null);
  const [focus, setFocus] = useState<Record<string, string>>({});
  const [inviteDismissed, setInviteDismissed] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const contentRef = useRef<View>(null);
  const painRefs = useRef(new Map<string, { current: View | null }>());

  const content = contentQuery.data?.content;
  const model = useMemo(() => {
    if (!content) return null;
    const dreamsById = new Map(content.dreams.map((d) => [d.id, d]));
    const groups = content.domains
      .filter((domain) => domain.scope === scope)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((domain) => ({
        ...domain,
        pains: content.pains
          .filter((pain) => pain.domainId === domain.id)
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((pain) => ({
            ...pain,
            dreams: content.painDreamLinks
              .filter((link) => link.painId === pain.id)
              .map((link) => dreamsById.get(link.dreamId))
              .filter((dream) => dream !== undefined),
          })),
      }));
    // A fix connected to a roadmap item shows the item's status.
    const fixes = resolveFeatureStatuses(content);
    return {
      groups,
      fixes: new Map(fixes.map((fix) => [fix.id, fix])),
      fixOrder: [...fixes]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(({ id }) => id),
      fixDreamLinks: content.fixDreamLinks,
    };
  }, [content, scope]);

  if (!model)
    return (
      <ContentQueryState
        loading={contentQuery.isLoading}
        error={contentQuery.error}
        retry={() => void contentQuery.refetch()}
      />
    );

  const pathFor = (painId: string) =>
    paths.find((path) => path.painId === painId);
  const painRef = (painId: string) => {
    let ref = painRefs.current.get(painId);
    if (!ref) {
      ref = { current: null };
      painRefs.current.set(painId, ref);
    }
    return ref;
  };

  // Keeps the person's place: brings a view back near the top of the screen.
  function scrollTo(view: View | null | undefined) {
    const container = contentRef.current;
    if (!view || !container) return;
    view.measureLayout(container, (_x, y) => {
      scrollRef.current?.scrollTo({
        y: Math.max(0, y - 96),
        animated: !reduceMotion,
      });
    });
  }
  const afterLayout = (run: () => void) => setTimeout(run, 40);

  function open(painId: string, groupId: string) {
    selectPain(painId);
    setOpenGroup(groupId);
    setOpenPain(painId);
    setOpenChip(null);
  }
  function close(painId: string, keepPlace: boolean) {
    setOpenPain(null);
    setOpenChip(null);
    if (keepPlace) afterLayout(() => scrollTo(painRef(painId).current));
  }

  const interacted = selected.length > 0 || paths.length > 0;
  const unexplored = model.groups
    .flatMap((group) => group.pains.map((pain) => ({ pain, group })))
    .filter(
      ({ pain }) =>
        selected.includes(pain.id) &&
        pain.dreams.length > 0 &&
        !pathFor(pain.id)?.dreamIds.length &&
        openPain !== pain.id,
    );
  const showInvite =
    !inviteDismissed && selected.length >= 4 && unexplored.length >= 2;

  return (
    <ScrollView
      ref={scrollRef}
      className="flex-1 bg-paper"
      contentContainerStyle={{ flexGrow: 1 }}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View
        ref={contentRef}
        className="mx-auto w-full max-w-xl flex-1 gap-[18px] px-5 pb-7 pt-6"
      >
        {header(interacted)}

        {!ready ? (
          <Text className="text-ink-soft">Loading your saved choices…</Text>
        ) : (
          <View className="gap-2.5">
            {model.groups.map((group) => {
              const expanded = openGroup === group.id;
              // Each pain with picked futures, as its closed row reads: the
              // pain's name and one sentence, in content order. The rest of
              // the group's pains follow, still to explore.
              const summaries = group.pains.flatMap((pain) => {
                const chosen = pathFor(pain.id)?.dreamIds ?? [];
                const lines = pain.dreams
                  .filter((dream) => chosen.includes(dream.id))
                  .map((dream) => dream.description);
                return lines.length
                  ? [{ pain, sentence: joinFutureLines(lines) }]
                  : [];
              });
              const others = group.pains.filter(
                (pain) => !summaries.some((summary) => summary.pain === pain),
              );
              return (
                <View
                  key={group.id}
                  className="overflow-hidden rounded-2xl border border-rule bg-paper-raised"
                >
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ expanded }}
                    aria-expanded={expanded}
                    onPress={() => setOpenGroup(expanded ? null : group.id)}
                    className="min-h-[60px] flex-row items-start gap-3 px-4 py-3"
                  >
                    {groupIcons[group.id] ? (
                      <View className="h-[72px] w-[72px] items-center justify-center">
                        <GroupIcon id={group.id} size={72} riso={printLook} />
                      </View>
                    ) : null}
                    <View className="flex-1">
                      {/* The name is centred on the icon, so it doesn't move
                          when the group opens; the preview starts just
                          under it, beside the icon. */}
                      <View className="h-[72px] flex-row items-center gap-3">
                        <Text className="flex-1 font-heading text-[22px] leading-7 text-ink">
                          {group.title}
                        </Text>
                        <Chevron open={expanded} />
                      </View>
                      {expanded ? null : (
                        <View className="-mt-2 gap-[3px]">
                          {summaries.map(({ pain, sentence }) => (
                            <View key={pain.id} className="mb-2.5">
                              {/* A small turn down from the pain's name to its
                                  sentence. */}
                              <View className="mb-0.5 flex-row items-center gap-1">
                                <CornerLeftDown
                                  aria-hidden
                                  size={12}
                                  strokeWidth={2.2}
                                  color={softInk}
                                />
                                <Text className="font-ui-bold text-[11px] uppercase tracking-[1.2px] text-ink-soft">
                                  {pain.title}
                                </Text>
                              </View>
                              <Text className="font-heading text-[15px] leading-[21px] text-ink">
                                {sentence}
                              </Text>
                            </View>
                          ))}
                          {/* The pains themselves are listed once it's open. */}
                          {others.length ? (
                            <Text className="text-sm leading-5 text-ink-faint">
                              {others.map((pain) => pain.title).join(" · ")}
                            </Text>
                          ) : null}
                        </View>
                      )}
                    </View>
                  </Pressable>

                  {expanded ? (
                    <View className="gap-1.5 px-2.5 pb-3">
                      {group.pains.map((pain) => {
                        const isOpen = openPain === pain.id;
                        const isSelected = selected.includes(pain.id);
                        return (
                          <PainRow
                            key={pain.id}
                            pain={pain}
                            dreams={pain.dreams}
                            selected={isSelected}
                            open={isOpen}
                            path={pathFor(pain.id)}
                            fixes={model.fixes}
                            fixDreamLinks={model.fixDreamLinks}
                            fixOrder={model.fixOrder}
                            focusDreamId={focus[pain.id]}
                            openChip={openChip}
                            rowRef={painRef(pain.id)}
                            onCheck={() => {
                              if (!isSelected) return open(pain.id, group.id);
                              unselectPain(pain.id);
                              if (isOpen) close(pain.id, false);
                            }}
                            onRowPress={() =>
                              isOpen
                                ? close(pain.id, false)
                                : open(pain.id, group.id)
                            }
                            onToggleDream={(dreamId) => {
                              const picking = !pathFor(
                                pain.id,
                              )?.dreamIds.includes(dreamId);
                              toggleDream(
                                pain.id,
                                dreamId,
                                model.fixDreamLinks,
                              );
                              if (picking)
                                setFocus((current) => ({
                                  ...current,
                                  [pain.id]: dreamId,
                                }));
                            }}
                            onToggleFix={(fixId) => toggleFix(pain.id, fixId)}
                            onChip={(fixId, chip) =>
                              setOpenChip((current) =>
                                current?.fixId === fixId &&
                                current.chip === chip
                                  ? null
                                  : { fixId, chip },
                              )
                            }
                            onClose={() => close(pain.id, true)}
                          />
                        );
                      })}
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        )}

        {showInvite ? (
          <View className="gap-2.5 rounded-[14px] border border-dashed border-ink-faint p-3.5">
            <Text className="font-ui-bold text-[15px] leading-5 text-ink">
              You've picked {selected.length}. Start with about three?
            </Text>
            <Text className="-mt-1 text-[13px] text-ink-soft">
              The rest stay saved. Come back to any of them.
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {unexplored.map(({ pain, group }) => (
                <Pressable
                  key={pain.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Open ${pain.title}`}
                  onPress={() => {
                    open(pain.id, group.id);
                    afterLayout(() => scrollTo(painRef(pain.id).current));
                  }}
                  className="min-h-10 justify-center rounded-full border border-ink bg-paper-raised px-3.5"
                >
                  <Text className="font-ui-bold text-sm text-ink">
                    {pain.title}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => setInviteDismissed(true)}
              className="min-h-9 justify-center self-start"
            >
              <Text className="text-[13px] text-ink-soft underline">
                Not now
              </Text>
            </Pressable>
          </View>
        ) : null}

        <View className="mt-auto gap-2.5 pt-2">
          <Link href={next} asChild>
            <Pressable
              className={`min-h-[54px] flex-row items-center justify-center rounded-full border-[1.5px] px-5 ${interacted ? "border-tide bg-tide" : "border-ink bg-transparent"}`}
            >
              <Text
                className={`text-center font-ui-bold text-base ${interacted ? "text-on-tide" : "text-ink"}`}
              >
                {interacted ? "Continue" : "Skip"}
              </Text>
            </Pressable>
          </Link>
          <Text className="text-center text-[13px] text-ink-soft">
            Free, and you're not the product.
          </Text>
          <Text className="text-center text-sm text-ink-soft">
            {selected.length} selected · kept on this device
          </Text>
          <View className="items-center">
            <ClearDraftControl />
          </View>
          {footer}
        </View>
      </View>
    </ScrollView>
  );
}
