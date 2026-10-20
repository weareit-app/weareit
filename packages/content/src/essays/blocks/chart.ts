import { z } from "zod";
import {
  checkRowKeys,
  dataColumns,
  dataContext,
  dataRow,
  text,
} from "./shared";

// True when any object in the spec has a key named `url` (data, images,
// projections): a chart may draw only the rows beside it, so it never makes
// a request.
function hasUrl(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(hasUrl);
  if (value === null || typeof value !== "object") return false;
  return Object.entries(value).some(
    ([key, child]) => key === "url" || hasUrl(child),
  );
}

// The data file of a `::chart{id="…"}` block. The same rows draw the chart in
// the browser and fill the table shown before it is drawn (and with scripts
// off), headed by `columns`.
export const chartBlockSchema = z
  .strictObject({
    title: text,
    /** Written description, read by screen readers and shown without scripts. */
    description: text,
    /** A Vega-Lite spec without its data; the data comes from `data`. */
    spec: z.record(z.string(), z.unknown()),
    columns: dataColumns,
    data: z.array(dataRow).min(1),
    ...dataContext,
  })
  .superRefine((chart, ctx) => {
    if ("data" in chart.spec)
      ctx.addIssue({
        code: "custom",
        path: ["spec", "data"],
        message: "put the chart's rows in `data` beside the spec, not in it",
      });
    if (hasUrl(chart.spec))
      ctx.addIssue({
        code: "custom",
        path: ["spec"],
        message: "a chart spec must not load anything from a URL",
      });
    checkRowKeys(chart.columns, chart.data, "data", ctx);
  });
