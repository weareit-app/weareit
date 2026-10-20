// Throwaway route for the async-routes spike: every essay behind one route,
// so the essay renderer belongs to a single route chunk.
import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import { ChartBlock } from "../src/essays/blocks/chart";
import { EssayScreen } from "../src/essays/essay-screen";
import { chartFixture, sourcesFixture } from "../src/essays/lab/block-fixtures";

export function generateStaticParams() {
  return [{ essay: "why" }, { essay: "spike-chart" }];
}

export default function EssayRoute() {
  const { essay } = useLocalSearchParams<{ essay: string }>();
  if (essay === "spike-chart")
    return (
      <ScrollView>
        <ChartBlock block={chartFixture} sources={sourcesFixture} />
      </ScrollView>
    );
  return <EssayScreen slug={essay} />;
}
