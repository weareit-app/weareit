import { Link } from "expo-router";
import { Image, type ImageSourcePropType, Pressable, View } from "react-native";
import { Text } from "../../src/components/text";
import { FirstActionCard } from "../../src/components/first-action-card";
import { Page } from "../../src/components/page";
import { useOnboardingStore } from "../../src/state/onboarding-store";
import {
  contentQueryStateProps,
  usePublishedContent,
} from "../../src/content/use-published-content";
import { ContentQueryState } from "../../src/components/content-query-state";

export default function FuturesScreen() {
  const personalIds = useOnboardingStore((state) => state.personalPainIds);
  const worldIds = useOnboardingStore((state) => state.worldPainIds);
  const chosenPersonalDreamIds = useOnboardingStore(
    (state) => state.personalDreamIds,
  );
  const chosenWorldDreamIds = useOnboardingStore(
    (state) => state.worldDreamIds,
  );
  const contentQuery = usePublishedContent();
  if (!contentQuery.data) {
    return (
      <ContentQueryState
        content="futures"
        {...contentQueryStateProps(contentQuery)}
      />
    );
  }
  const content = contentQuery.data.content;
  // Futures are chosen on the personal and societal pages; here they are a
  // reminder.
  const personalDreams = content.dreams.filter(({ id }) =>
    chosenPersonalDreamIds.includes(id),
  );
  const worldDreams = content.dreams.filter(({ id }) =>
    chosenWorldDreamIds.includes(id),
  );
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
          source={
            require("../../assets/brand/clouds.jpg") as ImageSourcePropType
          }
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
                For your life
              </Text>
              {personalDreams.map((dream) => (
                <View
                  key={dream.id}
                  className="gap-1 border-b border-rule py-3"
                >
                  <Text className="font-heading text-lg text-ink">
                    {dream.title}
                  </Text>
                  <Text className="font-ui text-[15px] leading-5 text-ink-soft">
                    {dream.description}
                  </Text>
                </View>
              ))}
              <Link href="/" asChild>
                <Pressable className="self-start py-2">
                  <Text className="text-ink-soft underline">
                    Change what could be better for you
                  </Text>
                </Pressable>
              </Link>
            </View>
          ) : null}
          {worldDreams.length ? (
            <View className="gap-3">
              <Text className="font-ui-bold text-lg text-ink">
                For the world we share
              </Text>
              {worldDreams.map((dream) => (
                <View
                  key={dream.id}
                  className="gap-1 border-b border-rule py-3"
                >
                  <Text className="font-heading text-lg text-ink">
                    {dream.title}
                  </Text>
                  <Text className="font-ui text-[15px] leading-5 text-ink-soft">
                    {dream.description}
                  </Text>
                </View>
              ))}
              <Link href="/onboarding/world" asChild>
                <Pressable className="self-start py-2">
                  <Text className="text-ink-soft underline">
                    Change what could be better for us
                  </Text>
                </Pressable>
              </Link>
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
          source={
            require("../../assets/brand/house-wide.jpg") as ImageSourcePropType
          }
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
