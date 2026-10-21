import { z } from "zod";
import { text, essayStatusLabelSchema } from "./shared";

// The data file of a `::status-board{id="…"}` block.
export const statusBoardBlockSchema = z.strictObject({
  title: text.optional(),
  items: z
    .array(
      z.strictObject({
        label: text,
        status: essayStatusLabelSchema,
        note: text.optional(),
      }),
    )
    .min(1),
});
