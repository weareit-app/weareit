import { describe, expect, it } from "vitest";
import {
  chosenDreamIds,
  emptySelection,
  onboardingDraftSchema,
  rankWays,
  selectPain,
  toggleDream,
  toggleFix,
  toggleSelection,
  unselectPain,
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

describe("pain paths", () => {
  const empty = { painIds: [], paths: [] };
  const links = [
    { fixId: "counseling", dreamId: "steady" },
    { fixId: "counseling", dreamId: "calm" },
    { fixId: "wind-down", dreamId: "calm" },
  ];

  it("selects the pain when a future is picked under it", () => {
    const next = toggleDream(empty, "anxiety", "steady", links);

    expect(next.painIds).toEqual(["anxiety"]);
    expect(next.paths).toEqual([
      { painId: "anxiety", dreamIds: ["steady"], fixIds: [] },
    ]);
  });

  it("keeps a way that another chosen future still supports", () => {
    let next = toggleDream(empty, "anxiety", "steady", links);
    next = toggleDream(next, "anxiety", "calm", links);
    next = toggleFix(next, "anxiety", "counseling");
    next = toggleFix(next, "anxiety", "wind-down");
    next = toggleDream(next, "anxiety", "steady", links);

    expect(next.paths[0]?.fixIds).toEqual(["counseling", "wind-down"]);
    next = toggleDream(next, "anxiety", "calm", links);
    expect(next.paths).toEqual([]);
    expect(next.painIds).toEqual(["anxiety"]);
  });

  it("drops a pain's path when the pain is unselected", () => {
    let next = selectPain(empty, "broke");
    next = toggleDream(next, "anxiety", "steady", links);
    next = unselectPain(next, "anxiety");

    expect(next).toEqual({ painIds: ["broke"], paths: [] });
  });

  it("lists each chosen future once", () => {
    expect(
      chosenDreamIds([
        { painId: "a", dreamIds: ["present", "x"], fixIds: [] },
        { painId: "b", dreamIds: ["present"], fixIds: [] },
      ]),
    ).toEqual(["present", "x"]);
  });

  it("loads drafts saved before paths existed", () => {
    const parsed = onboardingDraftSchema.parse({
      personalPainIds: ["anxiety"],
      worldPainIds: [],
      personalDreamIds: [],
      worldDreamIds: [],
      helpInterests: [],
      draftUpdatedAt: 1,
    });
    expect(parsed.personalPaths).toEqual([]);
    expect(parsed.worldPaths).toEqual([]);
  });
});

describe("rankWays", () => {
  it("lists each way once, most-connected first", () => {
    const links = [
      { fixId: "wind-down", dreamId: "calm" },
      { fixId: "counseling", dreamId: "steady" },
      { fixId: "counseling", dreamId: "calm" },
      { fixId: "shared-help", dreamId: "less" },
    ];
    expect(
      rankWays(["steady", "calm"], links, [
        "wind-down",
        "counseling",
        "shared-help",
      ]),
    ).toEqual([
      { fixId: "counseling", dreamIds: ["steady", "calm"] },
      { fixId: "wind-down", dreamIds: ["calm"] },
    ]);
  });
});
