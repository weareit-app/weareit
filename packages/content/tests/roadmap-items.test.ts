import { describe, expect, it } from "vitest";
import {
  applyRoadmapItemStatusChanges,
  contentGraphSchema,
  resolveFeatureStatuses,
  type ContentFix,
  type ContentRoadmapItem,
} from "../src/graph-schema";

const spanish: ContentRoadmapItem = {
  id: "use-it-in-spanish",
  title: "Use It in Spanish",
  line: "Every page and pain in Spanish.",
  status: "planned",
  statusChangedOn: "2026-10-01",
  statusNote: "Decided to build it after launch.",
  sortOrder: 0,
};
const ownStatus: ContentFix = {
  id: "check-ins",
  title: "Check-ins",
  description: "Paired with a person working on the same thing.",
  kind: "feature",
  featureStatus: "idea",
  evidence: "untested",
  evidenceNote: "Not tested yet.",
  sortOrder: 0,
};
const { featureStatus: _status, ...withoutStatus } = ownStatus;
const connected: ContentFix = {
  ...withoutStatus,
  id: "spanish-pages",
  roadmapItemId: spanish.id,
};

const graph = (extra: {
  fixes?: unknown[];
  roadmapItems?: unknown[];
}): unknown => ({
  domains: [],
  pains: [],
  dreams: [],
  painDreamLinks: [],
  firstActions: [],
  actionPainLinks: [],
  sources: [],
  provenance: [],
  ...extra,
});

const issuesOf = (input: unknown) => {
  const result = contentGraphSchema.safeParse(input);
  return result.success
    ? []
    : result.error.issues.map(({ message }) => message);
};

describe("roadmap items in the content graph", () => {
  it("reads content published before roadmap items existed", () => {
    expect(contentGraphSchema.parse(graph({})).roadmapItems).toEqual([]);
  });

  it("accepts items and a Feature fix connected to one", () => {
    expect(
      issuesOf(
        graph({ roadmapItems: [spanish], fixes: [ownStatus, connected] }),
      ),
    ).toEqual([]);
  });

  it("accepts an item without a status date or note", () => {
    const { statusChangedOn: _date, statusNote: _note, ...bare } = spanish;
    expect(issuesOf(graph({ roadmapItems: [bare] }))).toEqual([]);
  });

  it("rejects an item ID that is not readable", () => {
    expect(
      issuesOf(graph({ roadmapItems: [{ ...spanish, id: "Use It!" }] })),
    ).not.toEqual([]);
  });

  it("rejects duplicate item IDs", () => {
    expect(
      issuesOf(
        graph({ roadmapItems: [spanish, { ...spanish, sortOrder: 1 }] }),
      ),
    ).toContain("roadmapItems IDs must be unique.");
  });

  it("rejects a connected fix that also has its own status", () => {
    expect(
      issuesOf(
        graph({
          roadmapItems: [spanish],
          fixes: [{ ...connected, featureStatus: "planned" }],
        }),
      ),
    ).toContain("A connected fix takes its roadmap item's status.");
  });

  it("rejects a connected fix with its own status date or note", () => {
    expect(
      issuesOf(
        graph({
          roadmapItems: [spanish],
          fixes: [{ ...connected, statusNote: "Its own note." }],
        }),
      ),
    ).toContain("A connected fix takes its roadmap item's status.");
  });

  it("rejects a Feature fix with neither a status nor an item", () => {
    expect(issuesOf(graph({ fixes: [withoutStatus] }))).toContain(
      "Features, and only features, carry a roadmap status.",
    );
  });

  it("rejects a connection to an unknown item", () => {
    expect(issuesOf(graph({ fixes: [connected] }))).toContain(
      "Unknown roadmap item use-it-in-spanish.",
    );
  });

  it("connects only Feature fixes", () => {
    const habit = { ...connected, kind: "habit" };
    expect(
      issuesOf(graph({ roadmapItems: [spanish], fixes: [habit] })),
    ).toContain("Only Feature fixes connect to a roadmap item.");
  });
});

describe("resolveFeatureStatuses", () => {
  it("gives a connected fix its item's status, date and note", () => {
    const content = contentGraphSchema.parse(
      graph({ roadmapItems: [spanish], fixes: [ownStatus, connected] }),
    );

    expect(resolveFeatureStatuses(content)).toEqual([
      ownStatus,
      {
        ...connected,
        featureStatus: "planned",
        statusChangedOn: "2026-10-01",
        statusNote: "Decided to build it after launch.",
      },
    ]);
  });
});

describe("applyRoadmapItemStatusChanges", () => {
  const today = "2026-10-20";

  it("refuses a status change without a new note", () => {
    const result = applyRoadmapItemStatusChanges(
      [spanish],
      [{ ...spanish, status: "in-progress" }],
      today,
    );

    expect(result.issues).toEqual([
      {
        path: "roadmap_item.use-it-in-spanish.statusNote",
        message: "Add a note saying what changed before changing the status.",
      },
    ]);
  });

  it("records today's date with a status change and its note", () => {
    const result = applyRoadmapItemStatusChanges(
      [spanish],
      [{ ...spanish, status: "in-progress", statusNote: "Translating now." }],
      today,
    );

    expect(result.issues).toEqual([]);
    expect(result.items[0]).toMatchObject({
      status: "in-progress",
      statusChangedOn: today,
      statusNote: "Translating now.",
    });
  });

  it("requires a note for a new item", () => {
    const { statusNote: _note, ...noNote } = spanish;
    expect(
      applyRoadmapItemStatusChanges([], [noNote], today).issues,
    ).toHaveLength(1);
  });
});
