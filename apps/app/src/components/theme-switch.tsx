import { Moon, Sun } from "lucide-react-native";
import { Switch, View } from "react-native";
import { useIsDark, useThemeStore } from "../state/theme-store";
import { useTokenColor } from "../theme/use-token-color";

// Tide and stone are spot inks, the same in light and dark.
const TRACK = { true: "#087E9F", false: "#88898A" };

// Light or dark for this device, between a sun and a moon; starts from the
// device setting. The icons are decorative; the switch is named "Dark mode".
export function ThemeSwitch() {
  const setScheme = useThemeStore((state) => state.setScheme);
  const dark = useIsDark();
  const on = useTokenColor("--color-ink", "#1F2021");
  const off = useTokenColor("--color-ink-faint", "#727374");
  return (
    <View className="flex-row items-center gap-2">
      <Sun aria-hidden size={18} strokeWidth={2.2} color={dark ? off : on} />
      <Switch
        accessibilityLabel="Dark mode"
        value={dark}
        onValueChange={(next) => setScheme(next ? "dark" : "light")}
        trackColor={TRACK}
        thumbColor="#FFFFFF"
        {...{ activeThumbColor: "#FFFFFF" }}
      />
      <Moon aria-hidden size={18} strokeWidth={2.2} color={dark ? on : off} />
    </View>
  );
}
