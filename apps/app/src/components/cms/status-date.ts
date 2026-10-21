import { isoDateSchema } from "@it/domain/primitives";

export const statusDateHelp =
  "Write the status date as year-month-day, like 2026-10-20.";

// Status dates are free text in the CMS, so a mistyped one gets a plain
// message here rather than a schema error from the API. Returns the IDs of the
// records whose date isn't a calendar date.
export function badStatusDateIds(
  records: readonly { id: string; statusChangedOn?: string | undefined }[],
) {
  return records
    .filter(
      ({ statusChangedOn }) =>
        statusChangedOn !== undefined &&
        !isoDateSchema.safeParse(statusChangedOn).success,
    )
    .map(({ id }) => id);
}
