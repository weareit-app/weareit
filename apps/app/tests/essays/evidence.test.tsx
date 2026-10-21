/** @jest-environment node */
import { renderToStaticMarkup } from "react-dom/server";
import { EvidenceBlock } from "../../src/essays/blocks/evidence";
import {
  evidenceFixture,
  sourcesFixture,
} from "../../src/essays/lab/block-fixtures";

describe("EvidenceBlock", () => {
  const html = renderToStaticMarkup(
    <EvidenceBlock block={evidenceFixture} sources={sourcesFixture} />,
  );

  it("shows the claim and its main limitation", () => {
    expect(html).toContain(
      "People keep a new habit more often when they plan when and where they will do it.",
    );
    expect(html).toContain(
      "Most studies were short and measured intentions in students, not lasting change.",
    );
  });

  it("links the source beside the claim", () => {
    expect(html).toMatch(
      /<a href="https:\/\/doi\.org\/10\.1016\/S0065-2601\(06\)38002-1"[^>]*>Implementation intentions and goal achievement: a meta-analysis<\/a>/,
    );
    expect(html).toContain("Gollwitzer and Sheeran");
  });

  it("gives the status as its label and the date readably", () => {
    expect(html).toContain("Replicated finding");
    expect(html).toContain('<time dateTime="2006-03-15">March 15, 2006</time>');
  });
});
