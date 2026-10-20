import { chartBlockSchema } from "./chart";
import { diagramBlockSchema } from "./diagram";
import { evidenceBlockSchema } from "./evidence";
import { expandableBlockSchema } from "./expandable";
import { mathBlockSchema } from "./math";
import { statusBoardBlockSchema } from "./status-board";
import { tableBlockSchema } from "./table";
import { timelineBlockSchema } from "./timeline";

// Every block type an essay may use, by type. Each block's data is checked
// against its schema when the essays build. All but `expandable` read a data
// file beside the essay (`<block-id>.json` or `.yaml`).
export const blockSchemas = {
  chart: chartBlockSchema,
  diagram: diagramBlockSchema,
  math: mathBlockSchema,
  evidence: evidenceBlockSchema,
  timeline: timelineBlockSchema,
  "status-board": statusBoardBlockSchema,
  expandable: expandableBlockSchema,
  table: tableBlockSchema,
};

export type BlockType = keyof typeof blockSchemas;
export type DataBlockType = Exclude<BlockType, "expandable">;
export const dataBlockTypes = (Object.keys(blockSchemas) as BlockType[]).filter(
  (type): type is DataBlockType => type !== "expandable",
);
