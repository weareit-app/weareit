import { z } from "zod";
import {
  isoDateSchema,
  nonEmptyTextSchema,
  slugIdSchema,
} from "@it/domain/primitives";

// Field types shared by the essay front matter and the block schemas.

/** The fixed status labels an essay may give a result, view or plan. */
export const essayStatusLabels = [
  "established result",
  "replicated finding",
  "machine-checked under stated assumptions",
  "working hypothesis",
  "speculative direction",
  "open question",
  "planned engineering",
] as const;

export const essayStatusLabelSchema = z.enum(essayStatusLabels);

const cell = z.union([z.string(), z.number(), z.boolean(), z.null()]);
export const dataRow = z.record(z.string(), cell);
export type DataRow = z.infer<typeof dataRow>;

/**
 * The context every chart or table of outside data shows. `source` holds a
 * source ID from the essay's front matter.
 */
export const dataContext = {
  source: slugIdSchema,
  unit: nonEmptyTextSchema,
  timeframe: nonEmptyTextSchema,
  /** The population or denominator the numbers describe. */
  population: nonEmptyTextSchema,
  /** Uncertainty, where it is known. */
  uncertainty: nonEmptyTextSchema.optional(),
  updated: isoDateSchema,
};
const dataContextSchema = z.strictObject(dataContext);
export type DataContext = z.infer<typeof dataContextSchema>;

/** A table or chart column: the row key and its heading. */
export const dataColumns = z
  .array(z.strictObject({ key: nonEmptyTextSchema, label: nonEmptyTextSchema }))
  .min(1);
export type DataColumn = z.infer<typeof dataColumns>[number];

/** Reports each row value whose key isn't one of the declared columns. */
export function checkRowKeys(
  columns: readonly { key: string }[],
  rows: readonly Record<string, unknown>[],
  rowsPath: string,
  ctx: z.RefinementCtx,
) {
  const keys = new Set(columns.map((column) => column.key));
  rows.forEach((row, index) => {
    for (const key of Object.keys(row))
      if (!keys.has(key))
        ctx.addIssue({
          code: "custom",
          path: [rowsPath, index, key],
          message: `"${key}" is not one of the declared columns`,
        });
  });
}
