import { Redirect } from "expo-router";
import { lazy, Suspense, useSyncExternalStore } from "react";
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
  // lazy() wants a default export; the screen has a named one.
  const { LabScreen } = await import("../../src/watercolor/lab/lab-screen");
  return { default: LabScreen };
});

function Loading() {
  return (
    <View className="flex-1 items-center justify-center bg-paper">
      <Text className="text-ink-soft">Loading the watercolor lab…</Text>
    </View>
  );
}

const noSubscription = () => () => {};

export default function WatercolorLab() {
  // False while a static web page renders or hydrates, then true.
  const mounted = useSyncExternalStore(
    noSubscription,
    () => true,
    () => Platform.OS !== "web",
  );
  if (!__DEV__) return <Redirect href="/" />;
  if (!mounted) return <Loading />;
  return (
    <Suspense fallback={<Loading />}>
      <LabScreen />
    </Suspense>
  );
}
