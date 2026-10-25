import { oc, type OpenAPI } from "@orpc/contract";
import { z } from "zod";
import { contentGraphSchema } from "@it/domain/content";
import { onboardingDraftSchema } from "@it/domain/onboarding";
import { isoDatetimeSchema, nonEmptyTextSchema } from "@it/domain/primitives";
import {
  contributionStatusSchema,
  supportFrequencySchema,
} from "@it/domain/support";

const publishedContentSchema = z.strictObject({
  version: z.number().int().positive(),
  content: contentGraphSchema,
  checksum: z.string().regex(/^[a-f0-9]{64}$/),
  publishedAt: isoDatetimeSchema,
});

const draftSchema = z.strictObject({
  revision: z.number().int().nonnegative(),
  content: contentGraphSchema,
});

const validationSchema = z.strictObject({
  valid: z.boolean(),
  issues: z.array(z.strictObject({ path: z.string(), message: z.string() })),
});

const publishSchema = z.discriminatedUnion("published", [
  z.strictObject({
    published: z.literal(true),
    version: z.number().int().positive(),
    checksum: z.string(),
  }),
  z.strictObject({
    published: z.literal(false),
    issues: validationSchema.shape.issues,
  }),
]);

// biome-ignore-start lint/style/useNamingConvention: the CMS API's version fields keep the publication table's column names; renaming them changes the API.
const versionSchema = z.strictObject({
  version: z.number().int().positive(),
  source_revision: z.number().int().positive(),
  checksum: z.string(),
  published_by: z.string(),
  rollback_from: z.number().int().positive().nullable(),
  published_at: z.date(),
});
// biome-ignore-end lint/style/useNamingConvention: the CMS API's version fields keep the publication table's column names; renaming them changes the API.

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

// Declared errors (docs/architecture/decisions.md, #170). The caller acts on
// each by its code; the message is for developers, and the app writes its
// own copy. A failure several operations share is declared once, on the base
// they build from. A signed-out call fails with UNAUTHORIZED, and so does a
// CMS call without the admin token.
const signedIn = oc.errors({
  UNAUTHORIZED: { status: 401, message: "Sign in first." },
});
const cmsAdmin = oc.errors({
  UNAUTHORIZED: { status: 401, message: "CMS access is required." },
});

// Support that isn't the signed-in account's reads as not found, so support
// references can't be probed.
const supportNotFound = {
  NOT_FOUND: { status: 404, message: "Support checkout was not found." },
} as const;
const paymentsNotConfigured = {
  PAYMENTS_NOT_CONFIGURED: {
    status: 503,
    message: "Stripe is not configured on this server.",
  },
} as const;

