import { z } from "zod";

const idListSchema = z
  .array(z.string().min(1))
  .max(500)
  .refine(
    (ids) => new Set(ids).size === ids.length,
    "Selection IDs must be unique.",
  );

export const helpInterestIds = [
  "recruiting",
  "research",
  "product-feedback",
  "skills",
  "open-to-anything",
] as const;
export type HelpInterestId = (typeof helpInterestIds)[number];

// The full pain → future → way path a person chose for one pain.
const personalPathSchema = z
  .object({
    painId: z.string().min(1),
    dreamIds: idListSchema,
    fixIds: idListSchema,
  })
  .strict();
export type PersonalPath = z.infer<typeof personalPathSchema>;

export const onboardingDraftSchema = z
  .object({
    personalPainIds: idListSchema,
    worldPainIds: idListSchema,
    personalDreamIds: idListSchema,
    worldDreamIds: idListSchema,
    // Older drafts have no paths; their pains and dreams still load.
    worldPaths: z
      .array(personalPathSchema)
      .max(500)
      .refine(
        (paths) =>
          new Set(paths.map(({ painId }) => painId)).size === paths.length,
        "Each pain has one path.",
      )
      .default([]),
    personalPaths: z
      .array(personalPathSchema)
      .max(500)
      .refine(
        (paths) =>
          new Set(paths.map(({ painId }) => painId)).size === paths.length,
        "Each pain has one path.",
      )
      .default([]),
    helpInterests: z.array(z.enum(helpInterestIds)).max(helpInterestIds.length),
    draftUpdatedAt: z.number().int().nonnegative(),
  })
  .strict();

export type OnboardingDraft = z.infer<typeof onboardingDraftSchema>;
/** A draft as stored, before parsing fills in what older drafts lack. */
export type OnboardingDraftInput = z.input<typeof onboardingDraftSchema>;

export type SelectionState = {
  personalPainIds: string[];
  worldPainIds: string[];
};

export const emptySelection: SelectionState = {
  personalPainIds: [],
  worldPainIds: [],
};

export function toggleSelection<T extends string>(current: T[], id: T): T[] {
  return current.includes(id)
    ? current.filter((value) => value !== id)
    : [...current, id];
}

/** One page's choices: the pains picked and the path under each. */
export type PathSelection = {
  painIds: string[];
  paths: PersonalPath[];
};

/** Every future chosen under any pain, once each, in the order chosen. */
export function chosenDreamIds(paths: PersonalPath[]): string[] {
  return [...new Set(paths.flatMap(({ dreamIds }) => dreamIds))];
}

function withPath(
  selection: PathSelection,
  painId: string,
  update: (path: PersonalPath) => PersonalPath,
): PathSelection {
  const current = selection.paths.find((path) => path.painId === painId) ?? {
    painId,
    dreamIds: [],
    fixIds: [],
  };
  const next = update(current);
  const others = selection.paths.filter((path) => path.painId !== painId);
  return {
    painIds: selection.painIds.includes(painId)
      ? selection.painIds
      : [...selection.painIds, painId],
    paths:
      next.dreamIds.length || next.fixIds.length ? [...others, next] : others,
  };
}

export function selectPain(
  selection: PathSelection,
  painId: string,
): PathSelection {
  return selection.painIds.includes(painId)
    ? selection
    : { ...selection, painIds: [...selection.painIds, painId] };
}

/** Unselecting a pain drops the futures and ways chosen under it. */
export function unselectPain(
  selection: PathSelection,
  painId: string,
): PathSelection {
  return {
    painIds: selection.painIds.filter((id) => id !== painId),
    paths: selection.paths.filter((path) => path.painId !== painId),
  };
}

/**
 * Picks or unpicks a future under a pain. Picking also selects the pain.
 * Unpicking drops only the ways that no remaining future of that pain needs.
 */
export function toggleDream(
  selection: PathSelection,
  painId: string,
  dreamId: string,
  fixDreamLinks: { fixId: string; dreamId: string }[],
): PathSelection {
  return withPath(selection, painId, (path) => {
    if (!path.dreamIds.includes(dreamId))
      return { ...path, dreamIds: [...path.dreamIds, dreamId] };
    const dreamIds = path.dreamIds.filter((id) => id !== dreamId);
    const stillSupported = new Set(
      fixDreamLinks
        .filter((link) => dreamIds.includes(link.dreamId))
        .map((link) => link.fixId),
    );
    return {
      ...path,
      dreamIds,
      fixIds: path.fixIds.filter((id) => stillSupported.has(id)),
    };
  });
}

export function toggleFix(
  selection: PathSelection,
  painId: string,
  fixId: string,
): PathSelection {
  return withPath(selection, painId, (path) => ({
    ...path,
    fixIds: toggleSelection(path.fixIds, fixId),
  }));
}

/**
 * The ways that may help with any chosen future, each once, most-connected
 * first (ties keep content order), with the chosen futures each one serves.
 */
export function rankWays(
  chosenDreamIds: string[],
  fixDreamLinks: { fixId: string; dreamId: string }[],
  fixOrder: string[],
): { fixId: string; dreamIds: string[] }[] {
  const served = new Map<string, string[]>();
  for (const { fixId, dreamId } of fixDreamLinks) {
    if (!chosenDreamIds.includes(dreamId)) continue;
    served.set(fixId, [...(served.get(fixId) ?? []), dreamId]);
  }
  const position = (fixId: string) => {
    const index = fixOrder.indexOf(fixId);
    return index === -1 ? fixOrder.length : index;
  };
  return [...served]
    .map(([fixId, dreamIds]) => ({
      fixId,
      dreamIds: chosenDreamIds.filter((id) => dreamIds.includes(id)),
    }))
    .sort(
      (a, b) =>
        b.dreamIds.length - a.dreamIds.length ||
        position(a.fixId) - position(b.fixId),
    );
}
