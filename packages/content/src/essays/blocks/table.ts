import { z } from "zod";
import { nonEmptyTextSchema } from "@it/domain/primitives";
import { checkRowKeys, dataColumns, dataContext, dataRow } from "./shared";

// The data file of a `::table{id="…"}` block. (A Markdown table in the text
// needs no block.)
export const tableBlockSchema = z
  .strictObject({
    caption: nonEmptyTextSchema,
    columns: dataColumns,
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
    checkRowKeys(table.columns, table.rows, "rows", ctx);
  });
