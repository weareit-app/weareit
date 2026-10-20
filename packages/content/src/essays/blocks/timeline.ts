import { z } from "zod";
import { text } from "./shared";

// The data file of a `::timeline{id="…"}` block.
export const timelineBlockSchema = z.strictObject({
  title: text.optional(),
  entries: z
    .array(
      z.strictObject({
        date: z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/),
        title: text,
        note: text.optional(),
      }),
    )
    .min(1),
});
