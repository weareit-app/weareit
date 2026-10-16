import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const purchases = vi.hoisted(() => ({
  configure: vi.fn(),
  getOfferings: vi.fn(),
  purchasePackage: vi.fn(),
}));

vi.mock("react-native-purchases", () => ({ default: purchases }));

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  vi.stubEnv("EXPO_PUBLIC_REVENUECAT_IOS_API_KEY", "rc_public_test");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("iOS support purchases", () => {
  it("does not configure RevenueCat when the purchase module is imported", async () => {
    await import("./store-purchases.native");

    expect(purchases.configure).not.toHaveBeenCalled();
    expect(purchases.getOfferings).not.toHaveBeenCalled();
  });

  it("configures RevenueCat and fetches offerings only after purchase is requested", async () => {
    const supportPackage = {
      product: { identifier: "it_support_15" },
    };
    purchases.getOfferings.mockResolvedValue({
      current: { availablePackages: [supportPackage] },
    });
    const { purchaseStoreSupport } = await import("./store-purchases.native");

    await purchaseStoreSupport("it_support_15");

    expect(purchases.configure).toHaveBeenCalledWith({
      apiKey: "rc_public_test",
    });
    expect(purchases.getOfferings).toHaveBeenCalledOnce();
    expect(purchases.purchasePackage).toHaveBeenCalledWith(supportPackage);
  });

  it("rejects unknown products without creating a RevenueCat identity", async () => {
    const { purchaseStoreSupport } = await import("./store-purchases.native");

    await expect(purchaseStoreSupport("unexpected_product")).rejects.toThrow(
      "Choose one of the available support amounts.",
    );
    expect(purchases.configure).not.toHaveBeenCalled();
  });
});
