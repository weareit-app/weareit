import { describe, expect, it } from "vitest";
import { contentGraphSchema, type ContentGraph } from "./content";
import { removeRecord } from "./content-edits";

const provenanceFor = (
  entityType: ContentGraph["provenance"][number]["entityType"],
  entityId: string,
) => ({
  entityType,
  entityId,
  sourceId: "survey",
  locator: "Question 3",
  evidenceType: "Product curation",
  rights: "CC0-1.0",
  reviewStatus: "unreviewed" as const,
});

// Two of everything, linked every way the graph allows, so a cascade that
// misses a reference leaves the graph invalid.
const graph: ContentGraph = contentGraphSchema.parse({
  domains: [
    { id: "home", title: "Home", scope: "personal", sortOrder: 0 },
    { id: "work", title: "Work", scope: "personal", sortOrder: 1 },
  ],
  pains: [
    {
      id: "rent",
      domainId: "home",
      title: "Rent",
      description: "Too high.",
      sortOrder: 0,
    },
    {
      id: "hours",
      domainId: "work",
      title: "Hours",
      description: "Too long.",
      sortOrder: 0,
    },
  ],
  dreams: [
    {
      id: "stable-home",
      title: "A stable home",
      description: "Stay put.",
      sortOrder: 0,
    },
    {
      id: "free-time",
      title: "Free time",
      description: "Evenings back.",
      sortOrder: 1,
    },
  ],
  painDreamLinks: [
    { painId: "rent", dreamId: "stable-home" },
    { painId: "hours", dreamId: "free-time" },
  ],
  firstActions: [
    {
      id: "know-rights",
      title: "Know your rights",
      description: "Read up.",
      firstStep: "Open the guide.",
      effortMinutes: 15,
      evidence: "candidate",
      sortOrder: 0,
    },
    {
      id: "talk-to-boss",
      title: "Talk to your boss",
      description: "Ask.",
      firstStep: "Book a time.",
      effortMinutes: 15,
      evidence: "candidate",
      sortOrder: 1,
    },
  ],
  actionPainLinks: [
    { actionId: "know-rights", painId: "rent" },
    { actionId: "talk-to-boss", painId: "hours" },
  ],
  fixes: [
    {
      id: "tenant-union",
      title: "Tenant union",
      description: "Organize.",
      kind: "group",
      evidence: "untested",
      evidenceNote: "Not tested yet.",
      sortOrder: 0,
    },
    {
      id: "four-day-week",
      title: "Four-day week",
      description: "Push for it.",
      kind: "once",
      evidence: "untested",
      evidenceNote: "Not tested yet.",
      sortOrder: 1,
    },
  ],
  fixDreamLinks: [
    { fixId: "tenant-union", dreamId: "stable-home" },
    { fixId: "four-day-week", dreamId: "free-time" },
  ],
  sources: [
    {
      id: "survey",
      title: "Survey",
      documentPath: "research/survey.md",
      sourceType: "research_registry",
      rights: "CC0-1.0",
    },
  ],
  provenance: [
    provenanceFor("domain", "home"),
    provenanceFor("pain", "rent"),
    provenanceFor("dream", "stable-home"),
    provenanceFor("first_action", "know-rights"),
    provenanceFor("fix", "tenant-union"),
  ],
});

const issuesOf = (next: ContentGraph) => {
  const result = contentGraphSchema.safeParse(next);
  return result.success
    ? []
    : result.error.issues.map(({ message }) => message);
};

describe("removeRecord", () => {
  it("removes a dream with its links to ways, so the draft still saves", () => {
    const next = removeRecord(graph, "dreams", "stable-home");

    expect(issuesOf(next)).toEqual([]);
    expect(next.dreams.map(({ id }) => id)).toEqual(["free-time"]);
    expect(next.fixDreamLinks).toEqual([
      { fixId: "four-day-week", dreamId: "free-time" },
    ]);
    expect(next.painDreamLinks).toEqual([
      { painId: "hours", dreamId: "free-time" },
    ]);
    expect(
      next.provenance.some(({ entityId }) => entityId === "stable-home"),
    ).toBe(false);
    expect(next.fixes).toEqual(graph.fixes);
  });

  it("removes a pain with its links to dreams and first actions", () => {
    const next = removeRecord(graph, "pains", "rent");

    expect(issuesOf(next)).toEqual([]);
    expect(next.pains.map(({ id }) => id)).toEqual(["hours"]);
    expect(next.painDreamLinks).toEqual([
      { painId: "hours", dreamId: "free-time" },
    ]);
    expect(next.actionPainLinks).toEqual([
      { actionId: "talk-to-boss", painId: "hours" },
    ]);
    expect(next.provenance.some(({ entityId }) => entityId === "rent")).toBe(
      false,
    );
    expect(next.dreams).toEqual(graph.dreams);
  });

  it("removes a domain with its pains and everything that pointed at them", () => {
    const next = removeRecord(graph, "domains", "home");

    expect(issuesOf(next)).toEqual([]);
    expect(next.domains.map(({ id }) => id)).toEqual(["work"]);
    expect(next.pains.map(({ id }) => id)).toEqual(["hours"]);
    expect(next.actionPainLinks).toEqual([
      { actionId: "talk-to-boss", painId: "hours" },
    ]);
    expect(next.provenance.map(({ entityId }) => entityId)).toEqual([
      "stable-home",
      "know-rights",
      "tenant-union",
    ]);
  });

  it("removes a first action with its links to pains", () => {
    const next = removeRecord(graph, "firstActions", "know-rights");

    expect(issuesOf(next)).toEqual([]);
    expect(next.firstActions.map(({ id }) => id)).toEqual(["talk-to-boss"]);
    expect(next.actionPainLinks).toEqual([
      { actionId: "talk-to-boss", painId: "hours" },
    ]);
    expect(
      next.provenance.some(({ entityId }) => entityId === "know-rights"),
    ).toBe(false);
  });

  it("returns the graph unchanged for an ID that isn't there", () => {
    expect(removeRecord(graph, "dreams", "missing")).toEqual(graph);
  });
});
