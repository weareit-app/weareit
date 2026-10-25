import { groupIconArt } from "./group-icon-art";
import type { IconPart } from "./icon-part";

// Icons for the personal groups, traced from the founder's drawings on a
// 48 × 48 grid (tools/icon-trace). Their parts and tones: `./icon-part`.

export const groupIcons: Record<string, IconPart[]> = groupIconArt;
