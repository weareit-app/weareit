import { Redirect } from "expo-router";
import { Text, View } from "react-native";
import { GatherDot } from "../../src/watercolor/gather-dot";
import { ItWordmarkLoader } from "../../src/watercolor/it-wordmark-loader";
import { WatercolorLoader } from "../../src/watercolor/watercolor-loader";

// The gathering loader on its own, as shipped and enlarged, and as the dot of
// the i in the "it" wordmark (spec 007).
// Development builds only. It needs no taps, so a deep link can open it on a
// simulator or device: weareit:///lab/loader
export default function LoaderLab() {
  if (!__DEV__) return <Redirect href="/" />;
  return (
    <View className="flex-1 items-center justify-center gap-10 bg-paper">
      <GatherDot size={220} />
      <WatercolorLoader />
      <ItWordmarkLoader height={200} />
      <Text className="text-sm text-muted">Development only</Text>
    </View>
  );
}
