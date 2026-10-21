import { z } from "zod";
import { nonEmptyTextSchema } from "@it/domain/primitives";
import { checkRowKeys, dataColumns, dataContext, dataRow } from "./shared";

// True when any object in the spec, at any depth, has one of these keys.
function hasKey(value: unknown, keys: readonly string[]): boolean {
  if (Array.isArray(value)) return value.some((child) => hasKey(child, keys));
  if (value === null || typeof value !== "object") return false;
  return Object.entries(value).some(
    ([key, child]) => keys.includes(key) || hasKey(child, keys),
  );
}

// The data file of a `::chart{id="…"}` block. The same rows draw the chart in
// the browser and fill the table shown before it is drawn (and with scripts
// off), headed by `columns`.
export const chartBlockSchema = z
  .strictObject({
    title: nonEmptyTextSchema,
    /** Written description, read by screen readers and shown without scripts. */
    description: nonEmptyTextSchema,
    /** A Vega-Lite spec without its data; the data comes from `data`. */
    spec: z.record(z.string(), z.unknown()),
    columns: dataColumns,
    data: z.array(dataRow).min(1),
    ...dataContext,
  })
  .superRefine((chart, ctx) => {
    // The chart draws only the rows beside it, the same rows the fallback
    // table shows: no data inside the spec (top level, layers, lookups or
    // named datasets) and no URL, so it never makes a request either.
    if (hasKey(chart.spec, ["data", "datasets"]))
      ctx.addIssue({
        code: "custom",
        path: ["spec"],
        message: "put the chart's rows in `data` beside the spec, not in it",
      });
    if (hasKey(chart.spec, ["url"]))
      ctx.addIssue({
        code: "custom",
        path: ["spec"],
        message: "a chart spec must not load anything from a URL",
      });
    checkRowKeys(chart.columns, chart.data, "data", ctx);
  });
