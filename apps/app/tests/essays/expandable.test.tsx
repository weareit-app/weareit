/** @jest-environment node */
import { renderToStaticMarkup } from "react-dom/server";
import { EssayBody } from "../../src/essays/essay-body";

describe("ExpandableBlock", () => {
  const html = renderToStaticMarkup(
    <EssayBody
      nodes={[
        {
          type: "block",
          block: {
            type: "expandable",
            title: "How the numbers were counted",
            children: [
              {
                type: "paragraph",
                children: [{ type: "text", value: "Each visit counts once." }],
              },
              {
                type: "block",
                block: {
                  type: "timeline",
                  id: "counting",
                  data: {
                    entries: [{ date: "2026-10", title: "Counting began" }],
                  },
                },
              },
            ],
          },
        },
      ]}
      sources={[]}
    />,
  );

  it("is a native disclosure, so it works by keyboard and announces its state with scripts off", () => {
    expect(html).toMatch(
      /^<details[^>]*><summary[^>]*>.*How the numbers were counted.*<\/summary>/,
    );
  });

  it("holds its nested text in the page, readable with scripts off", () => {
    expect(html).toMatch(/<\/summary>.*Each visit counts once\..*<\/details>$/);
  });

  it("draws nested blocks with their own components", () => {
    expect(html).toMatch(
      /<\/summary>.*<ol[^>]*>.*Counting began.*<\/ol>.*<\/details>$/,
    );
  });

  it("doesn't animate with reduced motion", () => {
    for (const transition of html.match(/class="[^"]*transition[^"]*"/g) ??
      []) {
      expect(transition).toContain("motion-reduce:transition-none");
    }
  });
});
