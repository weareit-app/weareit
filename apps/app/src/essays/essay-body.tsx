import type {
  EssayBlock,
  EssayInline,
  EssayNode,
  EssaySource,
} from "@it/content/essay-schema";
import { Link, type Href } from "expo-router";
import { View } from "react-native";
import { Text } from "../components/text";

// Renders the typed tree the essay build writes (public-essays). Static: the
// text, sources and labels are in the pre-rendered HTML, with scripts off.

const blockNames: Record<EssayBlock["type"], string> = {
  chart: "chart",
  diagram: "diagram",
  math: "formula",
  evidence: "evidence card",
  timeline: "timeline",
  "status-board": "status board",
  table: "table",
  expandable: "section",
};

const capitalize = (text: string) => text[0]!.toUpperCase() + text.slice(1);

function Inline({
  nodes,
  sources,
}: {
  nodes: EssayInline[];
  sources: EssaySource[];
}) {
  return nodes.map((node, index) => {
    switch (node.type) {
      case "text":
        return node.value;
      case "emphasis":
        return (
          <Text key={index} className="font-body italic">
            <Inline nodes={node.children} sources={sources} />
          </Text>
        );
      case "strong":
        return (
          <Text key={index} className="font-body font-bold">
            <Inline nodes={node.children} sources={sources} />
          </Text>
        );
      case "link":
        return (
          <Link
            key={index}
            href={node.href as Href}
            className="font-body text-tide-deep underline underline-offset-4"
          >
            <Inline nodes={node.children} sources={sources} />
          </Link>
        );
      case "sourceRef": {
        const number = sources.findIndex((source) => source.id === node.id) + 1;
        const source = sources[number - 1]!;
        return (
          <Link
            key={index}
            href={source.url as Href}
            aria-label={`Source ${number}: ${source.title}`}
            className="align-super font-ui text-xs text-tide-deep underline-offset-2 hover:underline"
          >
            [{number}]
          </Link>
        );
      }
      case "status":
        return (
          <Text
            key={index}
            className="whitespace-nowrap rounded-sm border border-tide-tint px-1 font-ui-semibold text-sm text-tide-deep"
          >
            {capitalize(node.label)}
          </Text>
        );
      case "math":
        return (
          <Text key={index} className="font-ui text-base">
            {node.tex}
          </Text>
        );
    }
  });
}

function Block({ block }: { block: EssayBlock }) {
  // Real blocks arrive with public-pages group 4; until then each shows a
  // plain fallback.
  return (
    <View className="rounded-md border border-rule bg-paper-sunk px-4 py-3">
      <Text className="text-base text-ink-soft">
        This {blockNames[block.type]} can't be shown yet.
      </Text>
    </View>
  );
}

export function EssayBody({
  nodes,
  sources,
}: {
  nodes: EssayNode[];
  sources: EssaySource[];
}) {
  return nodes.map((node, index) => {
    switch (node.type) {
      case "heading":
        return (
          <Text
            key={index}
            role="heading"
            aria-level={node.level}
            className={
              node.level === 2
                ? "mt-4 font-heading text-2xl leading-tight text-ink md:text-3xl"
                : "mt-2 font-heading text-xl leading-tight text-ink"
            }
          >
            <Inline nodes={node.children} sources={sources} />
          </Text>
        );
      case "paragraph":
        return (
          <Text key={index} className="font-body text-lg leading-8 text-ink">
            <Inline nodes={node.children} sources={sources} />
          </Text>
        );
      case "list":
        return (
          <View key={index} role="list" className="gap-2">
            {node.items.map((item, itemIndex) => (
              <View key={itemIndex} role="listitem" className="flex-row gap-3">
                <Text
                  aria-hidden
                  className="min-w-5 font-body text-lg leading-8 text-ink-soft"
                >
                  {node.ordered ? `${itemIndex + 1}.` : "•"}
                </Text>
                <View className="flex-1 gap-2">
                  <EssayBody nodes={item} sources={sources} />
                </View>
              </View>
            ))}
          </View>
        );
      case "table":
        return (
          <View
            key={index}
            role="table"
            className="overflow-hidden rounded-md border border-rule"
          >
            {[node.head, ...node.rows].map((row, rowIndex) => (
              <View
                key={rowIndex}
                role="row"
                className={
                  rowIndex === 0
                    ? "flex-row bg-paper-sunk"
                    : "flex-row border-t border-rule"
                }
              >
                {row.map((cell, cellIndex) => (
                  <Text
                    key={cellIndex}
                    role={rowIndex === 0 ? "columnheader" : "cell"}
                    className={`flex-1 px-3 py-2 text-base text-ink ${
                      rowIndex === 0 ? "font-ui-semibold" : "font-body"
                    } ${
                      node.align[cellIndex] === "right"
                        ? "text-right"
                        : node.align[cellIndex] === "center"
                          ? "text-center"
                          : "text-left"
                    }`}
                  >
                    <Inline nodes={cell} sources={sources} />
                  </Text>
                ))}
              </View>
            ))}
          </View>
        );
      case "block":
        return <Block key={index} block={node.block} />;
    }
  });
}
