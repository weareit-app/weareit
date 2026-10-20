import type { BlockProps } from "./types";
import { BlockFallback } from "./block-fallback";

export function EvidenceBlock({ block }: BlockProps<"evidence">) {
  return <BlockFallback type={block.type} />;
}
