import { ORPCError, implement } from "@orpc/server";
import type { ItDatabase } from "@it/database/database";
import {
  listPublishedVersions,
  InvalidOnboardingDraftError,
  publishDraftContent,
  readDraftContent,
  readPublishedContent,
  rollbackToVersion,
  saveUserOnboardingDraft,
  saveDraftContent,
  validatePublishableGraph,
} from "@it/database/content-repository";
import { apiContract } from "./contract";

export interface ApiContext {
  db: ItDatabase;
  cmsActor: string | null;
  userId: string | null;
  supportPayments: {
    createCheckout(input: {
      amountMinor: number;
      frequency: "once" | "monthly";
      userId: string;
    }): Promise<{ url: string; reference: string }>;
    getStatus(
      reference: string,
      userId: string,
    ): Promise<{
      frequency: "once" | "monthly";
      status:
        | "pending"
        | "active"
        | "succeeded"
        | "past_due"
        | "cancel_scheduled"
        | "canceled"
        | "expired"
        | "failed"
        | "refunded";
    }>;
    createPortal(reference: string, userId: string): Promise<{ url: string }>;
  };
}

const os = implement(apiContract).$context<ApiContext>();

function requireCmsActor(actor: string | null) {
  if (!actor)
    throw new ORPCError("UNAUTHORIZED", { message: "CMS access is required." });
  return actor;
}

function requireUserId(
  userId: string | null,
  message = "Sign in with an email code before saving your exploration.",
) {
  if (!userId) throw new ORPCError("UNAUTHORIZED", { message });
  return userId;
}

const supportSignInMessage = "Sign in with the account you used to support It.";

// Support references travel in Checkout return URLs, so a reference alone
// never grants access. Records owned by another account (or by no account)
// are reported as not found so references cannot be probed.
function supportNotFound() {
  return new ORPCError("NOT_FOUND", {
    message: "Support checkout was not found.",
  });
}

export function createApiRouter(db: ItDatabase) {
  return os.router({
    content: {
      getPublished: os.content.getPublished.handler(async () => {
        const content = await readPublishedContent(db);
        if (!content)
          throw new ORPCError("NOT_FOUND", {
            message: "Published onboarding content is not available.",
          });
        return content;
      }),
    },
    account: {
      saveOnboarding: os.account.saveOnboarding.handler(
        async ({ context, input }) => {
          const userId = requireUserId(context.userId);
          try {
            return await saveUserOnboardingDraft(
              db,
              userId,
              input.contentVersion,
              input.draft,
            );
          } catch (error) {
            if (error instanceof InvalidOnboardingDraftError)
              throw new ORPCError("BAD_REQUEST", { message: error.message });
            throw error;
          }
        },
      ),
    },
    support: {
      createCheckout: os.support.createCheckout.handler(
        async ({ context, input }) => {
          const userId = requireUserId(
            context.userId,
            "Sign in before supporting It.",
          );
          try {
            return await context.supportPayments.createCheckout({
              ...input,
              userId,
            });
          } catch (error) {
            if (
              error instanceof Error &&
              error.message === "STRIPE_NOT_CONFIGURED"
            )
              throw new ORPCError("PRECONDITION_FAILED", {
                message: "Web payments are not configured yet.",
              });
            throw error;
          }
        },
      ),
      getStatus: os.support.getStatus.handler(async ({ context, input }) => {
        const userId = requireUserId(context.userId, supportSignInMessage);
        try {
          return await context.supportPayments.getStatus(
            input.reference,
            userId,
          );
        } catch (error) {
          if (
            error instanceof Error &&
            error.message === "SUPPORT_CONTRIBUTION_NOT_FOUND"
          )
            throw supportNotFound();
          throw error;
        }
      }),
      createPortal: os.support.createPortal.handler(
        async ({ context, input }) => {
          const userId = requireUserId(context.userId, supportSignInMessage);
          try {
            return await context.supportPayments.createPortal(
              input.reference,
              userId,
            );
          } catch (error) {
            if (
              error instanceof Error &&
              error.message === "SUPPORT_CONTRIBUTION_NOT_FOUND"
            )
              throw supportNotFound();
            if (
              error instanceof Error &&
              error.message === "SUPPORT_PORTAL_NOT_AVAILABLE"
            )
              throw new ORPCError("PRECONDITION_FAILED", {
                message:
                  "Subscription management is not available for this support.",
              });
            if (
              error instanceof Error &&
              error.message === "STRIPE_NOT_CONFIGURED"
            )
              throw new ORPCError("PRECONDITION_FAILED", {
                message: "Stripe billing is not configured yet.",
              });
            throw error;
          }
        },
      ),
    },
    cms: {
      getDraft: os.cms.getDraft.handler(async ({ context }) => {
        requireCmsActor(context.cmsActor);
        return readDraftContent(db);
      }),
      saveDraft: os.cms.saveDraft.handler(async ({ context, input }) => {
        const actor = requireCmsActor(context.cmsActor);
        const revision = await saveDraftContent(db, input.content, {
          expectedRevision: input.expectedRevision,
          actor,
          changeNote: input.changeNote,
        });
        return { revision };
      }),
      validateDraft: os.cms.validateDraft.handler(async ({ context }) => {
        requireCmsActor(context.cmsActor);
        const draft = await readDraftContent(db);
        const result = validatePublishableGraph(draft.content);
        return { valid: result.issues.length === 0, issues: result.issues };
      }),
      previewDraft: os.cms.previewDraft.handler(async ({ context, input }) => {
        requireCmsActor(context.cmsActor);
        const draft = await readDraftContent(db);
        return { ...draft, content: input.content ?? draft.content };
      }),
      publishDraft: os.cms.publishDraft.handler(async ({ context }) => {
        const actor = requireCmsActor(context.cmsActor);
        return publishDraftContent(db, { actor });
      }),
      listVersions: os.cms.listVersions.handler(async ({ context }) => {
        requireCmsActor(context.cmsActor);
        return listPublishedVersions(db);
      }),
      rollback: os.cms.rollback.handler(async ({ context, input }) => {
        const actor = requireCmsActor(context.cmsActor);
        const result = await rollbackToVersion(db, input.version, actor);
        if (!result.published)
          throw new ORPCError("BAD_REQUEST", {
            message: JSON.stringify(result.issues),
          });
        return result;
      }),
    },
  });
}

export type ApiRouter = ReturnType<typeof createApiRouter>;
