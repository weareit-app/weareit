import { act } from "react";
import { createRoot } from "react-dom/client";
import { ChartBlock } from "./chart";
import { chartFixture, sourcesFixture } from "../lab/block-fixtures";

const mockEmbed = jest.fn((element: HTMLElement) => {
  element.innerHTML = "<svg></svg>";
  return Promise.resolve({ finalize: jest.fn() });
});
jest.mock("vega-embed", () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockEmbed(...(args as [HTMLElement])),
}));

// Tells React this test drives updates through act().
(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

async function renderChart() {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  // A callback that returns a promise makes act() wait for the async work.
  await act(() => {
    root.render(<ChartBlock block={chartFixture} sources={sourcesFixture} />);
    return Promise.resolve();
  });
  // Let the lazy import and the drawing settle.
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
  return { container, root };
}

describe("ChartBlock in the browser", () => {
  it("draws the chart from the rows beside it, with no actions menu", async () => {
    await renderChart();

    expect(mockEmbed).toHaveBeenCalledTimes(1);
    const [, spec, options] = mockEmbed.mock.calls[0] as unknown as [
      HTMLElement,
      Record<string, unknown>,
      Record<string, unknown>,
    ];
    expect(spec).toMatchObject({
      mark: "bar",
      data: { values: chartFixture.data.data },
    });
    expect(options).toMatchObject({ actions: false, mode: "vega-lite" });
  });

  it("keeps the description and table for screen readers and hides the drawing from them", async () => {
    const { container } = await renderChart();

    const drawing = container.querySelector("svg")?.parentElement;
    expect(drawing?.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelector("table caption")?.textContent).toBe(
      "Reported AI incidents per year, as a table",
    );
    expect(container.textContent).toContain(chartFixture.data.description);
  });

  it("releases the chart when it leaves the page", async () => {
    const { root } = await renderChart();
    const { finalize } = (await mockEmbed.mock.results[0]!.value) as {
      finalize: jest.Mock;
    };

    await act(() => {
      root.unmount();
      return Promise.resolve();
    });

    expect(finalize).toHaveBeenCalledTimes(1);
  });
});
