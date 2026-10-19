import { z } from "zod";

const contentIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const copySchema = z.string().trim().min(1);

export const dreamSchema = z
  .object({
    id: contentIdSchema,
    title: copySchema,
    description: copySchema,
  })
  .strict();

export const painSchema = z
  .object({
    id: contentIdSchema,
    title: copySchema,
    description: copySchema,
    // Empty until futures are written; the page says so (CONFLICTS.md P7).
    dreams: z.array(dreamSchema),
  })
  .strict();

export const painDomainSchema = z
  .object({
    id: contentIdSchema,
    title: copySchema,
    pains: z.array(painSchema).min(1),
  })
  .strict();

function hasUniqueIds<T extends { id: string }>(items: T[]) {
  return new Set(items.map((item) => item.id)).size === items.length;
}

export const painDomainListSchema = z
  .array(painDomainSchema)
  .min(1)
  .superRefine((domains, context) => {
    if (!hasUniqueIds(domains)) {
      context.addIssue({
        code: "custom",
        message: "Domain IDs must be unique.",
      });
    }

    const pains = domains.flatMap((domain) => domain.pains);
    if (!hasUniqueIds(pains)) {
      context.addIssue({
        code: "custom",
        message: "Pain IDs must be unique across the content set.",
      });
    }

    // A dream may serve several pains; every use of its ID must carry the same copy.
    const dreamsById = new Map<string, Dream>();
    for (const dream of pains.flatMap((pain) => pain.dreams)) {
      const existing = dreamsById.get(dream.id);
      if (
        existing &&
        (existing.title !== dream.title ||
          existing.description !== dream.description)
      ) {
        context.addIssue({
          code: "custom",
          message: `Dream ${dream.id} has different copy in different pains.`,
        });
      }
      dreamsById.set(dream.id, dream);
    }
  });

export type Dream = z.infer<typeof dreamSchema>;
export type Pain = z.infer<typeof painSchema>;
export type PainDomain = z.infer<typeof painDomainSchema>;
