import { firstActions } from "@it/content/first-actions";
import { fixes } from "@it/content/fixes";
import type { ContentFix, ContentGraph } from "@it/domain/content";
import { personalPainDomains } from "@it/content/tier-1";

// Real content for stories, shaped as the published content graph delivers
// it, so a story shows the copy people will see.

export const contentFixes: ContentFix[] = fixes.map(
  ({ dreamIds: _dreamIds, ...fix }, sortOrder) => ({ ...fix, sortOrder }),
);

export const fixDreamLinks = fixes.flatMap((fix) =>
  fix.dreamIds.map((dreamId) => ({ fixId: fix.id, dreamId })),
);

export function fixOfKind(
  kind: ContentFix["kind"],
  featureStatus?: ContentFix["featureStatus"],
): ContentFix {
  const fix = contentFixes.find(
    (f) =>
      f.kind === kind &&
      (featureStatus === undefined || f.featureStatus === featureStatus),
  );
  if (!fix) throw new Error(`No ${kind} fix in the content package.`);
  return fix;
}

export function personalPain(id: string) {
  const pain = personalPainDomains
    .flatMap((domain) => domain.pains)
    .find((p) => p.id === id);
  if (!pain) throw new Error(`No personal pain "${id}".`);
  return pain;
}

export function firstAction(
  find: (action: (typeof firstActions)[number]) => boolean,
): ContentGraph["firstActions"][number] {
  const index = firstActions.findIndex(find);
  const action = firstActions[index];
  if (!action) throw new Error("No matching first action.");
  const { painIds: _painIds, source: _source, ...rest } = action;
  return { ...rest, sortOrder: index };
}
