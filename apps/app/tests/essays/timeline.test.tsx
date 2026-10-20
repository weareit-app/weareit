/** @jest-environment node */
import { renderToStaticMarkup } from "react-dom/server";
import { TimelineBlock } from "../../src/essays/blocks/timeline";

describe("TimelineBlock", () => {
  const html = renderToStaticMarkup(
    <TimelineBlock
      block={{
        type: "timeline",
        id: "milestones",
        data: {
          title: "How It got here",
          entries: [
            { date: "2025", title: "The idea" },
            {
              date: "2026-10",
              title: "First spec",
              note: "Written in public.",
            },
            { date: "2026-10-26", title: "Launch" },
          ],
        },
      }}
      sources={[]}
    />,
  );

  it("is an ordered list named by its title", () => {
    expect(html).toMatch(
      /<section aria-labelledby="milestones-title"[^>]*><p id="milestones-title"[^>]*>How It got here<\/p><ol/,
    );
  });

  it("reads its entries in order, each with a readable date", () => {
    const entries = [...html.matchAll(/<li[^>]*>(.*?)<\/li>/g)].map(
      ([, entry]) => entry!.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "),
    );
    expect(entries.map((entry) => entry.trim())).toEqual([
      "2025 The idea",
      "October 2026 First spec Written in public.",
      "October 26, 2026 Launch",
    ]);
    expect(html).toContain('<time dateTime="2026-10"');
  });
});

describe("TimelineBlock with a date that doesn't exist", () => {
  // The essay build rejects these; the page still mustn't fail if one slips
  // through.
  it("shows the date as written instead of failing or shifting it", () => {
    const html = renderToStaticMarkup(
      <TimelineBlock
        block={{
          type: "timeline",
          id: "odd",
          data: {
            entries: [
              { date: "2026-13", title: "No such month" },
              { date: "2026-02-30", title: "No such day" },
            ],
          },
        }}
        sources={[]}
      />,
    );
    expect(html).toMatch(/<time dateTime="2026-13"[^>]*>2026-13<\/time>/);
    expect(html).toMatch(/<time dateTime="2026-02-30"[^>]*>2026-02-30<\/time>/);
  });
});
