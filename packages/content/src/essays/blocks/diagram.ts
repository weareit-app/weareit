import { z } from "zod";
import { nonEmptyTextSchema } from "@it/domain/primitives";

// The data file of a `::diagram{id="…"}` block. The description is what
// readers get with scripts off and what screen readers hear, so it is
// required.
export const diagramBlockSchema = z.strictObject({
  title: nonEmptyTextSchema.optional(),
  /** Mermaid source. */
  mermaid: nonEmptyTextSchema
    // The app sets the theme, security level and layout, so a diagram may
    // not carry its own %%{init}%% directive or YAML front matter.
    .refine(
      (source) => !/%%\{/.test(source) && !source.startsWith("---"),
      "Remove the Mermaid directive or front matter; the app sets diagram configuration",
    )
    // The ELK layout engine is EPL-2.0 and is left out of the app's bundle.
    .refine(
      (source) => !/^\s*flowchart-elk\b/.test(source),
      "Use flowchart instead of flowchart-elk; the ELK layout is not shipped",
    )
    // Mermaid typesets $$…$$ with its own bundled KaTeX, whose stylesheet
    // the app doesn't load. Put formulas in a math block instead.
    .refine(
      (source) => !source.includes("$$"),
      "Remove the $$ math; use a math block for formulas",
    ),
  description: nonEmptyTextSchema,
});
