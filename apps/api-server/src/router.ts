import type {
  InferContractRouterInputs,
  InferContractRouterOutputs,
} from "@orpc/contract";
import { implement } from "@orpc/server";
import type { ItDatabase } from "@it/database/database";
import {
  FeatureStatusNoteError,
  listPublishedVersions,
  InvalidOnboardingDraftError,
  RevisionConflictError,
  publishDraftContent,
  readDraftContent,
  readPublishedContent,
  rollbackToVersion,
  saveUserOnboardingDraft,
  saveDraftContent,
  validatePublishableGraph,
} from "@it/database/content-repository";
import { apiContract } from "@it/api-contract/contract";
import {
  PaymentsNotConfiguredError,
  SupportContributionNotFoundError,
  SupportNotRecurringError,
} from "./payment-errors";

type ApiInputs = InferContractRouterInputs<typeof apiContract>;
type ApiOutputs = InferContractRouterOutputs<typeof apiContract>;
interface Support<K extends keyof ApiInputs["support"]> {
  input: ApiInputs["support"][K];
  output: Promise<ApiOutputs["support"][K]>;
}

// The payment service the support operations call. Its shapes come from the
// contract, plus the signed-in account the router has checked.
export interface SupportPayments {
  createCheckout(
    input: Support<"createCheckout">["input"] & { userId: string },
  ): Support<"createCheckout">["output"];
  getStatus(
    reference: Support<"getStatus">["input"]["reference"],
    userId: string,
  ): Support<"getStatus">["output"];
  createPortal(
    reference: Support<"createPortal">["input"]["reference"],
    userId: string,
  ): Support<"createPortal">["output"];
}

export interface ApiContext {
  db: ItDatabase;
  cmsActor: string | null;
  userId: string | null;
  supportPayments: SupportPayments;
}

const os = implement(apiContract).$context<ApiContext>();

// Each handler maps the error classes its services throw to the errors its
// contract declares (errors.CODE). Anything else propagates, such as the
// repository's ContentNotSeededError and PublishedVersionNotFoundError, which
// no caller can act on. oRPC sends those as INTERNAL_SERVER_ERROR with the
// message "Internal server error", keeping the original only as the error's
// cause on the server (toORPCError in the installed @orpc/client 1.15.6 dist,
// checked 2026-10-22).
interface Unauthorized {
  // biome-ignore lint/style/useNamingConvention: the contract names this error code.
  UNAUTHORIZED: (options?: { message?: string }) => Error;
}

function requireCmsActor(actor: string | null, errors: Unauthorized) {
  if (!actor) throw errors.UNAUTHORIZED();
  return actor;
}

function requireUserId(
  userId: string | null,
  errors: Unauthorized,
  message = "Sign in with an email code before saving your exploration.",
) {
  if (!userId) throw errors.UNAUTHORIZED({ message });
  return userId;
}

const supportSignInMessage = "Sign in with the account you used to support It.";

export function createApiRouter(db: ItDatabase) {
  return os.router({
    content: {
      getPublished: os.content.getPublished.handler(async ({ errors }) => {
        const content = await readPublishedContent(db);
        if (!content) throw errors.CONTENT_NOT_PUBLISHED();
        return content;
      }),
    },
    account: {
      saveOnboarding: os.account.saveOnboarding.handler(
        async ({ context, input, errors }) => {
          const userId = requireUserId(context.userId, errors);
          try {
            return await saveUserOnboardingDraft(
              db,
              userId,
              input.contentVersion,
              input.draft,
            );
          } catch (error) {
            if (error instanceof InvalidOnboardingDraftError)
              throw errors.ONBOARDING_DRAFT_INVALID({ message: error.message });
            throw error;
          }
        },
      ),
    },
    support: {
      createCheckout: os.support.createCheckout.handler(
        async ({ context, input, errors }) => {
          const userId = requireUserId(
            context.userId,
            errors,
            "Sign in before supporting It.",
          );
          try {
            return await context.supportPayments.createCheckout({
              ...input,
              userId,
            });
          } catch (error) {
            if (error instanceof PaymentsNotConfiguredError)
              throw errors.PAYMENTS_NOT_CONFIGURED();
            throw error;
          }
        },
      ),
      getStatus: os.support.getStatus.handler(
        async ({ context, input, errors }) => {
          const userId = requireUserId(
            context.userId,
            errors,
            supportSignInMessage,
          );
          try {
            return await context.supportPayments.getStatus(
              input.reference,
              userId,
            );
          } catch (error) {
            if (error instanceof SupportContributionNotFoundError)
              throw errors.NOT_FOUND();
            throw error;
          }
        },
      ),
      createPortal: os.support.createPortal.handler(
        async ({ context, input, errors }) => {
          const userId = requireUserId(
            context.userId,
            errors,
            supportSignInMessage,
          );
          try {
            return await context.supportPayments.createPortal(
              input.reference,
              userId,
            );
          } catch (error) {
            if (error instanceof SupportContributionNotFoundError)
              throw errors.NOT_FOUND();
            if (error instanceof SupportNotRecurringError)
              throw errors.SUPPORT_NOT_RECURRING();
            if (error instanceof PaymentsNotConfiguredError)
              throw errors.PAYMENTS_NOT_CONFIGURED();
            throw error;
          }
        },
      ),
    },
    cms: {
      getDraft: os.cms.getDraft.handler(async ({ context, errors }) => {
        requireCmsActor(context.cmsActor, errors);
        return readDraftContent(db);
      }),
      saveDraft: os.cms.saveDraft.handler(
        async ({ context, input, errors }) => {
          const actor = requireCmsActor(context.cmsActor, errors);
          try {
            const revision = await saveDraftContent(db, input.content, {
              expectedRevision: input.expectedRevision,
              actor,
              changeNote: input.changeNote,
            });
            return { revision };
          } catch (error) {
            if (error instanceof RevisionConflictError)
              throw errors.REVISION_CONFLICT({
                data: {
                  expectedRevision: error.expectedRevision,
                  actualRevision: error.actualRevision,
                },
              });
            if (error instanceof FeatureStatusNoteError)
              throw errors.STATUS_NOTE_REQUIRED({
                data: { issues: error.issues },
              });
            throw error;
          }
        },
      ),
      validateDraft: os.cms.validateDraft.handler(
        async ({ context, errors }) => {
          requireCmsActor(context.cmsActor, errors);
          const draft = await readDraftContent(db);
          const result = validatePublishableGraph(draft.content);
          return { valid: result.issues.length === 0, issues: result.issues };
        },
      ),
      previewDraft: os.cms.previewDraft.handler(
        async ({ context, input, errors }) => {
          requireCmsActor(context.cmsActor, errors);
          const draft = await readDraftContent(db);
          return { ...draft, content: input.content ?? draft.content };
        },
      ),
      publishDraft: os.cms.publishDraft.handler(async ({ context, errors }) => {
        const actor = requireCmsActor(context.cmsActor, errors);
        return publishDraftContent(db, { actor });
      }),
      listVersions: os.cms.listVersions.handler(async ({ context, errors }) => {
        requireCmsActor(context.cmsActor, errors);
        return listPublishedVersions(db);
      }),
      rollback: os.cms.rollback.handler(async ({ context, input, errors }) => {
        const actor = requireCmsActor(context.cmsActor, errors);
        const result = await rollbackToVersion(db, input.version, actor);
        if (!result.published)
          throw errors.ROLLBACK_NOT_PUBLISHABLE({
            data: { revision: result.revision, issues: result.issues },
          });
        return result;
      }),
    },
  });
}

export type ApiRouter = ReturnType<typeof createApiRouter>;
