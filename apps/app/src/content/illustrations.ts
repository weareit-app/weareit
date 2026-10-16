import type { ImageSourcePropType } from "react-native";
import {
  getAllDreams,
  getAllPains,
  personalPainDomains,
  worldPainDomains,
} from "@it/content/tier-1";

// Presentation-only mapping: domain content stays independent of React Native.
export const painIllustrations: Record<string, ImageSourcePropType> = {
  procrastination: require("../../assets/brand/icon-procrastination.jpg"),
  anxiety: require("../../assets/brand/icon-anxiety.jpg"),
  loneliness: require("../../assets/brand/icon-loneliness.jpg"),
  "no-accountability": require("../../assets/brand/icon-corruption.jpg"),
  "dont-know-whats-true": require("../../assets/brand/icon-misinformation.jpg"),
  "shouting-into-void": require("../../assets/brand/icon-advocacy.jpg"),
};

export const dreamIllustrations: Record<string, ImageSourcePropType> = {
  belonging: require("../../assets/brand/icon-connection.jpg"),
  "found-my-people": require("../../assets/brand/icon-connection.jpg"),
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
