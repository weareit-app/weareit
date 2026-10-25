import { createORPCClient, isDefinedError, ORPCError } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { RPCHandler } from "@orpc/server/fetch";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ApiClient } from "@it/api-contract/client";
import { buildTier1ContentGraph } from "@it/content/tier-1-graph";
import * as repository from "@it/database/content-repository";
import type { ItDatabase } from "@it/database/database";
import {
  PaymentsNotConfiguredError,
  SupportContributionNotFoundError,
  SupportNotRecurringError,
} from "./payment-errors";
import { createApiRouter, type ApiContext } from "./router";

// The repository is faked: these tests check how the router maps each error
// class to a declared contract error, not the SQL behind it.
vi.mock("@it/database/content-repository", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@it/database/content-repository")>();
  return {
    ...actual,
    readPublishedContent: vi.fn(),
    readDraftContent: vi.fn(),
    saveDraftContent: vi.fn(),
    saveUserOnboardingDraft: vi.fn(),
    rollbackToVersion: vi.fn(),
  };
});

const reference = "00000000-0000-4000-8000-000000000001";
const content = buildTier1ContentGraph();
const draft = {
  personalPainIds: [],
  worldPainIds: [],
  personalDreamIds: [],
  worldDreamIds: [],
  helpInterests: [],
  draftUpdatedAt: 1760000000000,
};

type SupportPayments = ApiContext["supportPayments"];
const createCheckout = vi.fn<SupportPayments["createCheckout"]>();
const getStatus = vi.fn<SupportPayments["getStatus"]>();
const createPortal = vi.fn<SupportPayments["createPortal"]>();
const supportPayments: SupportPayments = {
  createCheckout,
  getStatus,
  createPortal,
};

// Calls go over the RPC wire, through the server's handler and the
// contract-typed client, so each test sees what the app would.
function client(context: Partial<ApiContext> = {}): ApiClient {
  const handler = new RPCHandler(createApiRouter({} as ItDatabase));
  const fullContext: ApiContext = {
    db: {} as ItDatabase,
    cmsActor: "cms-admin",
    userId: "user_owner",
    supportPayments,
    ...context,
  };
  return createORPCClient<ApiClient>(
    new RPCLink({
      url: "http://localhost/rpc",
      fetch: async (request) => {
        const result = await handler.handle(request, {
          prefix: "/rpc",
          context: fullContext,
        });
        return result.response ?? new Response(null, { status: 404 });
      },
    }),
  );
}

