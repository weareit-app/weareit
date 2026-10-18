import { Link } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { Page } from "../src/components/page";

export default function WelcomeScreen() {
  return (
    <Page
      brand
      title="Let’s start the good timeline."
      description="Become who you want to be.\nBuild the world you want to live in."
    >
      <View className="h-44 w-full items-center justify-center overflow-hidden rounded-3xl bg-white">
        <Image
          source={require("../assets/brand/watercolor-orb.jpg")}
          resizeMode="contain"
          className="h-full w-44"
          accessibilityLabel="Watercolor orb in blue and green"
        />
      </View>
      <View className="gap-5">
        <Text className="font-serif text-2xl font-bold leading-8 text-ink">
          Start with you.
        </Text>
        <Text className="font-serif text-lg leading-7 text-ink">
          Explore what you want to change, imagine what could be different, and
          find a first step.
        </Text>
        <Link href="/onboarding/personal" asChild>
          <Pressable className="min-h-14 items-center justify-center rounded-xl bg-blue px-6">
            <Text className="text-base font-bold text-white">Get started</Text>
          </Pressable>
        </Link>
      </View>
      <Text className="font-serif text-sm leading-6 text-muted">
        No account needed to explore. Your choices stay on this device until you
        decide to save them.
      </Text>
      {__DEV__ && (
        <Link href="/lab/loader" asChild>
          <Pressable className="min-h-12 items-center justify-center rounded-xl border border-muted px-6">
            <Text className="text-base text-ink">
              Loader lab (development only)
            </Text>
          </Pressable>
        </Link>
      )}
    </Page>
  );
}
