import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, type ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GatherDot } from "../../src/watercolor/gather-dot";
import { MarkLoader } from "../../src/watercolor/mark-loader";
import { IT_MARK, WE_ARE_IT_MARK } from "../../src/watercolor/marks";
import { WatercolorLoader } from "../../src/watercolor/watercolor-loader";

// The gathering loader, one variant per page: enlarged, as shipped, and as
// the dot of the i in "it" and "we are it" (spec 007). Swipe sideways
// between them. Development builds only. It needs no taps, so a deep link
// can open it on a simulator or device: weareit:///lab/loader, or a given
// page with weareit:///lab/loader?page=4
export default function LoaderLab() {
  const { width, height } = useWindowDimensions();
  const { page: startPage } = useLocalSearchParams<{ page?: string }>();
  const insets = useSafeAreaInsets();
  const pager = useRef<ScrollView>(null);
  useEffect(() => {
    const index = Math.max(Number(startPage) || 1, 1) - 1;
    pager.current?.scrollTo({ x: index * width, animated: false });
  }, [startPage, width]);
  if (!__DEV__) return <Redirect href="/" />;
  const maxWidth = width - 48;
  const pages: { name: string; content: ReactNode }[] = [
    { name: "Big", content: <GatherDot size={Math.min(280, maxWidth)} /> },
    { name: "Little, as shipped", content: <WatercolorLoader /> },
    {
      name: "it",
      content: (
        <MarkLoader mark={IT_MARK} maxWidth={maxWidth} maxHeight={260} />
      ),
    },
    {
      name: "we are it",
      content: (
        <MarkLoader mark={WE_ARE_IT_MARK} maxWidth={maxWidth} maxHeight={320} />
      ),
    },
  ];
  return (
    <View className="flex-1 bg-paper">
      <ScrollView
        ref={pager}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        className="flex-1 bg-paper"
      >
        {pages.map((page, i) => (
          <View
            key={page.name}
            style={{ width, height }}
            className="items-center justify-center"
          >
            {page.content}
            <View className="absolute bottom-12 items-center gap-1">
              <Text className="text-ink">{page.name}</Text>
              <Text className="text-sm text-ink-soft">
                {i + 1} of {pages.length} · swipe for more · development only
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      {/* Sideways swipes move between slides, so a button leads back. */}
      <Pressable
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace("/")
        }
        accessibilityRole="button"
        className="absolute left-4 min-h-11 justify-center rounded-xl px-3"
        style={{ top: insets.top + 8 }}
      >
        <Text className="text-base text-ink">‹ Back</Text>
      </Pressable>
    </View>
  );
}
