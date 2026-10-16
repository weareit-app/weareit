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

export const onboardingDraftSchema = z
  .object({
    personalPainIds: idListSchema,
    worldPainIds: idListSchema,
    personalDreamIds: idListSchema,
    worldDreamIds: idListSchema,
    helpInterests: z.array(z.enum(helpInterestIds)).max(helpInterestIds.length),
    draftUpdatedAt: z.number().int().nonnegative(),
  })
  .strict();

export type OnboardingDraft = z.infer<typeof onboardingDraftSchema>;

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
