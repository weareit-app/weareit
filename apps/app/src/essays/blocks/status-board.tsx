import type { BlockProps } from "./types";

// A status board: cards grouped by status, the groups in the order their
// status first appears. Each group is named by its status in words, so
// nothing rests on colour. Essays are web-only, so blocks render plain HTML
// that reads the same with scripts off.

type Item = BlockProps<"status-board">["block"]["data"]["items"][number];

const capitalize = (text: string) => text[0]!.toUpperCase() + text.slice(1);

function groupByStatus(items: Item[]) {
  const groups = new Map<Item["status"], Item[]>();
  for (const item of items) {
    groups.set(item.status, [...(groups.get(item.status) ?? []), item]);
  }
  return [...groups];
}

export function StatusBoardBlock({ block }: BlockProps<"status-board">) {
  const { title, items } = block.data;
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
      <div className="grid gap-4 md:grid-cols-2">
        {groupByStatus(items).map(([status, group]) => {
          const statusId = `${block.id}-${status.replaceAll(" ", "-")}`;
          return (
            <div
              key={status}
              className="flex flex-col gap-3 rounded-md bg-paper-sunk p-4"
            >
              <p
                id={statusId}
                className="font-ui-semibold text-base text-tide-deep"
              >
                {capitalize(status)}
              </p>
              <ul aria-labelledby={statusId} className="flex flex-col gap-2">
                {group.map((item, index) => (
                  <li
                    key={index}
                    className="flex flex-col gap-1 rounded-md border border-rule bg-paper-raised px-3 py-2"
                  >
                    <span className="font-body text-base text-ink">
                      {item.label}
                    </span>
                    {item.note ? (
                      <span className="font-body text-sm text-ink-soft">
                        {item.note}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
