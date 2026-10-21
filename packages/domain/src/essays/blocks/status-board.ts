import { z } from "zod";
import { nonEmptyTextSchema } from "../../primitives";
import { essayStatusLabelSchema } from "./shared";

// The data file of a `::status-board{id="…"}` block.
export const statusBoardBlockSchema = z.strictObject({
  title: nonEmptyTextSchema.optional(),
  items: z
    .array(
      z.strictObject({
        label: nonEmptyTextSchema,
        status: essayStatusLabelSchema,
        note: nonEmptyTextSchema.optional(),
      }),
    )
    .min(1),
});
