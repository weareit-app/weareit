import { describe, expect, it } from "vitest";
import { contentGraphSchema } from "@it/domain/content";
import { validatePublishableGraph } from "./content-repository";
import { buildTier1ContentGraph } from "@it/content/tier-1-graph";

describe("Tier 1 database import", () => {
  it("imports sourced content with stable IDs and valid links", () => {
    const graph = buildTier1ContentGraph();

    expect(contentGraphSchema.safeParse(graph).success).toBe(true);
    expect(
      graph.domains.filter(({ scope }) => scope === "personal"),
    ).toHaveLength(8);
    expect(graph.domains.filter(({ scope }) => scope === "world")).toHaveLength(
      10,
    );
    expect(graph.pains.length).toBeGreaterThan(0);
    expect(graph.dreams.length).toBeGreaterThan(0);
    expect(graph.firstActions).toHaveLength(5);
    expect(graph.fixes.length).toBeGreaterThan(0);
    expect(
      graph.fixes.every((fix) =>
        graph.fixDreamLinks.some(({ fixId }) => fixId === fix.id),
      ),
    ).toBe(true);
    expect(validatePublishableGraph(graph).issues).toEqual([]);
    expect(
      graph.provenance.every(
        (reference) => reference.reviewStatus !== "unreviewed",
      ),
    ).toBe(true);
  });

  // Publishing stores the parsed graph and its checksum, so the schema must
  // hand the seed back unchanged, byte for byte.
  it("parses the seed into the same JSON it was given", () => {
    const graph = buildTier1ContentGraph();

    expect(JSON.stringify(contentGraphSchema.parse(graph))).toBe(
      JSON.stringify(graph),
    );
  });

  it("rejects links to records outside the content graph", () => {
    const graph = buildTier1ContentGraph();
    const result = contentGraphSchema.safeParse({
      ...graph,
      painDreamLinks: [
        ...graph.painDreamLinks,
        { painId: "missing-pain", dreamId: graph.dreams[0]!.id },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("requires linked and reviewed provenance before publication", () => {
    const graph = buildTier1ContentGraph();
    const result = validatePublishableGraph({
      ...graph,
      provenance: graph.provenance.filter(
        (item) =>
          !(item.entityType === "pain" && item.entityId === graph.pains[0]!.id),
      ),
    });

    expect(result.issues).toContainEqual(
      expect.objectContaining({
        path: `pain.${graph.pains[0]!.id}.provenance`,
      }),
    );
  });
});
