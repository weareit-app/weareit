/** @jest-environment node */
import { renderToStaticMarkup } from "react-dom/server";
import { TableBlock } from "./table";
import {
  sourcesFixture,
  tableFixture,
  tableWithContextFixture,
} from "../lab/block-fixtures";

describe("TableBlock", () => {
  it("renders a captioned HTML table with column and row headers", () => {
    const html = renderToStaticMarkup(
      <TableBlock block={tableFixture} sources={sourcesFixture} />,
    );

    expect(html).toContain("<caption");
    expect(html).toContain("Licenses for each part of It</caption>");
    expect(html).toMatch(/<th[^>]*scope="col"[^>]*>License<\/th>/);
    expect(html).toMatch(/<th[^>]*scope="row"[^>]*>App code<\/th>/);
    expect(html).toMatch(/<td[^>]*>CC BY-SA 4.0<\/td>/);
  });

  it("shows outside data's source, unit, timeframe and update date", () => {
    const html = renderToStaticMarkup(
      <TableBlock block={tableWithContextFixture} sources={sourcesFixture} />,
    );

    expect(html).toMatch(
      /<a href="https:\/\/example\.org\/placeholder-counts"[^>]*>Placeholder incident counts<\/a>/,
    );
    expect(html).toContain("incidents reported");
    expect(html).toContain("2019–2023");
    expect(html).toContain(
      "Incidents submitted to and accepted by the database",
    );
    expect(html).toContain("Counts depend on what people report");
    expect(html).toContain(
      '<time dateTime="2026-09-30">September 30, 2026</time>',
    );
  });
});
