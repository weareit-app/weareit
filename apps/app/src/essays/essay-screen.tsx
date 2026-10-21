import type { Essay } from "@it/domain/essays";
import { essays } from "@it/content/essays";
import { Unmatched, useLocalSearchParams } from "expo-router";
import { isListedPage } from "../navigation/site-links";
import { EssayPage } from "./essay-page";

const published: Partial<Record<string, Essay>> = essays;

// Unpublished essays exist only in development builds: Metro drops this
// require from release bundles, so they never carry an unapproved essay.
const drafts: Partial<Record<string, Essay>> = __DEV__
  ? require("@it/content/essay-drafts").draftEssays
  : {};

/** An essay is reachable only when it is published and in the link list. */
export function isEssayLive(slug: string) {
  return Boolean(published[slug] && isListedPage(`/${slug}`));
}

// The body of each essay route (`app/why.tsx`, …). Anything not live shows the
// not-found screen. In development, `?draft` previews an unpublished essay.
export function EssayScreen({ slug }: { slug: string }) {
  const params = useLocalSearchParams<{ draft?: string }>();
  const essay = isEssayLive(slug)
    ? published[slug]
    : __DEV__ && params.draft !== undefined
      ? drafts[slug]
      : undefined;
  if (!essay) return <Unmatched />;
  return <EssayPage essay={essay} />;
}
