import type { EssayBlockOf } from "@it/domain/essays";
import embed, { type VisualizationSpec } from "vega-embed";

// Loaded only when a chart renders on the web, so Vega stays out of every
// other bundle. The spec carries no data or URLs (the content schema rejects
// them); the rows come from the data file beside the essay.

// A theme colour from the page's CSS, read when the chart is drawn, so it
// follows light or dark. `global.css` defines every token on every page.
function themeColor(element: Element, name: `--color-${string}`) {
  return getComputedStyle(element).getPropertyValue(name).trim();
}

export async function drawChart(
  element: HTMLElement,
  chart: EssayBlockOf<"chart">["data"],
) {
  const ink = themeColor(element, "--color-ink");
  const soft = themeColor(element, "--color-ink-soft");
  const rule = themeColor(element, "--color-rule");
  const tide = themeColor(element, "--color-tide");
  const font = getComputedStyle(element).fontFamily || "sans-serif";
  const result = await embed(
    element,
    // The content schema checks the chart's context and data, not Vega-Lite's
    // own grammar; vega-embed reports a spec it can't draw.
    {
      ...chart.spec,
      width: "container",
      data: { values: chart.data },
    } as VisualizationSpec,
    {
      mode: "vega-lite",
      actions: false,
      renderer: "svg",
      config: {
        background: "transparent",
        font,
        mark: { color: tide },
        range: {
          category: [
            tide,
            themeColor(element, "--color-harbor"),
            themeColor(element, "--color-sun-deep"),
            themeColor(element, "--color-mint-deep"),
          ],
        },
        axis: {
          labelColor: soft,
          titleColor: ink,
          domainColor: rule,
          gridColor: rule,
          tickColor: rule,
        },
        legend: { labelColor: soft, titleColor: ink },
        title: { color: ink },
        view: { stroke: null },
      },
    },
  );
  return () => result.finalize();
}
