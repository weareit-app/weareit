import "../global.css";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useOnboardingStore } from "../src/state/onboarding-store";
import { getSessionCookie } from "../src/auth/auth-client";
import { setSessionCookieProvider } from "../src/api-client";
import { appFonts } from "../src/theme/fonts";
import { useIsDark, useThemeStore } from "../src/state/theme-store";
import { applyColorScheme } from "../src/theme/apply-color-scheme";
import { StatusBarBackdrop } from "../src/components/status-bar-backdrop";
import { CornerControls } from "../src/components/corner-controls";
import { SignedInProvider } from "../src/navigation/signed-in-provider";

export default function RootLayout() {
  // Loaded synchronously here so static web rendering embeds the fonts in
  // the page HTML.
  const [fontsLoaded, fontError] = useFonts(appFonts);
  const rehydrate = useOnboardingStore.persist.rehydrate;
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 5 * 60 * 1000, retry: 1 } },
      }),
  );

  useEffect(() => {
    void rehydrate();
  }, [rehydrate]);

  useEffect(() => {
    setSessionCookieProvider(getSessionCookie);
  }, []);

  const scheme = useThemeStore((state) => state.scheme);
  const isDark = useIsDark();
  useEffect(() => {
    void useThemeStore.persist.rehydrate();
  }, []);
  useEffect(() => applyColorScheme(scheme), [scheme]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <SignedInProvider>
        {/* Follows the app's own light/dark choice, not only the system's. */}
        <StatusBar style={isDark ? "light" : "dark"} />
        <Stack screenOptions={{ headerShown: false, animation: "fade" }} />
        <StatusBarBackdrop />
        <CornerControls />
      </SignedInProvider>
    </QueryClientProvider>
  );
}
