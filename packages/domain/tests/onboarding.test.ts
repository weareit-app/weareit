import { describe, expect, it } from "vitest";
import {
  emptySelection,
  onboardingDraftSchema,
  toggleSelection,
} from "../src/onboarding";

describe("toggleSelection", () => {
  it("adds an unselected ID without changing the original list", () => {
    const current = ["anxiety"];

    expect(toggleSelection(current, "procrastination")).toEqual([
      "anxiety",
      "procrastination",
    ]);
    expect(current).toEqual(["anxiety"]);
  });

  it("removes an already selected ID", () => {
    expect(toggleSelection(["anxiety", "procrastination"], "anxiety")).toEqual([
      "procrastination",
    ]);
  });
});

describe("onboardingDraftSchema", () => {
  it("accepts a valid local draft", () => {
    expect(
      onboardingDraftSchema.safeParse({
        ...emptySelection,
        personalDreamIds: [],
        worldDreamIds: [],
        helpInterests: [],
        draftUpdatedAt: 1,
      }).success,
    ).toBe(true);
  });

  it("rejects duplicate IDs and invalid timestamps", () => {
    const result = onboardingDraftSchema.safeParse({
      personalPainIds: ["anxiety", "anxiety"],
      worldPainIds: [],
      personalDreamIds: [],
      worldDreamIds: [],
      helpInterests: [],
      draftUpdatedAt: -1,
    });

    expect(result.success).toBe(false);
  });
});
