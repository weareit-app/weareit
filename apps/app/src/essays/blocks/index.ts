import type { BlockType } from "@it/content/essay-schema";
import type { ComponentType } from "react";
import { ChartBlock } from "./chart";
import { DiagramBlock } from "./diagram";
import { EvidenceBlock } from "./evidence";
import { ExpandableBlock } from "./expandable";
import { MathBlock } from "./math";
import { StatusBoardBlock } from "./status-board";
import { TableBlock } from "./table";
import { TimelineBlock } from "./timeline";
import type { BlockProps } from "./types";

// One component per block type. Each starts as the plain fallback and is
// replaced by its real block (public-pages tasks 4.2–4.4).
export const blockComponents: {
  [T in BlockType]: ComponentType<BlockProps<T>>;
} = {
  chart: ChartBlock,
  diagram: DiagramBlock,
  math: MathBlock,
  evidence: EvidenceBlock,
  timeline: TimelineBlock,
  "status-board": StatusBoardBlock,
  expandable: ExpandableBlock,
  table: TableBlock,
};

export type { BlockProps };
