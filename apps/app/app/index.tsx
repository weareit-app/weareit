import { Link } from "expo-router";
import { Pressable, View } from "react-native";
import { Text } from "../src/components/text";
import { PainExplorer } from "../src/components/personal/pain-explorer";
import { BrandMark } from "../src/watercolor/brand-mark";

// The landing page, "What could be better for you?" (spec 001).
export default function LandingScreen() {
  return (
    <PainExplorer
      scope="personal"
      next="/onboarding/world"
      header={(interacted) => (
        <>
          {/* The landing view: the mark and the promise, centered. */}
          <View className="items-center gap-8 pb-4 pt-10 md:pt-16">
            {/* Between the onboarding design's 76 × 54 and the lab's lockup. */}
            <BrandMark living maxWidth={152} maxHeight={108} />
            <Text
              accessibilityRole="header"
              aria-level={1}
              className={`text-center font-display tracking-tight text-ink ${interacted ? "text-[36px] leading-[40px] md:text-[48px] md:leading-[52px]" : "text-[52px] leading-[56px] md:text-[72px] md:leading-[76px]"}`}
            >
              It can be better.
            </Text>
          </View>

          <Text
            accessibilityRole="header"
            aria-level={2}
            className="mt-6 font-display text-[24px] leading-[30px] text-ink md:text-[30px] md:leading-[36px]"
          >
            What could be better for you?
          </Text>
        </>
      )}
      footer={
        __DEV__ ? (
          <Link href="/lab/loader" asChild>
            <Pressable className="min-h-11 items-center justify-center">
              <Text className="text-sm text-ink-soft underline">
                Loader lab (development only)
              </Text>
            </Pressable>
          </Link>
        ) : null
      }
    />
  );
}
