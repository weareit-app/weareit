import type { EssayNode } from "@it/content/essay-schema";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { EssayBody } from "../../src/essays/essay-body";

const mockRender = jest.fn(async () => ({
  svg: '<svg aria-roledescription="flowchart-v2"></svg>',
}));
jest.mock("mermaid", () => ({
  __esModule: true,
  default: {
    initialize: jest.fn(),
    render: (...args: unknown[]) => mockRender(...(args as [])),
  },
}));

// Tells React this test drives updates through act().
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const nodes: EssayNode[] = [
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
];

async function renderEssay() {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  await act(async () => {
    root.render(<EssayBody nodes={nodes} sources={[]} />);
  });
  // Let the lazy imports and the drawing settle.
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
  return { container, root };
}

describe("diagram and math in an essay", () => {
  it("pre-renders the diagram's description and each formula's TeX", () => {
    const html = renderToString(<EssayBody nodes={nodes} sources={[]} />);
    expect(html).toContain("From pain to way");
    expect(html).toContain("A pain leads to a future.");
    expect(html).toContain("E = mc^2");
    expect(html).toContain("Mass-energy equivalence");
    expect(html).toContain("is the speed of light.");
    expect(html).not.toContain("<svg");
    expect(html).not.toContain("<math");
  });

  it("draws the diagram and typesets the math, keeping the description", async () => {
    const { container, root } = await renderEssay();
    // The math waits for KaTeX's stylesheet; jsdom doesn't load it, so the
    // test reports it loaded.
    await act(async () => {
      document
        .querySelector('link[href="/katex/katex.min.css"]')!
        .dispatchEvent(new Event("load"));
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(mockRender).toHaveBeenCalledWith(
      expect.stringMatching(/^diagram-/),
      "flowchart LR\n  pain --> future",
    );
    // The drawing is hidden from screen readers; the description is its text.
    const drawing = container.querySelector("svg[aria-roledescription]");
    expect(drawing?.closest("[aria-hidden]")).not.toBeNull();
    expect(container.textContent).toContain("A pain leads to a future.");
    // Screen readers read the MathML; the TeX is only its annotation now.
    expect(container.querySelectorAll("math")).toHaveLength(2);
    expect(
      document.querySelector('link[href="/katex/katex.min.css"]'),
    ).not.toBeNull();

    await act(async () => root.unmount());
  });
});
