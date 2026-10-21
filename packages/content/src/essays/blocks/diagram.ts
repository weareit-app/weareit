import { z } from "zod";
import { text } from "./shared";

// The data file of a `::diagram{id="…"}` block.
export const diagramBlockSchema = z.strictObject({
  title: text.optional(),
  /** Mermaid source. */
  mermaid: text,
  description: text,
});