async function failure(call: Promise<unknown>) {
  try {
    await call;
  } catch (error) {
    return error;
  }
  throw new Error("The call succeeded");
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe("declared errors", () => {
  it("UNAUTHORIZED: a signed-out call", async () => {
    const error = await failure(
      client({ userId: null }).account.saveOnboarding({
        contentVersion: 1,
        draft,
      }),
    );

    expect(isDefinedError(error)).toBe(true);
    expect(error).toMatchObject({ code: "UNAUTHORIZED", status: 401 });
  });

  it("UNAUTHORIZED: a CMS call without the admin token", async () => {
    const error = await failure(client({ cmsActor: null }).cms.getDraft());

    expect(isDefinedError(error)).toBe(true);
    expect(error).toMatchObject({ code: "UNAUTHORIZED", status: 401 });
  });

  it("CONTENT_NOT_PUBLISHED: nothing has been published", async () => {
    vi.mocked(repository.readPublishedContent).mockResolvedValue(null);

    const error = await failure(client().content.getPublished());

    expect(isDefinedError(error)).toBe(true);
    expect(error).toMatchObject({ code: "CONTENT_NOT_PUBLISHED", status: 404 });
  });

  it("ONBOARDING_DRAFT_INVALID: choices outside the content version", async () => {
    vi.mocked(repository.saveUserOnboardingDraft).mockRejectedValue(
      new repository.InvalidOnboardingDraftError(
        "Some saved choices are not in the content version you explored.",
      ),
    );

    const error = await failure(
      client().account.saveOnboarding({ contentVersion: 1, draft }),
    );

    expect(isDefinedError(error)).toBe(true);
    expect(error).toMatchObject({
      code: "ONBOARDING_DRAFT_INVALID",
      status: 400,
    });
  });

  it("REVISION_CONFLICT: the draft changed elsewhere, with both revisions", async () => {
    vi.mocked(repository.saveDraftContent).mockRejectedValue(
      new repository.RevisionConflictError(3, 4),
    );

    const error = await failure(
      client().cms.saveDraft({
        expectedRevision: 3,
        changeNote: "Fix a typo",
        content,
      }),
    );

    expect(isDefinedError(error)).toBe(true);
    expect(error).toMatchObject({
      code: "REVISION_CONFLICT",
      status: 409,
      data: { expectedRevision: 3, actualRevision: 4 },
    });
  });

  it("STATUS_NOTE_REQUIRED: a status change without a note, with its issues", async () => {
    const issues = [
      {
        path: "fix.sleep-clinic.statusNote",
        message: "Add a note saying what changed before changing the status.",
      },
    ];
    vi.mocked(repository.saveDraftContent).mockRejectedValue(
      new repository.FeatureStatusNoteError(issues),
    );

    const error = await failure(
      client().cms.saveDraft({
        expectedRevision: 3,
        changeNote: "Ship it",
        content,
      }),
    );

    expect(isDefinedError(error)).toBe(true);
    expect(error).toMatchObject({
      code: "STATUS_NOTE_REQUIRED",
      status: 400,
      data: { issues },
    });
  });

  it("ROLLBACK_NOT_PUBLISHABLE: the issues as data, not in the message", async () => {
    const issues = [
      {
        path: "dreams",
        message: "Publish at least one domain, pain, and dream.",
      },
    ];
    vi.mocked(repository.rollbackToVersion).mockResolvedValue({
      revision: 7,
      published: false,
      issues,
    });

    const error = await failure(client().cms.rollback({ version: 2 }));

    expect(isDefinedError(error)).toBe(true);
    expect(error).toMatchObject({
      code: "ROLLBACK_NOT_PUBLISHABLE",
      status: 422,
      data: { revision: 7, issues },
    });
    expect((error as Error).message).not.toContain("Publish at least one");
  });

  it("PAYMENTS_NOT_CONFIGURED: starting a checkout", async () => {
    createCheckout.mockRejectedValue(new PaymentsNotConfiguredError());

    const error = await failure(
      client().support.createCheckout({ amountMinor: 500, frequency: "once" }),
    );

    expect(isDefinedError(error)).toBe(true);
    expect(error).toMatchObject({
      code: "PAYMENTS_NOT_CONFIGURED",
      status: 503,
    });
  });

  it("PAYMENTS_NOT_CONFIGURED: opening subscription management", async () => {
    createPortal.mockRejectedValue(new PaymentsNotConfiguredError());

    const error = await failure(client().support.createPortal({ reference }));

    expect(isDefinedError(error)).toBe(true);
    expect(error).toMatchObject({ code: "PAYMENTS_NOT_CONFIGURED" });
  });

  it("NOT_FOUND: support that isn't the caller's", async () => {
    getStatus.mockRejectedValue(new SupportContributionNotFoundError());
    createPortal.mockRejectedValue(new SupportContributionNotFoundError());

    for (const call of [
      client().support.getStatus({ reference }),
      client().support.createPortal({ reference }),
    ]) {
      const error = await failure(call);
      expect(isDefinedError(error)).toBe(true);
      expect(error).toMatchObject({ code: "NOT_FOUND", status: 404 });
    }
  });

  it("SUPPORT_NOT_RECURRING: managing one-time support", async () => {
    createPortal.mockRejectedValue(new SupportNotRecurringError());

    const error = await failure(client().support.createPortal({ reference }));

    expect(isDefinedError(error)).toBe(true);
    expect(error).toMatchObject({ code: "SUPPORT_NOT_RECURRING", status: 409 });
  });
});

describe("undeclared errors", () => {
  it("reach the client as INTERNAL_SERVER_ERROR with no detail", async () => {
    vi.mocked(repository.readDraftContent).mockRejectedValue(
      new Error('connection to "db.internal" terminated unexpectedly'),
    );

    const error = await failure(client().cms.getDraft());

    expect(error).toBeInstanceOf(ORPCError);
    expect(isDefinedError(error)).toBe(false);
    expect(error).toMatchObject({
      code: "INTERNAL_SERVER_ERROR",
      status: 500,
      message: "Internal server error",
      data: undefined,
    });
    expect(JSON.stringify(error)).not.toContain("db.internal");
    expect((error as Error).cause).toBeUndefined();
  });
});
