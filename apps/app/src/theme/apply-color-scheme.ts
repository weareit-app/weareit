import { Appearance } from "react-native";
import type { ColorScheme } from "../state/theme-store";

// iOS: overrides the system scheme, which global.css's dark block follows.
export function applyColorScheme(scheme: ColorScheme | null) {
  Appearance.setColorScheme(scheme ?? "unspecified");
}
