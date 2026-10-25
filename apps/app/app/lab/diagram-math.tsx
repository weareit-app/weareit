import { Redirect } from "expo-router";
import type { ComponentType } from "react";

// The diagram and math essay blocks drawn from fixtures. Load with scripts
// off to see the fallbacks. Web only. Development builds only: production
// builds fold `__DEV__` to false and drop the require, so the fixtures and
// blocks stay out of the bundle every page loads.
const DiagramMathLab: ComponentType | null = __DEV__
  ? (
      require("../../src/essays/blocks/lab/essay-blocks-lab") as typeof import("../../src/essays/blocks/lab/essay-blocks-lab")
    ).EssayBlocksLab
  : null;

export default function DiagramMathLabScreen() {
  if (!DiagramMathLab) return <Redirect href="/" />;
  return <DiagramMathLab />;
}
