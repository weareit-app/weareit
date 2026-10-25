// biome-ignore-all lint/suspicious/noArrayIndexKey: an essay is a static tree from the essay build, so its nodes, list items, rows, and cells are never added, removed, or reordered, and their index is their identity.
import type {
  BlockType,
  EssayBlock,
  EssayInline,
  EssayNode,
  EssaySource,
} from "@it/domain/essays";
import { Link, type Href } from "expo-router";
import type { ComponentType } from "react";
import { Platform, View } from "react-native";
import { Text } from "../components/text";
import { BlockFallback } from "./blocks/block-fallback";
import { ChartBlock } from "./blocks/chart";
import { DiagramBlock } from "./blocks/diagram";
import { EvidenceBlock } from "./blocks/evidence";
import { ExpandableBlock } from "./blocks/expandable";
import { InlineMath, MathBlock } from "./blocks/math";
import { StatusBoardBlock } from "./blocks/status-board";
import { TableBlock } from "./blocks/table";
import { TimelineBlock } from "./blocks/timeline";
import type { BlockProps } from "./blocks/types";

// Renders the typed tree the essay build writes (public-essays). Static: the
// text, sources and labels are in the pre-rendered HTML, with scripts off.

const capitalize = (text: string) =>
  text.slice(0, 1).toUpperCase() + text.slice(1);

function Inline({
  nodes,
  sources,
}: {
  nodes: EssayInline[];
  sources: EssaySource[];
}) {
  return nodes.map((node, index) => (
    <InlineNode key={index} node={node} sources={sources} />
  ));
}

function InlineNode({
  node,
  sources,
}: {
  node: EssayInline;
  sources: EssaySource[];
}) {
  switch (node.type) {
    case "text":
      return node.value;
    case "emphasis":
      return (
        <Text className="font-body italic">
          <Inline nodes={node.children} sources={sources} />
        </Text>
      );
    case "strong":
      return (
        <Text className="font-body font-bold">
          <Inline nodes={node.children} sources={sources} />
        </Text>
      );
    case "link":
      return (
        <Link
          href={node.href as Href}
          className="font-body text-tide-deep underline underline-offset-4"
        >
          <Inline nodes={node.children} sources={sources} />
        </Link>
      );
    case "sourceRef": {
      const index = sources.findIndex((source) => source.id === node.id);
      const source = sources[index];
      // The essay build fails on a reference to a source not in the front
      // matter, so this is a bug in the build, not the essay.
      if (!source) throw new Error(`Essay source ${node.id} is not listed`);
      const number = index + 1;
      return (
        <Link
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
        <Text className="whitespace-nowrap rounded-sm border border-tide-tint px-1 font-ui-semibold text-sm text-tide-deep">
          {capitalize(node.label)}
        </Text>
      );
    case "math":
      return <InlineMath tex={node.tex} />;
  }
}

// One component per block type. It lives here, not in blocks/, because an
// expandable block holds essay body: the blocks import nothing back from this
// file, so there is no require cycle.
const blockComponents: {
  [T in BlockType]: ComponentType<BlockProps<T>>;
} = {
  chart: ChartBlock,
  diagram: DiagramBlock,
  math: MathBlock,
  evidence: EvidenceBlock,
  timeline: TimelineBlock,
  "status-board": StatusBoardBlock,
  expandable: ({ block, sources }) => (
    <ExpandableBlock title={block.title}>
      <EssayBody nodes={block.children} sources={sources} />
    </ExpandableBlock>
  ),
  table: TableBlock,
};

function Block({
  block,
  sources,
}: {
  block: EssayBlock;
  sources: EssaySource[];
}) {
  // Essays are web-only and blocks render HTML elements, which React Native
  // can't draw, so anywhere else a block shows its plain fallback.
  if (Platform.OS !== "web") return <BlockFallback type={block.type} />;
  const Component = blockComponents[block.type] as ComponentType<{
    block: EssayBlock;
    sources: EssaySource[];
  }>;
  return <Component block={block} sources={sources} />;
}

export function EssayBody({
  nodes,
  sources,
}: {
  nodes: EssayNode[];
  sources: EssaySource[];
}) {
  return nodes.map((node, index) => (
    <BodyNode key={index} node={node} sources={sources} />
  ));
}

function BodyNode({
  node,
  sources,
}: {
  node: EssayNode;
  sources: EssaySource[];
}) {
  switch (node.type) {
    case "heading":
      return (
        <Text
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
        <Text className="font-body text-lg leading-8 text-ink">
          <Inline nodes={node.children} sources={sources} />
        </Text>
      );
    case "list":
      return (
        <View role="list" className="gap-2">
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
      return <Block block={node.block} sources={sources} />;
  }
}
