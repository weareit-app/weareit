import { z } from "zod";
import { nonEmptyTextSchema } from "@it/domain/primitives";

// The data file of a `::math{id="…"}` block.
export const mathBlockSchema = z.strictObject({
  /** TeX source, shown as text until it is drawn. */
  tex: nonEmptyTextSchema,
  description: nonEmptyTextSchema.optional(),
});
