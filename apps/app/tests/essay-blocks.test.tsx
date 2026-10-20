import { render, screen } from "@testing-library/react-native";
import { EssayBody } from "../src/essays/essay-body";

// Before (or without) the drawing libraries, each block shows the fallback
// the pre-rendered page carries.
describe("diagram and math in an essay", () => {
  it("shows the diagram's title and written description", async () => {
    await render(
      <EssayBody
        sources={[]}
        nodes={[
          {
            type: "block",
            block: {
              type: "diagram",
              id: "flow",
              data: {
                title: "From pain to way",
                mermaid: "flowchart LR\n  pain --> future",
                description: "A pain leads to a future.",
              },
            },
          },
        ]}
      />,
    );
    expect(screen.getByText("From pain to way")).toBeTruthy();
    expect(screen.getByText("A pain leads to a future.")).toBeTruthy();
  });

  it("shows a formula's TeX, its description, and inline TeX in a sentence", async () => {
    await render(
      <EssayBody
        sources={[]}
        nodes={[
          {
            type: "block",
            block: {
              type: "math",
              id: "energy",
              data: { tex: "E = mc^2", description: "Mass-energy equivalence" },
            },
          },
          {
            type: "paragraph",
            children: [
              { type: "text", value: "Where " },
              { type: "math", tex: "c" },
              { type: "text", value: " is the speed of light." },
            ],
          },
        ]}
      />,
    );
    expect(screen.getByText("E = mc^2")).toBeTruthy();
    expect(screen.getByText("Mass-energy equivalence")).toBeTruthy();
    expect(screen.getByText("c")).toBeTruthy();
  });
});
