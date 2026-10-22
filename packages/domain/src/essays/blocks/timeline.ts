import { z } from "zod";
import { isoDateSchema, nonEmptyTextSchema } from "../../primitives";

// A year ("2026"), a month ("2026-10") or a day ("2026-10-26") that exists.
const timelineDate = z.union(
  [
    z.string().regex(/^\d{4}$/),
    z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
    isoDateSchema,
  ],
  { error: "use a real year (2026), month (2026-10) or day (2026-10-26)" },
);

// The data file of a `::timeline{id="…"}` block.
export const timelineBlockSchema = z.strictObject({
  title: nonEmptyTextSchema.optional(),
  entries: z
    .array(
      z.strictObject({
        date: timelineDate,
        title: nonEmptyTextSchema,
        note: nonEmptyTextSchema.optional(),
      }),
    )
    .min(1),
});
