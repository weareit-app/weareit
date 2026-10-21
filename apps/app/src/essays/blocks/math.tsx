import type { BlockProps } from "./types";
import { BlockFallback } from "./block-fallback";

export function MathBlock({ block }: BlockProps<"math">) {
  return <BlockFallback type={block.type} />;
}
