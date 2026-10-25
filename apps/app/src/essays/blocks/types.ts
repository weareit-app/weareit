import type { BlockType, EssayBlockOf, EssaySource } from "@it/domain/essays";

/**
 * What every block component receives: its parsed block (type, id and the
 * data checked against its schema; `expandable` has title and children) and
 * the essay's sources, for blocks that name a source by ID.
 */
export interface BlockProps<T extends BlockType> {
  block: EssayBlockOf<T>;
  sources: EssaySource[];
}
