import { Redirect } from "expo-router";
import { Text, View } from "react-native";
import { GatherDot } from "../../src/watercolor/gather-dot";
import { WatercolorLoader } from "../../src/watercolor/watercolor-loader";

// The gathering loader on its own, as shipped and enlarged (spec 007).
// Development builds only. It needs no taps, so a deep link can open it on a
// simulator or device: weareit:///lab/loader
export default function LoaderLab() {
  if (!__DEV__) return <Redirect href="/" />;
  return (
    <View className="flex-1 items-center justify-center gap-12 bg-paper">
      <GatherDot size={280} />
      <WatercolorLoader />
      <Text className="text-sm text-muted">Development only</Text>
    </View>
  );
}
