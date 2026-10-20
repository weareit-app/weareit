import { Redirect } from "expo-router";
import type { ComponentType } from "react";

// The diagram and maths essay blocks drawn from fixtures, until the essay
// pipeline renders them on real essays. Load with scripts off to see the
// fallbacks. Web only. Development builds only: production builds fold
// `__DEV__` to false and drop the require, so the fixtures and blocks stay
// out of the bundle every page loads.
const EssayBlocksLab: ComponentType | null = __DEV__
  ? require("../../src/essays/blocks/lab/essay-blocks-lab").default
  : null;

export default function EssayBlocksLabScreen() {
  if (!EssayBlocksLab) return <Redirect href="/" />;
  return <EssayBlocksLab />;
}
