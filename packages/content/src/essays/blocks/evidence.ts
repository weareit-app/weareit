import { z } from "zod";
import {
  isoDateSchema,
  nonEmptyTextSchema,
  slugIdSchema,
} from "@it/domain/primitives";
import { essayStatusLabelSchema } from "./shared";

// The data file of a `::evidence{id="…"}` block.
export const evidenceBlockSchema = z.strictObject({
  claim: nonEmptyTextSchema,
  source: slugIdSchema,
  date: isoDateSchema,
  status: essayStatusLabelSchema,
  limitation: nonEmptyTextSchema,
});
