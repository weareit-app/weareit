import { describe, expect, it } from "vitest";
import { diagramBlockSchema } from "../src/essays/blocks/diagram";
import { mathBlockSchema } from "../src/essays/blocks/math";

describe("diagram block", () => {
  it("accepts Mermaid text with a written description", () => {
    const block = diagramBlockSchema.parse({
      mermaid: "flowchart LR\n  pain --> future --> way",
      description: "A pain leads to a future, which leads to a way.",
    });
    expect(block.description).toBe(
      "A pain leads to a future, which leads to a way.",
    );
  });

  it("rejects a diagram without a description", () => {
    expect(
      diagramBlockSchema.safeParse({ mermaid: "flowchart LR\n  a --> b" })
        .success,
    ).toBe(false);
    expect(
      diagramBlockSchema.safeParse({
        mermaid: "flowchart LR\n  a --> b",
        description: "  ",
      }).success,
    ).toBe(false);
  });
});

describe("diagram configuration", () => {
  it("rejects Mermaid directives and front matter, which could change the theme, security or layout", () => {
    for (const mermaid of [
      '%%{init: {"securityLevel": "loose"}}%%\nflowchart LR\n  a --> b',
      "---\nconfig:\n  layout: elk\n---\nflowchart LR\n  a --> b",
    ]) {
      expect(
        diagramBlockSchema.safeParse({ mermaid, description: "a to b" })
          .success,
      ).toBe(false);
    }
  });

  it("rejects the ELK layout, which the app does not ship", () => {
    for (const mermaid of ["flowchart-elk LR\n  a --> b"]) {
      expect(
        diagramBlockSchema.safeParse({ mermaid, description: "a to b" })
          .success,
      ).toBe(false);
    }
  });

  it("allows ordinary Mermaid comments", () => {
    expect(
      diagramBlockSchema.safeParse({
        mermaid: "flowchart LR\n  %% the main path\n  a --> b",
        description: "a to b",
      }).success,
    ).toBe(true);
  });
});

describe("math block", () => {
  it("holds a display formula as TeX, with an optional description", () => {
    expect(mathBlockSchema.parse({ tex: "E = mc^2" })).toEqual({
      tex: "E = mc^2",
    });
    expect(
      mathBlockSchema.parse({ tex: "E = mc^2", description: "Mass-energy" })
        .description,
    ).toBe("Mass-energy");
  });

  it("rejects empty TeX", () => {
    expect(mathBlockSchema.safeParse({ tex: " " }).success).toBe(false);
  });
});
