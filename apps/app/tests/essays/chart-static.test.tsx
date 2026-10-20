/** @jest-environment node */
import { renderToStaticMarkup } from "react-dom/server";
import { ChartBlock } from "../../src/essays/blocks/chart";
import {
  chartFixture,
  sourcesFixture,
} from "../../src/essays/lab/block-fixtures";

// The pre-rendered page, as read with scripts off.
describe("ChartBlock before it is drawn", () => {
  const html = renderToStaticMarkup(
    <ChartBlock block={chartFixture} sources={sourcesFixture} />,
  );

  it("names the chart and describes it in words", () => {
    expect(html).toContain("Reported AI incidents per year</figcaption>");
    expect(html).toContain(
      "Reported AI incidents rose every year from 2019 to 2023, from 41 to 123.",
    );
  });

  it("ties the description to the figure, so it is heard with the chart", () => {
    const describedBy = html.match(
      /<figure[^>]*aria-describedby="([^"]+)"/,
    )?.[1];
    expect(describedBy).toBeTruthy();
    expect(html).toMatch(
      new RegExp(`<p id="${describedBy}"[^>]*>Reported AI incidents rose`),
    );
  });

  it("shows the chart's data as a table", () => {
    expect(html).toContain(
      "Reported AI incidents per year, as a table</caption>",
    );
    expect(html).toMatch(/<th[^>]*scope="col"[^>]*>Incidents reported<\/th>/);
    expect(html).toMatch(
      /<th[^>]*scope="row"[^>]*>2023<\/th><td[^>]*>123<\/td>/,
    );
  });

  it("shows the data's context", () => {
    expect(html).toMatch(
      /<a href="https:\/\/example\.org\/placeholder-counts"[^>]*>Placeholder incident counts<\/a>/,
    );
    expect(html).toContain(
      '<time dateTime="2026-09-30">September 30, 2026</time>',
    );
  });
});
