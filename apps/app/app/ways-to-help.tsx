import { Link } from "expo-router";
import { Pressable, View } from "react-native";
import { Text } from "../src/components/text";
import { ChoiceCard } from "../src/components/choice-card";
import { ClearDraftControl } from "../src/components/clear-draft-control";
import { Page } from "../src/components/page";
import { useOnboardingStore } from "../src/state/onboarding-store";
import type { helpInterestIds } from "@it/domain/onboarding";

const options = [
  {
    id: "recruiting",
    title: "Invite one person",
    description:
      "Tell someone why you want a better future to be possible, and invite them to explore It with you. About 10 minutes.",
  },
  {
    id: "research",
    title: "Check one claim or source",
    description:
      "Find the original source for a public claim and note what it does and doesn't show. About 20 minutes.",
  },
  {
    id: "product-feedback",
    title: "Try the onboarding and give feedback",
    description:
      "Notice what feels clear, what feels off, and what you wish It asked. About 10 minutes.",
  },
  {
    id: "skills",
    title: "Put a skill to use",
    description:
      "Choose a skill you would enjoy contributing. We are building a way to map skills to real tasks as the roadmap grows.",
  },
  {
    id: "open-to-anything",
    title: "Help wherever you are needed",
    description:
      "Recruiting, research, testing, and small practical tasks are useful even before the roadmap is fully formed.",
  },
] satisfies Array<{
  id: (typeof helpInterestIds)[number];
  title: string;
  description: string;
}>;

export default function WaysToHelpScreen() {
  const selected = useOnboardingStore((state) => state.helpInterests);
  const toggle = useOnboardingStore((state) => state.toggleHelpInterest);
  return (
    <Page
      eyebrow="An exploratory waitlist"
      title="There is room for you in this."
      description="It is still being built. Pick the kinds of work you'd be curious about and help shape what becomes possible."
    >
      {options.map((option) => (
        <ChoiceCard
          key={option.id}
          title={option.title}
          description={option.description}
          selected={selected.includes(option.id)}
          onPress={() => toggle(option.id)}
        />
      ))}
      <View className="gap-3 rounded-3xl bg-sun-wash p-5">
        <Text className="font-ui-semibold text-ink">Just exploring?</Text>
        <Text className="leading-6 text-ink-soft">
          That's welcome too. These choices stay on this device until you choose
          to save them with an email code.
        </Text>
      </View>
      <View className="flex-row flex-wrap gap-3">
        <Link href="/onboarding/futures" asChild>
          <Pressable className="min-h-12 rounded-full bg-tide px-6 py-3">
            <Text className="font-ui-semibold text-on-tide">
              Back to futures
            </Text>
          </Pressable>
        </Link>
        <Link href="/support-it" asChild>
          <Pressable className="min-h-12 rounded-full border border-ember px-6 py-3">
            <Text className="font-ui-semibold text-ember-deep">Support It</Text>
          </Pressable>
        </Link>
        <Link href="/save-progress" asChild>
          <Pressable className="min-h-12 rounded-full bg-tide px-6 py-3">
            <Text className="font-ui-semibold text-on-tide">
              Save my exploration
            </Text>
          </Pressable>
        </Link>
      </View>
      <ClearDraftControl />
    </Page>
  );
}
