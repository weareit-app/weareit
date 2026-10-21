import type { BlockProps } from "./types";
import { BlockFallback } from "./block-fallback";

export function ChartBlock({ block }: BlockProps<"chart">) {
  return <BlockFallback type={block.type} />;
}
