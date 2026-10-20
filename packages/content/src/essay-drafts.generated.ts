// Generated from essays/<slug>/essay.md by `pnpm --filter @it/content essays`.
// Don't edit it by hand: edit the essay and run the script again.
import type { Essay } from "./essay-schema";

/** Unpublished essays, for the development `?draft` preview only. */
export const draftEssays: Partial<Record<string, Essay>> = {
  why: {
    slug: "why",
    title: "Why It exists",
    question: "What made this worth attempting?",
    published: false,
    updated: "2026-10-20",
    changes: [
      {
        date: "2026-10-20",
        note: "Placeholder page, written to check the essay layout. The founder is writing the real essay.",
      },
    ],
    sources: [
      {
        id: "public-pages-plan",
        title: "Public pages change (essays, roadmap and site navigation)",
        publisher: "We Are It, on GitHub",
        url: "https://github.com/weareit-app/weareit/tree/master/openspec/changes/public-pages",
      },
    ],
    body: [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value:
              "This page is a placeholder. The founder is writing the essay that goes here, about what made It worth attempting.",
          },
        ],
      },
      {
        type: "heading",
        level: 2,
        children: [{ type: "text", value: "What this page will cover" }],
      },
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value:
              "The plan for this page is public, along with the other essays and the roadmap",
          },
          { type: "sourceRef", id: "public-pages-plan" },
          { type: "text", value: ". It will cover:" },
        ],
      },
      {
        type: "list",
        ordered: false,
        items: [
          [
            {
              type: "paragraph",
              children: [
                {
                  type: "text",
                  value:
                    "the question: why build It at all, when there are already apps for habits, causes and self-help",
                },
              ],
            },
          ],
          [
            {
              type: "paragraph",
              children: [
                {
                  type: "text",
                  value:
                    "what the founder noticed: people can usually name what hurts, but rarely see the different futures that could follow",
                },
              ],
            },
          ],
          [
            {
              type: "paragraph",
              children: [
                {
                  type: "text",
                  value: "what It is trying to change, and what is true today",
                },
              ],
            },
          ],
        ],
      },
      {
        type: "heading",
        level: 2,
        children: [{ type: "text", value: "What is true today" }],
      },
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value:
              "Today It is the explorer plus signup. Everything else on the roadmap is ",
          },
          { type: "status", label: "planned engineering" },
          { type: "text", value: "." },
        ],
      },
    ],
  },
};
