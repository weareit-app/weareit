import { useColorScheme } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { onboardingStorage } from "../storage";

export type ColorScheme = "light" | "dark";

// The viewer's light or dark choice; null follows the device setting. A
// display preference on this device only, never sent anywhere.
export const useThemeStore = create<{
  scheme: ColorScheme | null;
  setScheme: (scheme: ColorScheme | null) => void;
}>()(
  persist((set) => ({ scheme: null, setScheme: (scheme) => set({ scheme }) }), {
    name: "it-theme-v1",
    storage: createJSONStorage(() => onboardingStorage),
    partialize: ({ scheme }) => ({ scheme }),
    skipHydration: true,
  }),
);

/** Whether the app is showing dark mode: the viewer's choice, else the device's. */
export function useIsDark() {
  const system = useColorScheme();
  const scheme = useThemeStore((state) => state.scheme);
  return (scheme ?? system) === "dark";
}
