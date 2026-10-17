import { useEffect, useState } from "react";
import { AccessibilityInfo, Platform, Text, View } from "react-native";
import { GatherDot } from "./gather-dot";

// Wait this long before showing the loader, so quick loads don't flash it.
export const LOADER_DELAY_MS = 300;

// The gathering watercolor dot while content loads (contract:
// WatercolorLoader). It shows no words (founder, 2026-10-17); screen readers
// still hear the label, announced once. It never shows progress it doesn't
// have.
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
    <View
      accessible
      role="progressbar"
      aria-label={label}
      style={{ minHeight: size }}
    >
      <GatherDot size={size} />
      {/* Read on web by screen readers as it appears; not shown. */}
      <Text aria-live="polite" style={visuallyHidden}>
        {label}
      </Text>
    </View>
  );
}

const visuallyHidden = {
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  opacity: 0,
} as const;
