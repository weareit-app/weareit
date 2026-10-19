import type { ImageSourcePropType } from "react-native";
import {
  getAllDreams,
  getAllPains,
  personalPainDomains,
  worldPainDomains,
} from "@it/content/tier-1";

// Presentation-only mapping: domain content stays independent of React Native.
export const painIllustrations: Record<string, ImageSourcePropType> = {
  "no-accountability": require("../../assets/brand/icon-corruption.jpg"),
  "dont-know-whats-true": require("../../assets/brand/icon-misinformation.jpg"),
  "shouting-into-void": require("../../assets/brand/icon-advocacy.jpg"),
};

export const dreamIllustrations: Record<string, ImageSourcePropType> = {
  "found-my-people": require("../../assets/brand/icon-connection.jpg"),
};

// Personal page stage art (riso ink, onboarding prototype 2026-10-18): a pain
// is drawn in black ink; a future changes what the person is doing and adds
// spot color. Most pains and futures have no art yet and read as text alone.
export const painStageArt: Record<string, ImageSourcePropType> = {
  anxiety: require("../../assets/brand/stage-anxiety.png"),
};

export const dreamStageArt: Record<string, ImageSourcePropType> = {
  "steady-enough-to-plan": require("../../assets/brand/stage-steady-enough-to-plan.png"),
};

function assertKnownIds(
  mapping: Record<string, ImageSourcePropType>,
  knownIds: Set<string>,
  kind: string,
) {
  for (const id of Object.keys(mapping)) {
    if (!knownIds.has(id)) {
      throw new Error(`Unknown ${kind} illustration mapping: ${id}`);
    }
  }
}

assertKnownIds(
  painIllustrations,
  new Set(
    [...getAllPains(personalPainDomains), ...getAllPains(worldPainDomains)].map(
      (pain) => pain.id,
    ),
  ),
  "pain",
);
assertKnownIds(
  dreamIllustrations,
  new Set(
    [
      ...getAllDreams(personalPainDomains),
      ...getAllDreams(worldPainDomains),
    ].map((dream) => dream.id),
  ),
  "dream",
);
assertKnownIds(
  painStageArt,
  new Set(getAllPains(personalPainDomains).map((pain) => pain.id)),
  "pain",
);
assertKnownIds(
  dreamStageArt,
  new Set(getAllDreams(personalPainDomains).map((dream) => dream.id)),
  "dream",
);
