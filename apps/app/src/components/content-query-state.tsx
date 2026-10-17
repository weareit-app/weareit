import { Pressable, Text } from "react-native";
import { WatercolorLoader } from "../watercolor/watercolor-loader";
import { Page } from "./page";

export function ContentQueryState({
  loading,
  error,
  retry,
}: {
  loading: boolean;
  error: Error | null;
  retry: () => void;
}) {
  if (loading) {
    return (
      <Page
        title="Loading the roadmap"
        description="Getting the latest published content…"
      >
        <WatercolorLoader />
      </Page>
    );
  }
  if (error) {
    return (
      <Page
        title="The roadmap isn't available yet"
        description="Try again when the content service is available."
      >
        <Pressable
          onPress={retry}
          className="min-h-12 self-start justify-center rounded-xl bg-blue px-6"
        >
          <Text className="font-semibold text-white">Try again</Text>
        </Pressable>
      </Page>
    );
  }
  return (
    <Page
      title="Loading the roadmap"
      description="Getting the latest published content…"
    >
      <WatercolorLoader />
    </Page>
  );
}
