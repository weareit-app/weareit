import type { EssayBlockOf } from "@it/content/essay-schema";
import embed, { type VisualizationSpec } from "vega-embed";

// Loaded only when a chart renders on the web, so Vega stays out of every
// other bundle. The spec carries no data or URLs (the content schema rejects
// them); the rows come from the data file beside the essay.

function token(element: Element, name: string, fallback: string) {
  const value = getComputedStyle(element).getPropertyValue(name).trim();
  return value || fallback;
}

export async function drawChart(
  element: HTMLElement,
  chart: EssayBlockOf<"chart">["data"],
) {
  const ink = token(element, "--color-ink", "#1F2021");
  const soft = token(element, "--color-ink-soft", "#606162");
  const rule = token(element, "--color-rule", "#D5D6D6");
  const tide = token(element, "--color-tide", "#087E9F");
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
            token(element, "--color-harbor", "#3D5588"),
            token(element, "--color-sun-deep", "#94620B"),
            token(element, "--color-mint-deep", "#0D7E45"),
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
