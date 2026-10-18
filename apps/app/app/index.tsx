import { Link } from "expo-router";
import { Pressable, View } from "react-native";
import { Text } from "../src/components/text";
import { Page } from "../src/components/page";

export default function WelcomeScreen() {
  return (
    <Page
      brand
      title="Let’s start the good timeline."
      description={
        "Become who you want to be.\nBuild the world you want to live in."
      }
    >
      <View className="gap-5">
        <Text className="font-heading text-3xl leading-9 text-ink">
          It can be better.
        </Text>
        <Text className="font-body text-lg leading-7 text-ink">
          Explore what you want to change, imagine what could be different, and
          find a first step.
        </Text>
        <Link href="/onboarding/personal" asChild>
          <Pressable className="min-h-14 items-center justify-center rounded-xl bg-tide px-6">
            <Text className="text-base font-ui-semibold text-on-tide">
              Get started
            </Text>
          </Pressable>
        </Link>
      </View>
      <Text className="font-ui text-sm leading-6 text-ink-soft">
        No account needed to explore. Your choices stay on this device until you
        decide to save them.
      </Text>
      {__DEV__ && (
        <Link href="/lab/loader" asChild>
          <Pressable className="min-h-12 items-center justify-center rounded-xl border border-ink-soft px-6">
            <Text className="text-base text-ink">
              Loader lab (development only)
            </Text>
          </Pressable>
        </Link>
      )}
    </Page>
  );
}
