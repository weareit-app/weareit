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

// Personal page stage art (riso, onboarding prototype 2026-10-18), traced
// into group-icon-art by tools/icon-trace: a pain's art and its future's
// show the same person; the pain is ink only and the future adds one spot.
// Each maps an id to its art's key. Most pains and futures have no art yet
// and read as text alone.
export const painStageArt: Record<string, string> = {
  anxiety: "stage-anxiety",
};

export const dreamStageArt: Record<string, string> = {
  "steady-enough-to-plan": "stage-steady-enough-to-plan",
};

function assertKnownIds(
  mapping: Record<string, unknown>,
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
