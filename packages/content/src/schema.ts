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
    dreams: z.array(dreamSchema).min(1),
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

    const dreams = pains.flatMap((pain) => pain.dreams);
    if (!hasUniqueIds(dreams)) {
      context.addIssue({
        code: "custom",
        message: "Dream IDs must be unique across the content set.",
      });
    }
  });

export type Dream = z.infer<typeof dreamSchema>;
export type Pain = z.infer<typeof painSchema>;
export type PainDomain = z.infer<typeof painDomainSchema>;
