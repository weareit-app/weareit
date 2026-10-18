import { Link } from "expo-router";
import { Image, Pressable, View } from "react-native";
import { Text } from "../../src/components/text";
import { ChoiceCard } from "../../src/components/choice-card";
import { FirstActionCard } from "../../src/components/first-action-card";
import { dreamIllustrations } from "../../src/content/illustrations";
import { Page } from "../../src/components/page";
import { useOnboardingStore } from "../../src/state/onboarding-store";
import { usePublishedContent } from "../../src/content/use-published-content";
import { ContentQueryState } from "../../src/components/content-query-state";

export default function FuturesScreen() {
  const personalIds = useOnboardingStore((state) => state.personalPainIds);
  const worldIds = useOnboardingStore((state) => state.worldPainIds);
  const selectedPersonalDreams = useOnboardingStore(
    (state) => state.personalDreamIds,
  );
  const selectedWorldDreams = useOnboardingStore(
    (state) => state.worldDreamIds,
  );
  const togglePersonalDream = useOnboardingStore(
    (state) => state.togglePersonalDream,
  );
  const toggleWorldDream = useOnboardingStore(
    (state) => state.toggleWorldDream,
  );
  const contentQuery = usePublishedContent();
  if (!contentQuery.data) {
    const state = (
      <ContentQueryState
        loading={contentQuery.isLoading}
        error={contentQuery.error}
        retry={() => void contentQuery.refetch()}
      />
    );
    if (state) return state;
  }
  const content = contentQuery.data!.content;
  const personalDreamIds = new Set(
    content.painDreamLinks
      .filter(({ painId }) => personalIds.includes(painId))
      .map(({ dreamId }) => dreamId),
  );
  const worldDreamIds = new Set(
    content.painDreamLinks
      .filter(({ painId }) => worldIds.includes(painId))
      .map(({ dreamId }) => dreamId),
  );
  const personalDreams = content.dreams.filter(({ id }) =>
    personalDreamIds.has(id),
  );
  const worldDreams = content.dreams.filter(({ id }) => worldDreamIds.has(id));
  const actionsFor = (painIds: string[]) => {
    const matchedActionIds = new Set(
      content.actionPainLinks
        .filter(({ painId }) => painIds.includes(painId))
        .map(({ actionId }) => actionId),
    );
    return content.firstActions.filter(({ id }) => matchedActionIds.has(id));
  };
  const personalActions = actionsFor(personalIds);
  const worldActions = actionsFor(worldIds);

  return (
    <Page
      eyebrow="A direction to move"
      title="Picture a life with more room in it."
      description="The futures below come from what you chose. They aren't promises or prescriptions. They're places we can begin to find a path."
    >
      <View className="h-40 w-full items-center justify-center overflow-hidden rounded-3xl bg-white">
        <Image
          source={require("../../assets/brand/clouds.jpg")}
          resizeMode="contain"
          className="h-full w-full"
          accessibilityLabel="Soft watercolor clouds in blue and warm yellow"
        />
      </View>
      {personalDreams.length || worldDreams.length ? (
        <View className="gap-6">
          {personalDreams.length ? (
            <View className="gap-3">
              <Text className="font-ui-bold text-lg text-ink">
                For your life · choose what calls to you
              </Text>
              {personalDreams.map((dream) => (
                <ChoiceCard
                  key={dream.id}
                  title={dream.title}
                  description={dream.description}
                  selected={selectedPersonalDreams.includes(dream.id)}
                  onPress={() => togglePersonalDream(dream.id)}
                  illustration={dreamIllustrations[dream.id]}
                />
              ))}
            </View>
          ) : null}
          {worldDreams.length ? (
            <View className="gap-3">
              <Text className="font-ui-bold text-lg text-ink">
                For the world we share
              </Text>
              {worldDreams.map((dream) => (
                <ChoiceCard
                  key={dream.id}
                  title={dream.title}
                  description={dream.description}
                  selected={selectedWorldDreams.includes(dream.id)}
                  onPress={() => toggleWorldDream(dream.id)}
                  illustration={dreamIllustrations[dream.id]}
                />
              ))}
            </View>
          ) : null}
        </View>
      ) : (
        <View className="gap-3 rounded-3xl bg-paper-raised p-6">
          <Text className="font-heading text-xl text-ink">
            You can start anywhere.
          </Text>
          <Text className="font-body leading-6 text-ink-soft">
            A future doesn't have to begin with a problem you named. It can
            begin with something you want to help make possible.
          </Text>
        </View>
      )}
      {personalActions.length ? (
        <View className="gap-3">
          <Text className="font-heading text-2xl text-ink">
            A next step for your life
          </Text>
          {personalActions.map((action) => (
            <FirstActionCard key={action.id} action={action} />
          ))}
        </View>
      ) : null}
      {worldActions.length ? (
        <View className="gap-3">
          <Text className="font-heading text-2xl text-ink">
            A next step we could take together
          </Text>
          {worldActions.map((action) => (
            <FirstActionCard key={action.id} action={action} />
          ))}
        </View>
      ) : null}
      <View className="gap-3 rounded-3xl border border-rule bg-paper-raised p-6 md:p-8">
        <Image
          source={require("../../assets/brand/house-wide.jpg")}
          resizeMode="contain"
          className="h-40 w-full"
          accessibilityLabel="Watercolor home surrounded by a garden"
        />
        <Text className="font-heading text-2xl text-ink">
          There are a few ways to take a first step.
        </Text>
        <Text className="font-body leading-6 text-ink-soft">
          Try a practical idea for your own life, help build the shared roadmap,
          invite someone, or support the work.
        </Text>
        <Link href="/ways-to-help" asChild>
          <Pressable className="min-h-12 items-center justify-center rounded-xl bg-tide px-5">
            <Text className="font-ui-semibold text-on-tide">
              See ways to help
            </Text>
          </Pressable>
        </Link>
        <Link href="/support-it" asChild>
          <Pressable className="min-h-12 items-center justify-center rounded-xl border border-ember px-5">
            <Text className="font-ui-semibold text-ember-deep">Support It</Text>
          </Pressable>
        </Link>
      </View>
      <Link href="/onboarding/world" asChild>
        <Pressable className="self-start py-2">
          <Text className="text-ink-soft">Go back and change choices</Text>
        </Pressable>
      </Link>
    </Page>
  );
}
