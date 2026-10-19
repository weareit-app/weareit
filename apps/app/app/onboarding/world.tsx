import { View } from "react-native";
import { Text } from "../../src/components/text";
import { PainExplorer } from "../../src/components/personal/pain-explorer";
import { BrandMark } from "../../src/watercolor/brand-mark";

// The societal page, "What could be better for us?" (spec 002), in the same
// design and interaction as the landing page.
export default function WorldScreen() {
  return (
    <PainExplorer
      scope="world"
      next="/onboarding/futures"
      header={() => (
        <>
          <View className="items-center pt-10 md:pt-16">
            <BrandMark maxWidth={76} maxHeight={54} />
          </View>
          {/* Set as the landing page's "What could be better for you?". */}
          <Text
            accessibilityRole="header"
            aria-level={1}
            className="mt-6 font-display text-[24px] leading-[30px] text-ink md:text-[30px] md:leading-[36px]"
          >
            What could be better for us?
          </Text>
        </>
      )}
    />
  );
}
