import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useIsDark } from "../state/theme-store";

// A frosted band behind the status bar, as in Apple's own apps: content
// scrolled up under the clock and battery blurs instead of showing through.
// It follows the app's light/dark choice. On web the inset is zero and
// nothing draws.
export function StatusBarBackdrop() {
  const insets = useSafeAreaInsets();
  const isDark = useIsDark();
  if (!insets.top) return null;
  return (
    <BlurView
      pointerEvents="none"
      intensity={80}
      tint={isDark ? "systemChromeMaterialDark" : "systemChromeMaterialLight"}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: insets.top,
      }}
    />
  );
}
