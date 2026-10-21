import { DataContextNote, DataTable } from "./data-table";
import type { BlockProps } from "./types";

// A table from a data file beside the essay. A table of outside data names
// its source, and the schema then requires the rest of its context.
export function TableBlock({ block, sources }: BlockProps<"table">) {
  const { caption, columns, rows, source, unit, timeframe, population } =
    block.data;
  const { uncertainty, updated } = block.data;
  return (
    <figure className="my-6">
      <DataTable caption={caption} columns={columns} rows={rows} />
      {source && unit && timeframe && population && updated ? (
        <DataContextNote
          context={{
            source,
            unit,
            timeframe,
            population,
            uncertainty,
            updated,
          }}
          sources={sources}
        />
      ) : null}
    </figure>
  );
}