export const apiContract = {
  content: oc.tag("content").router({
    getPublished: oc
      .route({
        summary: "Get the published content",
        description:
          "Returns the newest published content snapshot: its version, the content graph, a checksum, and when it was published. Anyone may call it.",
      })
      .errors({
        CONTENT_NOT_PUBLISHED: {
          status: 404,
          message: "No content has been published yet.",
        },
      })
      .output(publishedContentSchema),
  }),
  account: oc.tag("account").router({
    saveOnboarding: signedIn
      .route({
        summary: "Save onboarding answers",
        description:
          "Saves the signed-in person's onboarding draft against a content version. Needs a signed-in session.",
      })
      .errors({
        ONBOARDING_DRAFT_INVALID: {
          status: 400,
          message: "The draft doesn't match the content version it names.",
        },
      })
      .input(
        z.strictObject({
          contentVersion: z.number().int().positive(),
          draft: onboardingDraftSchema,
        }),
      )
      .output(
        z.strictObject({
          contentVersion: z.number().int().positive(),
          savedAt: isoDatetimeSchema,
        }),
      ),
  }),
  support: oc.tag("support").router({
    createCheckout: signedIn
      .route({
        summary: "Start a support checkout",
        description:
          "Creates a Stripe Checkout for a one-time or monthly support amount, in minor units, and returns its URL and reference. Needs a signed-in session.",
      })
      .errors(paymentsNotConfigured)
      .input(
        z.strictObject({
          amountMinor: z.number().int().min(100).max(100_000),
          frequency: supportFrequencySchema,
        }),
      )
      .output(z.strictObject({ url: z.url(), reference: z.uuid() })),
    getStatus: signedIn
      .route({
        summary: "Get the status of a support payment",
        description:
          "Returns the frequency and status of a support payment by its reference. Needs the session of the account that made it; any other reference reads as not found.",
      })
      .errors(supportNotFound)
      .input(z.strictObject({ reference: z.uuid() }))
      .output(
        z.strictObject({
          frequency: supportFrequencySchema,
          status: contributionStatusSchema,
        }),
      ),
    createPortal: signedIn
      .route({
        summary: "Open subscription management",
        description:
          "Returns a Stripe billing portal URL for managing a monthly support payment. Needs the session of the account that made it.",
      })
      .errors({
        ...supportNotFound,
        ...paymentsNotConfigured,
        SUPPORT_NOT_RECURRING: {
          status: 409,
          message: "This support has no subscription to manage.",
        },
      })
      .input(z.strictObject({ reference: z.uuid() }))
      .output(z.strictObject({ url: z.url() })),
  }),
  cms: oc.tag("cms").router({
    getDraft: cmsAdmin
      .route(
        cmsRoute(
          "Get the CMS draft",
          "Returns the current draft content graph and its revision.",
        ),
      )
      .output(draftSchema),
    saveDraft: cmsAdmin
      .route(
        cmsRoute(
          "Save the CMS draft",
          "Replaces the draft content graph with a change note. Fails if expectedRevision is not the current revision.",
        ),
      )
      .errors({
        REVISION_CONFLICT: {
          status: 409,
          message: "The draft changed since expectedRevision.",
          data: z.strictObject({
            expectedRevision: z.number().int().nonnegative(),
            actualRevision: z.number().int().nonnegative(),
          }),
        },
        STATUS_NOTE_REQUIRED: {
          status: 400,
          message: "A status change needs a new note.",
          data: z.strictObject({ issues: validationSchema.shape.issues }),
        },
      })
      .input(
        z.strictObject({
          expectedRevision: z.number().int().nonnegative(),
          changeNote: nonEmptyTextSchema.max(500),
          content: contentGraphSchema,
        }),
      )
      .output(z.strictObject({ revision: z.number().int().positive() })),
    validateDraft: cmsAdmin
      .route(
        cmsRoute(
          "Check the CMS draft",
          "Reports whether the draft could be published, with each problem and its path.",
        ),
      )
      .output(validationSchema),
    previewDraft: cmsAdmin
      .route(
        cmsRoute(
          "Preview the CMS draft",
          "Returns the draft as it would be published. Pass content to preview unsaved changes.",
        ),
      )
      .input(z.strictObject({ content: contentGraphSchema.optional() }))
      .output(draftSchema),
    publishDraft: cmsAdmin
      .route(
        cmsRoute(
          "Publish the CMS draft",
          "Publishes the draft as a new content version, or returns the problems that stop it.",
        ),
      )
      .output(publishSchema),
    listVersions: cmsAdmin
      .route(
        cmsRoute(
          "List published versions",
          "Lists every published content version, who published it, and when.",
        ),
      )
      .output(z.array(versionSchema)),
    rollback: cmsAdmin
      .route(
        cmsRoute(
          "Roll back to a version",
          "Publishes an earlier version's content again as a new version.",
        ),
      )
      .errors({
        ROLLBACK_NOT_PUBLISHABLE: {
          status: 422,
          message:
            "The version was restored to the draft but can't be published.",
          data: z.strictObject({
            revision: z.number().int().positive(),
            issues: validationSchema.shape.issues,
          }),
        },
      })
      .input(z.strictObject({ version: z.number().int().positive() }))
      .output(
        z.strictObject({
          revision: z.number().int().positive(),
          published: z.literal(true),
          version: z.number().int().positive(),
          checksum: z.string(),
        }),
      ),
  }),
};

export type ApiContract = typeof apiContract;
export type PublishedContent = z.infer<typeof publishedContentSchema>;
export type CmsDraft = z.infer<typeof draftSchema>;
