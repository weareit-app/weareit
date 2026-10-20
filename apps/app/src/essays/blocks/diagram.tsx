import type { BlockProps } from "./types";
import { BlockFallback } from "./block-fallback";

export function DiagramBlock({ block }: BlockProps<"diagram">) {
  return <BlockFallback type={block.type} />;
}
