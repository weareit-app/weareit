import { z } from "zod";

// Field types shared by the essay front matter and the block schemas.

/** The fixed status labels an essay may give a result, view or plan. */
export const essayStatusLabels = [
  "established result",
  "replicated finding",
  "machine-checked under stated assumptions",
  "working hypothesis",
  "speculative direction",
  "open question",
  "planned engineering",
] as const;

export const essayStatusLabelSchema = z.enum(essayStatusLabels);

export const isoDate = z.iso.date();
export const text = z.string().trim().min(1);
export const slugId = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "use lowercase words joined by hyphens");

const cell = z.union([z.string(), z.number(), z.boolean(), z.null()]);
export const dataRow = z.record(z.string(), cell);

/**
 * The context every chart or table of outside data shows. `source` holds a
 * source ID from the essay's front matter.
 */
export const dataContext = {
  source: slugId,
  unit: text,
  timeframe: text,
  /** The population or denominator the numbers describe. */
  population: text,
  /** Uncertainty, where it is known. */
  uncertainty: text.optional(),
  updated: isoDate,
};
