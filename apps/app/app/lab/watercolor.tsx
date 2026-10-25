import { Redirect } from "expo-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { Platform, Text, View } from "react-native";

// Fidelity proof for the watercolor dot (spec 007). Development builds only.
// On web, Skia's runtime (CanvasKit) loads here, in the browser, and nowhere
// else; static rendering on the server only shows the loading message.
const LabScreen = lazy(async () => {
  if (Platform.OS === "web") {
    const { LoadSkiaWeb } = await import(
      "@shopify/react-native-skia/lib/module/web"
    );
    await LoadSkiaWeb({ locateFile: (file: string) => `/${file}` });
  }
  return import("../../src/watercolor/lab/lab-screen");
});

function Loading() {
  return (
    <View className="flex-1 items-center justify-center bg-paper">
      <Text className="text-ink-soft">Loading the watercolor lab…</Text>
    </View>
  );
}

export default function WatercolorLab() {
  const [mounted, setMounted] = useState(Platform.OS !== "web");
  useEffect(() => setMounted(true), []);
  if (!__DEV__) return <Redirect href="/" />;
  if (!mounted) return <Loading />;
  return (
    <Suspense fallback={<Loading />}>
      <LabScreen />
    </Suspense>
  );
}
