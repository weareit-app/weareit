import { Redirect } from "expo-router";
import type { ComponentType } from "react";

// The chart, evidence and table essay blocks with sample data (public-pages
// tasks 4.2 and 4.4). Development builds only: `__DEV__` is constant-folded
// in production, so the blocks never enter a release bundle. The lab is not
// lazy, so a development static export pre-renders the blocks and the page
// can be checked with scripts off.
const BlocksLab: ComponentType | null = __DEV__
  ? (
      require("../../src/essays/lab/blocks-lab") as typeof import("../../src/essays/lab/blocks-lab")
    ).BlocksLab
  : null;

export default function EssayBlocksLab() {
  if (!BlocksLab) return <Redirect href="/" />;
  return <BlocksLab />;
}
