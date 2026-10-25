import { describe, expect, it } from "vitest";
import {
  applyFeatureStatusChanges,
  contentFixSchema,
  contentGraphSchema,
  featureStatuses,
  type ContentFix,
} from "@it/domain/content";
import { fixes } from "./fixes";

const feature: ContentFix = {
  id: "check-ins",
  title: "Check-ins",
  description: "Paired with a person working on the same thing.",
  kind: "feature",
  featureStatus: "planned",
  evidence: "untested",
  evidenceNote: "Not tested yet.",
  sortOrder: 0,
};

describe("feature statuses", () => {
  it("lists the five roadmap statuses in roadmap order", () => {
    expect(featureStatuses).toEqual([
      "live",
      "in-progress",
      "planned",
      "exploring",
      "idea",
    ]);
  });

  it.each(featureStatuses)("accepts a %s feature", (featureStatus) => {
    expect(
      contentFixSchema.safeParse({ ...feature, featureStatus }).success,
    ).toBe(true);
  });

  it("accepts a status date and note on a feature", () => {
    expect(
      contentFixSchema.safeParse({
        ...feature,
        statusChangedOn: "2026-10-20",
        statusNote: "Decided to build it after launch.",
      }).success,
    ).toBe(true);
  });

  it("rejects a status date that is not a calendar date", () => {
    expect(
      contentFixSchema.safeParse({ ...feature, statusChangedOn: "2026-13-40" })
        .success,
    ).toBe(false);
    expect(
      contentFixSchema.safeParse({ ...feature, statusChangedOn: "yesterday" })
        .success,
    ).toBe(false);
  });

  it("keeps existing planned and idea fixes valid without a date or note", () => {
    expect(fixes.some(({ featureStatus }) => featureStatus === "planned")).toBe(
      true,
    );
    expect(fixes.some(({ featureStatus }) => featureStatus === "idea")).toBe(
      true,
    );
  });
});

describe("applyFeatureStatusChanges", () => {
  const today = "2026-10-20";

  it("refuses a status change without a note", () => {
    const result = applyFeatureStatusChanges(
      [feature],
      [{ ...feature, featureStatus: "in-progress" }],
      today,
    );

    expect(result.issues).toEqual([
      {
        path: "fix.check-ins.statusNote",
        message: "Add a note saying what changed before changing the status.",
      },
    ]);
  });

  it("refuses a status change that keeps the previous note", () => {
    const before = { ...feature, statusNote: "Decided to build it." };
    const result = applyFeatureStatusChanges(
      [before],
      [{ ...before, featureStatus: "in-progress" }],
      today,
    );

    expect(result.issues).toHaveLength(1);
  });

  it("records today's date with a status change and its note", () => {
    const result = applyFeatureStatusChanges(
      [{ ...feature, statusChangedOn: "2026-09-01" }],
      [
        {
          ...feature,
          featureStatus: "in-progress",
          statusChangedOn: "2026-09-01",
          statusNote: "Building it now.",
        },
      ],
      today,
    );

    expect(result.issues).toEqual([]);
    expect(result.fixes[0]).toMatchObject({
      featureStatus: "in-progress",
      statusChangedOn: today,
      statusNote: "Building it now.",
    });
  });

  it("keeps a date the founder set with the change", () => {
    const result = applyFeatureStatusChanges(
      [feature],
      [
        {
          ...feature,
          featureStatus: "live",
          statusChangedOn: "2026-10-18",
          statusNote: "Live in It.",
        },
      ],
      today,
    );

    expect(result.fixes[0]?.statusChangedOn).toBe("2026-10-18");
  });

  it("lets a note or date be edited without a status change", () => {
    const result = applyFeatureStatusChanges(
      [feature],
      [{ ...feature, statusNote: "Clearer wording." }],
      today,
    );

    expect(result.issues).toEqual([]);
    expect(result.fixes[0]?.statusChangedOn).toBeUndefined();
  });

  it("requires a note for a new feature but not for other new fixes", () => {
    const habit: ContentFix = {
      ...feature,
      id: "wind-down",
      kind: "habit",
      featureStatus: undefined,
    };
    const result = applyFeatureStatusChanges([], [feature, habit], today);

    expect(result.issues.map(({ path }) => path)).toEqual([
      "fix.check-ins.statusNote",
    ]);
  });
});

describe("status date and note", () => {
  it("belong only to features", () => {
    const habit = {
      ...feature,
      kind: "habit",
      featureStatus: undefined,
      statusNote: "Not a feature.",
    };
    expect(contentFixSchema.safeParse(habit).success).toBe(false);
    expect(
      contentGraphSchema.safeParse({
        domains: [],
        pains: [],
        dreams: [],
        painDreamLinks: [],
        firstActions: [],
        actionPainLinks: [],
        fixes: [habit],
        sources: [],
        provenance: [],
      }).success,
    ).toBe(false);
  });
});
