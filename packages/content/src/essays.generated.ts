// Generated from essays/<slug>/essay.md by `pnpm --filter @it/content essays`.
// Don't edit it by hand: edit the essay and run the script again.
import type { Essay } from "./essay-schema";

/** Every essay's `published` front matter, by slug. */
export const essayPublished = { why: false } as const;

export type EssaySlug = keyof typeof essayPublished;

/** Published essays only. */
export const essays: Partial<Record<EssaySlug, Essay>> = {};
