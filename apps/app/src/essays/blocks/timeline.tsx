import type { BlockProps } from "./types";

// A dated timeline, as an ordered list so it reads in order. Essays are
// web-only, so blocks render plain HTML that reads the same with scripts off.

const monthYear = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  timeZone: "UTC",
});
const fullDate = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

/** "2026" → "2026", "2026-10" → "October 2026", "2026-10-26" → "October 26, 2026". */
function formatTimelineDate(date: string) {
  const parts = date.split("-");
  if (parts.length === 1) return date;
  const format = parts.length === 2 ? monthYear : fullDate;
  return format.format(
    new Date(`${parts.length === 2 ? `${date}-01` : date}T00:00:00Z`),
  );
}

export function TimelineBlock({ block }: BlockProps<"timeline">) {
  const { title, entries } = block.data;
  const titleId = `${block.id}-title`;
  return (
    <section
      aria-labelledby={title ? titleId : undefined}
      className="flex flex-col gap-4"
    >
      {title ? (
        <p id={titleId} className="font-ui-semibold text-base text-ink-soft">
          {title}
        </p>
      ) : null}
      <ol className="flex flex-col gap-5 border-l-2 border-tide-tint pl-5">
        {entries.map((entry, index) => (
          <li key={index} className="relative flex flex-col gap-1">
            <span
              aria-hidden
              className="absolute top-1.5 -left-[27px] size-3 rounded-full border-2 border-paper bg-tide"
            />
            <time
              dateTime={entry.date}
              className="font-ui-semibold text-sm text-tide-deep"
            >
              {formatTimelineDate(entry.date)}
            </time>
            <span className="font-body text-lg leading-7 text-ink">
              {entry.title}
            </span>
            {entry.note ? (
              <span className="font-body text-base text-ink-soft">
                {entry.note}
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
