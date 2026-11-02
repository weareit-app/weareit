import type { ContentGraph } from "./content";

// The records the content editor creates and deletes directly.
export type ContentRecordKind = "domains" | "pains" | "dreams" | "firstActions";

const entityTypes = {
  domains: "domain",
  pains: "pain",
  dreams: "dream",
  firstActions: "first_action",
} as const satisfies Record<
  ContentRecordKind,
  ContentGraph["provenance"][number]["entityType"]
>;

// Removes one record and everything that refers to it, so the graph stays
// valid: a domain takes its pains with it, and a removed pain, dream or first
// action takes its links and provenance. Fixes stay; only their links to a
// removed dream go.
export function removeRecord(
  graph: ContentGraph,
  kind: ContentRecordKind,
  id: string,
): ContentGraph {
  const removedPains = new Set(
    kind === "pains"
      ? [id]
      : kind === "domains"
        ? graph.pains
            .filter(({ domainId }) => domainId === id)
            .map((pain) => pain.id)
        : [],
  );
  const removedDream = kind === "dreams" ? id : undefined;
  const removedAction = kind === "firstActions" ? id : undefined;
  const removedEntity = (
    entityType: ContentGraph["provenance"][number]["entityType"],
    entityId: string,
  ) =>
    (entityType === entityTypes[kind] && entityId === id) ||
    (entityType === "pain" && removedPains.has(entityId));

  return {
    ...graph,
    domains:
      kind === "domains"
        ? graph.domains.filter((d) => d.id !== id)
        : graph.domains,
    pains: graph.pains.filter((pain) => !removedPains.has(pain.id)),
    dreams: graph.dreams.filter((dream) => dream.id !== removedDream),
    firstActions: graph.firstActions.filter(
      (action) => action.id !== removedAction,
    ),
    painDreamLinks: graph.painDreamLinks.filter(
      ({ painId, dreamId }) =>
        !removedPains.has(painId) && dreamId !== removedDream,
    ),
    actionPainLinks: graph.actionPainLinks.filter(
      ({ actionId, painId }) =>
        !removedPains.has(painId) && actionId !== removedAction,
    ),
    fixDreamLinks: graph.fixDreamLinks.filter(
      ({ dreamId }) => dreamId !== removedDream,
    ),
    provenance: graph.provenance.filter(
      ({ entityType, entityId }) => !removedEntity(entityType, entityId),
    ),
  };
}
