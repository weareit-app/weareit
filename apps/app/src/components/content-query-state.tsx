import { Pressable } from "react-native";
import { WatercolorLoader } from "../watercolor/watercolor-loader";
import { Page } from "./page";
import { Text } from "./text";

export function ContentQueryState({
  loading,
  error,
  retry,
  developerDetail,
}: {
  loading: boolean;
  error: Error | null;
  retry: () => void;
  /** What actually went wrong; pass it in development builds only. */
  developerDetail?: string | undefined;
}) {
  if (!loading && error) {
    return (
      <Page
        title="This page didn't load"
        description="Check your internet connection and try again. If that doesn't work, the problem is probably on our side, so try again in a little while."
      >
        <Pressable
          onPress={retry}
          className="min-h-12 self-start justify-center rounded-xl bg-tide px-6"
        >
          <Text className="font-ui-semibold text-on-tide">Try again</Text>
        </Pressable>
        {developerDetail ? (
          <Text className="text-sm text-ink-soft">
            For developers: {developerDetail}
          </Text>
        ) : null}
      </Page>
    );
  }
  return (
    <Page
      title="Just a moment"
      description="Loading the things people want to be better."
    >
      <WatercolorLoader />
    </Page>
  );
}
