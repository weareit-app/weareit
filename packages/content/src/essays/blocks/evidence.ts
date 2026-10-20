import { z } from "zod";
import { text, slugId, isoDate, essayStatusLabelSchema } from "./shared";

// The data file of a `::evidence{id="…"}` block.
export const evidenceBlockSchema = z.strictObject({
  claim: text,
  source: slugId,
  date: isoDate,
  status: essayStatusLabelSchema,
  limitation: text,
});
