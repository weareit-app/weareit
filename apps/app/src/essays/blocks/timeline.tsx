import type { BlockProps } from "./types";
import { BlockFallback } from "./block-fallback";

export function TimelineBlock({ block }: BlockProps<"timeline">) {
  return <BlockFallback type={block.type} />;
}
