import { oc } from "@orpc/contract";
import { z } from "zod";
import { contentGraphSchema } from "@it/content/graph-schema";
import { onboardingDraftSchema } from "@it/domain/onboarding";

const publishedContentSchema = z
  .object({
    version: z.number().int().positive(),
    content: contentGraphSchema,
    checksum: z.string().regex(/^[a-f0-9]{64}$/),
    publishedAt: z.string().datetime(),
  })
  .strict();

const draftSchema = z
  .object({
    revision: z.number().int().nonnegative(),
    content: contentGraphSchema,
  })
  .strict();

const validationSchema = z
  .object({
    valid: z.boolean(),
    issues: z.array(
      z.object({ path: z.string(), message: z.string() }).strict(),
    ),
  })
  .strict();

const publishSchema = z.discriminatedUnion("published", [
  z
    .object({
      published: z.literal(true),
      version: z.number().int().positive(),
      checksum: z.string(),
    })
    .strict(),
  z
    .object({
      published: z.literal(false),
      issues: validationSchema.shape.issues,
    })
    .strict(),
]);

const versionSchema = z
  .object({
    version: z.number().int().positive(),
    source_revision: z.number().int().positive(),
    checksum: z.string(),
    published_by: z.string(),
    rollback_from: z.number().int().positive().nullable(),
    published_at: z.date(),
  })
  .strict();

export const apiContract = {
  content: {
    getPublished: oc.output(publishedContentSchema),
  },
  account: {
    saveOnboarding: oc
      .input(
        z
          .object({
            contentVersion: z.number().int().positive(),
            draft: onboardingDraftSchema,
          })
          .strict(),
      )
      .output(
        z
          .object({
            contentVersion: z.number().int().positive(),
            savedAt: z.string().datetime(),
          })
          .strict(),
      ),
  },
  support: {
    createCheckout: oc
      .input(
        z
          .object({
            amountMinor: z.number().int().min(100).max(100_000),
            frequency: z.enum(["once", "monthly"]),
          })
          .strict(),
      )
      .output(
        z
          .object({ url: z.string().url(), reference: z.string().uuid() })
          .strict(),
      ),
    getStatus: oc
      .input(z.object({ reference: z.string().uuid() }).strict())
      .output(
        z
          .object({
            frequency: z.enum(["once", "monthly"]),
            status: z.enum([
              "pending",
              "active",
              "succeeded",
              "past_due",
              "cancel_scheduled",
              "canceled",
              "expired",
              "failed",
              "refunded",
            ]),
          })
          .strict(),
      ),
    createPortal: oc
      .input(z.object({ reference: z.string().uuid() }).strict())
      .output(z.object({ url: z.string().url() }).strict()),
  },
  cms: {
    getDraft: oc.output(draftSchema),
    saveDraft: oc
      .input(
        z
          .object({
            expectedRevision: z.number().int().nonnegative(),
            changeNote: z.string().trim().min(1).max(500),
            content: contentGraphSchema,
          })
          .strict(),
      )
      .output(z.object({ revision: z.number().int().positive() }).strict()),
    validateDraft: oc.output(validationSchema),
    previewDraft: oc
      .input(z.object({ content: contentGraphSchema.optional() }).strict())
      .output(draftSchema),
    publishDraft: oc.output(publishSchema),
    listVersions: oc.output(z.array(versionSchema)),
    rollback: oc
      .input(z.object({ version: z.number().int().positive() }).strict())
      .output(
        z
          .object({
            revision: z.number().int().positive(),
            published: z.literal(true),
            version: z.number().int().positive(),
            checksum: z.string(),
          })
          .strict(),
      ),
  },
};

export type ApiContract = typeof apiContract;
export type PublishedContent = z.infer<typeof publishedContentSchema>;
export type CmsDraft = z.infer<typeof draftSchema>;
