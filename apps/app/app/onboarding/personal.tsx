import { Link } from "expo-router";
import { Pressable, View } from "react-native";
import { Text } from "../../src/components/text";
import { ChoiceCard } from "../../src/components/choice-card";
import { ClearDraftControl } from "../../src/components/clear-draft-control";
import { painIllustrations } from "../../src/content/illustrations";
import { Page } from "../../src/components/page";
import { useOnboardingStore } from "../../src/state/onboarding-store";
import { usePublishedContent } from "../../src/content/use-published-content";
import { ContentQueryState } from "../../src/components/content-query-state";

export default function PersonalPainsScreen() {
  const selected = useOnboardingStore((state) => state.personalPainIds);
  const toggle = useOnboardingStore((state) => state.togglePersonalPain);
  const ready = useOnboardingStore((state) => state.ready);
  const contentQuery = usePublishedContent();

  if (!contentQuery.data)
    return (
      <ContentQueryState
        loading={contentQuery.isLoading}
        error={contentQuery.error}
        retry={() => void contentQuery.refetch()}
      />
    );

  if (!ready)
    return (
      <Page
        title="Your life"
        description="Loading your saved choices…"
        descriptionStyle="interface"
      >
        <View />
      </Page>
    );

  return (
    <Page
      eyebrow="Start with you."
      title="What can be better for you?"
      description="Choose whatever fits. You can change your mind later."
      descriptionStyle="interface"
    >
      {contentQuery.data.content.domains
        .filter((domain) => domain.scope === "personal")
        .map((domain) => (
          <View key={domain.id} className="gap-3">
            <Text className="font-ui-bold text-lg text-ink">
              {domain.title}
            </Text>
            {contentQuery.data.content.pains
              .filter((pain) => pain.domainId === domain.id)
              .map((pain) => (
                <ChoiceCard
                  key={pain.id}
                  title={pain.title}
                  description={pain.description}
                  selected={selected.includes(pain.id)}
                  onPress={() => toggle(pain.id)}
                  illustration={painIllustrations[pain.id]}
                />
              ))}
          </View>
        ))}
      <View className="flex-row items-center justify-between gap-4">
        <Text className="flex-1 text-sm text-ink-soft">
          {selected.length} selected · kept on this device
        </Text>
        <Link href="/onboarding/world" asChild>
          <Pressable className="min-h-12 rounded-xl bg-tide px-6 py-3">
            <Text className="font-ui-semibold text-on-tide">Continue</Text>
          </Pressable>
        </Link>
      </View>
      <Link href="/onboarding/world" asChild>
        <Pressable className="self-start py-2">
          <Text className="text-ink-soft">Skip this step</Text>
        </Pressable>
      </Link>
      <ClearDraftControl />
    </Page>
  );
}
