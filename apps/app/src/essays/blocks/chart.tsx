import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { DataContextNote, DataTable } from "./data-table";
import type { BlockProps } from "./types";

// A chart: its title, a description in words, the drawing, and its data as
// a table with the data's context. The pre-rendered page has everything but
// the drawing, so it reads fully with scripts off. Once drawn, the drawing
// is hidden from screen readers: the description and table already say what
// it shows, and the table is easier to move through.
export function ChartBlock({ block, sources }: BlockProps<"chart">) {
  const chart = block.data;
  const drawing = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = drawing.current;
    if (Platform.OS !== "web" || !element) return;
    let cancelled = false;
    let release: (() => void) | undefined;
    void import("./draw-chart")
      .then(({ drawChart }) => drawChart(element, chart))
      .then((finalize) => {
        if (cancelled) finalize();
        else release = finalize;
      })
      .catch((error: unknown) => {
        // The description and table stay, so a chart that fails to draw
        // hides nothing.
        if (__DEV__) console.warn("Chart not drawn", error);
      });
    return () => {
      cancelled = true;
      release?.();
    };
  }, [chart]);

  return (
    <figure className="my-6">
      <figcaption className="font-heading text-lg text-ink">
        {chart.title}
      </figcaption>
      <p className="mt-1 font-body text-base text-ink-soft">
        {chart.description}
      </p>
      <div ref={drawing} aria-hidden="true" className="my-4 w-full font-ui" />
      <DataTable
        caption={`${chart.title}, as a table`}
        columns={chart.columns}
        rows={chart.data}
      />
      <DataContextNote context={chart} sources={sources} />
    </figure>
  );
}
