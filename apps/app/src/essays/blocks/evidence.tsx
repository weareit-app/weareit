import { SourceLink } from "./source-link";
import { formatEssayDate } from "./format";
import type { BlockProps } from "./types";

const capitalize = (text: string) => text[0]!.toUpperCase() + text.slice(1);

// An evidence card: a claim with its source, date, status and main
// limitation. Essays are web-only, so blocks render plain HTML that reads
// the same with scripts off.
export function EvidenceBlock({ block, sources }: BlockProps<"evidence">) {
  const evidence = block.data;
  return (
    <aside className="my-6 rounded-lg border border-rule bg-paper-raised p-5">
      <p className="font-body text-lg text-ink">{evidence.claim}</p>
      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 font-ui text-sm text-ink-soft">
        <dt className="font-ui-semibold">Status</dt>
        <dd>{capitalize(evidence.status)}</dd>
        <dt className="font-ui-semibold">Source</dt>
        <dd>
          <SourceLink id={evidence.source} sources={sources} />
        </dd>
        <dt className="font-ui-semibold">Date</dt>
        <dd>
          <time dateTime={evidence.date}>{formatEssayDate(evidence.date)}</time>
        </dd>
        <dt className="font-ui-semibold">Main limitation</dt>
        <dd>{evidence.limitation}</dd>
      </dl>
    </aside>
  );
}
