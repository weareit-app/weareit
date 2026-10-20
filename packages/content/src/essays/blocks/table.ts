import { z } from "zod";
import { dataContext, dataRow, text } from "./shared";

// The data file of a `::table{id="…"}` block. (A Markdown table in the text
// needs no block.)
export const tableBlockSchema = z
  .strictObject({
    caption: text,
    columns: z.array(z.strictObject({ key: text, label: text })).min(1),
    rows: z.array(dataRow).min(1),
    // A table of outside data names its source and then needs the rest of
    // its context too.
    source: dataContext.source.optional(),
    unit: dataContext.unit.optional(),
    timeframe: dataContext.timeframe.optional(),
    population: dataContext.population.optional(),
    uncertainty: dataContext.uncertainty,
    updated: dataContext.updated.optional(),
  })
  .superRefine((table, ctx) => {
    if (table.source)
      for (const field of [
        "unit",
        "timeframe",
        "population",
        "updated",
      ] as const)
        if (!table[field])
          ctx.addIssue({
            code: "custom",
            path: [field],
            message: `a table with a source needs ${field}`,
          });
    const keys = new Set(table.columns.map((column) => column.key));
    table.rows.forEach((row, index) => {
      for (const key of Object.keys(row))
        if (!keys.has(key))
          ctx.addIssue({
            code: "custom",
            path: ["rows", index, key],
            message: `"${key}" is not one of the table's columns`,
          });
    });
  });
