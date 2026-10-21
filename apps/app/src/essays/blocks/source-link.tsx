import type { EssaySource } from "@it/content/essay-schema";

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
