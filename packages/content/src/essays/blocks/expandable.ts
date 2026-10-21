import { z } from "zod";
import { nonEmptyTextSchema } from "@it/domain/primitives";

// The attributes of an `:::expandable{title="…"}` block. It has no data file:
// the Markdown between its lines is the section, checked as part of the tree.
export const expandableBlockSchema = z.strictObject({
  title: nonEmptyTextSchema,
});
