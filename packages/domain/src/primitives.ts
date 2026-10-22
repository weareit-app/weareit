import { z } from "zod";

// Field shapes every other module builds on. Each is written here once.

/** A content or source ID: lowercase words joined by hyphens. */
export const slugIdSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "use lowercase words joined by hyphens");

/** Text with something in it after trimming. Callers add a maximum. */
export const nonEmptyTextSchema = z.string().trim().min(1);

/** A calendar date, `YYYY-MM-DD`. */
export const isoDateSchema = z.iso.date();

/** A UTC timestamp, such as `2026-10-21T19:48:55.000Z`. */
export const isoDatetimeSchema = z.iso.datetime();
