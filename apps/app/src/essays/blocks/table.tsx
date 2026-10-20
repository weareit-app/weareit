import type { BlockProps } from "./types";
import { BlockFallback } from "./block-fallback";

export function TableBlock({ block }: BlockProps<"table">) {
  return <BlockFallback type={block.type} />;
}
