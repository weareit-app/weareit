import { Pressable, Text, View } from "react-native";
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
        <View />
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
          className="min-h-12 self-start justify-center rounded-xl bg-tide px-6"
        >
          <Text className="font-semibold text-on-tide">Try again</Text>
        </Pressable>
      </Page>
    );
  }
  return (
    <Page
      title="Loading the roadmap"
      description="Getting the latest published content…"
    >
      <View />
    </Page>
  );
}
