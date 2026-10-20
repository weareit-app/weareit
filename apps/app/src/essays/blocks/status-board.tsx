import type { BlockProps } from "./types";
import { BlockFallback } from "./block-fallback";

export function StatusBoardBlock({ block }: BlockProps<"status-board">) {
  return <BlockFallback type={block.type} />;
}
