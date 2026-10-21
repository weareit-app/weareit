import { oc, type OpenAPI } from "@orpc/contract";
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

// Each route carries developer docs text, and each group's tag names it
// (docs/architecture/decisions.md, 2026-10-21). No route sets a path, so the
// OpenAPI generator and handler both use `route.path ?? toHttpPath(path)`,
// POST /<group>/<name> (@orpc/openapi 1.15.6 source, checked 2026-10-21).

// CMS operations need the admin token as a Bearer header.
function cmsRoute(summary: string, description: string) {
  return {
    summary,
    description,
    spec: (current: OpenAPI.OperationObject) => ({
      ...current,
      security: [{ cmsAdminToken: [] }],
    }),
  };
}

export const apiContract = {
  content: oc.tag("content").router({
    getPublished: oc
      .route({
        summary: "Get the published content",
        description:
          "Returns the newest published content snapshot: its version, the content graph, a checksum, and when it was published. Anyone may call it.",
      })
      .output(publishedContentSchema),
  }),
  account: oc.tag("account").router({
    saveOnboarding: oc
      .route({
        summary: "Save onboarding answers",
        description:
          "Saves the signed-in person's onboarding draft against a content version. Needs a signed-in session.",
      })
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
  }),
  support: oc.tag("support").router({
    createCheckout: oc
      .route({
        summary: "Start a support checkout",
        description:
          "Creates a Stripe Checkout for a one-time or monthly support amount, in minor units, and returns its URL and reference. Needs a signed-in session.",
      })
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
      .route({
        summary: "Get the status of a support payment",
        description:
          "Returns the frequency and status of a support payment by its reference. Needs the session of the account that made it; any other reference reads as not found.",
      })
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
      .route({
        summary: "Open subscription management",
        description:
          "Returns a Stripe billing portal URL for managing a monthly support payment. Needs the session of the account that made it.",
      })
      .input(z.object({ reference: z.string().uuid() }).strict())
      .output(z.object({ url: z.string().url() }).strict()),
  }),
  cms: oc.tag("cms").router({
    getDraft: oc
      .route(
        cmsRoute(
          "Get the CMS draft",
          "Returns the current draft content graph and its revision.",
        ),
      )
      .output(draftSchema),
    saveDraft: oc
      .route(
        cmsRoute(
          "Save the CMS draft",
          "Replaces the draft content graph with a change note. Fails if expectedRevision is not the current revision.",
        ),
      )
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
    validateDraft: oc
      .route(
        cmsRoute(
          "Check the CMS draft",
          "Reports whether the draft could be published, with each problem and its path.",
        ),
      )
      .output(validationSchema),
    previewDraft: oc
      .route(
        cmsRoute(
          "Preview the CMS draft",
          "Returns the draft as it would be published. Pass content to preview unsaved changes.",
        ),
      )
      .input(z.object({ content: contentGraphSchema.optional() }).strict())
      .output(draftSchema),
    publishDraft: oc
      .route(
        cmsRoute(
          "Publish the CMS draft",
          "Publishes the draft as a new content version, or returns the problems that stop it.",
        ),
      )
      .output(publishSchema),
    listVersions: oc
      .route(
        cmsRoute(
          "List published versions",
          "Lists every published content version, who published it, and when.",
        ),
      )
      .output(z.array(versionSchema)),
    rollback: oc
      .route(
        cmsRoute(
          "Roll back to a version",
          "Publishes an earlier version's content again as a new version.",
        ),
      )
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
  }),
};

export type ApiContract = typeof apiContract;
export type PublishedContent = z.infer<typeof publishedContentSchema>;
export type CmsDraft = z.infer<typeof draftSchema>;
