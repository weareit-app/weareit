import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SiteMenuButton } from "./site-menu";
import { ThemeSwitch } from "./theme-switch";

// The theme switch and the menu button, pinned to the window's top-right
// corner over every screen.
export function CornerControls() {
  const insets = useSafeAreaInsets();
  return (
    <View
      pointerEvents="box-none"
      className="absolute right-0 top-0 flex-row items-center gap-3 rounded-bl-2xl bg-paper py-2 pl-4"
      // Below the status bar, which has its own frosted backdrop.
      style={{ top: insets.top, paddingRight: insets.right + 8 }}
    >
      <ThemeSwitch />
      <SiteMenuButton />
    </View>
  );
}
