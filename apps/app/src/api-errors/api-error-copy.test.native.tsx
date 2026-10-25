import { ORPCError } from "@orpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import type { ComponentType, ReactNode } from "react";
import { Platform } from "react-native";
import { buildTier1ContentGraph } from "@it/content/tier-1-graph";
import { cmsErrorFallback, describeCmsError } from "./describe-cms-error";
import {
  describeSupportError,
  supportErrorFallback,
} from "./describe-support-error";

const mockApi = {
  cms: {
    getDraft: jest.fn(),
    listVersions: jest.fn(),
    saveDraft: jest.fn(),
  },
  support: {
    createCheckout: jest.fn(),
    getStatus: jest.fn(),
    createPortal: jest.fn(),
  },
};
jest.mock("../api-client", () => ({
  apiClient: mockApi,
  setCmsToken: () => {},
}));
// The brand mark draws with Skia, which doesn't run under Jest.
jest.mock("../watercolor/brand-mark", () => ({ BrandMark: () => null }));
// Apple's in-app purchases are native only.
jest.mock("../payments/store-purchases", () => ({
  purchaseStoreSupport: jest.fn(),
}));
jest.mock("expo-router", () => ({
  Link: ({ children }: { children: ReactNode }) => children,
  useLocalSearchParams: () => ({}),
}));

// A declared error as the client receives it: oRPC marks it defined when its
// code and status match the contract.
function declared(code: string, status: number, data?: unknown) {
  return new ORPCError(code, { defined: true, status, data });
}

async function renderScreen(Screen: ComponentType) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <Screen />
    </QueryClientProvider>,
  );
}

describe("CMS error copy", () => {
  const { default: CmsScreen } = jest.requireActual<{
    default: ComponentType;
  }>("../../app/cms/index");

  beforeEach(() => {
    mockApi.cms.getDraft.mockResolvedValue({
      revision: 4,
      content: buildTier1ContentGraph(),
    });
    mockApi.cms.listVersions.mockResolvedValue([]);
  });

  async function saveDraft() {
    await renderScreen(CmsScreen);
    await fireEvent.changeText(
      screen.getByPlaceholderText("CMS admin token"),
      "token",
    );
    await fireEvent.press(screen.getByRole("button", { name: "Connect" }));
    await fireEvent.press(
      await screen.findByRole("button", { name: "Save draft" }),
    );
  }

  it("announces a revision conflict with its message", async () => {
    const conflict = declared("REVISION_CONFLICT", 409, {
      expectedRevision: 4,
      actualRevision: 5,
    });
    mockApi.cms.saveDraft.mockRejectedValue(conflict);

    await saveDraft();

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(describeCmsError(conflict));
    expect(describeCmsError(conflict)).not.toBe(cmsErrorFallback);
    // The save control stays where it was, to retry by keyboard.
    expect(screen.getByRole("button", { name: "Save draft" })).toBeEnabled();
  });

  it("announces the fallback for an undeclared error", async () => {
    mockApi.cms.saveDraft.mockRejectedValue(
      new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Internal server error",
      }),
    );

    await saveDraft();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      cmsErrorFallback,
    );
  });
});

describe("Support It error copy", () => {
  // Support It takes the web checkout path only off iOS, decided when the
  // module loads.
  let SupportItScreen: ComponentType;
  beforeAll(() => {
    jest.replaceProperty(Platform, "OS", "web");
    SupportItScreen = jest.requireActual<typeof import("../../app/support-it")>(
      "../../app/support-it",
    ).default;
  });

  it("announces the fallback for an undeclared error, not the server's message", async () => {
    mockApi.support.createCheckout.mockRejectedValue(
      new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Internal server error",
      }),
    );
    await renderScreen(SupportItScreen);

    await fireEvent.press(
      screen.getByRole("button", { name: "Continue to secure checkout" }),
    );

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(supportErrorFallback);
    expect(alert).not.toHaveTextContent("Internal server error");
  });

  it("says support isn't available when payments aren't configured", async () => {
    const notConfigured = declared("PAYMENTS_NOT_CONFIGURED", 503);
    mockApi.support.createCheckout.mockRejectedValue(notConfigured);
    await renderScreen(SupportItScreen);

    await fireEvent.press(
      screen.getByRole("button", { name: "Continue to secure checkout" }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      describeSupportError(notConfigured),
    );
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Continue to secure checkout" }),
      ).toBeEnabled(),
    );
  });
});

describe("error copy by code", () => {
  it("gives each declared CMS code its own copy", () => {
    const errors = [
      declared("UNAUTHORIZED", 401),
      declared("REVISION_CONFLICT", 409, {
        expectedRevision: 1,
        actualRevision: 2,
      }),
      declared("STATUS_NOTE_REQUIRED", 400, { issues: [] }),
      declared("ROLLBACK_NOT_PUBLISHABLE", 422, {
        revision: 3,
        issues: [{ path: "dreams", message: "x" }],
      }),
    ];
    const copy = errors.map(describeCmsError);

    expect(new Set([...copy, cmsErrorFallback]).size).toBe(errors.length + 1);
  });

  it("gives each declared support code its own copy", () => {
    const errors = [
      declared("UNAUTHORIZED", 401),
      declared("PAYMENTS_NOT_CONFIGURED", 503),
      declared("NOT_FOUND", 404),
      declared("SUPPORT_NOT_RECURRING", 409),
    ];
    const copy = errors.map(describeSupportError);

    expect(new Set([...copy, supportErrorFallback]).size).toBe(
      errors.length + 1,
    );
  });

  it("falls back when the API can't be reached", () => {
    const offline = new TypeError("fetch failed");

    expect(describeCmsError(offline)).toBe(cmsErrorFallback);
    expect(describeSupportError(offline)).toBe(supportErrorFallback);
  });

  it("falls back for an undeclared error even with a known code", () => {
    const undeclared = new ORPCError("REVISION_CONFLICT", { status: 409 });

    expect(describeCmsError(undeclared)).toBe(cmsErrorFallback);
  });
});
