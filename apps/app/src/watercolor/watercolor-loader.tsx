import { useEffect, useState } from "react";
import { AccessibilityInfo, Platform, Text, View } from "react-native";
import { WatercolorDot } from "./watercolor-dot";

// Wait this long before showing the loader, so quick loads don't flash it.
export const LOADER_DELAY_MS = 300;

// The watercolor dot breathing while content loads, with the words saying so
// (contract: WatercolorLoader). The dot is decorative; the text carries the
// meaning and is announced once. It never shows progress it doesn't have.
export function WatercolorLoader({
  label = "Loading…",
  size = 56,
}: {
  label?: string;
  size?: number;
}) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShown(true), LOADER_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (shown && Platform.OS === "ios") {
      AccessibilityInfo.announceForAccessibility(label);
    }
  }, [shown, label]);

  if (!shown) return <View style={{ minHeight: size }} />;

  return (
    <View className="flex-row items-center gap-4" style={{ minHeight: size }}>
      <WatercolorDot size={size} motion="bloom-loop" />
      <Text
        className="font-serif text-lg text-muted"
        accessibilityLiveRegion="polite"
        aria-live="polite"
      >
        {label}
      </Text>
    </View>
  );
}
