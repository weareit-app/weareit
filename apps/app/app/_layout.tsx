import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useOnboardingStore } from "../src/state/onboarding-store";
import { getSessionCookie } from "../src/auth/auth-client";
import { setSessionCookieProvider } from "@it/api/client";

export default function RootLayout() {
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

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, animation: "fade" }} />
    </QueryClientProvider>
  );
}
