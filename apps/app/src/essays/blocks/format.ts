const dateFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

/** An ISO date (YYYY-MM-DD) as essay text: "March 15, 2006". */
export function formatEssayDate(isoDate: string) {
  return dateFormat.format(new Date(`${isoDate}T00:00:00Z`));
}
