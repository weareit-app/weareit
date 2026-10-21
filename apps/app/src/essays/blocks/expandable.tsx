import { EssayBody } from "../essay-body";
import type { BlockProps } from "./types";

// An expandable section. A native disclosure: it opens by keyboard and
// announces expanded or collapsed without scripts, and its text is in the
// pre-rendered HTML. Essays are web-only, so blocks render plain HTML.
export function ExpandableBlock({ block, sources }: BlockProps<"expandable">) {
  return (
    <details className="group rounded-md border border-rule bg-paper-raised">
      <summary className="flex cursor-pointer list-none items-center gap-3 rounded-md px-4 py-3 font-ui-semibold text-lg text-ink hover:bg-paper-sunk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tide-deep [&::-webkit-details-marker]:hidden">
        <span
          aria-hidden
          className="inline-block text-tide-deep transition-transform group-open:rotate-90 motion-reduce:transition-none"
        >
          ▸
        </span>
        {block.title}
      </summary>
      <div className="flex flex-col gap-5 border-t border-rule px-4 py-4">
        <EssayBody nodes={block.children} sources={sources} />
      </div>
    </details>
  );
}
