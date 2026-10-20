import type { EssaySource } from "@it/content/essay-schema";
import { formatEssayDate } from "./format";

type Cell = string | number | boolean | null;
type DataRow = Record<string, Cell>;
type DataColumn = { key: string; label: string };

/** Where outside data came from and what it measures. */
export type DataContext = {
  source: string;
  unit: string;
  timeframe: string;
  population: string;
  uncertainty?: string | undefined;
  updated: string;
};

/**
 * A source named by ID in a block, as a link to what was published and who
 * published it. The essay build has checked the ID is in the front matter.
 */
export function SourceLink({
  id,
  sources,
}: {
  id: string;
  sources: readonly EssaySource[];
}) {
  const source = sources.find((candidate) => candidate.id === id);
  if (!source) return <>{id}</>;
  return (
    <>
      <a
        href={source.url}
        className="text-tide-deep underline underline-offset-4"
      >
        {source.title}
      </a>
      {`, ${source.publisher}`}
    </>
  );
}

// Digits are grouped from five up, so years read as 2023 and counts as 12,400.
const numberFormat = new Intl.NumberFormat("en-US", { useGrouping: "min2" });

function formatCell(value: DataRow[string] | undefined) {
  if (value === null || value === undefined) return "No data";
  if (typeof value === "number") return numberFormat.format(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return value;
}

// A plain HTML table: the first column heads each row, so a screen reader
// can move through it cell by cell and hear both headers.
export function DataTable({
  caption,
  columns,
  rows,
}: {
  caption: string;
  columns: readonly DataColumn[];
  rows: readonly DataRow[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse font-ui text-sm text-ink">
        <caption className="mb-2 text-left font-heading text-base text-ink">
          {caption}
        </caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="border-b border-rule px-2 py-1 text-left font-semibold"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {columns.map((column, columnIndex) =>
                columnIndex === 0 ? (
                  <th
                    key={column.key}
                    scope="row"
                    className="border-b border-rule px-2 py-1 text-left font-normal"
                  >
                    {formatCell(row[column.key])}
                  </th>
                ) : (
                  <td
                    key={column.key}
                    className="border-b border-rule px-2 py-1"
                  >
                    {formatCell(row[column.key])}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Where outside data came from and what it measures, shown under its table
// or chart ("Data shown with its context").
export function DataContextNote({
  context,
  sources,
}: {
  context: DataContext;
  sources: readonly EssaySource[];
}) {
  return (
    <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-ui text-sm text-ink-soft">
      <dt className="font-semibold">Source</dt>
      <dd>
        <SourceLink id={context.source} sources={sources} />
      </dd>
      <dt className="font-semibold">Unit</dt>
      <dd>{context.unit}</dd>
      <dt className="font-semibold">Timeframe</dt>
      <dd>{context.timeframe}</dd>
      <dt className="font-semibold">Counted</dt>
      <dd>{context.population}</dd>
      {context.uncertainty ? (
        <>
          <dt className="font-semibold">Uncertainty</dt>
          <dd>{context.uncertainty}</dd>
        </>
      ) : null}
      <dt className="font-semibold">Last updated</dt>
      <dd>
        <time dateTime={context.updated}>
          {formatEssayDate(context.updated)}
        </time>
      </dd>
    </dl>
  );
}
