import { describe, expect, it } from "vitest";
import { firstActions, getFirstActionsForPainIds } from "../src/first-actions";
import {
  getAllPains,
  personalPainDomains,
  worldPainDomains,
} from "../src/tier-1";
import { painDomainListSchema } from "../src/schema";

describe("onboarding content", () => {
  it("has unique, valid IDs and nonempty content", () => {
    expect(painDomainListSchema.safeParse(personalPainDomains).success).toBe(
      true,
    );
    expect(painDomainListSchema.safeParse(worldPainDomains).success).toBe(true);
  });

  it("rejects duplicate IDs across content groups", () => {
    const firstDomain = personalPainDomains[0]!;

    expect(
      painDomainListSchema.safeParse([
        firstDomain,
        { ...firstDomain, id: "duplicate-group" },
      ]).success,
    ).toBe(false);
  });

  it("links every first action to an existing pain", () => {
    const painIds = new Set(
      [...personalPainDomains, ...worldPainDomains].flatMap((domain) =>
        getAllPains([domain]).map((pain) => pain.id),
      ),
    );

    expect(firstActions.length).toBeGreaterThan(0);
    expect(
      firstActions.every((action) =>
        action.painIds.every((painId) => painIds.has(painId)),
      ),
    ).toBe(true);
  });

  it("shows only actions relevant to the selected pains", () => {
    expect(
      getFirstActionsForPainIds(["procrastination"]).map((item) => item.id),
    ).toContain("shrink-first-step");
    expect(getFirstActionsForPainIds(["anxiety"])).toEqual([]);
  });

  it("presents the bedroom air suggestion as a conditional candidate", () => {
    const [action] = getFirstActionsForPainIds(["poor-sleep"]);

    expect(action?.id).toBe("explore-bedroom-air");
    expect(action?.evidence).toBe("candidate");
    expect(action?.safetyNote).toMatch(/not medical advice/i);
  });
});
