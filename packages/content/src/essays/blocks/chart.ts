import { z } from "zod";
import { text, dataContext, dataRow } from "./shared";

// The data file of a `::chart{id="…"}` block.
export const chartBlockSchema = z.strictObject({
  title: text,
  /** Written description, read by screen readers and shown without scripts. */
  description: text,
  /** A Vega-Lite spec without its data; the data comes from `data`. */
  spec: z.record(z.string(), z.unknown()),
  data: z.array(dataRow).min(1),
  ...dataContext,
});
