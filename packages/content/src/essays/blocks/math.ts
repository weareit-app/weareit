import { z } from "zod";
import { text } from "./shared";

// The data file of a `::math{id="…"}` block.
export const mathBlockSchema = z.strictObject({
  /** TeX source, shown as text until it is drawn. */
  tex: text,
  description: text.optional(),
});
