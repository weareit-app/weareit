import { blockSchemas, type EssayNode } from "@it/content/essay-schema";
import { ScrollView, View } from "react-native";
import { EssayBody } from "../../essay-body";

// Fixtures for the diagram and math blocks, rendered by the essay body and
// shown by app/lab/diagram-math.
const nodes: EssayNode[] = [
  {
    type: "heading",
    level: 2,
    children: [{ type: "text", value: "Diagram" }],
  },
  {
    type: "block",
    block: {
      type: "diagram",
      id: "flow",
      data: blockSchemas.diagram.parse({
        mermaid: [
          "flowchart LR",
          "  pain[A pain you name] --> future[A future without it]",
          "  future --> way[A way toward it]",
          "  way --> others[Others on the same way]",
        ].join("\n"),
        description:
          "A flow from left to right: a pain you name leads to a future without it, which leads to a way toward it, which leads to others on the same way.",
      }),
    },
  },
  {
    type: "block",
    block: {
      type: "diagram",
      id: "sequence",
      data: blockSchemas.diagram.parse({
        title: "What stays on your device",
        mermaid: [
          "sequenceDiagram",
          "  You->>It: Pick pains on this device",
          "  It-->>You: Futures and ways, nothing sent",
        ].join("\n"),
        description:
          "Two steps between you and It: you pick pains on this device, and It shows futures and ways without sending anything.",
      }),
    },
  },
  {
    type: "heading",
    level: 2,
    children: [{ type: "text", value: "Math" }],
  },
  {
    type: "block",
    block: {
      type: "math",
      id: "quadratic",
      data: blockSchemas.math.parse({
        tex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
        description: "The quadratic formula",
      }),
    },
  },
  {
    type: "paragraph",
    children: [
      { type: "text", value: "Inline, as in a sentence: " },
      { type: "math", tex: "a^2 + b^2 = c^2" },
      { type: "text", value: ", then the sentence goes on." },
    ],
  },
];

export default function EssayBlocksLab() {
  return (
    <ScrollView className="flex-1 bg-paper" contentContainerClassName="p-6">
      <View className="mx-auto w-full max-w-2xl gap-4">
        <EssayBody nodes={nodes} sources={[]} />
      </View>
    </ScrollView>
  );
}
