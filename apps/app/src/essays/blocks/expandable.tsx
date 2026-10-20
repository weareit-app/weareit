import type { BlockProps } from "./types";
import { BlockFallback } from "./block-fallback";

export function ExpandableBlock({ block }: BlockProps<"expandable">) {
  return <BlockFallback type={block.type} />;
}
