import { Platform, ScrollView, View } from "react-native";
import { Text } from "../../components/text";
import { ChartBlock } from "../blocks/chart";
import { EvidenceBlock } from "../blocks/evidence";
import { TableBlock } from "../blocks/table";
import {
  chartFixture,
  evidenceFixture,
  sourcesFixture,
  tableFixture,
  tableWithContextFixture,
} from "./block-fixtures";

// Every chart, evidence and table block on one page, with sample data.
// Essays are web-only, so the blocks render HTML and this lab is web-only.
export function BlocksLab() {
  if (Platform.OS !== "web") {
    return (
      <View className="flex-1 items-center justify-center bg-paper p-6">
        <Text className="font-ui text-ink">Essay blocks are web-only.</Text>
      </View>
    );
  }
  return (
    <ScrollView className="flex-1 bg-paper">
      <main className="mx-auto w-full max-w-2xl bg-paper px-4 py-10 text-ink">
        <h1 className="font-display text-3xl">Essay blocks</h1>
        <p className="mt-2 font-ui text-sm text-ink-soft">
          Chart, evidence card and tables with sample data · development only
        </p>
        <h2 className="mt-8 font-heading text-2xl">Chart</h2>
        <ChartBlock block={chartFixture} sources={sourcesFixture} />
        <h2 className="mt-8 font-heading text-2xl">Evidence card</h2>
        <EvidenceBlock block={evidenceFixture} sources={sourcesFixture} />
        <h2 className="mt-8 font-heading text-2xl">
          Table of It&apos;s own facts
        </h2>
        <TableBlock block={tableFixture} sources={sourcesFixture} />
        <h2 className="mt-8 font-heading text-2xl">Table of outside data</h2>
        <TableBlock block={tableWithContextFixture} sources={sourcesFixture} />
      </main>
    </ScrollView>
  );
}
